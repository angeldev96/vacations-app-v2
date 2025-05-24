const db = require('../config/database');

const getPermissionHistory = async (page, limit) => {
  return await db.getPermissionHistory(page, limit);
};

const getPermissionsByEmployeeId = async (empleado_id) => {
  return await db.getPermissionsByEmployeeId(empleado_id);
};

const createPermissionRequest = async (empleado_id, descripcion, con_goce_sueldo, fecha_inicio, fecha_fin) => {
  return await db.insertPermissionRequest(empleado_id, descripcion, con_goce_sueldo, fecha_inicio, fecha_fin);
};

const updatePermissionStatus = async (permissionId, estado) => {
  return await db.updatePermissionStatus(permissionId, estado);
};

const deletePermissionRequest = async (permissionId) => {
  return await db.deletePermissionRequest(permissionId);
};

module.exports = {
  getPermissionHistory,
  getPermissionsByEmployeeId,
  createPermissionRequest,
  updatePermissionStatus,
  deletePermissionRequest
}; 