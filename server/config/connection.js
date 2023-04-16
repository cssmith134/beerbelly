const path = require("path")
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});

module.exports = mongoose.connection;
