const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const ApiFeature = require("../utils/apifeatures");

// Create Products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Get ALL Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const resultPerPage = 5;

    const apiFeature = new ApiFeature(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Get All Product (Admin)
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Get Product Details

exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Update Product ---Admin

exports.updateProduct = async (req, res, next) => {
  try {
    let product = Product.findById(req.params.id);

    if (!product) {
      res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Delete Product

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product Delete Successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Create new Review or Update Review

exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Get All Reviews of a product

exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(400).json({
        message: "Product not Found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Delete Review

exports.deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(400).json({
        message: "Product not Found",
      });
    }
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
