-- Crear la base de datos
CREATE DATABASE planillero_db2;

-- Usar la base de datos creada
USE planillero_db2;

-- Crear la tabla Permiso
CREATE TABLE Permiso (
  id_permiso INT PRIMARY KEY,
  vistas VARCHAR(20),
  descripcion VARCHAR(20)
);

-- Crear la tabla Rol
CREATE TABLE Rol (
  id_rol INT PRIMARY KEY,
  id_permiso INT,
  descripcion VARCHAR(20),
  FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso)
);

-- Crear la tabla Empresa
CREATE TABLE Empresa (
  id_empresa INT PRIMARY KEY,
  nombre VARCHAR(25),
  rtn VARCHAR(250),
  logo BINARY
);

-- Crear la tabla Departamentos
CREATE TABLE Departamentos (
  id_departamento INT PRIMARY KEY,
  descripcion VARCHAR(20)
);

-- Crear la tabla Bancos
CREATE TABLE Bancos (
  id_banco INT PRIMARY KEY,
  descripcion VARCHAR(50)
);

-- Crear la tabla TipoContrato
CREATE TABLE TipoContrato (
  id_contrato INT PRIMARY KEY,
  descripcion VARCHAR(20)
);

-- Crear la tabla TipoHorario
CREATE TABLE TipoHorario (
  id_tipo_horario INT PRIMARY KEY,
  descripcion VARCHAR(20)
);

-- Crear la tabla Estados
CREATE TABLE Estados (
  id_estado INT PRIMARY KEY
);

-- Crear la tabla Usuarios
CREATE TABLE Usuarios (
  id_usuario INT PRIMARY KEY,
  id_rol INT,
  id_empresa INT,
  nombre_completo VARCHAR(50),
  correo_electronico VARCHAR(50),
  contrasena VARCHAR(50),
  FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
  FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa)
);

-- Crear la tabla Empleados
CREATE TABLE Empleados (
  id_empleado INT PRIMARY KEY,
  id_empresa INT,
  nombre_completo VARCHAR(50),
  numero_residencia VARCHAR(50),
  identidad VARCHAR(50),
  id_departamento INT,
  id_banco INT,
  numero_cuenta VARCHAR(20),
  id_tipo_contrato INT,
  id_tipo_horario INT,
  sueldo_base INT,
  id_estado INT,
  FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa),
  FOREIGN KEY (id_departamento) REFERENCES Departamentos(id_departamento),
  FOREIGN KEY (id_banco) REFERENCES Bancos(id_banco),
  FOREIGN KEY (id_tipo_contrato) REFERENCES TipoContrato(id_contrato),
  FOREIGN KEY (id_tipo_horario) REFERENCES TipoHorario(id_tipo_horario),
  FOREIGN KEY (id_estado) REFERENCES Estados(id_estado)
);

-- Crear la tabla PeriodoPago
CREATE TABLE PeriodoPago (
  id_periodo_pago INT PRIMARY KEY,
  inicio_periodo DATE,
  fin_periodo DATE
);

-- Crear la tabla Calculos
CREATE TABLE Calculos (
  id_calculo INT PRIMARY KEY,
  id_empleado INT,
  seguro_social INT,
  isr INT,
  prestamo INT,
  ajuste INT,
  deduccion_comida INT,
  deduccion_otros INT,
  rap INT,
  complemento INT,
  id_periodo_pago INT,
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado),
  FOREIGN KEY (id_periodo_pago) REFERENCES PeriodoPago(id_periodo_pago)
);