const router = require('express').Router();
const { pool, poolConnect, sql } = require('../db');

router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .execute('sp_CoachDashboard_Summary');

    //res.json({
    //  summary: result.recordsets[0][0],
    //  trend: result.recordsets[1],
    //  distribution: result.recordsets[2],
    //  athletes: result.recordsets[3],
    //  googleFit: result.recordsets[4][0],
    //});

    res.render("index",{
      summary: result.recordsets[0][0],
      trend: result.recordsets[1],
      distribution: result.recordsets[2],
      athletes: result.recordsets[3],
      googleFit: result.recordsets[4][0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Dashboard error');
  }
});

module.exports = router;