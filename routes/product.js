const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const middleware = require("../middleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});

router
  .route("/add/coverImage/:id")
  .patch(middleware.checkToken, upload.single("img"), (req, res) => {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          coverImage: req.file.path,
        },
      },
      { new: true },
      (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      }
    );
  });
router.route("/Add").post((req, res) => {
  const product = Product({
    //username: req.decoded.username,
    title: req.body.title,
    body: req.body.body,
  });
  product
    .save()
    .then((result) => {
      res.json({ data: result["_id"] });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
});


/*router.route("/getOwnBlog").get(middleware.checkToken, (req, res) => {
  Product.find({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});*/

router.route("/getProducts").get(middleware.checkToken, (req, res) => {
  Product.find(req.decoded.title, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  });
});

router.route("/delete/:id").delete((req, res) => {
  Product.findOneAndDelete(
    { id: req.params._id },
    /*{
      $and: [{ title: req.decoded.title }, { _id: req.params.id }],
    },*/
    (err, result) => {
      if (err) return res.json(err);
      else if (result) {
        console.log(result);
        return res.json("Product deleted");
      }
      return res.json("Product not deleted");
    }
  );
});
router.route("/update").put(middleware.checkToken,async(req, res)  => {
  let product = {};
  await Product.findOne({ _id: req.decoded._id}, (err, result) => {
    if (err) {
      product = {};
    }
    if (result != null) {
      profile = result;
    }
  });
  Product.findOneAndUpdate(
    { _id: req.decoded._id },
    
    {
      $set: {
        firstName: req.body.firstName ? req.body.firstName : profile.firstName,
        lastName: req.body.lastName
          ? req.body.lastName
          : profile.lastName,
        DOB: req.body.DOB ? req.body.DOB : profile.DOB,
        location: req.body.location ? req.body.location : profile.location,
        email: req.body.email ? req.body.email : profile.email,
        phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : profile.phoneNumber, //phoneNumber:""
      },
    },
    { new: true },
    (err, result) => {
      if (err) return res.json({ err: err });
      if (result == null) return res.json({ data: [] });
      else return res.json({ data: result });
    }
  );
});

module.exports = router;
