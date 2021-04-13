require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Routers
const authRouters = require('./routes/auth');
const uploadRouters = require('./routes/upload');
const getDocsRoutes = require('./routes/getDocs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Use Routers
app.use('/auth', authRouters);
app.use('/upload', uploadRouters);
app.use('/getdocs', getDocsRoutes);

// app.post("/upload");

app.listen(8001, () => {
  console.log("Listening on port 8001");
});
