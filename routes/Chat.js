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


// Desc: new chat insert api route
// Method: Post
// Access: Private
// URl: /api/chat/new

router.post(
    "/new",
    verifyToken,
    [
        check("message").not().isEmpty().withMessage("Please enter message").trim().escape(),
        check("team").not().isEmpty().withMessage("Please provide team id").trim().escape(),
        // check("to").not().isEmpty().withMessage("Please provide to id").trim().escape()
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


        // save new Chat 

        const newChat = new Chat({
            message: req.body.message,
            team: req.body.team,
            from: req.user.id
        })


        newChat.save().then(chat => {
            return res.status(200).json({
                status: true,
                message: "New chat message save...",
                chat: chat
            });
        }).catch(error => {
            return res.status(502).json({
                status: false,
                message: "Database error.",
                error: {
                    db_error: "some error in database"
                }
            });
        })
   }
);



// Desc: get user detail in a chat team api route
// Method: Post
// Access: Private
// URl: /api/chat/getTeamUser 

router.post(
    "/getTeamUser",
    verifyToken,
    [
        check("team").not().isEmpty().withMessage("Please enter team id").trim().escape()
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


        // get all chat team user

        Chat.find({team: req.body.team}).distinct("from").then(users =>{
            return res.status(200).json({
                status: true,
                message: "Tesm user id retreived..",
                users: users
            });
        }).catch(err =>{
            return res.status(502).json({
                status: false,
                message: "Database error.",
                error: {
                    db_error: "some error in database"
                }
            });
        })
   }
);



module.exports = router;
