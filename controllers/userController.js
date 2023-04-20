<<<<<<< HEAD
 const userList = require("../models/userModel");
=======
const userList = require("../models/userModel");
>>>>>>> 27e611deb30175551cb3d8b33f1e93e157ec766f
const express = require("express");
const router = express.Router();

// setup another route to listen on /log-in
router.get("/log-in", function (req, res) {
    res.render("user/login");
});

// setup another route to listen on /sign-up
router.get("/sign-up", function (req, res) {
    res.render("user/registration");
});

// setup "post" route to listen on /log-in with data
router.post("/log-in", function (req, res) {
    userList.login(req, res);
    
    
});

//set router of "regist" post 
router.post("/sign-up", function (req, res){
    //insert user into mongodb
    userList.addUser(req,res);
})








module.exports = router;