const router = require('express').Router();
const { pool, poolConnect, sql } = require('../db');

/* CREATE / CONNECT */
router.post('/', async (req, res) => {
  await poolConnect;
  const {
    ProfileId,
    AccessToken,
    RefreshToken,
    TokenExpiresAt,
    SyncStatus,
    SyncError
  } = req.body;

  await pool.request()
    .input('ProfileId', sql.Int, ProfileId)
    .input('AccessToken', sql.NVarChar(sql.MAX), AccessToken)
    .input('RefreshToken', sql.NVarChar(sql.MAX), RefreshToken)
    .input('TokenExpiresAt', sql.DateTime, TokenExpiresAt)
    .input('SyncStatus', sql.NVarChar, SyncStatus)
    .input('SyncError', sql.NVarChar, SyncError)
    .query(`
      INSERT INTO GoogleFitConnect
      (ProfileId, AccessToken, RefreshToken, TokenExpiresAt, SyncStatus, SyncError)
      VALUES
      (@ProfileId, @AccessToken, @RefreshToken, @TokenExpiresAt, @SyncStatus, @SyncError)
    `);

  res.json({ success: true });
});

/* READ by profile */
router.get('/profile/:profileId', async (req, res) => {
  await poolConnect;
  const result = await pool.request()
    .input('profileId', sql.Int, req.params.profileId)
    .query('SELECT * FROM GoogleFitConnect WHERE ProfileId=@profileId');

  res.json(result.recordset[0]);
});

/* UPDATE sync status */
router.put('/:id/sync', async (req, res) => {
  await poolConnect;
  const { SyncStatus, SyncError } = req.body;

  await pool.request()
    .input('id', sql.Int, req.params.id)
    .input('SyncStatus', sql.NVarChar, SyncStatus)
    .input('SyncError', sql.NVarChar, SyncError)
    .query(`
      UPDATE GoogleFitConnect
      SET SyncStatus=@SyncStatus,
          SyncError=@SyncError,
          LastSyncAt=GETDATE(),
          UpdatedAt=GETDATE()
      WHERE GoogleFitConnectId=@id
    `);

  res.json({ success: true });
});

/* DISCONNECT */
router.delete('/:id', async (req, res) => {
  await poolConnect;
  await pool.request()
    .input('id', sql.Int, req.params.id)
    .query(`
      UPDATE GoogleFitConnect
      SET IsActive=0, UpdatedAt=GETDATE()
      WHERE GoogleFitConnectId=@id
    `);

  res.json({ success: true });
});

module.exports = router;
