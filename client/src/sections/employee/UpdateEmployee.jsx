import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Grid,
  Paper,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

const UpdateEmployee = () => {
  const { dni } = useParams();  // Changed from empleadoId to dni
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empleado_id: '',
    nombre: '',
    dni: '',
    fecha_ingreso: null,
    anio_actual_empleo: 0,
    fecha_ultimo_aniversario: null,
    mes_actual_anio_laboral: 0,
    dias_vacaciones_acumulados: 0,
    dias_vacaciones_tomados: 0,
    fecha_ultima_acumulacion: null,
    empresa: '',
    ubicacion: '',
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/${dni}`);
        const employee = response.data;

        setFormData({
          ...employee,
          fecha_ingreso: employee.fecha_ingreso ? dayjs(employee.fecha_ingreso) : null,
          fecha_ultimo_aniversario: employee.fecha_ultimo_aniversario ? dayjs(employee.fecha_ultimo_aniversario) : null,
          fecha_ultima_acumulacion: employee.fecha_ultima_acumulacion ? dayjs(employee.fecha_ultima_acumulacion) : null,
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [dni]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name) => (date) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedData = {
        ...formData,
        fecha_ingreso: formData.fecha_ingreso ? formData.fecha_ingreso.format('YYYY-MM-DD') : null,
        fecha_ultimo_aniversario: formData.fecha_ultimo_aniversario ? formData.fecha_ultimo_aniversario.format('YYYY-MM-DD') : null,
        fecha_ultima_acumulacion: formData.fecha_ultima_acumulacion ? formData.fecha_ultima_acumulacion.format('YYYY-MM-DD') : null,
      };

      await axios.put(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/${formData.empleado_id}`, updatedData); 
      navigate(`/empleado/${formData.dni}`); 
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar Empleado
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha de Ingreso"
                  value={formData.fecha_ingreso}
                  onChange={handleDateChange('fecha_ingreso')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Año Actual de Empleo"
                  name="anio_actual_empleo"
                  type="number"
                  value={formData.anio_actual_empleo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha Último Aniversario"
                  value={formData.fecha_ultimo_aniversario}
                  onChange={handleDateChange('fecha_ultimo_aniversario')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mes Actual Año Laboral"
                  name="mes_actual_anio_laboral"
                  type="number"
                  value={formData.mes_actual_anio_laboral}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Días Vacaciones Acumulados"
                  name="dias_vacaciones_acumulados"
                  type="number"
                  value={formData.dias_vacaciones_acumulados}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Días Vacaciones Tomados"
                  name="dias_vacaciones_tomados"
                  type="number"
                  value={formData.dias_vacaciones_tomados}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha Última Acumulación"
                  value={formData.fecha_ultima_acumulacion}
                  onChange={handleDateChange('fecha_ultima_acumulacion')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Empresa</InputLabel>
                  <Select
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                  >
                    <MenuItem value="UPCO">UPCO</MenuItem>
                    <MenuItem value="IDSA">IDSA</MenuItem>
                    <MenuItem value="ARRAYAN">ARRAYAN</MenuItem>
                    <MenuItem value="DURRIKIKARA">DURRIKIKARA</MenuItem>
                    <MenuItem value="FINCASA">FINCASA</MenuItem>
                    <MenuItem value="LYNX">LYNX</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Ubicación</InputLabel>
                  <Select
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                  >
                    <MenuItem value="La Esperanza">La Esperanza</MenuItem>
                    <MenuItem value="Tegucigalpa">Tegucigalpa</MenuItem>
                    <MenuItem value="Utila">Utila</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Guardar Cambios
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/empleado/${formData.dni}`)} 
                  sx={{ ml: 2 }}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </LocalizationProvider>
      </Paper>
    </Container>
  );
};

export default UpdateEmployee;