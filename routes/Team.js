const express = require('express');
const router = express.Router()
const { check, validationResult } = require('express-validator');
const verifyToken = require('./../middlewares/verify_token');

// import user model
const User = require('./../models/User');
const Team = require('./../models/Team')


// middleware setup
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get(
    "/",
    (req, res) => {
        return res.status(200).json({
            status: true,
            message: "Default Team API Route."
        });
    }
);

// all team details

router.get(
    "/all",
    (req, res) => {
        Team.find({}, {__v:0, createdAt:0}).populate("user", ["username"]).then(teams => {
            return res.status(200).json({
                status: true,
                message: "All team data",
                team: teams
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

// my team

router.get(
    "/my",
    verifyToken,
    (req, res) => {
        Team.find({user: req.user.id}, {_id:0, __v:0, createdAt:0}).populate("user", ["username"]).then(teams => {
            return res.status(200).json({
                status: true,
                message: "User all team data",
                team: teams
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


// team route

router.post(
    "/new",
    verifyToken,
    [
        check("name").not().isEmpty().withMessage("Please enter team name").trim().escape(),
        check("description").not().isEmpty().withMessage("Please enter description").trim().escape()
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

        // save new team 

        const newTeam = new Team({
            name: req.body.name,
            description: req.body.description,
            user: req.user.id
        })


        newTeam.save().then(team => {
            return res.status(200).json({
                status: true,
                message: "New team created successfuly...",
                team: {
                    name: team.name,
                    description: team.description,
                    user_id: team.user
                }
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



module.exports = router;
