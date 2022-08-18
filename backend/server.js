//Import express, cors, and restaurants route file
import express from 'express'
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

//Set up express server
const app = express()

//Add Middleware - Cors module
app.use(cors())
//Set up express.json to allow server to read json requests
app.use(express.json())

//Set up initial routes - others in routes folder
app.use("/api/v1/restaurants", restaurants)
//Redirect route - * to signify any other route thats not established
app.use("*", (req, res) => res.status(404).json({error: "oh dear, this route could not be found!"}))

//Export app as a module
export default app
