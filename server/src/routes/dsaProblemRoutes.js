const express = require('express');
const router = express.Router();
const dsaProblemController = require('../controllers/dsaProblemController');

// Public routes
router.get('/', dsaProblemController.getAllSheets);
router.get('/:id', dsaProblemController.getSheetById);

module.exports = router;
