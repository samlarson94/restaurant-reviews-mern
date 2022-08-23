//Import ReviewsDAO
import ReviewsDAO from "../dao/reviewsDAO.js"

//Create ReviewsController Class with Post, Update, and Delete Methods
export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
    //Retrieve information directly from the body of the request
        //restaurant_id, review text, and user information
      const restaurantId = req.body.restaurant_id
      const review = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      //Add date of review
      const date = new Date()
      //Send to the addReview DAO
      const ReviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
    //Get the id of the review, text, and new date
      const reviewId = req.body.review_id
      const text = req.body.text
      const date = new Date()

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        //Include user_id to make sure it is the original poster who is updating the review
        req.body.user_id,
        text,
        date,
      )

      var { error } = reviewResponse
      if (error) {
        res.status(400).json({ error })
      }
      //Send error if the review was not updated
      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
    //For delete, use an url query parameter for reviewId
      const reviewId = req.query.id
      //Send user_id from body as a quick, light version of authentication (not standard) to check if it is the original poster who is deletiing the review
      const userId = req.body.user_id
      console.log(reviewId)
      const reviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}