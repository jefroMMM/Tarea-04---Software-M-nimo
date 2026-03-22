module.exports = (app, pool) => {
  // Obtener todas las reservas de un usuario
  app.get('/api/reservas/usuario/:id_usuario', async (req, res) => {
    try {
      const { id_usuario } = req.params;
      const query = `
        SELECT r.*, e.nombre as espacio_nombre, e.capacidad, e.tipo, e.estado
        FROM Reserva r
        JOIN "Espacio" e ON r.id_espacio = e.id_espacio
        WHERE r.id_usuario = $1 AND r.estado_reserva != 'Cancelada'
        ORDER BY r.fecha DESC, r.hora_inicio DESC
      `;
      const result = await pool.query(query, [id_usuario]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      res.status(500).json({ error: "Error al obtener reservas: " + error.message });
    }
  });

  // Obtener reservas de un espacio en una fecha especÃ­fica
  app.get('/api/reservas/espacio/:id_espacio/fecha/:fecha', async (req, res) => {
    try {
      const { id_espacio, fecha } = req.params;
      const query = `
        SELECT * FROM Reserva
        WHERE id_espacio = $1 AND fecha = $2 AND estado_reserva != 'Cancelada'
        ORDER BY hora_inicio ASC
      `;
      const result = await pool.query(query, [id_espacio, fecha]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener reservas del espacio:', error);
      res.status(500).json({ error: "Error al obtener reservas: " + error.message });
    }
  });

  // Crear una nueva reserva
  app.post('/api/reservas', async (req, res) => {
    const { id_usuario, id_espacio, fecha, hora_inicio, hora_fin } = req.body;

    if (!id_usuario || !id_espacio || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Bloquea por espacio + fecha para evitar reservas simultÃ¡neas del mismo salÃ³n
      await client.query('SELECT pg_advisory_xact_lock($1, hashtext($2))', [id_espacio, fecha]);

      const espacioQuery = `
        SELECT * FROM "Espacio" WHERE id_espacio = $1
      `;
      const espacioResult = await client.query(espacioQuery, [id_espacio]);

      if (espacioResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      const espacio = espacioResult.rows[0];

      if (espacio.estado !== 'Activo') {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Solo puedes reservar espacios activos' });
      }

      if (hora_inicio < espacio.Primer_Hora_Disponible) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `La hora de inicio no puede ser menor a ${espacio.Primer_Hora_Disponible}`
        });
      }

      if (hora_fin > espacio.Ultima_Hora_Disponible) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `La hora final no puede ser mayor a ${espacio.Ultima_Hora_Disponible}`
        });
      }

      if (hora_inicio >= hora_fin) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'La hora de inicio debe ser menor a la hora final'
        });
      }

      const conflictQuery = `
        SELECT COUNT(*) as count FROM Reserva
        WHERE id_espacio = $1 AND fecha = $2 AND estado_reserva != 'Cancelada'
        AND (
          hora_inicio < $4 AND hora_fin > $3
        )
      `;
      const conflictResult = await client.query(conflictQuery, [id_espacio, fecha, hora_inicio, hora_fin]);
      const conflictCount = parseInt(conflictResult.rows[0].count, 10);

      if (conflictCount > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'Ese espacio ya estÃ¡ reservado en el horario seleccionado'
        });
      }

      const insertQuery = `
        INSERT INTO Reserva (id_usuario, id_espacio, fecha, hora_inicio, hora_fin, estado_reserva)
        VALUES ($1, $2, $3, $4, $5, 'Confirmada')
        RETURNING id_reserva
      `;
      const insertResult = await client.query(insertQuery, [id_usuario, id_espacio, fecha, hora_inicio, hora_fin]);

      await client.query('COMMIT');

      res.status(201).json({
        msg: "Reserva creada exitosamente",
        id_reserva: insertResult.rows[0].id_reserva
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear reserva:', error);
      res.status(500).json({ error: "Error al crear reserva: " + error.message });
    } finally {
      client.release();
    }
  });

  // Cancelar una reserva
  app.put('/api/reservas/:id/cancelar', async (req, res) => {
    const { id } = req.params;

    try {
      const query = 'UPDATE Reserva SET estado_reserva = $1 WHERE id_reserva = $2 RETURNING id_reserva';
      const result = await pool.query(query, ['Cancelada', id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      res.status(200).json({ msg: "Reserva cancelada exitosamente" });
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      res.status(500).json({ error: "Error al cancelar reserva: " + error.message });
    }
  });
};
