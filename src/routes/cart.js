const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyTokenAndAutherization,
  verifyTokenAndAdmin,
} = require("../utils/verifyToken");

// CREATE
router.post("/create", verifyTokenAndAutherization, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const saveCart = await newCart.save();
    res.status(201).json(saveCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    const cartUpdate = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(cartUpdate);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has deleted successfully!");
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET User Cart
router.get("/find/:userId", verifyTokenAndAutherization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALL Cart
router.get("/all/Carts", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
