import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Box,
  Table,
  Paper,
  Select,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Container,
  InputLabel,
  Typography,
  FormControl,
  TableContainer
} from '@mui/material';

const ResumenVacaciones = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies] = useState(['LYNX', 'IDSA', 'UPCO', 'ARRAYAN', 'DURRIKIKARA', 'FINCASA']);
  const [fechaActual] = useState(dayjs().format('DD/MM/YYYY'));
  const [fechaInicio, setFechaInicio] = useState(dayjs().startOf('month'));
  const [fechaFin, setFechaFin] = useState(dayjs().endOf('month'));
  const [filteredByPeriod, setFilteredByPeriod] = useState(false);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        let url = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees`;
        if (selectedCompany) {
          url = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/byCompany/${selectedCompany}`;
        }
        const response = await axios.get(url);
        const activeEmployees = response.data.employees.filter(employee => employee.empleado_activo === 1);
        setEmployees(activeEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (!filteredByPeriod) {
      fetchAllEmployees();
    }
  }, [selectedCompany, filteredByPeriod]);

  const fetchVacationsByPeriod = async () => {
    try {
      const params = {
        fecha_inicio: fechaInicio.format('YYYY-MM-DD'),
        fecha_fin: fechaFin.format('YYYY-MM-DD'),
      };
      
      if (selectedCompany) {
        params.empresa = selectedCompany;
      }

      const response = await axios.get(
        `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacations/period-report`,
        { params }
      );
      
      setEmployees(response.data.employees);
      setFilteredByPeriod(true);
    } catch (error) {
      console.error('Error fetching vacation period report:', error);
    }
  };

  const handleClearPeriodFilter = () => {
    setFilteredByPeriod(false);
    setFechaInicio(dayjs().startOf('month'));
    setFechaFin(dayjs().endOf('month'));
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ marginBottom: 2 }}>
          Inicio
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Reporte de Vacaciones por Empresa
        </Typography>
        
        {/* Filtros superiores */}
        <Box mb={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="company-select-label">Seleccionar Empresa</InputLabel>
              <Select
                labelId="company-select-label"
                id="company-select"
                value={selectedCompany}
                label="Seleccionar Empresa"
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <MenuItem value="">Todas las Empresas</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle1">
              Fecha Actual: {fechaActual}
            </Typography>
          </Box>
          
          {/* Filtros de período */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtrar por Período de Vacaciones
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <DatePicker
                  label="Fecha Inicio"
                  value={fechaInicio}
                  onChange={(newValue) => setFechaInicio(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="Fecha Fin"
                  value={fechaFin}
                  onChange={(newValue) => setFechaFin(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: 'small' } }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchVacationsByPeriod}
                  sx={{ height: 'fit-content' }}
                >
                  Aplicar Filtro
                </Button>
                {filteredByPeriod && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearPeriodFilter}
                    sx={{ height: 'fit-content' }}
                  >
                    Limpiar Filtro
                  </Button>
                )}
              </Box>
            </LocalizationProvider>
          </Paper>
        </Box>

        {/* Indicador de filtro activo */}
        {filteredByPeriod && (
          <Box mb={2}>
            <Paper elevation={1} sx={{ p: 2, backgroundColor: '#e3f2fd', border: '1px solid #1976d2' }}>
              <Typography variant="body2" sx={{ color: '#1565c0', fontWeight: 'medium' }}>
                Mostrando vacaciones tomadas del {fechaInicio.format('DD/MM/YYYY')} al {fechaFin.format('DD/MM/YYYY')}
              </Typography>
            </Paper>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="vacation report table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.800', color: 'common.white' }}>
                  Nombre del Empleado
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'grey.800', color: 'common.white' }}>
                  {filteredByPeriod ? 'Días Tomados en Período' : 'Días Tomados'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'grey.800', color: 'common.white' }}>
                  Días Disponibles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow 
                  key={employee.empleado_id || `${employee.dni}-${index}`}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell>{employee.nombre}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: filteredByPeriod && employee.dias_tomados_periodo > 0 ? 'warning.main' : 'text.secondary' }}>
                    {filteredByPeriod 
                      ? Number(employee.dias_tomados_periodo || 0).toFixed(1)
                      : Number(employee.dias_vacaciones_tomados).toFixed(2)
                    }
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {employee.dias_vacaciones_acumulados}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {employees.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {filteredByPeriod 
                ? "No se encontraron empleados con vacaciones en el período seleccionado."
                : "No se encontraron empleados para la empresa seleccionada."
              }
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ResumenVacaciones; 