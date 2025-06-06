const mysql = require("mysql2/promise");

require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
//   ssl: {
//     rejectUnauthorized: false,
//   },
});

const databaseName = process.env.DB_NAME; // Asegúrate de que la variable de entorno DATABASE_NAME esté configurada

const connect = async () => {
  try {
    await pool.getConnection();
    console.log("Conexión exitosa a la base de datos", databaseName);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", databaseName  ,error);
  }
};



const insertEmployee = async (nombre, dni, fecha_ingreso, dias_proporcionales, dias_disfrutados, ubicacion_empleado) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO empleados (nombre, dni, fecha_ingreso, dias_proporcionales, dias_disfrutados, ubicacion_empleado) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, dni, fecha_ingreso, dias_proporcionales, dias_disfrutados, ubicacion_empleado]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error al insertar empleado:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};


const getEmployeeByDNI = async (dni) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM empleados WHERE dni = ?',
      [dni]
    );
    if (rows.length > 0) {
      return rows[0]; // Devolver el primer objeto del array (si se encuentra)
    } else {
      return null; // Devolver null si no se encuentra el empleado
    }
  } catch (error) {
    console.error('Error al obtener empleado por DNI:', error);
    throw error;
  }
};


const updateEmployeeForm = async (id, employeeData) => {
  try {
    const [result] = await pool.query(
      'UPDATE empleados SET ? WHERE empleado_id = ?',
      [employeeData, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    throw error;
  }
};

const getEmployeesByNameAndCompany = async (name, empresa) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM empleados WHERE nombre LIKE ? AND empresa = ?',
      [`%${name}%`, empresa] // Utiliza LIKE para buscar coincidencias parciales y filtra por empresa
    );
    return rows; // Devuelve el array completo con todos los resultados
  } catch (error) {
    console.error('Error al buscar empleados por nombre y empresa:', error);
    throw error;
  }
};

const getEmployeesByCompany = async (empresa) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM empleados WHERE empresa = ?',
      [empresa]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener empleados por empresa:', error);
    throw error;
  }
};





// const updateVacationStatus = async (vacacion_id, estado) => {
//   try {
//     const [result] = await pool.query(
//       'UPDATE vacaciones SET estado = ? WHERE vacacion_id = ?',
//       [estado, vacacion_id]
//     );
//     await pool.query(
//       'INSERT INTO Historial_vacaciones (vacacion_id, estado, fecha_cambio) VALUES (?, ?, NOW())',
//       [vacacion_id, estado]
//     );
//     return result.affectedRows;
//   } catch (error) {
//     console.error('Error al actualizar estado de solicitud de vacaciones:', error);
//     throw error;
//   }
// };

const getPendingVacations = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM vacaciones WHERE estado = "pendiente"'
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener solicitudes de vacaciones pendientes:', error);
    throw error;
  }
};


const getVacationHistoryByEmployee = async (empleado_id) => {
  try {
    const [rows] = await pool.query(
      `SELECT v.*, hv.estado AS historial_estado, hv.fecha_cambio 
       FROM vacaciones v 
       JOIN Historial_vacaciones hv ON v.vacacion_id = hv.vacacion_id 
       WHERE v.empleado_id = ? 
       ORDER BY hv.fecha_cambio DESC`,
      [empleado_id]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener historial de vacaciones:', error);
    throw error;
  }
};

const getEmployeesWithPagination = async (page, limit, empresa) => {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM empleados';
  let params = [limit, offset];

  if (empresa) {
    query += ' WHERE empresa = ?';
    params = [empresa, ...params];
  }

  query += ' ORDER BY empleado_id LIMIT ? OFFSET ?';

  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error al obtener empleados con paginación:', error);
    throw error;
  }
};


const getTotalEmployees = async (empresa) => {
  let query = 'SELECT COUNT(*) AS total FROM empleados';
  let params = [];

  if (empresa) {
    query += ' WHERE empresa = ?';
    params = [empresa];
  }

  try {
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  } catch (error) {
    console.error('Error al obtener el número total de empleados:', error);
    throw error;
  }
};

const createEmployee = async (employeeData) => {
  try {
    const { nombre, dni, fecha_ingreso, empresa, ubicacion, dias_vacaciones_tomados } = employeeData;
    const [result] = await pool.query(
      'INSERT INTO empleados (nombre, dni, fecha_ingreso, empresa, ubicacion, dias_vacaciones_tomados) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, dni, fecha_ingreso, empresa, ubicacion, dias_vacaciones_tomados]
    );
    return { empleado_id: result.insertId, ...employeeData }; 
  } catch (error) {
    console.error('Error al crear empleado en la base de datos:', error);
    throw error;
  }
};



const insertVacationRequest = async (empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO vacaciones (empleado_id, fecha_inicio, fecha_fin, motivo, estado, dias_solicitados) VALUES (?, ?, ?, ?, "Pendiente", ?)',
      [empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados]
    );
    return result.insertId; // Devuelve la ID de la nueva solicitud
  } catch (error) {
    console.error('Error al insertar solicitud de vacaciones:', error);
    throw error;
  }
};


const getVacationHistory = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  try {
    const [rows] = await pool.query(
      `SELECT v.*, e.nombre, e.dni
       FROM vacaciones v
       JOIN empleados e ON v.empleado_id = e.empleado_id
       WHERE e.empleado_activo = 1
       ORDER BY v.fecha_solicitud DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM vacaciones v JOIN empleados e ON v.empleado_id = e.empleado_id WHERE e.empleado_activo = 1'
    );
    const total = countResult[0].total;

    return { rows, total };
  } catch (error) {
    console.error('Error al obtener historial de vacaciones:', error);
    throw error;
  }
};


const getVacationsByEmployeeId = async (empleado_id) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM vacaciones WHERE empleado_id = ?',
      [empleado_id]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener las solicitudes de vacaciones del empleado:', error);
    throw error;
  }
};


const updateVacationStatus = async (vacationId, estado) => {
  try {
    const [result] = await pool.query(
      'UPDATE vacaciones SET estado = ? WHERE vacacion_id = ?',
      [estado, vacationId]
    );
    return result;
  } catch (error) {
    console.error('Error al actualizar el estado de la vacación:', error);
    throw error;
  }
};


const insertVacationRequestAndUpdateDays = async (empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar la solicitud de vacaciones
    const [resultVacation] = await connection.query(
      'INSERT INTO vacaciones (empleado_id, fecha_inicio, fecha_fin, motivo, estado, dias_solicitados) VALUES (?, ?, ?, ?, "pendiente", ?)',
      [empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados]
    );

    // Actualizar los días acumulados del empleado
    const [resultUpdate] = await connection.query(
      'UPDATE empleados SET dias_vacaciones_acumulados = dias_vacaciones_acumulados - ?, dias_vacaciones_tomados = dias_vacaciones_tomados + ? WHERE empleado_id = ?',
      [dias_solicitados, dias_solicitados, empleado_id]
    );

    await connection.commit();
    return resultVacation.insertId;
  } catch (error) {
    await connection.rollback();
    console.error('Error en la transacción:', error);
    throw error;
  } finally {
    connection.release();
  }
};



const getAllEmployees = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleados');
    return rows;
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
};

// Método para obtener empleados por lotes
const getEmployeesBatch = async (limit, offset) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM empleados LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener empleados por lotes:', error);
    throw error;
  }
};



// Método para actualizar el empleado
const updateEmployee = async (
  empleado_id,
  anio_actual_empleo,
  mes_actual_anio_laboral,
  dias_vacaciones_acumulados,
  fecha_ultima_acumulacion
) => {
  try {
    await pool.query(
      'UPDATE empleados SET anio_actual_empleo = ?, mes_actual_anio_laboral = ?, dias_vacaciones_acumulados = ?, fecha_ultima_acumulacion = ? WHERE empleado_id = ?',
      [
        parseInt(anio_actual_empleo),
        parseInt(mes_actual_anio_laboral),
        parseFloat(dias_vacaciones_acumulados),
        fecha_ultima_acumulacion,
        empleado_id,
      ]
    );
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    throw error;
  }
};


const deleteVacationRequestAndUpdateDays = async (vacationId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener la información de la solicitud de vacaciones
    const [vacationInfo] = await connection.query(
      'SELECT empleado_id, estado, dias_solicitados FROM vacaciones WHERE vacacion_id = ?',
      [vacationId]
    );

    if (vacationInfo.length === 0) {
      throw new Error('Solicitud de vacaciones no encontrada');
    }

    const { empleado_id, estado, dias_solicitados } = vacationInfo[0];

    // Eliminar la solicitud de vacaciones
    await connection.query('DELETE FROM vacaciones WHERE vacacion_id = ?', [vacationId]);

    if (estado === 'Aprobada') {
      // Si la solicitud estaba aprobada, devolver días
      await connection.query(
        'UPDATE empleados SET dias_vacaciones_acumulados = dias_vacaciones_acumulados + ?, dias_vacaciones_tomados = dias_vacaciones_tomados - ? WHERE empleado_id = ?',
        [dias_solicitados, dias_solicitados, empleado_id]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error en la transacción:', error);
    throw error;
  } finally {
    connection.release();
  }
};


const deactivateEmployee = async (dni) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Cambia el estado de activación del empleado
    await connection.query(
      'UPDATE empleados SET empleado_activo = 0 WHERE dni = ?',
      [dni]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error en la transacción:', error);
    throw error;
  } finally {
    connection.release();
  }
};


const updateVacationStatusAndDays = async (vacationId, newEstado) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener información actual de la solicitud
    const [vacationRows] = await connection.query(
      'SELECT empleado_id, estado, dias_solicitados FROM vacaciones WHERE vacacion_id = ?',
      [vacationId]
    );

    if (vacationRows.length === 0) {
      throw new Error('Solicitud de vacaciones no encontrada');
    }

    const vacation = vacationRows[0];
    const { empleado_id, estado: currentEstado, dias_solicitados } = vacation;

    // Actualizar el estado de la solicitud
    await connection.query(
      'UPDATE vacaciones SET estado = ? WHERE vacacion_id = ?',
      [newEstado, vacationId]
    );

    // Lógica para ajustar días de vacaciones
    if (currentEstado !== 'Aprobada' && newEstado === 'Aprobada') {
      // Si se aprueba la solicitud, deducir días
      await connection.query(
        'UPDATE empleados SET dias_vacaciones_acumulados = dias_vacaciones_acumulados - ?, dias_vacaciones_tomados = dias_vacaciones_tomados + ? WHERE empleado_id = ?',
        [dias_solicitados, dias_solicitados, empleado_id]
      );
    } else if (currentEstado === 'Aprobada' && newEstado !== 'Aprobada') {
      // Si se cambia de Aprobada a otro estado, devolver días
      await connection.query(
        'UPDATE empleados SET dias_vacaciones_acumulados = dias_vacaciones_acumulados + ?, dias_vacaciones_tomados = dias_vacaciones_tomados - ? WHERE empleado_id = ?',
        [dias_solicitados, dias_solicitados, empleado_id]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error en la transacción:', error);
    throw error;
  } finally {
    connection.release();
  }
};

const updateVacationStatusWithoutDeduction = async (vacationId, newEstado) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Actualizar el estado de la solicitud sin afectar los días
    await connection.query(
      'UPDATE vacaciones SET estado = ? WHERE vacacion_id = ?',
      [newEstado, vacationId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error en la transacción:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// FUNCIONES PARA PERMISOS

const insertPermissionRequest = async (empleado_id, descripcion, con_goce_sueldo, fecha_inicio, fecha_fin) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO permisos (empleado_id, descripcion, con_goce_sueldo, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, "pendiente")',
      [empleado_id, descripcion, con_goce_sueldo, fecha_inicio, fecha_fin]
    );
    return result.insertId; // Devuelve la ID de la nueva solicitud
  } catch (error) {
    console.error('Error al insertar solicitud de permiso:', error);
    throw error;
  }
};

const getPermissionHistory = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  try {
    const [rows] = await pool.query(
      `SELECT p.*, e.nombre, e.dni
       FROM permisos p
       JOIN empleados e ON p.empleado_id = e.empleado_id
       WHERE e.empleado_activo = 1
       ORDER BY p.fecha_solicitud DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM permisos p JOIN empleados e ON p.empleado_id = e.empleado_id WHERE e.empleado_activo = 1'
    );
    const total = countResult[0].total;

    return { rows, total };
  } catch (error) {
    console.error('Error al obtener historial de permisos:', error);
    throw error;
  }
};

const getPermissionsByEmployeeId = async (empleado_id) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM permisos WHERE empleado_id = ?',
      [empleado_id]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener las solicitudes de permisos del empleado:', error);
    throw error;
  }
};

const updatePermissionStatus = async (permissionId, estado) => {
  try {
    const [result] = await pool.query(
      'UPDATE permisos SET estado = ? WHERE permiso_id = ?',
      [estado, permissionId]
    );
    return result;
  } catch (error) {
    console.error('Error al actualizar el estado del permiso:', error);
    throw error;
  }
};

const deletePermissionRequest = async (permissionId) => {
  try {
    const [result] = await pool.query('DELETE FROM permisos WHERE permiso_id = ?', [permissionId]);
    return result;
  } catch (error) {
    console.error('Error al eliminar solicitud de permiso:', error);
    throw error;
  }
};

const getVacationsByPeriodAndCompany = async (fecha_inicio, fecha_fin, empresa) => {
  try {
    let query = `
      SELECT 
        e.nombre,
        e.dni,
        e.empresa,
        e.dias_vacaciones_acumulados,
        e.dias_vacaciones_tomados,
        SUM(
          CASE 
            WHEN v.estado = 'Aprobada' AND v.fecha_inicio <= ? AND v.fecha_fin >= ? THEN 
              LEAST(v.dias_solicitados, 
                DATEDIFF(
                  LEAST(v.fecha_fin, ?), 
                  GREATEST(v.fecha_inicio, ?)
                ) + 1
              )
            ELSE 0 
          END
        ) as dias_tomados_periodo
      FROM empleados e
      INNER JOIN vacaciones v ON e.empleado_id = v.empleado_id
      WHERE e.empleado_activo = 1 
        AND v.estado = 'Aprobada' 
        AND v.fecha_inicio <= ? 
        AND v.fecha_fin >= ?
    `;
    
    let params = [fecha_fin, fecha_inicio, fecha_fin, fecha_inicio, fecha_fin, fecha_inicio];
    
    if (empresa) {
      query += ' AND e.empresa = ?';
      params.push(empresa);
    }
    
    query += ' GROUP BY e.empleado_id, e.nombre, e.dni, e.empresa, e.dias_vacaciones_acumulados, e.dias_vacaciones_tomados HAVING dias_tomados_periodo > 0 ORDER BY e.nombre';
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error al obtener vacaciones por período:', error);
    throw error;
  }
};

// Exportar las funciones
module.exports = {
  connect,
  insertEmployee,
  getEmployeeByDNI,
  insertVacationRequest,
  updateVacationStatus,
  getPendingVacations,
  getVacationHistoryByEmployee,
  getEmployeesWithPagination,
  getTotalEmployees,
  getUserByEmail,
  getVacationHistory,
  getVacationsByEmployeeId,
  insertVacationRequestAndUpdateDays,
  getAllEmployees,
  updateEmployee,
  getEmployeesBatch,
  createEmployee,
  getEmployeesByNameAndCompany,
  deleteVacationRequestAndUpdateDays,
  updateEmployeeForm,
  getEmployeesByCompany,
  deactivateEmployee,
  updateVacationStatusAndDays,
  updateVacationStatusWithoutDeduction,
  insertPermissionRequest,
  getPermissionHistory,
  getPermissionsByEmployeeId,
  updatePermissionStatus,
  deletePermissionRequest,
  getVacationsByPeriodAndCompany
};

