require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./src/routes/api');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const host = process.env.HOST ||'127.0.0.1';

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors()); // Allow all origins (not recommended for production)

//routes
app.use('/v1', apiRoutes);
app.use("/public", express.static(path.join(__dirname, 'public')));
app.listen(port,host, () => {
  console.log(`Server is running on port ${port}`);
});
