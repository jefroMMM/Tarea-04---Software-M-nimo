# Sistema de Reservas Académicas

Proyecto base para la gestión de reservas de espacios académicos como salones, laboratorios y auditorios.

## Requisitos

- Docker Desktop instalado y en ejecución
- Puerto `3000` disponible para el backend
- Puerto `5432` disponible para PostgreSQL

## Variables de entorno

El proyecto usa el archivo `.env`. Debe contener al menos:

```env
DB_PASSWORD=tu_password_bd
PORT=3000
DATABASE_URL=postgresql://admin:tu_password_bd@db:5432/reservas_db
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contrasena_de_aplicacion
```

Notas:

- `DB_PASSWORD` se usa para crear la base de datos en Docker.
- `DATABASE_URL` debe apuntar al servicio `db` porque el backend corre dentro de Docker.
- `EMAIL_USER` y `EMAIL_PASS` se usan para enviar credenciales temporales al crear usuarios.
- Si no quieres probar envío de correos, el backend igual arrancará, pero la creación de usuarios puede fallar cuando intente enviar el email.

## Cómo ejecutar el proyecto

1. Ubícate en la raíz del proyecto:

```bash
cd C:\Users\JefroMM\TareasIngSoftware\Tarea-04---Software-M-nimo
```

2. Levanta la base de datos y el backend:

```bash
docker compose up --build
```

3. Espera a que ambos servicios estén listos:

- PostgreSQL se inicializa con el script [sql/esquema.sql](/C:/Users/JefroMM/TareasIngSoftware/Tarea-04---Software-M-nimo/sql/esquema.sql)
- El backend se expone en `http://localhost:3000`

4. Abre las vistas HTML en el navegador:

- Login: `VistasUniversales/LoginGeneral.html`
- Panel administrador: `VistasAdmin/DashboardAdmin.html`
- Panel estudiante: `VistasEstudiante/ReservaEstudiantes.html`

Si las abres con Live Server, normalmente quedan así:

- `http://127.0.0.1:5500/VistasUniversales/LoginGeneral.html`
- `http://127.0.0.1:5500/VistasAdmin/DashboardAdmin.html`
- `http://127.0.0.1:5500/VistasEstudiante/ReservaEstudiantes.html`

## Endpoints principales

- `POST /api/login`
- `POST /api/usuarios`
- `GET /api/usuarios`
- `GET /api/espacios`
- `POST /api/espacios`
- `PUT /api/espacios/:id`
- `DELETE /api/espacios/:id`
- `GET /api/reservas/usuario/:id_usuario`
- `GET /api/reservas/espacio/:id_espacio/fecha/:fecha`
- `POST /api/reservas`
- `PUT /api/reservas/:id/cancelar`

## Base de datos

La base se crea automáticamente al iniciar Docker por primera vez usando:

- [sql/esquema.sql](/C:/Users/JefroMM/TareasIngSoftware/Tarea-04---Software-M-nimo/sql/esquema.sql)

Si ya existe un volumen previo de PostgreSQL y quieres reinicializar la base desde cero, primero debes eliminar el contenedor y su volumen manualmente.

## Documentación de análisis

La documentación solicitada del análisis está en:

- [docs/ANALISIS.md](/C:/Users/JefroMM/TareasIngSoftware/Tarea-04---Software-M-nimo/docs/ANALISIS.md)
