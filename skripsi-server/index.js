if(process.env.NODE_ENV == 'development') {
}
require('dotenv').config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const route = require("./routes");
const bodyParser = require("body-parser");
const Cors = require("cors");
const path = require("path");
// const errHandler = require("./middlewares/errHandler");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded ({ extended : true }));
app.use(express.json());
app.use(Cors());

app.use("/", route);
// app.use(errHandler)

app.listen(PORT, ()=> {
    console.log(`listening at http://localhost:${PORT}`);
});