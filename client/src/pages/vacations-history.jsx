import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
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

const VacationHistoryTable = () => {
  const [vacations, setVacations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);

  const estadoColors = {
    Aprobada: 'success.main',
    Rechazada: 'error.main',
    Pendiente: 'warning.main',
  };

  useEffect(() => {
    fetchVacationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchVacationHistory = async () => {
    try {
      const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/vacation-history?page=${page + 1}&limit=${rowsPerPage}`);
      setVacations(response.data.vacations);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching vacation history:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h4" sx={{ p: 2 }}>Historial de Vacaciones</Typography>
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