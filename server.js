const path = require("path"); //we bring in path
const express = require("express"); //we bring in express
const dbConnection = require("./config/connection"); //we bring in code from connection.js

const app = express(); //we create a variable to run express
const PORT = process.env.PORT || 3000; //we then set a port to be used. It's 3000 by default

app.use(express.json()); //Makes it so that we can take in json responses
app.use(express.urlencoded({ extended: true })); //Makes it so that we can take in special url characters
app.use(express.static(path.join(__dirname, "public"))); //Joins our current directory to public


app.get("/",(req,res)=>{
    res.redirect("test1.html")
    console.log("hellow world")
})
// dbConnection.sync({ force: false }).then(() => { //connects to the database and logs out what port we are connected to
    app.listen(PORT, () => {
        console.log("Server listening on port " + PORT);
    });
// });

