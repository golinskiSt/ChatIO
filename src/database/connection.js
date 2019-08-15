const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(`${process.env.DB_HOST_prod}/chatIO`, {useNewUrlParser: true})
  .then(() => { console.log('DB: Connected!') })
  .catch(err => console.log(err.message))

module.exports = mongoose