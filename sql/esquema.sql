
CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);


CREATE TABLE "Espacio" (
    id_espacio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    "Primer_Hora_Disponible" TIME NOT NULL,
    "Ultima_Hora_Disponible" TIME NOT NULL,
    "Reservaciones_Permitidas" INT NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK(tipo IN ('Salón', 'Laboratorio', 'Auditorio')),
    capacidad INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'Activo' CHECK(estado IN ('Activo', 'Mantenimiento', 'Inactivo'))
);


CREATE TABLE Reserva (
    id_reserva SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_espacio INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado_reserva VARCHAR(50) DEFAULT 'Confirmada' CHECK(estado_reserva IN ('Confirmada', 'Cancelada', 'Completada')),
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_espacio FOREIGN KEY (id_espacio) REFERENCES "Espacio"(id_espacio) ON DELETE CASCADE
);

