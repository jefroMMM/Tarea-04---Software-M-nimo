module.exports = (app, pool) => {
  app.get('/api/estadisticas', async (req, res) => {
    try {
      const [reservasResult, usuariosResult, espaciosActivosResult, espaciosMantenimientoResult] = await Promise.all([
        pool.query('SELECT COUNT(*) as total FROM "Reserva"'),
        pool.query('SELECT COUNT(*) as total FROM "Usuario"'),
        pool.query('SELECT COUNT(*) as total FROM "Espacio" WHERE estado = \'Activo\''),
        pool.query('SELECT COUNT(*) as total FROM "Espacio" WHERE estado = \'Mantenimiento\'')
      ]);

      res.status(200).json({
        totalReservas: parseInt(reservasResult.rows[0].total),
        usuariosActivos: parseInt(usuariosResult.rows[0].total),
        espaciosDisponibles: parseInt(espaciosActivosResult.rows[0].total),
        espaciosMantenimiento: parseInt(espaciosMantenimientoResult.rows[0].total)
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ error: "Error al obtener estadísticas: " + error.message });
    }
  });
};
