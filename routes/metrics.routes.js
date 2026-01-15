const router = require('express').Router();
const { pool, poolConnect, sql } = require('../db');

/* CREATE */
//router.post('/metricsPost', async (req, res) => {
//  await poolConnect;
//  const {
//    HeartRate, SleepDuration, Spo2, EcgStatus,
//    ActivityDuration, StressLevel, ProfileId
//  } = req.body;
//
//  await pool.request()
//    .input('HeartRate', sql.Int, HeartRate)
//    .input('SleepDuration', sql.Decimal(4,1), SleepDuration)
//    .input('Spo2', sql.TinyInt, Spo2)
//    .input('EcgStatus', sql.NVarChar, EcgStatus)
//    .input('ActivityDuration', sql.Int, ActivityDuration)
//    .input('StressLevel', sql.NVarChar, StressLevel)
//    .input('ProfileId', sql.Int, ProfileId)
//    .query(`
//      INSERT INTO HealthMetrics
//      (HeartRate, SleepDuration, Spo2, EcgStatus, ActivityDuration, StressLevel, ProfileId)
//      VALUES
//      (@HeartRate, @SleepDuration, @Spo2, @EcgStatus, @ActivityDuration, @StressLevel, @ProfileId)
//    `);
//
//  res.json({ success: true });
//});

/* READ by profile */
router.get('/:profileId', async (req, res) => {
  await poolConnect;
  const result = await pool.request()
    .input('profileId', sql.Int, req.params.profileId)
    .query(`
      SELECT TOP(1)
           [MetricId]
          ,[HeartRate]
          ,[SleepDuration]
          ,[Spo2]
          ,[EcgStatus]
          ,[ActivityDuration]
          ,[StressLevel]
          ,[ProfileId]
          ,FORMAT(CreatedAt, 'dd MM yyyy') AS CreatedAt
      FROM [Recovai].[dbo].[HealthMetrics]
      WHERE ProfileId=@profileId
      ORDER BY MetricId DESC  
    `);

  res.json(result.recordset);
});

module.exports = router;
