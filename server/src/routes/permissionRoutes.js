const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const permissionController = require('../controllers/permissionController');

// Get permission history
router.get('/history', permissionController.getPermissionHistory);

// Get employee permissions
router.get('/', permissionController.getEmployeePermissions);

// Create permission request
router.post('/', permissionController.createPermissionRequest);

// Update permission status
router.put('/:permissionId', permissionController.updatePermissionStatus);

// Delete permission request
router.delete('/:id', permissionController.deletePermissionRequest);

module.exports = router; 