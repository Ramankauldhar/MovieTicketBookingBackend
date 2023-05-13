const router = require("express").Router();
const Users = require("../model/users");
//bcrypt to encrypt the password for security
const bcrypt = require("bcrypt");

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
  res.json("Register Work");
});


module.exports = router;