const express = require("express");
const router = express.Router();
const rentalList = require("../models/rentalModel");
const userList = require("../models/userModel");

// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", function (req, res) {
    res.render("general/home",{
        rentals: rentalList.getFeaturedRentals
    });
});

router.get("/cart",function(req,res){
    console.log(req.session.user)
    if (!req.session.user) {
        res.status(401)
        res.send("You are not authorized to view this page.")
    }
    else if(req.session.user.userType === 'c'){
        res.status(401)
        res.send("You are not authorized to view this page.")
    }
    else{
        res.render("general/cart")
    }
    
})

//set router of "logout" 
router.get("/logout",function(req,res){
    req.session.destroy();

    res.redirect("/user/login");
})
module.exports = router;