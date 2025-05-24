import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

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

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies] = useState(['LYNX', 'IDSA', 'UPCO', 'ARRAYAN', 'DURRIKIKARA', 'FINCASA']);
  const [fechaActual] = useState(dayjs().format('DD/MM/YYYY'));

  useEffect(() => {
    const fetchEmployees = async () => {
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

    fetchEmployees();
  }, [selectedCompany]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ marginBottom: 2 }}>
          Inicio
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Listado de Empleados
        </Typography>
         <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
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

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="employee table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre del Empleado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Días disponibles de vacaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.empleado_id}>
                  <TableCell>{employee.nombre}</TableCell>
                  <TableCell align="right">{employee.dias_vacaciones_acumulados}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default EmployeeList;