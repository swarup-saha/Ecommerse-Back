const router = require("express").Router();
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const {
  verifyTokenAndAutherization,
  verifyTokenAndAdmin,
} = require("../utils/verifyToken");

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// CREATE
router.post("/create", async (req, res) => {
  var options = {
    amount: req.body.amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"),
  };
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();
    instance.orders.create(options, function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
      res.status(201).json(saveOrder);
    });
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const OrderUpdate = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(OrderUpdate);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has deleted successfully!");
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET User Order
router.get("/find/:userId", verifyTokenAndAutherization, async (req, res) => {
  try {
    const Order = await Order.find({ userId: req.params.userId });
    res.status(200).json(Order);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALL Order
router.get("/all/Orders", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Orders);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: prevMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
