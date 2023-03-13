const express = require("express");
const router = express.Router();
const rentalList = require("../models/rentals-db");

router.get("/", (req, res) => {
    res.render("rentals/list", {
        rentals: rentalList.getAllRentals()
    });
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


module.exports = router;