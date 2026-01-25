const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or 'outlook'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // App password for Gmail
        }
    });
};

// Send single email
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.APP_NAME || 'Event Platform'}" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Send email error:', error);
        throw new Error('Failed to send email');
    }
};

// Send bulk emails with rate limiting
const sendBulkEmails = async (recipients, { subject, html, attachments = [] }) => {
    const results = [];
    const batchSize = 50; // Gmail limit-friendly
    const delayBetweenBatches = 60000; // 1 minute delay between batches

    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        console.log(`Sending batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(recipients.length / batchSize)}`);

        // Send emails in current batch
        const batchPromises = batch.map(async (recipient) => {
            try {
                await sendEmail({
                    to: recipient.email,
                    subject: replacePlaceholders(subject, recipient),
                    html: replacePlaceholders(html, recipient),
                    attachments
                });
                return { email: recipient.email, success: true };
            } catch (error) {
                return { email: recipient.email, success: false, error: error.message };
            }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map(r => r.value));

        // Delay between batches (except for last batch)
        if (i + batchSize < recipients.length) {
            console.log(`Waiting 1 minute before next batch...`);
            await delay(delayBetweenBatches);
        }
    }

    return results;
};

// Replace placeholders in email content
const replacePlaceholders = (content, data) => {
    let result = content;

    // Replace all placeholders
    result = result.replace(/{{name}}/g, data.name || data.fullName || 'Participant');
    result = result.replace(/{{email}}/g, data.email || '');
    result = result.replace(/{{event_name}}/g, data.eventName || '');
    result = result.replace(/{{event_date}}/g, data.eventDate || '');
    result = result.replace(/{{team_name}}/g, data.teamName || '');
    result = result.replace(/{{position}}/g, data.position || '');
    result = result.replace(/{{certificate_id}}/g, data.certificateId || '');
    result = result.replace(/{{registration_id}}/g, data.registrationId || '');

    return result;
};

// Email templates
const templates = {
    eventUpdate: (eventName, message) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                         color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                .message-box { background: white; padding: 20px; border-radius: 5px; 
                              border-left: 4px solid #667eea; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📢 Event Update</h1>
                    <p style="margin: 0;">${eventName}</p>
                </div>
                <div class="content">
                    <p>Hi {{name}},</p>
                    <div class="message-box">
                        ${message}
                    </div>
                    <p>If you have any questions, please don't hesitate to reach out.</p>
                    <p>Best regards,<br>The ${process.env.APP_NAME || 'Event Platform'} Team</p>
                </div>
                <div class="footer">
                    <p>You received this email because you're registered for ${eventName}</p>
                </div>
            </div>
        </body>
        </html>
    `,

    certificate: (eventName, position = null) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                         color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .trophy { font-size: 48px; text-align: center; margin: 20px 0; }
                .certificate-info { background: white; padding: 20px; border-radius: 5px; 
                                   text-align: center; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Congratulations!</h1>
                    <p style="margin: 0;">Your Certificate is Ready</p>
                </div>
                <div class="content">
                    <p>Dear {{name}},</p>
                    <div class="trophy">🏆</div>
                    <p>Congratulations on ${position ? `securing ${position} position in` : 'successfully completing'} <strong>${eventName}</strong>!</p>
                    <p>Your certificate is attached to this email.</p>
                    <div class="certificate-info">
                        <p><strong>Certificate ID:</strong> {{certificate_id}}</p>
                        <p><strong>Event:</strong> ${eventName}</p>
                        <p><strong>Date:</strong> {{event_date}}</p>
                        ${position ? `<p><strong>Achievement:</strong> ${position}</strong></p>` : ''}
                    </div>
                    <p>You can verify your certificate at: <a href="${process.env.FRONTEND_URL}/verify-certificate">Verify Certificate</a></p>
                    <p>Keep this certificate safe for your records.</p>
                    <p>Best wishes for your future endeavors!</p>
                </div>
                <div class="footer">
                    <p>Certificate ID: {{certificate_id}}</p>
                </div>
            </div>
        </body>
        </html>
    `,

    registrationConfirmation: (eventName) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                         color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-icon { font-size: 64px; text-align: center; margin: 20px 0; }
                .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Registration Confirmed!</h1>
                </div>
                <div class="content">
                    <div class="success-icon">🎉</div>
                    <p>Hi {{name}},</p>
                    <p>Your registration for <strong>${eventName}</strong> has been confirmed!</p>
                    <div class="details">
                        <p><strong>Event:</strong> ${eventName}</p>
                        <p><strong>Registration ID:</strong> {{registration_id}}</p>
                        <p><strong>Event Date:</strong> {{event_date}}</p>
                    </div>
                    <p>We look forward to seeing you at the event!</p>
                </div>
            </div>
        </body>
        </html>
    `
};

// Utility: delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    sendEmail,
    sendBulkEmails,
    templates,
    replacePlaceholders
};
