const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

// Get all employees with pagination
router.get('/', employeeController.getEmployees);

// Create a new employee
router.post('/', employeeController.createEmployee);

// Search employees by name and company
router.get('/search', employeeController.searchEmployees);

// Get employees by company
router.get('/byCompany/:empresa', employeeController.getEmployeesByCompany);

// Get employee by DNI
router.get('/:dni', employeeController.getEmployeeByDNI);

// Update employee
router.put('/:id', employeeController.updateEmployee);

// Deactivate employee
router.put('/deactivate/:dni', employeeController.deactivateEmployee);

module.exports = router; 