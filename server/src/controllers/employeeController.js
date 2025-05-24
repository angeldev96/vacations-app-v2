const employeeService = require('../services/employeeService');

const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const empresa = req.query.empresa || null;
    
    const employees = await employeeService.getEmployeesWithPagination(page, limit, empresa);
    const totalEmployees = await employeeService.getTotalEmployees(empresa);

    res.json({ employees, total: totalEmployees });
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { nombre, dni, fechaIngreso, empresa, ubicacion, diasVacacionesTomados } = req.body;

    if (!nombre || !dni || !fechaIngreso || !empresa || !ubicacion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newEmployee = await employeeService.createEmployee({
      nombre,
      dni,
      fecha_ingreso: fechaIngreso,
      empresa,
      ubicacion,
      dias_vacaciones_tomados: diasVacacionesTomados || 0,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ error: 'Error al crear empleado' });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const { name, empresa } = req.query;
    const employees = await employeeService.searchEmployeesByNameAndCompany(name, empresa);

    if (employees.length > 0) {
      res.json({ employees });
    } else {
      res.status(404).json({ error: 'No se encontraron empleados con ese nombre y empresa' });
    }
  } catch (error) {
    console.error('Error al buscar empleados:', error);
    res.status(500).json({ error: 'Error al buscar empleados' });
  }
};

const getEmployeesByCompany = async (req, res) => {
  try {
    const { empresa } = req.params;
    const employees = await employeeService.getEmployeesByCompany(empresa);

    if (employees.length > 0) {
      res.json({ employees });
    } else {
      res.status(404).json({ error: 'No se encontraron empleados para esa empresa' });
    }
  } catch (error) {
    console.error('Error al obtener empleados por empresa:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

const getEmployeeByDNI = async (req, res) => {
  try {
    const dni = req.params.dni;
    const employee = await employeeService.getEmployeeByDNI(dni);

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener empleado por DNI:', error);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedEmployee = req.body;
    const result = await employeeService.updateEmployeeForm(id, updatedEmployee);
    
    if (result) {
      res.json({ message: 'Empleado actualizado con éxito' });
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const { dni } = req.params;
    await employeeService.deactivateEmployee(dni);
    res.status(200).json({ message: 'Empleado desactivado exitosamente' });
  } catch (error) {
    console.error('Error al desactivar empleado:', error);
    res.status(500).json({ error: 'Error al desactivar empleado' });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  searchEmployees,
  getEmployeesByCompany,
  getEmployeeByDNI,
  updateEmployee,
  deactivateEmployee
}; 