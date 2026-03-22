module.exports = (app, pool) => {
  app.get('/api/espacios', async (req, res) => {
    try {
      const query = 'SELECT id_espacio, nombre, "Primer_Hora_Disponible", "Ultima_Hora_Disponible", tipo, capacidad, estado FROM "Espacio" ORDER BY nombre ASC';
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener espacios:', error);
      res.status(500).json({ error: "Error al obtener espacios: " + error.message });
    }
  });

  app.post('/api/espacios', async (req, res) => {
    const { nombre, Primer_Hora_Disponible, Ultima_Hora_Disponible, tipo, capacidad } = req.body;

    if (!nombre || !Primer_Hora_Disponible || !Ultima_Hora_Disponible || !tipo || !capacidad) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (!['Salón', 'Laboratorio', 'Auditorio'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de espacio no válido' });
    }

    try {
      const checkQuery = 'SELECT id_espacio FROM "Espacio" WHERE nombre = $1';
      const checkResult = await pool.query(checkQuery, [nombre]);
      
      if (checkResult.rows.length > 0) {
        return res.status(409).json({ error: 'El nombre del espacio ya existe' });
      }

      const query = 'INSERT INTO "Espacio" (nombre, "Primer_Hora_Disponible", "Ultima_Hora_Disponible", tipo, capacidad, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_espacio';
      const values = [nombre, Primer_Hora_Disponible, Ultima_Hora_Disponible, tipo, capacidad, 'Inactivo'];
      
      const result = await pool.query(query, values);

      res.status(201).json({ 
        msg: "Espacio creado exitosamente",
        id_espacio: result.rows[0].id_espacio
      });
    } catch (error) {
      console.error('Error al crear espacio:', error);
      res.status(500).json({ error: "Error al crear espacio: " + error.message });
    }
  });

  app.put('/api/espacios/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['Activo', 'Mantenimiento', 'Inactivo'].includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    try {
      const query = 'UPDATE "Espacio" SET estado = $1 WHERE id_espacio = $2 RETURNING id_espacio';
      const result = await pool.query(query, [estado, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      res.status(200).json({ msg: "Estado actualizado exitosamente" });
    } catch (error) {
      console.error('Error al actualizar espacio:', error);
      res.status(500).json({ error: "Error al actualizar espacio: " + error.message });
    }
  });

  app.delete('/api/espacios/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const query = 'DELETE FROM "Espacio" WHERE id_espacio = $1 RETURNING id_espacio';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }

      res.status(200).json({ msg: "Espacio eliminado exitosamente" });
    } catch (error) {
      console.error('Error al eliminar espacio:', error);
      res.status(500).json({ error: "Error al eliminar espacio: " + error.message });
    }
  });
};
