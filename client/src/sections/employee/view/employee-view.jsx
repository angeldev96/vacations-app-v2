import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Grid,
  Table,
  Paper,
  Button,
  Avatar,
  Dialog,
  Divider,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  DialogContentText,
} from '@mui/material';

import VacationDrawer from './VacationDrawer';
import Iconify from '../../../components/iconify';
import VacationProjection from './VacationProjection';

const EmployeeVacationDetails = () => {
  const { dni } = useParams();
  const [employee, setEmployee] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [employeeVacations, setEmployeeVacations] = useState([]);
  const [employeePermissions, setEmployeePermissions] = useState([]);
  const [openPopover, setOpenPopover] = useState(null);
  const [openPermissionPopover, setOpenPermissionPopover] = useState(null);
  const [selectedVacationId, setSelectedVacationId] = useState(null);
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmPermissionDialogOpen, setConfirmPermissionDialogOpen] = useState(false);
  const [projectionDrawerOpen, setProjectionDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProjectionDrawer = (open) => () => {
    setProjectionDrawerOpen(open);
  };

  const estadoColors = {
    Aprobada: 'success.main',
    Rechazada: 'error.main',
    Pendiente: 'warning.main',
  };

  const permisoEstadoColors = {
    aprobado: 'success.main',
    rechazado: 'error.main',
    pendiente: 'warning.main',
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/${dni}`);
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    const fetchEmployeeVacations = async () => {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations?empleado_id=${employee.empleado_id}`);
        setEmployeeVacations(response.data);
      } catch (error) {
        console.error('Error fetching employee vacations:', error);
      }
    };

    const fetchEmployeePermissions = async () => {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions?empleado_id=${employee.empleado_id}`);
        setEmployeePermissions(response.data);
      } catch (error) {
        console.error('Error fetching employee permissions:', error);
      }
    };

    if (dni) {
      fetchEmployeeDetails();
    }

    if (employee && employee.empleado_id) {
      fetchEmployeeVacations();
      fetchEmployeePermissions();
    }
  }, [dni, employee]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleOpenPopover = (event, vacationId) => {
    setOpenPopover(event.currentTarget);
    setSelectedVacationId(vacationId);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedVacationId(null);
  };

  // Funciones para manejar permisos
  const handleOpenPermissionPopover = (event, permissionId) => {
    setOpenPermissionPopover(event.currentTarget);
    setSelectedPermissionId(permissionId);
  };

  const handleClosePermissionPopover = () => {
    setOpenPermissionPopover(null);
    setSelectedPermissionId(null);
  };

  const handleApprovePermission = async () => {
    try {
      await axios.put(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions/${selectedPermissionId}`, {
        estado: 'aprobado'
      });
      // Actualizar lista de permisos
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions?empleado_id=${employee.empleado_id}`);
      setEmployeePermissions(response.data);
    } catch (error) {
      console.error('Error approving permission:', error);
    }
    handleClosePermissionPopover();
  };

  const handleRejectPermission = async () => {
    try {
      await axios.put(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions/${selectedPermissionId}`, {
        estado: 'rechazado'
      });
      // Actualizar lista de permisos
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions?empleado_id=${employee.empleado_id}`);
      setEmployeePermissions(response.data);
    } catch (error) {
      console.error('Error rejecting permission:', error);
    }
    handleClosePermissionPopover();
  };

  const handleDeletePermission = async () => {
    setConfirmPermissionDialogOpen(false);
    try {
      await axios.delete(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions/${selectedPermissionId}`);
      // Actualizar lista de permisos
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions?empleado_id=${employee.empleado_id}`);
      setEmployeePermissions(response.data);
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
    handleClosePermissionPopover();
  };

  const handleOpenConfirmPermissionDialog = () => {
    setConfirmPermissionDialogOpen(true);
  };

  const handleCloseConfirmPermissionDialog = () => {
    setConfirmPermissionDialogOpen(false);
  };

  const handleUndoVacation = async () => {
    setConfirmDialogOpen(false);

    try {
      await axios.delete(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations/${selectedVacationId}`);
      // Actualizar información del empleado
      const employeeResponse = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/${dni}`);
      setEmployee(employeeResponse.data);

      // Actualizar lista de vacaciones
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations?empleado_id=${employee.empleado_id}`);
      setEmployeeVacations(response.data);
    } catch (error) {
      console.error('Error undoing vacation:', error);
    }
    handleClosePopover();
  };

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleApproveVacation = async () => {
    try {
      await axios.put(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations/${selectedVacationId}`, {
        estado: 'Aprobada'
      });
      // Actualizar información del empleado
      const employeeResponse = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/${dni}`);
      setEmployee(employeeResponse.data);

      // Actualizar lista de vacaciones
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations?empleado_id=${employee.empleado_id}`);
      setEmployeeVacations(response.data);
    } catch (error) {
      console.error('Error approving vacation:', error);
    }
    handleClosePopover();
  };

  const handleApproveWithoutDeduction = async () => {
    try {
      await axios.put(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations/${selectedVacationId}/approve-without-deduction`);
      // Actualizar lista de vacaciones
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations?empleado_id=${employee.empleado_id}`);
      setEmployeeVacations(response.data);
    } catch (error) {
      console.error('Error approving vacation without deduction:', error);
    }
    handleClosePopover();
  };

  const handleRejectVacation = async () => {
    try {
      await axios.put(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations/${selectedVacationId}`, {
        estado: 'Rechazada'
      });
      // Actualizar información del empleado
      const employeeResponse = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/${dni}`);
      setEmployee(employeeResponse.data);

      // Actualizar lista de vacaciones
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations?empleado_id=${employee.empleado_id}`);
      setEmployeeVacations(response.data);
    } catch (error) {
      console.error('Error rejecting vacation:', error);
    }
    handleClosePopover();
  };

  if (!employee) {
    return <Typography variant="h6" align="center">Cargando...</Typography>;
  }

  const formattedDate = employee.fecha_ingreso ? dayjs(employee.fecha_ingreso).format('DD/MM/YYYY') : '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Detalles de Vacaciones del Empleado
      </Typography>

      <Box display="flex">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/empleado/actualizar-empleado/${employee.dni}`)}
        >
          Actualizar Empleado
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ width: 100, height: 100 }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              {employee.nombre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {employee.dni}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ubicación (Proyecto)"
                  value={employee.ubicacion_proyecto}
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                    '& .MuiFormLabel-root.Mui-disabled': {
                      color: '#000000',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Ingreso"
                  value={formattedDate}
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                    '& .MuiFormLabel-root.Mui-disabled': {
                      color: '#000000',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Año Actual de Empleo"
                  value={employee.anio_actual_empleo}
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                    '& .MuiFormLabel-root.Mui-disabled': {
                      color: '#000000',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha Último Aniversario"
                  value={employee.fecha_ultimo_aniversario ? dayjs(employee.fecha_ultimo_aniversario).format('DD/MM/YYYY') : ''}
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                    '& .MuiFormLabel-root.Mui-disabled': {
                      color: '#000000',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mes Actual Año Laboral"
                  value={employee.mes_actual_anio_laboral}
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                    '& .MuiFormLabel-root.Mui-disabled': {
                      color: '#000000',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Empresa"
                  value={employee.empresa}
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                    '& .MuiFormLabel-root.Mui-disabled': {
                      color: '#000000',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de Vacaciones
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Días de Vacaciones Acumulados"
                value={employee.dias_vacaciones_acumulados}
                fullWidth
                disabled
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                  },
                  '& .MuiFormLabel-root.Mui-disabled': {
                    color: '#000000',
                  },
                }}
              />
              <TextField
                label="Días de Vacaciones Tomados"
                value={Number(employee.dias_vacaciones_tomados).toFixed(2)}
                fullWidth
                disabled
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                  },
                  '& .MuiFormLabel-root.Mui-disabled': {
                    color: '#000000',
                  },
                }}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={toggleDrawer(true)}
                sx={{ borderRadius: 2, mr: 2 }}
              >
                Gestionar Vacaciones o Permisos
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={toggleProjectionDrawer(true)}
                sx={{ borderRadius: 2, flexGrow: 1 }}
              >
                Proyección de Vacaciones
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Historial de Vacaciones
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Periodo</TableCell>
                    <TableCell>Días Disfrutados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Aquí deberías obtener el historial de vacaciones de la API */}
                  {/* {vacationHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.period}</TableCell>
                      <TableCell>{entry.days}</TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Solicitudes de Vacaciones del Empleado
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha de Solicitud</TableCell>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Fecha Fin</TableCell>
                    <TableCell>Días Solicitados</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeVacations.map((vacation) => (
                    <TableRow key={vacation.vacacion_id}>
                      <TableCell>{dayjs(vacation.fecha_solicitud).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>{dayjs(vacation.fecha_inicio).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>{dayjs(vacation.fecha_fin).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>{vacation.dias_solicitados?.toFixed(2) || '0'}</TableCell>
                      <TableCell>{vacation.motivo}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            bgcolor: estadoColors[vacation.estado] || estadoColors.Pendiente,
                            color: 'common.white',
                            px: 1,
                            borderRadius: 1,
                            display: 'inline-block',
                          }}
                        >
                          {vacation.estado}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleOpenPopover(e, vacation.vacacion_id)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Solicitudes de Permisos del Empleado
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha de Solicitud</TableCell>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Fecha Fin</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeePermissions.map((permission) => (
                    <TableRow key={permission.permiso_id}>
                      <TableCell>{dayjs(permission.fecha_solicitud).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>{dayjs(permission.fecha_inicio).format('DD/MM/YYYY HH:mm')}</TableCell>
                      <TableCell>{dayjs(permission.fecha_fin).format('DD/MM/YYYY HH:mm')}</TableCell>
                      <TableCell>{permission.descripcion}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            bgcolor: permission.con_goce_sueldo ? 'success.light' : 'warning.light',
                            color: permission.con_goce_sueldo ? 'success.contrastText' : 'warning.contrastText',
                            px: 1,
                            borderRadius: 1,
                            display: 'inline-block',
                          }}
                        >
                          {permission.con_goce_sueldo ? 'Con goce de sueldo' : 'Sin goce de sueldo'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            bgcolor: permisoEstadoColors[permission.estado] || permisoEstadoColors.pendiente,
                            color: 'common.white',
                            px: 1,
                            borderRadius: 1,
                            display: 'inline-block',
                          }}
                        >
                          {permission.estado.charAt(0).toUpperCase() + permission.estado.slice(1)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleOpenPermissionPopover(e, permission.permiso_id)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 160 },
        }}
      >
        <MenuItem onClick={handleApproveVacation} sx={{ color: 'success.main' }}>
          <Iconify icon="eva:checkmark-circle-2-fill" sx={{ mr: 2 }} />
          Aprobar
        </MenuItem>
        <MenuItem onClick={handleApproveWithoutDeduction} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:checkmark-circle-2-fill" sx={{ mr: 2 }} />
          Aprov. sin deducción
        </MenuItem>
        <MenuItem onClick={handleRejectVacation} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:close-circle-fill" sx={{ mr: 2 }} />
          Rechazar
        </MenuItem>

        <MenuItem onClick={handleOpenConfirmDialog} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:undo-fill" sx={{ mr: 2 }} />
          Deshacer Solicitud
        </MenuItem>
      </Popover>

      <Popover
        open={Boolean(openPermissionPopover)}
        anchorEl={openPermissionPopover}
        onClose={handleClosePermissionPopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 160 },
        }}
      >
        <MenuItem onClick={handleApprovePermission} sx={{ color: 'success.main' }}>
          <Iconify icon="eva:checkmark-circle-2-fill" sx={{ mr: 2 }} />
          Aprobar
        </MenuItem>
        <MenuItem onClick={handleRejectPermission} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:close-circle-fill" sx={{ mr: 2 }} />
          Rechazar
        </MenuItem>
        <MenuItem onClick={handleOpenConfirmPermissionDialog} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:undo-fill" sx={{ mr: 2 }} />
          Eliminar Solicitud
        </MenuItem>
      </Popover>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estás seguro de deshacer la solicitud de vacaciones?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Si deshaces esta solicitud, se eliminará de la base de datos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
          <Button onClick={handleUndoVacation} autoFocus color="error">
            Deshacer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmPermissionDialogOpen}
        onClose={handleCloseConfirmPermissionDialog}
        aria-labelledby="permission-dialog-title"
        aria-describedby="permission-dialog-description"
      >
        <DialogTitle id="permission-dialog-title">¿Estás seguro de eliminar la solicitud de permiso?</DialogTitle>
        <DialogContent>
          <DialogContentText id="permission-dialog-description">
            Si eliminas esta solicitud, se eliminará permanentemente de la base de datos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmPermissionDialog}>Cancelar</Button>
          <Button onClick={handleDeletePermission} autoFocus color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <VacationProjection
        open={projectionDrawerOpen}
        toggleDrawer={toggleProjectionDrawer}
        employee={employee}
      />
      <VacationDrawer open={drawerOpen} toggleDrawer={toggleDrawer} employeeId={employee.empleado_id} />
    </Box>
  );
};

export default EmployeeVacationDetails;