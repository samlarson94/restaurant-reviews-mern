//Import RestaurantsDAO
import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
    //Call apiGetRestaurants and establish url query string
    static async apiGetRestaurants(req, res, next) {
        //Check if restaurantsPerPage exists, and then parse as an integer - if not, default is 20
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        //Check if a page number has been passed in
            //if true, convert it to an integer, if not default to be 0
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        //Check if filters have been passed in though URL
        let filters = {}
            // ex: if cuisine exists within the query
        if (req.query.cuisine) {
            // Set filters.cuisine value to the cuisine type
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        //Then, call get Restaurants method and pass in our established filters, page, and restaurants
            //This will take query information and provide back our restaurantsList and total number of restaurants as established in the method
        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page, 
            restaurantsPerPage
        })

        //Create a response to be sent back when the API URL is called
            //Establish key value pairs and send response as a json object
            let response = {
                restaurants: restaurantsList,
                page: page,
                filters: filters,
                entries_per_page: restaurantsPerPage,
                total_results: totalNumRestaurants,
              }
        //send response
        res.json(response)
    }
    
    //RESTAURANTS BY ID
    static async apiGetRestaurantById(req, res, next) {
        try {
        //Look for the id parameter in the url
          let id = req.params.id || {}
        //Assign restaurant by calling getRestaurantByID method and passing in id from parameter
          let restaurant = await RestaurantsDAO.getRestaurantByID(id)
          if (!restaurant) {
            res.status(404).json({ error: "Not found" })
            return
          }
          res.json(restaurant)
        } catch (e) {
          console.log(`api, ${e}`)
          res.status(500).json({ error: e })
        }
      }
    //RESTAURANT CUISINES
      static async apiGetRestaurantCuisines(req, res, next) {
        try {
        //Call getCuisines method to assign cuisines. No parameters needed.
          let cuisines = await RestaurantsDAO.getCuisines()
        //Respond with existing cuisines in json object
          res.json(cuisines)
        } catch (e) {
          console.log(`api, ${e}`)
          res.status(500).json({ error: e })
        }
      }
}
