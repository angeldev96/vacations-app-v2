-- Comandos para modificar la precisión decimal de los campos de vacaciones
-- Cambiar dias_vacaciones_acumulados de DECIMAL(6,4) a DECIMAL(6,2)
ALTER TABLE empleados MODIFY COLUMN dias_vacaciones_acumulados DECIMAL(6,2);

-- Cambiar dias_vacaciones_tomados de DECIMAL(7,4) a DECIMAL(7,2)
ALTER TABLE empleados MODIFY COLUMN dias_vacaciones_tomados DECIMAL(7,2);

-- Verificar los cambios
DESCRIBE empleados; 