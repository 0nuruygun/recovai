require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/metrics', require('./routes/metrics.routes'));
app.use('/api/score', require('./routes/score.routes'));
app.use('/api/daily', require('./routes/daily.routes'));
app.use('/api/googlefit', require('./routes/googlefit.routes'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
