const path = require("path"); //we bring in path
const express = require("express"); //we bring in express
const expressLayouts = require("express-handlebars"); //enables us to use express-handlebars
const dbConnection = require("./config/connection"); //we bring in code from connection.js
const app = express(); //initializse app variable with express

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const PORT = process.env.PORT || 3000; //we then set a port to be used. It's 3000 by default
const routes = require("./controllers");
const helpers = require("./utils/helpers");

const hbs = expressLayouts.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars"); //makes our engine look for handlebars files

app.use(cookieParser());

const sess = {
  name: "session",
  secret: "This is my Movie Time app keep it secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  // Cookie Options
  maxAge: 60 * 60 * 1000,
  store: new SequelizeStore({
    db: dbConnection,
  }),
};
// connect to flash
app.use(flash());

// Globar variables
app.locals.pageActive="";
// app.use((req, res, next) => {
//   res.locals.profile_msg = req.flash("profile_msg");
//   res.locals.search_msg = req.flash("search_msg");

//   next();
// });

app.use(session(sess));

app.use(express.json()); //Makes it so that we can take in json responses
app.use(express.urlencoded({ extended: true })); //Makes it so that we can take in special url characters
app.use(express.static(path.join(__dirname, "public"))); //Joins our current directory to public

app.use(routes);

dbConnection.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  })
});
