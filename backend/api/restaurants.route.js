//Import Express
import express from "express"
//Import RestaurantsCtrl method
import RestaurantsCtrl from "./restaurants.controller.js"

//Import Router
const router = express.Router()

//Establish test route 
    //Call RestaurantsCtrl method as home route
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)
//Note - route will start with "/api/v1/restaurants" - start node server and test root route

export default router