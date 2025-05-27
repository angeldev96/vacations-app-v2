const express = require("express");
const db = require("./src/config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"], // Permite métodos específicos
    credentials: true, // Permite el envío de cookies
  })
);

const { verifyToken } = require("./middlewares/auth");

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario en la base de datos
    const user = await db.getUserByEmail(email);

    if (!user) {
      return res.status(401).send("User not found");
    }

    // Verifica la contraseña (texto plano para pruebas)
    const passwordIsValid = password === user.password;

    if (!passwordIsValid) {
      return res.status(401).send("Incorrect email or password");
    }

    // Genera un token
    const token = jwt.sign({ id: user.id, role: user.role }, "secretkey", {
      expiresIn: "7d",
    });

    return res.json({ message: "Successful login", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal server error");
  }
});

// Ruta para obtener todos los empleados (con paginación y filtro por empresa)
app.get("/api/employees", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const empresa = req.query.empresa || null;
    const employees = await db.getEmployeesWithPagination(page, limit, empresa);
    const totalEmployees = await db.getTotalEmployees(empresa);

    res.json({ employees, total: totalEmployees });
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
});

// Ruta para crear un nuevo empleado
app.post("/api/employees", async (req, res) => {
  try {
    const {
      nombre,
      dni,
      fechaIngreso,
      empresa,
      ubicacion,
      diasVacacionesTomados,
    } = req.body;

    // Validar que los campos requeridos no estén vacíos
    if (!nombre || !dni || !fechaIngreso || !empresa || !ubicacion) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Insertar el nuevo empleado en la base de datos
    const newEmployee = await db.createEmployee({
      nombre,
      dni,
      fecha_ingreso: fechaIngreso,
      empresa,
      ubicacion,
      dias_vacaciones_tomados: diasVacacionesTomados || 0, // Valor por defecto en caso de que no se provea
    });

    res.status(201).json(newEmployee); // 201 Created
  } catch (error) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ error: "Error al crear empleado" });
  }
});

// Ruta para buscar empleados por nombre y empresa
app.get("/api/employees/search", async (req, res) => {
  try {
    const { name, empresa } = req.query; // Obtén el nombre y la empresa de los parámetros de la consulta
    const employees = await db.getEmployeesByNameAndCompany(name, empresa); // Llama a la función de la base de datos

    if (employees.length > 0) {
      res.json({ employees }); // Devuelve los empleados encontrados
    } else {
      res
        .status(404)
        .json({
          error: "No se encontraron empleados con ese nombre y empresa",
        });
    }
  } catch (error) {
    console.error("Error al buscar empleados por nombre y empresa:", error);
    res.status(500).json({ error: "Error al buscar empleados" });
  }
});

app.get("/api/employees/byCompany/:empresa", async (req, res) => {
  try {
    const { empresa } = req.params;
    const employees = await db.getEmployeesByCompany(empresa);

    if (employees.length > 0) {
      res.json({ employees });
    } else {
      res
        .status(404)
        .json({ error: "No se encontraron empleados para esa empresa" });
    }
  } catch (error) {
    console.error("Error al obtener empleados por empresa:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
});

// Ruta para obtener un empleado específico por DNI
app.get("/api/employees/:dni", async (req, res) => {
  try {
    const dni = req.params.dni;
    const employee = await db.getEmployeeByDNI(dni);

    if (employee) {
      res.json(employee); // Devuelve el empleado si se encuentra
    } else {
      res.status(404).json({ error: "Empleado no encontrado" }); // Devuelve 404 si no se encuentra
    }
  } catch (error) {
    console.error("Error al obtener empleado por DNI:", error);
    res.status(500).json({ error: "Error al obtener empleado" });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedEmployee = req.body;
    const result = await db.updateEmployeeForm(id, updatedEmployee);
    if (result) {
      res.json({ message: "Empleado actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Empleado no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
});

// Ruta para crear una nueva solicitud de vacaciones
// app.post('/api/vacations', async (req, res) => {
//   try {
//     const { empleado_id, fecha_inicio, fecha_fin, motivo  } = req.body;

//     // Validar datos (opcional, pero recomendable)
//     if (!empleado_id || !fecha_inicio || !fecha_fin) {
//       return res.status(400).json({ error: 'Faltan datos requeridos' });
//     }

//     // Insertar la solicitud de vacaciones en la base de datos
//     const newVacationId = await db.insertVacationRequest(
//       empleado_id,
//       fecha_inicio,
//       fecha_fin,
//       motivo
//     );

//     // Si la inserción fue exitosa, devuelve la ID de la solicitud
//     res.status(201).json({ vacacion_id: newVacationId });
//   } catch (error) {
//     console.error('Error al crear solicitud de vacaciones:', error);
//     res.status(500).json({ error: 'Error al crear solicitud de vacaciones' });
//   }
// });

app.get("/api/vacation-history", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { rows, total } = await db.getVacationHistory(page, limit);
    res.json({ vacations: rows, total });
  } catch (error) {
    console.error("Error al obtener historial de vacaciones:", error);
    res.status(500).json({ error: "Error al obtener historial de vacaciones" });
  }
});

app.get("/api/vacations", async (req, res) => {
  try {
    const empleado_id = req.query.empleado_id;

    // Validar que se proporcionó el ID del empleado
    if (!empleado_id) {
      return res.status(400).json({ error: "Se requiere el ID del empleado" });
    }

    // Obtener las solicitudes de vacaciones del empleado
    const vacations = await db.getVacationsByEmployeeId(empleado_id);

    res.json(vacations);
  } catch (error) {
    console.error(
      "Error al obtener las solicitudes de vacaciones del empleado:",
      error
    );
    res
      .status(500)
      .json({ error: "Error al obtener las solicitudes de vacaciones" });
  }
});

app.put("/api/vacations/:vacationId", async (req, res) => {
  try {
    const { vacationId } = req.params;
    const { estado } = req.body;

    if (!estado || !["Aprobada", "Rechazada"].includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    // Actualizar el estado y manejar días de vacaciones
    await db.updateVacationStatusAndDays(vacationId, estado);

    res.json({ message: "Estado de vacación actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el estado de la vacación:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el estado de la vacación" });
  }
});

// Nuevo endpoint para aprobar sin deducción
app.put("/api/vacations/:vacationId/approve-without-deduction", async (req, res) => {
  try {
    const { vacationId } = req.params;
    
    // Actualizar el estado sin deducir días
    await db.updateVacationStatusWithoutDeduction(vacationId, "Aprobada");

    res.json({ message: "Vacación aprobada sin deducción de días" });
  } catch (error) {
    console.error("Error al aprobar vacación sin deducción:", error);
    res.status(500).json({ error: "Error al aprobar vacación sin deducción" });
  }
});

// Ruta para crear una nueva solicitud de vacaciones
app.post("/api/vacations", async (req, res) => {
  try {
    const { empleado_id, fecha_inicio, fecha_fin, motivo, dias_solicitados } =
      req.body;

    if (!empleado_id || !fecha_inicio || !fecha_fin || !dias_solicitados) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Insertar la solicitud de vacaciones sin actualizar los días
    const newVacationId = await db.insertVacationRequest(
      empleado_id,
      fecha_inicio,
      fecha_fin,
      motivo,
      dias_solicitados
    );

    res.status(201).json({ vacacion_id: newVacationId });
  } catch (error) {
    console.error("Error al crear solicitud de vacaciones:", error);
    res.status(500).json({ error: "Error al crear solicitud de vacaciones" });
  }
});

app.delete("/api/vacations/:id", async (req, res) => {
  try {
    const vacationId = req.params.id;
    await db.deleteVacationRequestAndUpdateDays(vacationId);
    res
      .status(200)
      .json({
        message: "Solicitud de vacaciones eliminada y días actualizados",
      });
  } catch (error) {
    console.error("Error al deshacer solicitud de vacaciones:", error);
    res
      .status(500)
      .json({ error: "Error al deshacer solicitud de vacaciones" });
  }
});

// Ruta para desactivar al empleado
app.put("/api/employees/deactivate/:dni", async (req, res) => {
  try {
    const { dni } = req.params;
    await db.deactivateEmployee(dni); // Llama a la función para desactivar el empleado en la base de datos
    res.status(200).json({ message: "Empleado desactivado exitosamente" });
  } catch (error) {
    console.error("Error al desactivar empleado:", error);
    res.status(500).json({ error: "Error al desactivar empleado" });
  }
});

app.listen(process.env.PORT || 3001, async () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3001}`);
  await db.connect();
});

require("./cronjob.js");
