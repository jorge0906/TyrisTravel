

DROP DATABASE IF EXISTS tyristravel;
CREATE DATABASE tyristravel CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE tyristravel;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, email, password) VALUES
('Juan Pérez', 'juan@example.com', '12345'),
('María López', 'maria@example.com', '12345');


CREATE TABLE categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

INSERT INTO categorias (nombre) VALUES
('Europa'),
('Asia'),
('América'),
('África');


CREATE TABLE destinos (
  id_destino INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  duracion_dias INT NOT NULL,
  plazas_disponibles INT DEFAULT 20,
  fecha_salida DATE,
  incluye_vuelo BOOLEAN DEFAULT TRUE,
  hotel VARCHAR(100),
  valoracion DECIMAL(2,1) DEFAULT 4.5,
  id_categoria INT,
  imagen_url VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

INSERT INTO destinos 
(nombre, descripcion, precio, duracion_dias, plazas_disponibles, fecha_salida, incluye_vuelo, hotel, valoracion, id_categoria, imagen_url, activo)
VALUES
('París', 'Descubre la ciudad del amor con visitas guiadas y alojamiento incluido', 899.99, 5, 15, '2026-06-10', TRUE, 'Hotel Lumière', 4.7, 1, 'paris.jpg', TRUE),
('Tokio', 'Explora la capital japonesa y su cultura única', 1200.50, 7, 10, '2026-07-15', TRUE, 'Tokyo Central Hotel', 4.8, 2, 'tokio.jpg', TRUE),
('Nueva York', 'Viaja a la ciudad que nunca duerme', 1100.00, 6, 20, '2026-08-01', TRUE, 'Manhattan Suites', 4.6, 3, 'ny.jpg', TRUE),
('Marrakech', 'Sumérgete en la cultura marroquí y sus mercados tradicionales', 750.00, 4, 18, '2026-05-20', FALSE, 'Riad Atlas', 4.4, 4, 'marrakech.jpg', TRUE);


CREATE TABLE reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_destino INT,
  fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'pendiente',
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_destino) REFERENCES destinos(id_destino)
);

INSERT INTO reservas (id_usuario, id_destino, estado) VALUES
(1, 1, 'confirmada'),
(2, 3, 'pendiente');
