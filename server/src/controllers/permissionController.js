const permissionService = require('../services/permissionService');

const getPermissionHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { rows, total } = await permissionService.getPermissionHistory(page, limit);
    res.json({ permissions: rows, total });
  } catch (error) {
    console.error('Error al obtener historial de permisos:', error);
    res.status(500).json({ error: 'Error al obtener historial de permisos' });
  }
};

const getEmployeePermissions = async (req, res) => {
  try {
    const empleado_id = req.query.empleado_id;

    if (!empleado_id) {
      return res.status(400).json({ error: 'Se requiere el ID del empleado' });
    }

    const permissions = await permissionService.getPermissionsByEmployeeId(empleado_id);
    res.json(permissions);
  } catch (error) {
    console.error('Error al obtener las solicitudes de permisos:', error);
    res.status(500).json({ error: 'Error al obtener las solicitudes de permisos' });
  }
};

const createPermissionRequest = async (req, res) => {
  try {
    const { empleado_id, descripcion, con_goce_sueldo, fecha_inicio, fecha_fin } = req.body;

    if (!empleado_id || !descripcion || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const newPermissionId = await permissionService.createPermissionRequest(
      empleado_id,
      descripcion,
      con_goce_sueldo,
      fecha_inicio,
      fecha_fin
    );

    res.status(201).json({ permiso_id: newPermissionId });
  } catch (error) {
    console.error('Error al crear solicitud de permiso:', error);
    res.status(500).json({ error: 'Error al crear solicitud de permiso' });
  }
};

const updatePermissionStatus = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { estado } = req.body;

    if (!estado || !['aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    await permissionService.updatePermissionStatus(permissionId, estado);
    res.json({ message: 'Estado de permiso actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del permiso:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del permiso' });
  }
};

const deletePermissionRequest = async (req, res) => {
  try {
    const permissionId = req.params.id;
    await permissionService.deletePermissionRequest(permissionId);
    res.status(200).json({ message: 'Solicitud de permiso eliminada' });
  } catch (error) {
    console.error('Error al eliminar solicitud de permiso:', error);
    res.status(500).json({ error: 'Error al eliminar solicitud de permiso' });
  }
};

module.exports = {
  getPermissionHistory,
  getEmployeePermissions,
  createPermissionRequest,
  updatePermissionStatus,
  deletePermissionRequest
}; 