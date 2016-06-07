"use strict";

const BaseModel = require("./base_model");

class Review extends BaseModel {
  constructor() {
    super("Review");
  }
  findAllByRole(user) {
    if (user.role === "admin" || user.role === "print-person") {
      return this.Models.Review.findAll();
    } else if (user.role === "professor") {
      return this.Models.Review.findAll({ where: { UserId: user.id } });
    } else if (user.role === "instructor") {
      return this.Models.Thesis
        .findOne({ where: { UserId: user.id } })
        .then(thesis => this.Models.Review.findOne({ where: { ThesisId: thesis.id } }));
    }
  }
  findAll(params) {
    if (typeof params !== "undefined") {
      return this.Models.Review.findAll({ where: params });
    } else {
      return this.Models.Review.findAll();
    }
  }
  filterById(reviews, userId) {
    return reviews;
    return reviews.map(review => {
      if (review.UserId === userId) {
        return review;
      }
    });
  }
}

module.exports.class = Review;
module.exports = new Review();
