const express = require("express");
const { createReview, getReviewsByHerb, deleteReview } = require("../controllers/reviewController");
const authenticateUser = require("../middleware/authMiddleware");
const { isAdmin, isContentCreator } = require("../middleware/adminMiddleware");

const router = express.Router();

// POST review routes
router.post("/", authenticateUser, createReview);
router.post("/reviews", authenticateUser, createReview);

// GET reviews for herb
router.get("/herb/:herbId", getReviewsByHerb);
router.get("/herbs/:herbId/reviews", getReviewsByHerb);
router.get("/:herbId", getReviewsByHerb);

// DELETE review
router.delete("/:reviewId", authenticateUser, deleteReview);
router.delete("/reviews/:reviewId", authenticateUser, deleteReview);

module.exports = router;
