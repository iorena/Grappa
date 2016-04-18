"use strict";

const BaseModel = require("./base_model");

class Review extends BaseModel {
  constructor() {
    super("Review");
  }
  findAll(params) {
    if (typeof params !== "undefined") {
      return this.Models.Review.findAll({where: params});
    } else {
      return this.Models.Review.findAll();
    }
    return this.Models.Review.findAll({where: { UserId: 2 }});
    return this.Models.Review.findAll();
    return this.getModel().findAll();
    return this.Models.Review
      .findAll({
        // include: [this.Models.User],
      })
      .then(reviews => {
        console.log(reviews)
        return review;
      })
  }
  filterById(reviews, userId) {
    return reviews;
    return reviews.map(review => {
      if (review.UserId === userId) {
        return review;
      }
    })
  }
}

module.exports.class = Review;
module.exports = new Review();
