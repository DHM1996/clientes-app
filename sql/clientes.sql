/*CREATE DATABASE CLIENTES;*/
USE CLIENTES;

CREATE TABLE CLIENTES(
    numero_cliente INT NOT NULL UNIQUE AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    documento VARCHAR(10) UNIQUE NOT NULL,
    sexo CHAR(1) NOT NULL,
    fecha_nacimiento VARCHAR(10) NOT NULL,
    provincia VARCHAR(20) NOT NULL,
    localidad VARCHAR(20) NOT NULL,
    calle VARCHAR(50) NOT NULL,
    altura VARCHAR(4) NOT NULL,
    departamento VARCHAR(3),
    codigo_area VARCHAR(4),
    telefono VARCHAR(25) NOT NULL,
    correo VARCHAR(70) NOT NULL,
    PRIMARY KEY(numero_cliente)
)ENGINE=MyISAM DEFAULT CHARSET=utf8;