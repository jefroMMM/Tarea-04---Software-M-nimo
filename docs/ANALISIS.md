# Análisis del Sistema

## Definición del problema

Actualmente no se cuenta con algún sistema en el cual los estudiantes puedan
reservar espacios dentro de las instituciones provocando conflictos entre estudiantes o la
falta de areas para el disfrute o aprovechamiento de los estudiantes de forma ordenada para repartir 
salones, laboratorios o los auditorios ahorrando tiempo y malos entendidos

El sistema implementado busca de una forma centralizada y digital que los estudiantes puedan reservar
una aréa dentro del establecimiento con una constancia de aréa y horario y que cada usuario pueda gestionar sus propias reservas

## Requerimientos funcionales

1. El sistema debe permitir el inicio de sesión de usuarios registrados.
2. Registrar nuevos usuarios con nombre, correo y rol.
3. Permitir recuperar la contraseña de un usuario mediante correo electrónico.
4. Mostrar la lista de espacios académicos disponibles para reserva  a los estudiantes
5. Filtrar espacio disponibles por tipo.
6. Consultar la disponibilidad de un espacio según una fecha específica.
7. Crear reservas indicando espacio, fecha, hora de inicio y hora de fin.
8. Impedir reservas fuera del horario disponible del espaci0
9. Inpedir que dos usuarios reserven el mismo espacio en horarios similares o que choquen entre ellos
10. Solo el estudiante queé creó la reserva puede consultar y editar sus propias reservas
11. Un estudiante puede cancelar sus reservas activas.
12. Solo personal academico puede crear espacios en el sistema
13. Solo personal academico puede editar la información de los espacios
14. se deben de utilizar POST y GET para las peticiones
15. Se debe de contar con un dashboard para administración


## Requerimientos no funcionales

1. El sistema tiene que tener opciones para la accesibilidad de los estudiantes
2. Creación de logs especificos para mostrar errores a los usuarios
3. Todos los datos de la bd tienen que estar encriptados
4. El sistema debe de poder cambiar entre colores o utilizar una UI para día y noche
5. El sistema tiene que estar enteramente hecho con contenedores
6. La interfaz debe de poder alternar entre idiomas


## Preguntas al cliente

1. ¿Quiénes van a usar el sistema y qué van a poder hacer exactamente cada uno?
2. ¿Los profesores también podrán reservar espacios o eso solo lo hacen los estudiantes?
3. ¿Se puede tener más de una reserva al mismo tiempo en distintos espacios en un mismo día?
4. ¿Se puede reservar un espacio para fechas futuras sin límite, o habría que poner algún tope?
5. ¿Cuánto tiempo mínimo y máximo debería durar una reserva?
6. ¿Las reservas necesitan aprobación antes de confirmarse o se confirman automáticamente?
7. Además del nombre, tipo, horario, capacidad y estado, ¿hay algún otro dato que debamos registrar sobre los espacios?
8. Si un espacio entra en mantenimiento o se desactiva, ¿qué debería pasar con las reservas que ya existen?
9. ¿Se puede cancelar una reserva en cualquier momento o hay que fijar una fecha límite para cancelaciones?
10. ¿Queremos llevar un historial de reservas canceladas y completadas para administración o control?
11. ¿El sistema debería avisar por correo cuando se crea o se cancela una reserva?
12. ¿Los administradores necesitan poder ver reportes o estadísticas detalladas de uso de cada espacio?