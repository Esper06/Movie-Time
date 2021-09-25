const path = require("path"); //we bring in path
const express = require("express"); //we bring in express
const expressLayouts = require("express-handlebars"); //enables us to use express-handlebars
const dbConnection = require("./config/connection"); //we bring in code from connection.js

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express(); //initializse app variable with express
const PORT = process.env.PORT || 3000; //we then set a port to be used. It's 3000 by default
const routes = require("./controllers");
const helpers = require("./utils/helpers");

const hbs = expressLayouts.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars"); //makes our engine look for handlebars files

const sess = {
  name: "session",
  secret: "it is my movie tracker keep the secret",
  cookie: {},
  resave: true,
  saveUninitialized: true,
  // Cookie Options
  maxAge: 60 * 60 * 1000, // 1 hours
  store: new SequelizeStore({
    db: dbConnection,
  }),
};

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
