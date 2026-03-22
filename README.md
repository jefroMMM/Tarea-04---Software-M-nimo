# Sistema de Reservas Academicas

Proyecto base para la gestion de reservas de espacios academicos como salones, laboratorios y auditorios.

## Requisitos

- Docker Desktop instalado y en ejecucion
- Puerto `3000` disponible para el backend
- Puerto `5432` disponible para PostgreSQL

## Variables de entorno

El proyecto utiliza un archivo `.env`. Debe incluir al menos:

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
- `EMAIL_USER` y `EMAIL_PASS` se usan para enviar credenciales temporales por correo al crear usuarios.
- Si no configuras correo, el backend puede iniciar, pero la creacion de usuarios puede fallar al intentar enviar el email.

## Como ejecutar el proyecto

1. Abre una terminal en la raiz del proyecto.
2. Verifica que exista el archivo `.env` con las variables necesarias.
3. Levanta los servicios con:

```bash
docker compose up --build
```

4. Espera a que la base de datos y el backend terminen de iniciar.
5. Abre las vistas HTML desde tu navegador o con una extension como Live Server.

Vistas principales:

- Login: `VistasUniversales/LoginGeneral.html`
- Panel administrador: `VistasAdmin/DashboardAdmin.html`
- Panel estudiante: `VistasEstudiante/ReservaEstudiantes.html`

Si usas Live Server, normalmente las rutas quedan similares a estas:

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
- `GET /api/estadisticas`

## Base de datos

La base de datos se inicializa automaticamente la primera vez que se crea el contenedor de PostgreSQL usando el archivo:

- `sql/esquema.sql`

Si necesitas reconstruir la base desde cero, elimina antes el contenedor y el volumen de PostgreSQL y luego vuelve a ejecutar `docker compose up --build`.

## Documentacion de analisis

La documentacion solicitada del analisis se encuentra en:

- `docs/ANALISIS.md`
