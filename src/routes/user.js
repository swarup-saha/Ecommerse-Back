const router = require("express").Router();
const User = require("../models/User");
const {
  verifyTokenAndAutherization,
  verifyTokenAndAdmin,
} = require("../utils/verifyToken");
const CryptoJS = require("crypto-js");

// UPDATE
router.put("/:id", verifyTokenAndAutherization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.Secret
    ).toString();
  }
  try {
    const userUpdate = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(userUpdate);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has deleted successfully!");
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET USER
router.get("/find/:id", verifyTokenAndAutherization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALL USER
router.get("/all/users", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
