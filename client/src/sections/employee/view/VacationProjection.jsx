/* eslint-disable no-plusplus */
import 'dayjs/locale/es';
import dayjs from 'dayjs';
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { CalendarMonth } from '@mui/icons-material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f5f5' },
  },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});

const getVacationFactor = (anioActualEmpleo) => {
  if (anioActualEmpleo === 0) return 0.8333;
  if (anioActualEmpleo === 1) return 1.0;
  if (anioActualEmpleo === 2) return 1.25;
  return 1.6667;
};

const VacationProjection = ({ open, toggleDrawer, employee }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [projection, setProjection] = useState(null);

  useEffect(() => {
    if (employee) {
      calculateProjection(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, employee]);

  const calculateProjection = (projectionDate) => {
    const ingresoDate = dayjs(employee.fecha_ingreso).startOf('day');
    const currentVacationDays = parseFloat(employee.dias_vacaciones_acumulados || 0);

    // Usar fecha_ultima_acumulacion o fecha_ingreso si no está disponible
    const lastAccumulationDate = employee.fecha_ultima_acumulacion
      ? dayjs(employee.fecha_ultima_acumulacion).startOf('day')
      : ingresoDate;

    // Calcular meses completos desde la última acumulación
    let monthsSinceLastAccumulation = projectionDate.diff(lastAccumulationDate, 'month');

    // Evitar valores negativos
    if (monthsSinceLastAccumulation < 0) {
      monthsSinceLastAccumulation = 0;
    }

    // Calcular años trabajados
    let yearsWorked = projectionDate.diff(ingresoDate, 'year');
    if (projectionDate.isBefore(ingresoDate.add(yearsWorked, 'year'))) {
      yearsWorked--;
    }

    const vacationFactor = getVacationFactor(yearsWorked);

    // Calcular días adicionales de vacaciones
    const additionalVacationDays = parseFloat(
      (vacationFactor * monthsSinceLastAccumulation).toFixed(2)
    );

    const accumulatedVacationDays = parseFloat(
      (currentVacationDays + additionalVacationDays).toFixed(2)
    );

    // Próximo aniversario laboral
    const nextAnniversaryDate = ingresoDate.add(yearsWorked + 1, 'year');

    setProjection({
      projectedDate: projectionDate.format('DD/MM/YYYY'),
      yearsWorked,
      monthsSinceLastAccumulation,
      accumulatedVacationDays,
      nextAnniversaryDate: nextAnniversaryDate.format('DD/MM/YYYY'),
    });
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleConfirm = () => {
    console.log('Proyección confirmada:', projection);
    toggleDrawer(false)();
  };

  const handleCancel = () => {
    toggleDrawer(false)();
  };

  const drawerContent = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonth /> Proyección de Vacaciones
          </Typography>
        </Paper>
        <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Seleccionar Fecha de Proyección</Typography>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                sx={{ width: '100%' }}
              />
            </Box>
          </LocalizationProvider>
          {projection && (
            <Box sx={{ mt: 3 }}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Card sx={{ padding: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Resultados de la Proyección
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography>Fecha de Proyección: {projection.projectedDate}</Typography>
                  <Typography>Años de Trabajo: {projection.yearsWorked}</Typography>
                  <Typography>Meses desde última acumulación: {projection.monthsSinceLastAccumulation}</Typography>


                  <Typography>Próximo Aniversario: {projection.nextAnniversaryDate}</Typography>


                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Resultado de Proyección: {projection.accumulatedVacationDays} días
                  </Typography>

                </Card>
              </Paper>
            </Box>
          )}
        </Box>
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleCancel} fullWidth size="medium">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleConfirm} fullWidth size="medium">
            Confirmar
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      {drawerContent}
    </SwipeableDrawer>
  );
};

export default VacationProjection;
