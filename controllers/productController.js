const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");

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

exports.getProductDetails = async(req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found",404))
    }

    res.status(200).json({
      success: true,
      product
    })
  }  catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

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
