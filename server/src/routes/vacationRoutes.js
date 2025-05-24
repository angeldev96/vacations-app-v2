const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const vacationController = require('../controllers/vacationController');

// Get vacation history
router.get('/history', vacationController.getVacationHistory);

// Get employee vacations
router.get('/', vacationController.getEmployeeVacations);

// Create vacation request
router.post('/', vacationController.createVacationRequest);

// Update vacation status
router.put('/:vacationId', vacationController.updateVacationStatus);

// Approve vacation without deduction
router.put('/:vacationId/approve-without-deduction', vacationController.approveWithoutDeduction);

// Delete vacation request
router.delete('/:id', vacationController.deleteVacationRequest);

module.exports = router; 