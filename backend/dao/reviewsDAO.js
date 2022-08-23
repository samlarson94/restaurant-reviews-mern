//Import mongodb and get access to ObjectID (to convert string to a MongoDB object)
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

//Create ReviewsDAO Class
export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return
    }
    //If reviews has not been accessed already, create new connection to reviews collection in database
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

//ADD (POST) REVIEW 
  static async addReview(restaurantId, user, review, date) {
    try {
    //Create new reviewDoc
      const reviewDoc = { name: user.name,
          user_id: user._id,
          date: date,
          text: review,
          //Convert restaurant_id string to a MongoDB ObjectId
          restaurant_id: ObjectId(restaurantId), }
    //Insert review into Database
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }
    //Example of JSON body in POST request 
    // {
    //     "restaurant_id": "5eb3d668b31de5d588f4292a",
    //     "text": "Very Good Food!",
    //     "user_id": "1234",
    //     "name": "Sam"
    // }
    //Route: http://localhost:5001/api/v1/restaurants/review

//UPDATE (PUT) REVIEW
  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        //Look for review with the correct userID and reviewID/ObjectID.
        { user_id: userId, _id: ObjectId(reviewId)},
        //Set the new text and the new date.
        { $set: { text: text, date: date  } },
      )
    //Return the updated revieew
      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }
    //Example of JSON body in PUT Request
    // {
    //     "review_id":"6305210a2f1ba7837b039588",
    //     "name":"Sammy L",
    //     "user_id":"12345",
    //     "text":"Actually, jk. Food wasn't great.."
    // }
    //Endpoint: http://localhost:5001/api/v1/restaurants/review

//DELETE REVIEW 
  static async deleteReview(reviewId, userId) {

    try {
      const deleteResponse = await reviews.deleteOne({
        //Check for correct reviewId/ObjectId
        _id: ObjectId(reviewId),
        //Check that the user is the original poster
        user_id: userId,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

}