import { sequelize } from '../util/db';
import express from 'express';

const router = express.Router();

router.post('/reset', async (req, res) => {
  // Create all tables, dropping them first if they already exist.
  await sequelize.sync({ force: true });

  return res.sendStatus(204);
});

module.exports = router;
