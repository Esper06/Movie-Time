const path = required("path"); //we bring in path
const express = required("express"); //we bring in express
const dbConnection = require("./config/connection"); //we bring in code from connection.js
const expbs = require('express-handlebars'); //enables us to use express-handlebars

const app = express(); //we create a variable to run express
const PORT = process.env.PORT || 3000; //we then set a port to be used. It's 3000 by default

app.engine('handlebars', expbs({ defaultLayout: 'main' })); //sets our engine to use the handlebars template engine. Then we bring in the expbs variable to invoke it as a function. We also set our main.handlebars as a basis for all our handlebars
app.set('view engines', 'handlebars'); //makes our engine look for handlebars files

app.use(express.json()); //Makes it so that we can take in json responses
app.use(express.urlencoded({ extended: true })); //Makes it so that we can take in special url characters
app.use(express.static(path.join(__dirname, "public"))); //Joins our current directory to public


//Routing
app.get('/', (req, res) => {
    res.render('main');
});


dbConnection.sync({ force: false }).then(() => { //connects to the database and logs out what port we are connected to
    app.listen(PORT, () => {
        console.log("Server listening on port " + PORT);
    });
});

