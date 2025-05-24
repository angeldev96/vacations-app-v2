const db = require('../config/database');

const getEmployeesWithPagination = async (page, limit, empresa) => {
  return await db.getEmployeesWithPagination(page, limit, empresa);
};

const getTotalEmployees = async (empresa) => {
  return await db.getTotalEmployees(empresa);
};

const createEmployee = async (employeeData) => {
  return await db.createEmployee(employeeData);
};

const searchEmployeesByNameAndCompany = async (name, empresa) => {
  return await db.getEmployeesByNameAndCompany(name, empresa);
};

const getEmployeesByCompany = async (empresa) => {
  return await db.getEmployeesByCompany(empresa);
};

const getEmployeeByDNI = async (dni) => {
  return await db.getEmployeeByDNI(dni);
};

const updateEmployeeForm = async (id, employeeData) => {
  return await db.updateEmployeeForm(id, employeeData);
};

const deactivateEmployee = async (dni) => {
  return await db.deactivateEmployee(dni);
};

const getEmployeesBatch = async (limit, offset) => {
  return await db.getEmployeesBatch(limit, offset);
};

const updateEmployee = async (
  empleado_id,
  anio_actual_empleo,
  mes_actual_anio_laboral,
  dias_vacaciones_acumulados,
  fecha_ultima_acumulacion
) => {
  return await db.updateEmployee(
    empleado_id,
    anio_actual_empleo,
    mes_actual_anio_laboral,
    dias_vacaciones_acumulados,
    fecha_ultima_acumulacion
  );
};

module.exports = {
  getEmployeesWithPagination,
  getTotalEmployees,
  createEmployee,
  searchEmployeesByNameAndCompany,
  getEmployeesByCompany,
  getEmployeeByDNI,
  updateEmployeeForm,
  deactivateEmployee,
  getEmployeesBatch,
  updateEmployee
}; 