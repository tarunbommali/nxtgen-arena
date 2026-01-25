const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// For production, use AWS S3 or Cloudinary
// This is a local file storage implementation for development

const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
const ensureUploadDir = async () => {
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }
};

ensureUploadDir();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/jpg': '.jpg'
    };

    if (allowedTypes[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
    }
};

// Multer upload instance
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter
});

// Save file to local storage
const saveFile = async (file, subfolder = 'submissions') => {
    try {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        const folder = path.join(uploadDir, subfolder);

        // Ensure subfolder exists
        await fs.mkdir(folder, { recursive: true });

        const filepath = path.join(folder, filename);

        // Write file
        await fs.writeFile(filepath, file.buffer);

        // Return URL (in production, this would be S3/Cloudinary URL)
        return {
            url: `/uploads/${subfolder}/${filename}`,
            filename,
            size: file.size,
            mimetype: file.mimetype
        };
    } catch (error) {
        console.error('Save file error:', error);
        throw new Error('Failed to save file');
    }
};

// Delete file
const deleteFile = async (filepath) => {
    try {
        const fullPath = path.join(__dirname, '../../', filepath);
        await fs.unlink(fullPath);
        return true;
    } catch (error) {
        console.error('Delete file error:', error);
        return false;
    }
};

// Validate file
const validateFile = (file, maxSize = 5 * 1024 * 1024) => {
    if (!file) {
        throw new Error('No file provided');
    }

    if (file.size > maxSize) {
        throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    return true;
};

module.exports = {
    upload,
    saveFile,
    deleteFile,
    validateFile,
    uploadDir
};

/* 
 * AWS S3 Implementation (Uncomment for production):
 * 
 * const AWS = require('aws-sdk');
 * 
 * const s3 = new AWS.S3({
 *     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *     region: process.env.AWS_REGION
 * });
 * 
 * const uploadToS3 = async (file, subfolder = 'submissions') => {
 *     const ext = path.extname(file.originalname);
 *     const filename = `${subfolder}/${uuidv4()}${ext}`;
 *     
 *     const params = {
 *         Bucket: process.env.AWS_S3_BUCKET,
 *         Key: filename,
 *         Body: file.buffer,
 *         ContentType: file.mimetype,
 *         ACL: 'public-read'
 *     };
 *     
 *     const result = await s3.upload(params).promise();
 *     
 *     return {
 *         url: result.Location,
 *         key: result.Key,
 *         size: file.size,
 *         mimetype: file.mimetype
 *     };
 * };
 * 
 * const deleteFromS3 = async (key) => {
 *     const params = {
 *         Bucket: process.env.AWS_S3_BUCKET,
 *         Key: key
 *     };
 *     
 *     await s3.deleteObject(params).promise();
 *     return true;
 * };
 */
