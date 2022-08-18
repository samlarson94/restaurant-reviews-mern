//Import Express
import express from "express"

//Import Router
const router = express.Router()

//Establish test route 
router.route("/").get((req, res) => res.send("hello world!"))
//Note - route will start with "/api/v1/restaurants" - start node server and test root route

export default router