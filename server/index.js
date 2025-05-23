require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const linkRoutes = require("./routes/link");
const morgan = require('morgan');

const app = express();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error(err));

//Middlewares
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

//Route middlewares
app.use("/api", authRoutes);
app.use("/api", linkRoutes);

app.listen(8080, () => console.log('Server started on port 8080'));
