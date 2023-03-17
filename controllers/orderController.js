const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");

// Create new Order
exports.newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get Single Order
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get logged in user  Orders
exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get all Orders -- Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// update Order Status -- Admin
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
      return next(
        new ErrorHander("You have already delivered this order", 400)
      );
    }

    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });

    async function updateStock(id, quantity) {
      const product = await Product.findById(id);

      product.Stock -= quantity;

      await product.save({ validateBeforeSave: false });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// delete Order -- Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }

    await order.remove();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
