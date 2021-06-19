const express = require('express');
const router = express.Router()
const { check, validationResult } = require('express-validator');
const verifyToken = require('./../middlewares/verify_token');

// import user model
const User = require('./../models/User');
const Team = require('./../models/Team')
const Chat = require('./../models/Chat')

// middleware setup
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get(
    "/",
    (req, res) => {
        return res.status(200).json({
            status: true,
            message: "Default Chat API Route."
        });
    }
);



module.exports = router;
