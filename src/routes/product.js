const router = require("express").Router();
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");

// CREATE
router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const saveProduct = await newProduct.save();
    res.status(201).json(saveProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const productUpdate = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(productUpdate);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has deleted successfully!");
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALL Product
router.get("/all/products", async (req, res) => {
  const qNew = req.query?.new;
  const qCategory = req.query?.category;
  try {
    let product;
    if (qNew) {
      product = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      product = await Product.find({
        categories: { $in: [qCategory] },
      });
    } else {
      product = await Product.find();
    }
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
