//Import app from server.js and mongoDB
import app from "./server.js"
import mongodb from "mongodb"
//Import and configure dotenv to be able to access environment variables
import dotenv from "dotenv"
dotenv.config()
//Import RestaurantsDAO and call methods in server connection to create initial reference to the restaurants colleciton in the database
import RestaurantsDAO from "./dao/restaurantsDAO.js"

//Get access to MongoClient to access database
const MongoClient = mongodb.MongoClient

//Create PORT number - access from env. If it can't be accessed, backup to port 8000
const port = process.env.PORT || 8000

//Connect to the database through MongoClient
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI, 
    {
        maxPoolSize: 50, // Amount of people who can access at once
        wtimeoutMS: 2500, //Set timeout for requests
        useNewUrlParser: true 
    }
)
//Catch any errors in console.log and then exit the process
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
//Then start up web server after DB has connected without errors
.then(async client => {
    // call restaurants DAO injectDB method and pass the client
        //Makes inital connection to our database
    await RestaurantsDAO.injectDB(client)
    //app.listen starts server at specified port
    app.listen(port, () => {
        console.log(`Listening on PORT ${port}`)
    })
})