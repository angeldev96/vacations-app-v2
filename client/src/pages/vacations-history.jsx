/* eslint-disable react/prop-types */
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Table,
  Paper,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  InputLabel,
  FormControl,
  TableContainer,
  TablePagination,
} from '@mui/material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const VacationHistoryTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [vacations, setVacations] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies] = useState(['LYNX', 'IDSA', 'UPCO', 'ARRAYAN', 'DURRIKIKARA', 'FINCASA']);

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
    if (activeTab === 0) {
      fetchVacationHistory();
    } else {
      fetchPermissionHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, activeTab, selectedCompany]);

  const fetchVacationHistory = async () => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      
      if (selectedCompany) {
        params.empresa = selectedCompany;
      }
      
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacation-history`, { params });
      setVacations(response.data.vacations);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching vacation history:', error);
    }
  };

  const fetchPermissionHistory = async () => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      
      if (selectedCompany) {
        params.empresa = selectedCompany;
      }
      
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permission-history`, { params });
      setPermissions(response.data.permissions);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching permission history:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset page when switching tabs
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
    setPage(0); // Reset page when changing company filter
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Historial de Vacaciones y Permisos
        </Typography>
        
        {/* Filtro por empresa */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="company-select-label">Filtrar por Empresa</InputLabel>
            <Select
              labelId="company-select-label"
              id="company-select"
              value={selectedCompany}
              label="Filtrar por Empresa"
              onChange={handleCompanyChange}
              size="small"
            >
              <MenuItem value="">Todas las Empresas</MenuItem>
              {companies.map((company) => (
                <MenuItem key={company} value={company}>{company}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="historial tabs">
          <Tab label="Vacaciones" sx={{ textTransform: 'none' }} />
          <Tab label="Permisos" sx={{ textTransform: 'none' }} />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Fecha de Solicitud</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vacations.map((row) => (
                <TableRow key={row.vacacion_id}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.empresa}</TableCell>
                  <TableCell>{new Date(row.fecha_solicitud).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(row.fecha_inicio).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(row.fecha_fin).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        bgcolor: estadoColors[row.estado] || estadoColors.Pendiente,
                        color: 'common.white',
                        px: 1,
                        borderRadius: 1,
                        display: 'inline-block',
                      }}
                    >
                      {row.estado}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Fecha de Solicitud</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((row) => (
                <TableRow key={row.permiso_id}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.empresa}</TableCell>
                  <TableCell>{new Date(row.fecha_solicitud).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(row.fecha_inicio).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(row.fecha_fin).toLocaleDateString()}</TableCell>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        bgcolor: row.con_goce_sueldo ? 'success.light' : 'warning.light',
                        color: row.con_goce_sueldo ? 'success.contrastText' : 'warning.contrastText',
                        px: 1,
                        borderRadius: 1,
                        display: 'inline-block',
                      }}
                    >
                      {row.con_goce_sueldo ? 'Con goce de sueldo' : 'Sin goce de sueldo'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        bgcolor: permisoEstadoColors[row.estado] || permisoEstadoColors.pendiente,
                        color: 'common.white',
                        px: 1,
                        borderRadius: 1,
                        display: 'inline-block',
                      }}
                    >
                      {row.estado.charAt(0).toUpperCase() + row.estado.slice(1)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default VacationHistoryTable;