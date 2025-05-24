import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Card,
  Table,
  Paper,
  Stack,
  Button,
  Avatar,
  Toolbar,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  Pagination,
  OutlinedInput,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function EmployeeTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDni, setSelectedDni] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const empresa = location.state?.empresa || '';

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, empresa]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees?page=${page}&limit=${rowsPerPage}&empresa=${empresa}`);
      const employeeData = response.data.employees
        .filter(employee => employee.empleado_activo === 1)
        .map((employee) => ({
          nombre: employee.nombre,
          dni: employee.dni,
          fecha_ingreso: employee.fecha_ingreso,
          dias_proporcionales: employee.dias_vacaciones_acumulados,
          dias_disfrutados: employee.dias_vacaciones_tomados,
          empresa_empleado: employee.empresa,
        }));
      setRows(employeeData);
      setFilteredRows(employeeData);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handlePrintSummary = () => {
    navigate('/resumen-empleado');
  };

  const handleFilterName = async (event) => {
    const searchValue = event.target.value;
    setFilterName(searchValue);
  
    if (searchValue) {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/search?name=${searchValue}&empresa=${empresa}`);
        setFilteredRows(response.data.employees.filter(employee => employee.empleado_activo === 1));
      } catch (error) {
        console.error('Error searching employees:', error);
      }
    } else {
      setFilteredRows(rows);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handlePopoverOpen = (event, dni) => {
    setAnchorEl(event.currentTarget);
    setSelectedDni(dni);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedDni(null);
  };

  const handleDeactivateEmployee = async () => {
    try {
      // Solicitud al backend para desactivar al empleado
      await axios.put(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/employees/deactivate/${selectedDni}`);
      
      // Actualiza la lista de empleados después de desactivar
      fetchEmployees();
      handlePopoverClose();
    } catch (error) {
      console.error('Error al desactivar el empleado:', error);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 2),
        }}
      >
        <OutlinedInput
          value={filterName}
          onChange={handleFilterName}
          placeholder="Buscar empleado..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
          sx={{
            borderRadius: 2,
            boxShadow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/empleado/crear-empleado')}
          >
            Registrar Empleado
          </Button>

          <Button
        variant="contained"
        color="secondary"
        onClick={handlePrintSummary}
      >
        Imprimir Resumen de Vacaciones
      </Button>
        </Stack>
      </Toolbar>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ backgroundColor: 'grey.800', color: 'common.white' }}>Nombre</TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'grey.800', color: 'common.white' }}>DNI</TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'grey.800', color: 'common.white' }}>Fecha de Ingreso</TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'grey.800', color: 'common.white' }}>Días Proporcionales</TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'grey.800', color: 'common.white' }}>Días Disfrutados</TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'grey.800', color: 'common.white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.dni}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => navigate(`/empleado/${row.dni}`)}
              >
                <TableCell component="th" scope="row" padding="none" sx={{ paddingLeft: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'common.white',
                      }}
                    >
                      {row.nombre[0]}
                    </Avatar>
                    <Typography variant="subtitle2" noWrap>
                      {row.nombre}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">{row.dni}</TableCell>
                <TableCell align="center">{dayjs(row.fecha_ingreso).format('DD/MM/YYYY')}</TableCell>
                <TableCell align="center">{row.dias_proporcionales}</TableCell>
                <TableCell align="center">{row.dias_disfrutados}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePopoverOpen(e, row.dni);
                    }}
                  >
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <MenuItem onClick={handleDeactivateEmployee}>Desactivar</MenuItem>
  
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(total / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Stack>
    </Card>
  );
}