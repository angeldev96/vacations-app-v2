/* eslint-disable react/prop-types */
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
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
  }, [page, rowsPerPage, activeTab]);

  const fetchVacationHistory = async () => {
    try {
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacation-history?page=${page + 1}&limit=${rowsPerPage}`);
      setVacations(response.data.vacations);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching vacation history:', error);
    }
  };

  const fetchPermissionHistory = async () => {
    try {
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/permission-history?page=${page + 1}&limit=${rowsPerPage}`);
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

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h4" sx={{ p: 2 }}>Historial de Vacaciones y Permisos</Typography>
      
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
                <TableCell>Fecha de Solicitud</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vacations.map((row) => (
                <TableRow key={row.vacacion_id}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{new Date(row.fecha_solicitud).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(row.fecha_inicio).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(row.fecha_fin).toLocaleDateString()}</TableCell>
                  <TableCell>{row.motivo}</TableCell>
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