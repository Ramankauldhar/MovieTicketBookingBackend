const router = require("express").Router();
const Users = require("../model/users");
const bookingInfo = require("../model/ticketBooking");

//bcrypt to encrypt the password for security
const bcrypt = require("bcrypt");
//for security of email and pswd
const jwt = require("jsonwebtoken");
const validateUser = require('../middleware/ValidateUser');

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
          //"webBatch" is a secrate key where I want Jwt to hide the email and pswd .... if this will not be used, the user will not be able to login so it is hard to hack by hackers
          return res.json({
            success: true,
            token: token,
            email: user.email,
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

router.post("/bookticket", (req, res) => {
  const booking = new bookingInfo({
    email: req.body.email,
    movieTitle: req.body.movieTitle,
    showTime: req.body.showTime,
    noOfTickets: req.body.noOfTickets,
    totalPrice: req.body.totalPrice,
    seats: req.body.seats
  });
  booking
    .save()
    .then((_) => {
      res.json({ success: true, message: "Booking Done" });
    })
    .catch((err) => {
      res.json({ success: false, message: "Error: Can not book the ticket. All fields are required" });
    });
});

router.get("/bookings", validateUser, (req, res) => {
  const userEmail = req.body.email;
  console.log("email: "+ userEmail);
  // Find all bookings for the user with the specified email
  bookingInfo.find({email: userEmail})
    .exec()
    .then((bookings) => {
      res.json({ success: true, data: bookings});
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Server Error" });
    });
});


router.get("/profile", validateUser, (req, res) => {
  const u_id = req.userData.userEmail;

  Users.findById(u_id).exec().then((result) => {
    res.json({success:true, data:result});
  }).catch(error=>{
    res.json({success:false, message:"Server Error"});
  })
});


module.exports = router;