const router = require('express').Router();
const { pool, poolConnect, sql } = require('../db');

/* READ by profile */
router.get('/:profileId', async (req, res) => {
  await poolConnect;
  const result = await pool.request()
    .input('profileId', sql.Int, req.params.profileId)
    .query(`
      SELECT * FROM DailyInputs 
        WHERE ProfileId=@profileId 
        AND 
        CAST(CreatedAt AS DATE) = CAST(GETDATE() AS DATE)  
    `);
  res.json(result.recordset[0]);
});


/* CREATE */
router.post('/', async (req, res) => {
  await poolConnect;
  const {
    coffe, alcohol, supplement, calorie, medical, profileId
  } = req.body;

  await pool.request()
    .input('Coffee', sql.NVarChar, coffe)
    .input('Alcohol', sql.NVarChar, alcohol)
    .input('Supplement', sql.NVarChar, supplement)
    .input('Calorie', sql.NVarChar, calorie)
    .input('Medical', sql.NVarChar, medical)
    .input('ProfileId', sql.Int, profileId)
    .query(`
      INSERT INTO DailyInputs
      (Coffee, Alcohol, Supplement, Calorie, Medical, ProfileId, CreatedAt)
      VALUES
      (@Coffee, @Alcohol, @Supplement, @Calorie, @Medical, @ProfileId, GETDATE())
  
    `);

  res.json({ success: true });
});

/* UPDATE */
router.put('/:profileId', async (req, res) => {
  await poolConnect;
  const { 
    coffe, alcohol, supplement, calorie, medical, profileId
  } = req.body;

  await pool.request()
    .input('Coffee', sql.NVarChar, coffe)
    .input('Alcohol', sql.NVarChar, alcohol)
    .input('Supplement', sql.NVarChar, supplement)
    .input('Calorie', sql.Int, calorie)
    .input('Medical', sql.NVarChar, medical)
    .input('ProfileId', sql.Int, profileId)
    .query(`
      UPDATE DailyInputs
        SET
            Coffee = @Coffee,
            Alcohol = @Alcohol,
            Supplement = @Supplement,
            Calorie = @Calorie,
            Medical = @Medical,
            CreatedAt = GETDATE()
        WHERE 
        ProfileId = @ProfileId
            AND
        CAST(CreatedAt AS DATE) = CAST(GETDATE() AS DATE) 
    `);
  res.json({ success: true });
});

module.exports = router;
