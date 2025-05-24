const vacationService = require('../services/vacationService');

const getVacationHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { rows, total } = await vacationService.getVacationHistory(page, limit);
    res.json({ vacations: rows, total });
  } catch (error) {
    console.error('Error al obtener historial de vacaciones:', error);
    res.status(500).json({ error: 'Error al obtener historial de vacaciones' });
  }
};

const getEmployeeVacations = async (req, res) => {
  try {
    const empleado_id = req.query.empleado_id;

    if (!empleado_id) {
      return res.status(400).json({ error: 'Se requiere el ID del empleado' });
    }

    const vacations = await vacationService.getVacationsByEmployeeId(empleado_id);
    res.json(vacations);
  } catch (error) {
    console.error('Error al obtener las solicitudes de vacaciones:', error);
    res.status(500).json({ error: 'Error al obtener las solicitudes de vacaciones' });
  }
};

const createVacationRequest = async (req, res) => {
  try {
    const { empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados } = req.body;

    if (!empleado_id || !fecha_inicio || !fecha_fin || !dias_solicitados) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const newVacationId = await vacationService.createVacationRequest(
      empleado_id,
      fecha_inicio,
      fecha_fin,
      motivo,
      dias_solicitados
    );

    res.status(201).json({ vacacion_id: newVacationId });
  } catch (error) {
    console.error('Error al crear solicitud de vacaciones:', error);
    res.status(500).json({ error: 'Error al crear solicitud de vacaciones' });
  }
};

const updateVacationStatus = async (req, res) => {
  try {
    const { vacationId } = req.params;
    const { estado } = req.body;

    if (!estado || !['Aprobada', 'Rechazada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    await vacationService.updateVacationStatusAndDays(vacationId, estado);
    res.json({ message: 'Estado de vacación actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el estado de la vacación:', error);
    res.status(500).json({ error: 'Error al actualizar el estado de la vacación' });
  }
};

const approveWithoutDeduction = async (req, res) => {
  try {
    const { vacationId } = req.params;
    await vacationService.updateVacationStatusWithoutDeduction(vacationId, 'Aprobada');
    res.json({ message: 'Vacación aprobada sin deducción de días' });
  } catch (error) {
    console.error('Error al aprobar vacación sin deducción:', error);
    res.status(500).json({ error: 'Error al aprobar vacación sin deducción' });
  }
};

const deleteVacationRequest = async (req, res) => {
  try {
    const vacationId = req.params.id;
    await vacationService.deleteVacationRequestAndUpdateDays(vacationId);
    res.status(200).json({ message: 'Solicitud de vacaciones eliminada y días actualizados' });
  } catch (error) {
    console.error('Error al deshacer solicitud de vacaciones:', error);
    res.status(500).json({ error: 'Error al deshacer solicitud de vacaciones' });
  }
};

module.exports = {
  getVacationHistory,
  getEmployeeVacations,
  createVacationRequest,
  updateVacationStatus,
  approveWithoutDeduction,
  deleteVacationRequest
}; 