import 'dayjs/locale/es';
import dayjs from 'dayjs'; // Importa el idioma español para dayjs
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Grid,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl
} from '@mui/material';

const EmployeeRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    fechaIngreso: dayjs(),
    empresa: '',
    ubicacion: '',
    diasVacacionesTomados: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    const newFormData = {
      ...formData,
      [name]: value
    };

    if (name === 'empresa') {
      switch (value) {
        case 'UPCO':
          newFormData.ubicacion = 'Utila';
          break;
        case 'IDSA':
          newFormData.ubicacion = 'Tegucigalpa';
          break;
        case 'ARRAYAN':
        case 'DURRIKIKARA':
        case 'LYNX':
        case 'FINCASA':
          newFormData.ubicacion = 'La Esperanza';
          break;
        default:
          newFormData.ubicacion = '';
      }
    }

    setFormData(newFormData);
  };

  const handleDateChange = (newValue) => {
    setFormData({
      ...formData,
      fechaIngreso: newValue
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Formatear la fecha a 'YYYY-MM-DD'
      const formattedFechaIngreso = formData.fechaIngreso.format('YYYY-MM-DD');

      // Enviar los datos con la fecha formateada
      await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees`, {
        ...formData,
        fechaIngreso: formattedFechaIngreso // Reemplazar la fecha original con la formateada
      });
      navigate('/empleado');
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  return (
    <Paper sx={{ p: 4, margin: 'auto', maxWidth: 600, flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Registro de Empleado
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre Completo"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="dni"
                name="dni"
                label="DNI"
                value={formData.dni}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Fecha de Ingreso"
                value={formData.fechaIngreso}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>

            {/* Select para Empresa */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="empresa-label">Empresa</InputLabel>
                <Select
                  labelId="empresa-label"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  label="Empresa"
                  onChange={handleChange}
                >
                  <MenuItem value="UPCO">UPCO</MenuItem>
                  <MenuItem value="IDSA">IDSA</MenuItem>
                  <MenuItem value="ARRAYAN">ARRAYAN</MenuItem>
                  <MenuItem value="LYNX">LYNX</MenuItem>
                  <MenuItem value="DURRIKIKARA">DURRIKIKARA</MenuItem>
                  <MenuItem value="FINCASA">FINCASA</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            {/* Select para Ubicación */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="ubicacion-label">Ubicación</InputLabel>
                <Select
                  labelId="ubicacion-label"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  label="Ubicación"
                  onChange={handleChange}
                >
                  <MenuItem value="La Esperanza">La Esperanza</MenuItem>
                  <MenuItem value="Tegucigalpa">Tegucigalpa</MenuItem>
                  <MenuItem value="Utila">Utila</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Registrar Empleado
              </Button>
            </Grid>
          </Grid>
        </form>
      </LocalizationProvider>
    </Paper>
  );
};

export default EmployeeRegistrationForm;