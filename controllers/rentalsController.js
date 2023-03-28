const express = require("express");
const router = express.Router();
const rentalList = require("../models/rentalModel");

router.get("/", (req, res) => {
    res.render("rentals/list", {
        rentals: rentalList.getAllRentals()
    });
});

router.get("/list", (req, res) => {
    console.log(req.session.user)
    if (!req.session.user) {
        res.status(401);
        res.send("You are not authorized to view this page.")
    }
    else if (req.session.user.userType === 'u') {
        res.status(401);
        res.send("You are not authorized to view this page.")
    }
    else
    {
        res.render("rentals/list", {
            rentals: rentalList.getAllRentals()
        })
    }
    ;
});

router.get("/featured",(req,res)=>{
    res.render("rentals/featuredRentals",{
        rentals: rentalList.getFeaturedRentals()
    });
});

router.get("/cityProvince",(req,res)=>{
    
    res.render("rentals/cityProvince",{
        rentals: rentalList.getRentalsByCityAndProvince()
    });
});

router.get("/dummy",()=>{
    rentalList.insertdummy();
})

module.exports = router;