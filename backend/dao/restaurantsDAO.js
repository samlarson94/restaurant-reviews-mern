//Import mongodb and get access to ObjectID (to convert string to a MongoDB object)
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

// const ObjectId = mongodb.ObjectID
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
                query = { $text: { $search: filters["name"] } }
                    //Make sure to complete additional MongoDB text configuration.
            } else if ("cuisine" in filters) {
                query = {"cuisine": { $eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                 query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor

        try {
            //Find all restaurants in db that go along with the query passed in from query variable's conditional statement.
            cursor = await restaurants
                .find(query)
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`)
            //Return 0's for error - empty array and 0 restaurants
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
        //If there's no error, return the following
            //limit by restaurants by page (20) and skip to whatever page number we're at in the list.
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
        
        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return { restaurantsList, totalNumRestaurants }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }

    //GET RESTAURANT BY ID
    static async getRestaurantByID(id) {
        try {
        //Create pipeline to match different collections together
          const pipeline = [
            {
            //Match the id of a certain restaurant
                $match: {
                    _id: new ObjectId(id),
                },
            },
                //Lookup other items (reviews) and add to the $match result.
                    //Note: $lookup is part of the MongoDB aggregation pipeline
                        //Documents enter a multi-stage pipeline that transforms the documents into aggregated results
                  {
                      $lookup: {
                        //From the reviews collection, we create a pipeline that will match the restaurant id 
                            // and find all the reviews that match the restaurant id
                          from: "reviews",
                          let: {
                              id: "$_id",
                          },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$restaurant_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          //We then set the aggregated data to be called "reviews" as the result
                          as: "reviews",
                      },
                  },
                  //Add a new field called "reviews" that will populate in results
                  {
                      $addFields: {
                          reviews: "$reviews",
                      },
                  },
              ]
        //Collect all results together by aggregating the pipeline and return the restaurant w/ reviews connected.
          return await restaurants.aggregate(pipeline).next()
        } catch (e) {
          console.error(`Something went wrong in getRestaurantByID: ${e}`)
          throw e
        }
      }
      //Route Example Endpoint: http://localhost:5001/api/v1/restaurants/id/5eb3d668b31de5d588f42931
        //Pass in /id/<restaurant's _id> to see restaurant information and corresponding reviews in an array.
    
    //GET CUISINES
      static async getCuisines() {
        //Assign cuisines to take in multiple values as an array
        let cuisines = []
        try {
        //Use distinct method to search restaurants and find distinct cuisine types
            //By using .distinct, we will limit our search to finding only one of each distinct cuisine type
          cuisines = await restaurants.distinct("cuisine")
          return cuisines
        } catch (e) {
          console.error(`Unable to get cuisines, ${e}`)
          return cuisines
        }
      }
         //Route Example Endpoint: http://localhost:5001/api/v1/restaurants/cuisine
    }
