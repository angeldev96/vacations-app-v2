const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');

require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const vacationRoutes = require('./routes/vacationRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const permissionController = require('./controllers/permissionController');
const vacationController = require('./controllers/vacationController');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/permissions', permissionRoutes);

// Specific routes for history endpoints
app.get('/api/vacation-history', vacationController.getVacationHistory);
app.get('/api/permission-history', permissionController.getPermissionHistory);

// Initialize cron job
require('./utils/cronJob');

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await db.connect();
});

module.exports = app; 