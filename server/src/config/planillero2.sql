-- Crear la base de datos integrada
CREATE DATABASE gestion_empleados_db;

-- Usar la base de datos creada
USE gestion_empleados_db;

-- Tabla Empresa
CREATE TABLE Empresa (
  id_empresa INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rtn VARCHAR(250),
  logo MEDIUMBLOB
);

-- Tabla Departamentos
CREATE TABLE Departamentos (
  id_departamento INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL
);

-- Tabla Bancos
CREATE TABLE Bancos (
  id_banco INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL
);

-- Tabla TipoContrato
CREATE TABLE TipoContrato (
  id_contrato INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL
);

-- Tabla TipoHorario
CREATE TABLE TipoHorario (
  id_tipo_horario INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL
);

-- Tabla Estados
CREATE TABLE Estados (
  id_estado INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL
);

-- Tabla Empleados (fusionada con la información de ambas bases de datos)
CREATE TABLE Empleados (
  id_empleado INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa INT,
  nombre_completo VARCHAR(100) NOT NULL,
  numero_residencia VARCHAR(50),
  identidad VARCHAR(50) NOT NULL,
  id_departamento INT,
  id_banco INT,
  numero_cuenta VARCHAR(20),
  id_tipo_contrato INT,
  id_tipo_horario INT,
  sueldo_base DECIMAL(10, 2),
  id_estado INT,
  fecha_ingreso DATE NOT NULL,
  dias_proporcionales INT DEFAULT 0,
  dias_disfrutados INT DEFAULT 0,
  ubicacion_empleado VARCHAR(50),
  FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa),
  FOREIGN KEY (id_departamento) REFERENCES Departamentos(id_departamento),
  FOREIGN KEY (id_banco) REFERENCES Bancos(id_banco),
  FOREIGN KEY (id_tipo_contrato) REFERENCES TipoContrato(id_contrato),
  FOREIGN KEY (id_tipo_horario) REFERENCES TipoHorario(id_tipo_horario),
  FOREIGN KEY (id_estado) REFERENCES Estados(id_estado)
);

-- Tabla PeriodoPago
CREATE TABLE PeriodoPago (
  id_periodo_pago INT AUTO_INCREMENT PRIMARY KEY,
  inicio_periodo DATE NOT NULL,
  fin_periodo DATE NOT NULL
);

-- Tabla Calculos
CREATE TABLE Calculos (
  id_calculo INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT,
  seguro_social DECIMAL(10, 2),
  isr DECIMAL(10, 2),
  prestamo DECIMAL(10, 2),
  ajuste DECIMAL(10, 2),
  deduccion_comida DECIMAL(10, 2),
  deduccion_otros DECIMAL(10, 2),
  rap DECIMAL(10, 2),
  complemento DECIMAL(10, 2),
  id_periodo_pago INT,
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado),
  FOREIGN KEY (id_periodo_pago) REFERENCES PeriodoPago(id_periodo_pago)
);

-- Tabla Vacaciones
CREATE TABLE Vacaciones (
  id_vacacion INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  motivo TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Tabla Historial_Vacaciones
CREATE TABLE Historial_Vacaciones (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_vacacion INT,
  estado VARCHAR(20) NOT NULL,
  fecha_cambio DATETIME NOT NULL,
  FOREIGN KEY (id_vacacion) REFERENCES Vacaciones(id_vacacion)
);


CREATE TABLE Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(100) NOT NULL UNIQUE,
  rol ENUM('admin', 'rrhh', 'gerente', 'empleado') NOT NULL,
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  ultimo_acceso TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);	

-- Insertar usuarios predeterminados
INSERT INTO Usuarios (nombre_usuario, contrasena, correo_electronico, rol) VALUES
('admin', 'contrasena_admin', 'admin@example.com', 'admin'),
('rrhh', 'contrasena_rrhh', 'rrhh@example.com', 'rrhh');
