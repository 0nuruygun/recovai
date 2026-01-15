const router = require('express').Router();
const { pool, poolConnect, sql } = require('../db');

/* READ by profile */
router.get('/:profileId', async (req, res) => {
  await poolConnect;
  const result = await pool.request()
    .input('profileId', sql.Int, req.params.profileId)
    .query(`
      SELECT TOP (1) 
         [ScoreId]
        ,[Score]
        ,[Status]
        ,[Evaluation]
        ,[ProfileId]
        ,FORMAT(CreatedAt, 'dd MM yyyy') AS CreatedAt
      FROM Score 
      WHERE ProfileId=@profileId 
      ORDER BY ScoreId DESC  
    `);

  res.json(result.recordset);
});

module.exports = router;
