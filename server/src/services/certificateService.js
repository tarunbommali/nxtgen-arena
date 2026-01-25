const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../utils/prismaClient');

// Generate certificate PDF in memory (NO FILE STORAGE)
const generateCertificatePDF = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            // Store PDF in memory
            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            // Certificate Design
            const width = doc.page.width;
            const height = doc.page.height;

            // Border
            doc.rect(30, 30, width - 60, height - 60)
                .lineWidth(3)
                .strokeColor('#4A90E2')
                .stroke();

            doc.rect(40, 40, width - 80, height - 80)
                .lineWidth(1)
                .strokeColor('#4A90E2')
                .stroke();

            // Title
            doc.fontSize(40)
                .fillColor('#2C3E50')
                .font('Helvetica-Bold')
                .text('CERTIFICATE', 0, 100, { align: 'center' });

            doc.fontSize(16)
                .font('Helvetica')
                .text('OF ACHIEVEMENT', 0, 150, { align: 'center' });

            // Decorative line
            doc.moveTo(width / 2 - 100, 180)
                .lineTo(width / 2 + 100, 180)
                .lineWidth(2)
                .strokeColor('#E74C3C')
                .stroke();

            // "This is to certify that"
            doc.fontSize(14)
                .fillColor('#7F8C8D')
                .font('Helvetica')
                .text('This is to certify that', 0, 210, { align: 'center' });

            // Participant Name
            doc.fontSize(32)
                .fillColor('#2C3E50')
                .font('Helvetica-Bold')
                .text(data.participantName, 0, 250, { align: 'center' });

            // Underline name
            const nameWidth = doc.widthOfString(data.participantName);
            doc.moveTo((width - nameWidth) / 2, 290)
                .lineTo((width + nameWidth) / 2, 290)
                .lineWidth(1)
                .strokeColor('#BDC3C7')
                .stroke();

            // Achievement text
            let achievementText = '';
            if (data.position) {
                // Winner
                achievementText = `has secured ${data.position} in`;
            } else if (data.teamName) {
                // Team participant
                achievementText = `as a member of team "${data.teamName}"\nhas successfully participated in`;
            } else {
                // Individual participant
                achievementText = 'has successfully participated in';
            }

            doc.fontSize(14)
                .fillColor('#34495E')
                .font('Helvetica')
                .text(achievementText, 0, 320, { align: 'center' });

            // Event Name
            doc.fontSize(24)
                .fillColor('#E74C3C')
                .font('Helvetica-Bold')
                .text(data.eventName, 0, data.position ? 360 : 370, { align: 'center' });

            // Date
            doc.fontSize(12)
                .fillColor('#7F8C8D')
                .font('Helvetica')
                .text(`Date: ${data.date}`, 0, data.position ? 410 : 420, { align: 'center' });

            // Certificate ID (small at bottom)
            doc.fontSize(10)
                .fillColor('#95A5A6')
                .text(`Certificate ID: ${data.certificateId}`, 0, height - 80, { align: 'center' });

            // Signature placeholder
            doc.fontSize(12)
                .fillColor('#2C3E50')
                .font('Helvetica-Bold')
                .text('Authorized Signature', width / 2 + 100, height - 100, { align: 'center' });

            doc.moveTo(width / 2 + 50, height - 110)
                .lineTo(width / 2 + 200, height - 110)
                .lineWidth(1)
                .strokeColor('#2C3E50')
                .stroke();

            // Organization name
            doc.fontSize(10)
                .fillColor('#7F8C8D')
                .font('Helvetica')
                .text(process.env.APP_NAME || 'Event Platform', 60, height - 100, { align: 'left' });

            // Finalize PDF
            doc.end();

        } catch (error) {
            console.error('Generate certificate PDF error:', error);
            reject(error);
        }
    });
};

// Generate certificate ID and store metadata (NO PDF STORAGE)
const createCertificateRecord = async (eventId, userId, teamId, position, participantName) => {
    try {
        const certificateId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;

        const certificate = await prisma.certificate.create({
            data: {
                certificateId,
                eventId,
                userId,
                teamId,
                participantName,
                position,
                issuedAt: new Date()
            }
        });

        return certificate;
    } catch (error) {
        console.error('Create certificate record error:', error);
        throw error;
    }
};

// Verify certificate (only metadata lookup, no file)
const verifyCertificate = async (certificateId) => {
    try {
        const certificate = await prisma.certificate.findUnique({
            where: { certificateId },
            include: {
                event: {
                    select: {
                        title: true,
                        eventStart: true
                    }
                },
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                },
                team: {
                    select: {
                        teamName: true
                    }
                }
            }
        });

        if (!certificate) {
            return null;
        }

        return {
            valid: true,
            certificateId: certificate.certificateId,
            participantName: certificate.participantName,
            eventName: certificate.event.title,
            eventDate: certificate.event.eventStart.toISOString().split('T')[0],
            position: certificate.position,
            teamName: certificate.team?.teamName,
            issuedAt: certificate.issuedAt
        };
    } catch (error) {
        console.error('Verify certificate error:', error);
        throw error;
    }
};

// Generate and send certificate (in-memory, immediate send, no storage)
const generateAndSendCertificate = async (certificateData, recipientEmail) => {
    try {
        // 1. Generate PDF in memory
        const pdfBuffer = await generateCertificatePDF(certificateData);

        // 2. Prepare email with PDF attachment
        const emailData = {
            to: recipientEmail,
            subject: `Certificate - ${certificateData.eventName}`,
            html: templates.certificate(certificateData.eventName, certificateData.position),
            attachments: [
                {
                    filename: `Certificate-${certificateData.certificateId}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        // 3. Send email
        const { sendEmail, templates } = require('./emailService');
        await sendEmail(emailData);

        // 4. PDF automatically gets garbage collected (no storage)
        return { success: true, certificateId: certificateData.certificateId };

    } catch (error) {
        console.error('Generate and send certificate error:', error);
        throw error;
    }
};

module.exports = {
    generateCertificatePDF,
    createCertificateRecord,
    verifyCertificate,
    generateAndSendCertificate
};
