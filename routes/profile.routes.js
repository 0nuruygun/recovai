const router = require('express').Router();
const { pool, poolConnect, sql } = require('../db');

/* CREATE */
router.post('/', async (req, res) => {
  await poolConnect;

  const {
    name,
    surname,
    gender,
    age,
    weight,
    height,
    smoking,
    alcohol,
    trainingRate
  } = req.body;

  const result = await pool.request()
    .input('Name', sql.NVarChar, name)
    .input('Surname', sql.NVarChar, surname)
    .input('Gender', sql.NVarChar, gender)
    .input('Age', sql.Int, age)
    .input('Weight', sql.Decimal(5, 2), weight)
    .input('Height', sql.Decimal(5, 2), height)
    .input('Smoking', sql.NVarChar, smoking)
    .input('Alcohol', sql.NVarChar, alcohol)
    .input('TrainingRate', sql.NVarChar, trainingRate)
    .query(`
      INSERT INTO Profile
        (Name, Surname, Gender, Age, Weight, Height, Smoking, Alcohol, TrainingRate)
      VALUES
        (@Name, @Surname, @Gender, @Age, @Weight, @Height, @Smoking, @Alcohol, @TrainingRate);

      SELECT CAST(SCOPE_IDENTITY() AS INT) AS profileId;
    `);

  res.json(result.recordset[0]);
});


/* READ */
router.get('/:id', async (req, res) => {
  await poolConnect;
  const result = await pool.request()
    .input('id', sql.Int, req.params.id)
    .query('SELECT * FROM Profile WHERE ProfileId=@id');

  res.json(result.recordset[0]);
});

/* UPDATE */
router.put('/:id', async (req, res) => {
  await poolConnect;
  const { 
    name,
    surname,
    gender,
    age,
    weight,
    height,
    smoking,
    alcohol,
    trainingRate
  } = req.body;

  await pool.request()
    .input('id', sql.Int, req.params.id)
    .input('Name', sql.NVarChar, name)
    .input('Surname', sql.NVarChar, surname)
    .input('Gender', sql.NVarChar, gender)
    .input('Age', sql.Int, age)
    .input('Weight', sql.Decimal(5, 2), weight)
    .input('Height', sql.Decimal(5, 2), height)
    .input('Smoking', sql.NVarChar, smoking)
    .input('Alcohol', sql.NVarChar, alcohol)
    .input('TrainingRate', sql.NVarChar, trainingRate)
    .query(`
      UPDATE Profile
        SET
            Name          = @Name,
            Surname       = @Surname,
            Gender        = @Gender,
            Age           = @Age,
            Weight        = @Weight,
            Height        = @Height,
            Smoking       = @Smoking,
            Alcohol       = @Alcohol,
            TrainingRate  = @TrainingRate,
            UpdatedAt     = GETDATE()
        WHERE ProfileId = @id;
    `);
  res.json({ success: true });
});

/* DELETE */
router.delete('/:id', async (req, res) => {
  await poolConnect;
  await pool.request()
    .input('id', sql.Int, req.params.id)
    .query('DELETE FROM Profile WHERE ProfileId=@id');

  res.json({ success: true });
});

module.exports = router;
