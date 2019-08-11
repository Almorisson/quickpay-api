const express = require('express')
//const dotenv = require('dotenv')
const config = require('./config')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
//const jwt = require('jsonwebtoken'),
const mongoose = require('mongoose')
const cors = require('cors');
const { unAuthorizedError, errors } = require('./middlewares/errorHandler')
const customerRoutes = require('./routes/customerRoutes');
const traderRoutes = require('./routes/traderRoutes');
const paymentRoutes = require('./routes/paymentRoutes')
const passportJWT = require('./middlewares/passportJWT')();
const app = express();
//Dotenv Config
//dotenv.config()

// Using cors middleware
app.use(cors())

//db connection
mongoose.connect(
  config.MONGO_URI_ATLAS,
  {useNewUrlParser: true, useCreateIndex: true}
)
.then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('uploads', express.static('uploads'));
app.use(passportJWT.initialize())

app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/transactions', paymentRoutes);
app.use('/api/v1/traders', traderRoutes);

//app.use(unAuthorizedError)
app.use(errors)

app.listen(config.PORT, config.HOST, function(){
    console.log(`Server is listening on http://${config.HOST}:${config.PORT}`);
});

