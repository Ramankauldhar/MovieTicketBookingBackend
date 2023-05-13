const router = require("express").Router();
const Users = require("../model/users");
//bcrypt to encrypt the password for security
const bcrypt = require("bcrypt");
//for security of email and pswd
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  bcrypt.hash(req.body.pswd, 10, (err, hash) => {
    if (err) {
      return res.json({
        success: false,
        message: "Password can not be encypted",
      });
    } else {
      const user = new Users({
        fullName: req.body.fullName,
        email: req.body.email,
        pswd: hash,
      });
      user
        .save()
        .then((_) => {
          res.json({ success: true, message: "Account Has been created" });
        })
        .catch((err) => {
          if (err.code === 1100) {
            return res.json({
              success: false,
              message: "Email is already existed",
            });
          }
          res.json({ success: false, message: "Failed Authentication" });
        });
    }
  });
});

router.post("/login", (req, res) => {
  Users.find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result.length < 1) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }
      const user = result[0];
      bcrypt.compare(req.body.pswd, user.pswd, (err, ret) => {
        if (ret) {
          //payload will consume email and pswd`w22
          const payload = { userEmail: user._id };
          //Jwt(json web tokens) is used to generate a secrate-key to store email and password---- basically it will hide the email and password for security---- it will not be hacked
          // command: npm i jsonwebtoken --save
          //Jwt will provide a long encrypted string to hide the data
          const token = jwt.sign(payload, "webBatch");
          //webBatch is a secrate key where I want Jwt to hide the email and pswd .... if this will not be used, the user will not be able to login so it is hard to hack by hackers
          return res.json({
            success: true,
            token: token,
            message: "Login Successful",
          });
        } else {
          return res.json({
            success: false,
            message: "Email/Password does not match",
          });
        }
      });
    })
    .catch((err) => {
      res.json({ success: false, message: "Email/Password is wrong" });
    });
});
router.get("/profile", (req, res) => {});

module.exports = router;