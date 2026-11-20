// SETTINGAN RAILWAY
// process.env.NODE_ENV = 'production';
// require('dotenv').config();

// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 3000;
// const route = require("./routes");
// const bodyParser = require("body-parser");
// const Cors = require("cors");
// const path = require("path");
// // const errHandler = require("./middlewares/errHandler");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// app.use(express.urlencoded ({ extended : true }));
// app.use(express.json());
// app.use(Cors());

// app.use("/", route);
// const isRailway = process.env.RAILWAY_SERVICE_NAME;
// const uploadDir = isRailway ? "/app/uploads" : path.join(__dirname, "public/uploads");
// app.use('/uploads', express.static(uploadDir));
// // app.use(errHandler)

// app.listen(PORT, ()=> {
//     console.log(`listening at http://localhost:${PORT}`);
// });

// SETTINGAN VERCEL
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(Cors());

app.use("/", route);
// app.use(errHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
  });
}

module.exports = app;