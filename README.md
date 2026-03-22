# Levantar el proyecto

Paso 1 
ejecutar en la terminar y desde la raíz del proyecto 
```Bash
docker compose up -d
```

Paso 2
agregar correo y contraseña de aplicaciòn en las siguientes rutas
src/routes
auth: {
      user: 'correo',
      pass: 'contraseña de aplicaciòn' 
    }

    