const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const token_key = process.env.TOKEN_KEY;

// import user model
const User = require('./../models/User');
const { findOne } = require('./../models/User');


// middleware setup
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      status: true,
      message: "Default User API Route."
    });
  }
);

router.post(
  "/register",
  [
    check("username").not().isEmpty().withMessage("Please enter your username").trim().escape(),
    check("password").not().isEmpty().withMessage("Please enter your password").trim().escape(),
    check("password1").not().isEmpty().withMessage("Please enter your re-type password").trim().escape(),
    check("email").isEmail().normalizeEmail().withMessage("Please enter your valid email"),
  ],
  (req, res) => {
    
    // check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = {};
      for (let index = 0; index < errors.array().length; index++) {
        error = {
          ...error,
          [errors.array()[index].param]: errors.array()[index].msg
        }

      }
      return res.status(400).json({
        status: false,
        message: "Form Vlidation Error",
        error: error
      });
    }
// validation compare
    if (req.body.password != req.body.password1) {
      return res.status(400).json({
        status: false,
        message: "Form Vlidation Error",
        error: {
          password1: "Re-type password is same as password"
        }
      });
    }

    // check user in database
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({
          status: false,
          message: "User already exists",
        });
      } else {
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // save new user
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
        })

        newUser.save().then(user => {
          return res.status(200).json({
            status: true,
            message: "User register success.",
            user: user
          });
        }).catch(error => {
          return res.status(502).json({
            status: true,
            message: "Database error.",
            error: {
              db_error: "some error in database"
            }
          });
        })
      }


    }).catch(error => {
      return res.status(502).json({
        status: true,
        message: "Database error.",
        error: {
          db_error: "some error in database"
        }
      });
    })

  }
);


module.exports = router;
