//Import Express
import express from "express"
//Import RestaurantsCtrl method
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

//Import Router
const router = express.Router()

//Establish test route 
    //Call RestaurantsCtrl method as home route
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)
    //Note - route will start with "/api/v1/restaurants" - start node server and test root route

//Create Routes to POST, PUT, and DELETE Reviews
router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router