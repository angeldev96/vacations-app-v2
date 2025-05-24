




	CREATE DATABASE gestion_vacaciones;
	USE gestion_vacaciones;

	-- Tabla de empleados
	CREATE TABLE Empleados (
		empleado_id INT AUTO_INCREMENT PRIMARY KEY,
		nombre VARCHAR(100) NOT NULL,
		dni VARCHAR(20) NOT NULL,
		fecha_ingreso DATE NOT NULL,
		dias_proporcionales INT DEFAULT 0,
		dias_disfrutados INT DEFAULT 0,
		ubicacion_empleado VARCHAR(50)
	);

	-- Tabla de vacaciones
	CREATE TABLE Vacaciones (
    vacacion_id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    motivo TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES Empleados(empleado_id)
);

	-- Tabla de historial de vacaciones
	CREATE TABLE Historial_Vacaciones (
		historial_id INT AUTO_INCREMENT PRIMARY KEY,
		vacacion_id INT,
		estado VARCHAR(20) NOT NULL,
		fecha_cambio DATETIME NOT NULL,
		FOREIGN KEY (vacacion_id) REFERENCES Vacaciones(vacacion_id)
	);

	INSERT INTO Empleados (nombre, dni, fecha_ingreso, dias_proporcionales, dias_disfrutados, ubicacion_empleado)
	VALUES 
	('Marlon Noel Hernandez Meza', '1001-2000-00348', '2020-01-01', 7, 0, 'La Eza'),
	('Jose Mauricio Hernandez Meza', '1001-1991-00007', '2021-01-01', 7, 0 , 'La Eza'),
	('Fernando Hernandez Meza', '1001-1994-00012', '2021-01-01', 7, 0, 'La Eza'),
	('Renan Agustin Mejia Vasquez', '1001-1994-00026', '2021-01-01', 7, 0, 'La Eza'),
	('Jose Ignacio Membreño Gamez', '1001-1983-00221', '2021-01-01', 7, 0, 'La Eza');

	-- Insertar solicitudes de vacaciones para los empleados
	INSERT INTO Vacaciones (empleado_id, fecha_inicio, fecha_fin, motivo)
	VALUES 
	((SELECT empleado_id FROM Empleados WHERE dni = '1001-2000-00348'), '2024-08-01 09:00:00', '2024-08-07 18:00:00', 'Vacaciones familiares'),
	((SELECT empleado_id FROM Empleados WHERE dni = '1001-1991-00007'), '2024-09-01 09:00:00', '2024-09-05 18:00:00', 'Viaje personal'),
	((SELECT empleado_id FROM Empleados WHERE dni = '1001-1994-00012'), '2024-10-01 09:00:00', '2024-10-10 18:00:00', 'Descanso'),
	((SELECT empleado_id FROM Empleados WHERE dni = '1001-1994-00026'), '2024-11-01 09:00:00', '2024-11-07 18:00:00', 'Vacaciones con la familia'),
	((SELECT empleado_id FROM Empleados WHERE dni = '1001-1983-00221'), '2024-12-01 09:00:00', '2024-12-05 18:00:00', 'Vacaciones de Navidad');


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('superadmin', 'admin', 'user') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar usuarios predeterminados
INSERT INTO users (first_name, last_name, username, password, email, role) VALUES
('Recursos', 'Humanos', 'rrhh', 'contrasena', 'rrhh@example.com', 'superadmin');

