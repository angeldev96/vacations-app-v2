const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const permissionController = require('../controllers/permissionController');

// Get employee permissions - /api/permissions?empleado_id=X
router.get('/', permissionController.getEmployeePermissions);

// Create permission request - /api/permissions
router.post('/', permissionController.createPermissionRequest);

// Update permission status - /api/permissions/:permissionId
router.put('/:permissionId', permissionController.updatePermissionStatus);

// Delete permission request - /api/permissions/:id
router.delete('/:id', permissionController.deletePermissionRequest);

module.exports = router; 