const Review = require("../models/reviewModel");
const Herb = require("../models/herbModel");

// Create a new review for a herb
exports.createReview = async (req, res) => {
  try {
    const { herbId, rating, comment } = req.body;
    const userId = req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    // Validate herbId
    const herb = await Herb.findById(herbId);
    if (!herb) {
      return res.status(404).json({ message: "Herb not found" });
    }

    const newReview = new Review({
      herbId,
      userId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({ message: "Review created successfully", newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all reviews for a specific herb
exports.getReviewsByHerb = async (req, res) => {
  try {
    const { herbId } = req.params;

    const herb = await Herb.findById(herbId);
    if (!herb) {
      return res.status(404).json({ message: "Herb not found" });
    }

    const reviews = await Review.find({ herbId }).populate("userId", "username email");
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a review (Admin/Review Author)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?._id || req.userId;

    // Find the review
    const review = await Review.findById(reviewId).populate("userId");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const reviewAuthorId = review.userId?._id?.toString() || review.userId?.toString();
    const isOwner = reviewAuthorId === userId?.toString();
    const isAdminUser = req.user?.role === 'admin';

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: "You are not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
