//Set up Data Access Object

//Create a variable to store a reference to our database
let restaurants

//Create class with async methods
export default class RestaurantsDAO {
    //injectDB method will initially connect us to our Database. Called when our server initially runs.
    static async injectDB(conn) {
        //If restaurants is filled, simply return
        if (restaurants) {
            return
        }
        //If not already filled, we fill variable with a reference to our specific database.
            //Connect to database through our environmental variable
                //Connect to specific collection of database called "restaurants"
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        }catch (e) {
            console.error (
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }
    //getRestaurants will get all restaurants when called 
    static async getRestaurants({
        filters = null, // Can establish what filters we want - name, zip code, cuisine type
        page = 0, // Start on page 0
        restaurantsPerPage = 20, //Bring in 20 restaurants per page
    } = {}) {
        //Establish query variable for mongoDB search
        let query
        //Create conditional to assign selected filter to query
        if (filters) {
            if ("name" in filters) {
                query = {$text: {$search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": { $eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                 query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor
    }
}