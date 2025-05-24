const db = require('../config/database');

const getVacationHistory = async (page, limit) => {
  return await db.getVacationHistory(page, limit);
};

const getVacationsByEmployeeId = async (empleado_id) => {
  return await db.getVacationsByEmployeeId(empleado_id);
};

const createVacationRequest = async (empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados) => {
  return await db.insertVacationRequest(empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados);
};

const updateVacationStatusAndDays = async (vacationId, estado) => {
  return await db.updateVacationStatusAndDays(vacationId, estado);
};

const updateVacationStatusWithoutDeduction = async (vacationId, estado) => {
  return await db.updateVacationStatusWithoutDeduction(vacationId, estado);
};

const deleteVacationRequestAndUpdateDays = async (vacationId) => {
  return await db.deleteVacationRequestAndUpdateDays(vacationId);
};

const getVacationHistoryByEmployee = async (empleado_id) => {
  return await db.getVacationHistoryByEmployee(empleado_id);
};

module.exports = {
  getVacationHistory,
  getVacationsByEmployeeId,
  createVacationRequest,
  updateVacationStatusAndDays,
  updateVacationStatusWithoutDeduction,
  deleteVacationRequestAndUpdateDays,
  getVacationHistoryByEmployee
}; 