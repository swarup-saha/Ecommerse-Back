const router = require("express").Router();
var crypto = require("crypto");

router.post("/payment/verify", (req, res) => {
  try {
    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    var response = { signatureIsValid: "false" };
    if (expectedSignature === req.body.response.razorpay_signature)
      response = { signatureIsValid: "true" };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error!",
    });
  }
});

module.exports = router;
