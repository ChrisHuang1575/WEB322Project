const express = require("express");
const router = express.Router();
const rentalList = require("../models/rentalModel");
const userList = require("../models/userModel");

// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", function (req, res) {
    let isT = true;
    if(!req.session.user || req.session.user.userType === 'c') isT = false;
    res.render("general/home",{
        rentals: rentalList.getFeaturedRentals,
        isUser:isT
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
        let cart = req.session.cart || [];
         let cartTotal = 0;
         const hasRentals = cart.length > 0;
         // If there are songs in the cart, then calculate the order total.
        if (hasRentals) {
            cart.forEach(cartRental => {
                cartTotal += cartRental.rental.pricePerNight * cartRental.qty * 1.1;  });
        }
        res.render("general/cart",{
            hasRentals,
            rentals: cart,
            cartTotal: "$" + cartTotal.toFixed(2)
        })
    }
    
})

//set router of "logout" 
router.get("/logout",function(req,res){
    req.session.destroy();

    res.redirect("/user/log-in");
})
module.exports = router;