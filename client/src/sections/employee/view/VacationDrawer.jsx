/* eslint-disable react-hooks/exhaustive-deps */
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import axios from 'axios';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useState, useEffect } from 'react';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Tab, Tabs, Checkbox, FormControlLabel } from '@mui/material';
import { AccessTime, Assignment, BeachAccess } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const WORK_HOURS_PER_DAY = 10;
const MINUTES_PER_HOUR = 60;
const WORK_START_HOUR = 7;
const WORK_END_HOUR = 17;
const sevenAM = dayjs().set('hour', 7).startOf('hour');
const fivePM = dayjs().set('hour', 17).startOf('hour');

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vacation-tabpanel-${index}`}
      aria-labelledby={`vacation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
TabPanel.propTypes = {
  children: undefined,
  value: undefined,
  index: undefined,
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// eslint-disable-next-line react/prop-types
export default function VacationDrawer({ open, toggleDrawer, employeeId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [startDate, setStartDate] = useState(dayjs().set('hour', WORK_START_HOUR).startOf('hour'));
  const [endDate, setEndDate] = useState(dayjs().set('hour', WORK_END_HOUR).startOf('hour'));
  const [vacationDuration, setVacationDuration] = useState({ days: 0, hours: 0, minutes: 0 });
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [endDateBeforeStartDateError, setEndDateBeforeStartDateError] = useState(false);
  const [startDateBeforeTodayError, setStartDateBeforeTodayError] = useState(false);
  const [endDateBeforeTodayError, setEndDateBeforeTodayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [motivo, setMotivo] = useState('');
  
  // Estados para permisos
  const [conGoceDeSueldo, setConGoceDeSueldo] = useState(true);
  const [motivoPermiso, setMotivoPermiso] = useState('');
  const [startDatePermiso, setStartDatePermiso] = useState(dayjs().set('hour', WORK_START_HOUR).startOf('hour'));
  const [endDatePermiso, setEndDatePermiso] = useState(dayjs().set('hour', WORK_END_HOUR).startOf('hour'));
  const [startDatePermisoError, setStartDatePermisoError] = useState(false);
  const [endDatePermisoError, setEndDatePermisoError] = useState(false);
  const [endDateBeforeStartDatePermisoError, setEndDateBeforeStartDatePermisoError] = useState(false);

  useEffect(() => {
    calculateVacationDuration();
  }, [startDate, endDate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const isWeekday = (date) => {
    const day = date.day();
    return day !== 0 && day !== 6;
  };

  const calculateVacationDuration = () => {
    if (startDate && endDate) {
      let currentDate = startDate.startOf('day');
      let totalMinutes = 0;

      while (currentDate.isSameOrBefore(endDate, 'day')) {
        if (isWeekday(currentDate)) {
          let dayStart = currentDate.hour(WORK_START_HOUR);
          let dayEnd = currentDate.hour(WORK_END_HOUR);

          if (currentDate.isSame(startDate, 'day')) {
            dayStart = dayStart.isAfter(startDate) ? dayStart : startDate;
          }

          if (currentDate.isSame(endDate, 'day')) {
            dayEnd = dayEnd.isBefore(endDate) ? dayEnd : endDate;
          }

          if (dayEnd.isAfter(dayStart)) {
            totalMinutes += dayEnd.diff(dayStart, 'minute');
          }
        }

        currentDate = currentDate.add(1, 'day');
      }

      const totalWorkHours = totalMinutes / MINUTES_PER_HOUR;
      const days = Math.floor(totalWorkHours / WORK_HOURS_PER_DAY);
      const remainingHours = totalWorkHours % WORK_HOURS_PER_DAY;
      const hours = Math.floor(remainingHours);
      const minutes = Math.round((remainingHours - hours) * MINUTES_PER_HOUR);

      setVacationDuration({ days, hours, minutes });
    }
  };

  const handleStartDateChange = (newValue) => {
    if (!isWeekday(newValue)) {
      setStartDateError(true);
    } else {
      // setStartDateBeforeTodayError(true); // Comentado para permitir fechas anteriores
      setStartDateError(false);
      setStartDateBeforeTodayError(false);
      setStartDate(newValue);
      setEndDateBeforeStartDateError(false);
    }
  };
  
  const handleEndDateChange = (newValue) => {
    if (!isWeekday(newValue)) {
      setEndDateError(true);
    } else if (newValue.isBefore(startDate)) {
      setEndDateBeforeStartDateError(true);
      setEndDateError(false);
    } else {
      // setEndDateBeforeTodayError(true); // Comentado para permitir fechas anteriores
      setEndDateError(false);
      setEndDateBeforeStartDateError(false);
      setEndDateBeforeTodayError(false);
      setEndDate(newValue);
    }
  };
  
  const handleStartDatePermisoChange = (newValue) => {
    if (!isWeekday(newValue)) {
      setStartDatePermisoError(true);
    } else {
      setStartDatePermisoError(false);
      setStartDatePermiso(newValue);
      setEndDateBeforeStartDatePermisoError(false);
    }
  };

  const handleEndDatePermisoChange = (newValue) => {
    if (!isWeekday(newValue)) {
      setEndDatePermisoError(true);
    } else if (newValue.isBefore(startDatePermiso)) {
      setEndDateBeforeStartDatePermisoError(true);
      setEndDatePermisoError(false);
    } else {
      setEndDatePermisoError(false);
      setEndDateBeforeStartDatePermisoError(false);
      setEndDatePermiso(newValue);
    }
  };

  const handleConfirm = async () => {
    if (!startDateError && !endDateError && !endDateBeforeStartDateError && !startDateBeforeTodayError && !endDateBeforeTodayError) {
      setIsLoading(true);
      setErrorMessage(null);

      // Dentro de la función handleConfirm

try {
  const diasSolicitados = vacationDuration.days + (vacationDuration.hours / WORK_HOURS_PER_DAY) + (vacationDuration.minutes / (WORK_HOURS_PER_DAY * MINUTES_PER_HOUR));

  const response = await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations`, {
    empleado_id: employeeId,
    fecha_inicio: startDate.format('YYYY-MM-DD HH:mm:ss'),
    fecha_fin: endDate.format('YYYY-MM-DD HH:mm:ss'),
    motivo: motivo || 'Vacaciones',
    dias_solicitados: diasSolicitados
  });

  console.log('Solicitud de vacaciones creada:', response.data);
  setSnackbarSeverity('success');
  setSnackbarMessage('Solicitud de vacaciones creada correctamente');
  setSnackbarOpen(true);
  toggleDrawer(false)();
} catch (error) {
  setErrorMessage(error.message);
  setSnackbarSeverity('error');
  setSnackbarMessage('Error al crear la solicitud de vacaciones');
  setSnackbarOpen(true);
  console.error('Error al crear solicitud de vacaciones:', error);
} finally {
  setIsLoading(false);
}

    } else {
      alert("Por favor, seleccione fechas válidas para las vacaciones. Las fechas no pueden ser en fin de semana, deben ser posteriores a la fecha actual y la fecha final debe ser posterior a la fecha inicial.");
    }
  };

  const handleConfirmPermiso = async () => {
    if (!motivoPermiso.trim()) {
      setSnackbarSeverity('warning');
      setSnackbarMessage('Por favor, ingrese el motivo del permiso');
      setSnackbarOpen(true);
      return;
    }

    if (startDatePermisoError || endDatePermisoError || endDateBeforeStartDatePermisoError) {
      setSnackbarSeverity('warning');
      setSnackbarMessage('Por favor, seleccione fechas válidas para el permiso');
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permissions`, {
        empleado_id: employeeId,
        descripcion: motivoPermiso,
        con_goce_sueldo: conGoceDeSueldo,
        fecha_inicio: startDatePermiso.format('YYYY-MM-DD HH:mm:ss'),
        fecha_fin: endDatePermiso.format('YYYY-MM-DD HH:mm:ss')
      });

      console.log('Solicitud de permiso creada:', response.data);
      setSnackbarSeverity('success');
      setSnackbarMessage('Solicitud de permiso creada correctamente');
      setSnackbarOpen(true);
      
      // Limpiar campos
      setMotivoPermiso('');
      setConGoceDeSueldo(true);
      setStartDatePermiso(dayjs().set('hour', WORK_START_HOUR).startOf('hour'));
      setEndDatePermiso(dayjs().set('hour', WORK_END_HOUR).startOf('hour'));
      
      toggleDrawer(false)();
    } catch (error) {
      setErrorMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error al crear la solicitud de permiso');
      setSnackbarOpen(true);
      console.error('Error al crear solicitud de permiso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    toggleDrawer(false)();
  };

  const formatVacationDuration = () => {
    const { days, hours, minutes } = vacationDuration;
    const totalDays = days + (hours / WORK_HOURS_PER_DAY) + (minutes / (WORK_HOURS_PER_DAY * MINUTES_PER_HOUR));
    return `${totalDays.toFixed(2)} días laborales. Equivalentes a: ${days} día${days !== 1 ? 's' : ''}, ${hours} hora${hours !== 1 ? 's' : ''} y ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const drawerContent = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={0} sx={{ p: 1, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BeachAccess /> Gestionar Vacaciones y Permisos
          </Typography>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="vacaciones y permisos tabs">
            <Tab label="Vacaciones" sx={{ textTransform: 'none' }} />
            <Tab label="Permisos" sx={{ textTransform: 'none' }} />
          </Tabs>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <TabPanel value={activeTab} index={0}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Fecha y hora inicial</Typography>
                <DateTimePicker
                  value={startDate}
                  onChange={handleStartDateChange}
                  format="DD/MM/YYYY HH:mm"
                  minTime={sevenAM}
                  maxTime={fivePM}
                  sx={{ width: '100%' }}
                />
                {startDateError && <Alert severity="warning">La fecha inicial no puede ser en fin de semana.</Alert>}
                {startDateBeforeTodayError && <Alert severity="warning">La fecha inicial no puede ser anterior a la fecha actual.</Alert>}
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Fecha y hora final</Typography>
                <DateTimePicker
                  value={endDate}
                  onChange={handleEndDateChange}
                  format="DD/MM/YYYY HH:mm"
                  minTime={sevenAM}
                  maxTime={fivePM}
                  sx={{ width: '100%' }}
                />
                {endDateError && <Alert severity="warning">La fecha final no puede ser en fin de semana.</Alert>}
                {endDateBeforeStartDateError && <Alert severity="warning">La fecha final debe ser posterior a la fecha inicial.</Alert>}
                {endDateBeforeTodayError && <Alert severity="warning">La fecha final no puede ser anterior a la fecha actual.</Alert>}
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Motivo de la vacación</Typography>
                <TextField
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  placeholder="Motivo de la vacación"
                  fullWidth
                  size="small"
                  variant="outlined"
                  inputProps={{ maxLength: 100 }}
                  sx={{ mb: 2 }}
                />
              </Box>
            </LocalizationProvider>

            <Divider sx={{ my: 3 }} />

            <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime /> Duración de las vacaciones
              </Typography>
              <Typography variant="body1">
                {formatVacationDuration()}
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment /> Solicitud de Permiso
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>Fecha y hora inicial</Typography>
                  <DateTimePicker
                    value={startDatePermiso}
                    onChange={handleStartDatePermisoChange}
                    format="DD/MM/YYYY HH:mm"
                    minTime={sevenAM}
                    maxTime={fivePM}
                    sx={{ width: '100%' }}
                  />
                  {startDatePermisoError && <Alert severity="warning">La fecha inicial no puede ser en fin de semana.</Alert>}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>Fecha y hora final</Typography>
                  <DateTimePicker
                    value={endDatePermiso}
                    onChange={handleEndDatePermisoChange}
                    format="DD/MM/YYYY HH:mm"
                    minTime={sevenAM}
                    maxTime={fivePM}
                    sx={{ width: '100%' }}
                  />
                  {endDatePermisoError && <Alert severity="warning">La fecha final no puede ser en fin de semana.</Alert>}
                  {endDateBeforeStartDatePermisoError && <Alert severity="warning">La fecha final debe ser posterior a la fecha inicial.</Alert>}
                </Box>
              </LocalizationProvider>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={conGoceDeSueldo}
                    onChange={(e) => setConGoceDeSueldo(e.target.checked)}
                    color="primary"
                  />
                }
                label="Con goce de sueldo"
              />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Motivo del permiso
                </Typography>
                <TextField
                  value={motivoPermiso}
                  onChange={(e) => setMotivoPermiso(e.target.value)}
                  placeholder="Describa el motivo del permiso"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  inputProps={{ maxLength: 200 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {motivoPermiso.length}/200 caracteres
                </Typography>
              </Box>

              <Paper elevation={2} sx={{ p: 2, backgroundColor: 'info.light', color: 'info.contrastText' }}>
                <Typography variant="body2">
                  <strong>Tipo:</strong> {conGoceDeSueldo ? 'Con goce de sueldo' : 'Sin goce de sueldo'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Desde:</strong> {startDatePermiso.format('DD/MM/YYYY HH:mm')} <strong>Hasta:</strong> {endDatePermiso.format('DD/MM/YYYY HH:mm')}
                </Typography>
              </Paper>
            </Box>
          </TabPanel>
        </Box>

        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            fullWidth
            size="medium"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              py: 1,
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={activeTab === 0 ? handleConfirm : handleConfirmPermiso}
            fullWidth
            size="medium"
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: 2,
              py: 1,
            }}
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Enviando...';
              return activeTab === 0 ? 'Solicitar Vacaciones' : 'Solicitar Permiso';
            })()}
          </Button>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );

  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {drawerContent}
      </SwipeableDrawer>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}