const express = require("express");
const router = express.Router();
const rentalList = require("../models/rentalModel");
const path = require("path");
const sgMail = require("@sendgrid/mail");

const ObjectId = require('mongodb').ObjectId;

router.get("/", (req, res) => {
    res.render("rentals/list", {
        rentals: rentalList.getAllRentals(),
        isUser : true
        
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
            rentals: rentalList.getAllRentals(),
            isUser : false
        })
    }
    ;
});

router.get("/featured",(req,res)=>{
    res.render("rentals/featuredRentals",{
        rentals: rentalList.getFeaturedRentals(),
        isUser : true

    });
});

router.get("/cityProvince",(req,res)=>{
    if (!req.session.user) {
        res.status(401);
        res.send("You are not authorized to view this page.")
    }
    else if (req.session.user.userType === 'c') {
        res.status(401);
        res.send("You are not authorized to view this page.")
    }else{
    res.render("rentals/cityProvince",{
        rentals: rentalList.getRentalsByCityAndProvince(),
        isUser : true
    });}
});

router.get("/load-data",(req,res)=>{
    res.render("rentals/loadDataPage",{
        rentals: rentalList.getAllRentals()
    })
})

//
router.post("/add",(req,res)=>{
    const {headline, numSleeps, numBedrooms, pricePerNight, city, province, imageUrl, featuredRental} = req.body;
    const newRental = new rentalList.rentalModel({headline, numSleeps, numBedrooms, pricePerNight, city, province, imageUrl, featuredRental});
    newRental.save()
        .then(rentalSaved =>{
            console.log(`Rental ${rentalSaved.headline} has been added to the database.`);
            console.log(req.files.imageUrl);
            // Create a unique name for the image, so that it can be stord in the file system.
            let uniqueName = `rental-pic-${rentalSaved._id}${path.parse(req.files.imageUrl.name).ext}`;
            // Copy the image data to a file in the "/assets/profile-pics" folder.
            req.files.imageUrl.mv(`assets/rentals-images/${uniqueName}`)
                .then(()=>{
                    // Update the document so it includes the unique name.
                    rentalList.rentalModel.updateOne({
                        _id: rentalSaved._id
                    }, {
                        "imageUrl": uniqueName
                    })
                        .then(() => {
                            // Success
                            console.log("Add the pic.");
                            res.redirect("/rentals/load-data");
                        })
                        .catch(err => {
                            console.log(`Error updating the user's profile picture ... ${err}`);
                            res.redirect("/rentals/load-data");
                        });
                })
            
        })
})

router.post("/edit/:id",(req,res)=>{
    const rentalID = req.params.id;
    console.log(rentalID);
    const {headline, numSleeps, numBedrooms, pricePerNight, city, province, imageUrl, featuredRental} = req.body;
    const objID = new ObjectId(rentalID)
    // Create a unique name for the image, so that it can be stord in the file system.
    let uniqueName = `rental-pic-${rentalID}${path.parse(req.files.imageUrl.name).ext}`;
    // Copy the image data to a file in the "/assets/profile-pics" folder.
    req.files.imageUrl.mv(`assets/rentals-images/${uniqueName}`)

    rentalList.rentalModel.updateOne(
        {_id:objID},
        {
            "headline" : headline, 
            "numSleeps" : numSleeps, 
            "numBedrooms" : numBedrooms, 
            "pricePerNight" : pricePerNight, 
            "city" : city, 
            "province" : province, 
            "imageUrl" : uniqueName, 
        })
        .then(() => {
            // Success
            console.log("Updated the rental.");
            res.redirect("/rentals/load-data");
        })
        .catch(err => {
            console.log(`Error updating the picture ... ${err}`);
            res.redirect("/rentals/load-data");
        });;
    
})

router.post("/delete/:id",(req,res)=>{
    const rentalID = req.params.id;
    console.log(rentalID);
    const objID = new ObjectId(rentalID);
    rentalList.rentalModel.deleteOne({_id:objID})
    .then(() => {
        console.log("Successfully deleted the document");
        res.redirect("/rentals/load-data");
    })
    .catch(err => {
        console.log(`Error deleting the document ... ${err}`);
        res.redirect("/rentals/load-data");
    });
})


//Cart module
//find a rental
const findRental = function(id){
    let rental = [];
    rentalList.rentalModel.find({_id:id})
        .then(data=>{
            rental = data.map(value=>value.toObject());
            console.log("find: "+rental);
            return rental;
        })  
}

//a function to prepare the view model
const prepareViewModel = function(req,msg){
    if(req.session && req.session.user){
        // The user is signed in and has a session established.
        
        let cart = req.session.cart || [];
        console.log("preCart:" + cart)
        // Used to store how much is owed.
        let cartTotal = 0;

        // Check if the cart has any rentals.
        const hasRentals = cart.length > 0;

        // If there are songs in the cart, then calculate the order total.
        if (hasRentals) {
            cart.forEach(cartRental => {
                cartTotal += cartRental.rental.pricePerNight * cartRental.qty * 1.1;  });
        }
        

        return {
            msg,
            hasRentals,
            rentals: cart,
            cartTotal: "$" + cartTotal.toFixed(2)
        };
    }
    else{
        // The user is not signed in, return the default information.
        return {
            msg,
            hasRentals : false,
            rentals : [],
            cartTotal : "$0.00"
        }
    }
}

//add rental route
router.get("/add-rental/:id",async (req,res)=>{
    //get the id of rental from req
    let msg;
    const rentalID = req.params.id;
    //toObjlize
    const objID = new ObjectId(rentalID);
    //check if user
    if (req.session.user) {
        // The user is signed in.
        let cart = req.session.cart = req.session.cart || [];
        
        // await rentalList.rentalModel.find({_id:objID})
        // .then(data=>{
        //     rental = data.map(value=>value.toObject());
        //     console.log("find: "+ rental);
        // })  
        const rental = await rentalList.rentalModel.findOne({_id:objID});
        console.log("add find: " + rental);
        if (rental) {
            //rental found in the database
            //search if the rental is already added
            let found = false;
            console.log("cart: "+cart);
            cart.forEach(cartRental=>{
                if (cartRental.id == rentalID) {
                    // Rental is already in the shopping cart.
                    found = true;
                    cartRental.qty++;
                    cartRental.subTotal = cartRental.qty * rental.pricePerNight
                    cartRental.VAT = cartRental.qty * rental.pricePerNight * 1.1
                }
            })

            if (found) {
                // Rental was found in the cart, +1 quantity.
                msg = "The rental was added to the cart, incremented quantity by one.";
            }
            else{
                // Rental was not found in the shopping cart.

                // Create a new object and add it to the cart.
                cart.push({
                    id: rentalID,
                    qty: 1,
                    VAT: rental.pricePerNight*1.1,
                    subTotal : rental.pricePerNight,
                    rental
                });
                console.log("create:" +cart )
                // Logic to sort the cart. Sort by artist name.
                cart.sort((a, b) => a.rental.headline.localeCompare(b.rental.headline));
                console.log("create:" +cart )
                msg = "The rental was added to the shopping cart.";
            }
        }
        else{
            // rental was not found in the database.
            msg = "The rental was not found in the database.";
        }

    }
    else{
        msg = "You should be logged in."
    }

    
    res.redirect("/cart");
});
router.post("/update-rental/:id",(req,res)=>{
    let n_qty = req.body.qty;
    console.log(n_qty);
    //get the id of rental from req
    const rentalID = req.params.id;
    // Check if the user is signed in.
    if (req.session.user){
        // The user is signed in.
        
        let cart = req.session.cart || [];

        // Find the index of the song in the shopping cart.
        const index = cart.findIndex(cartRental => cartRental.id == rentalID);
        if (index >= 0) {
            // Rental was found in the cart.
            
            cart[index].qty = n_qty;
            cart[index].subTotal = cart[index].rental.pricePerNight * n_qty;
            cart[index].VAT = cart[index].rental.pricePerNight * n_qty *1.1;
        }
    }
    res.redirect("/cart");
})

router.get("/delete-rental/:id",(req,res)=>{
    //get the id of rental from req
    const rentalID = req.params.id;
    // Check if the user is signed in.
    if (req.session.user){
        // The user is signed in.
        
        let cart = req.session.cart || [];

        // Find the index of the song in the shopping cart.
        const index = cart.findIndex(cartRental => cartRental.id == rentalID);
        if (index >= 0) {
            // Rental was found in the cart.
            cart.splice(index, 1);
        }
    }
    res.redirect("/cart");
})

router.get("/place-order",(req,res)=>{
    // Check if the user is signed in.
    if (req.session.user){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // The user is signed in.
        let cart = req.session.cart || [];
        let m_html;
        let email = req.session.user.email;
        let name = req.session.user.name;
        cart.forEach(cartRental=>{
            let VAT = cartRental.rental.pricePerNight*1.1;
            let subTotal = cartRental.rental.pricePerNight;
            m_html += `
            Hi ${name}<br>
            Here is your order details:
            Headline: ${cartRental.rental.headline} <br>
            City: ${cartRental.rental.city} <br>
            Province: ${cartRental.rental.province} <br>
            PricePerNight: ${cartRental.rental.pricePerNight} <br>
            Nights : ${cartRental.qty} <br>
            SubTotal : ${subTotal}<br>
            VAT : ${VAT}<br><br>
            `
        })
        console.log("html: "+m_html);
        const msg = {
            to: email,
            from: "yhuang291@myseneca.ca",
            subject: "Welcome Message!",
            html: m_html
                
        };
        sgMail.send(msg)
                        .then(() => {
                            console.log("sent!");
                            req.session.cart = [];
                            
                            res.redirect("/cart");
                        })
                        .catch(err => {
                            console.log(err);
                            console.log("not sent!");
                            res.render("general/cart", {
                                title: "cart",
                                rentals: cart
                            });
                        });
    }
})
module.exports = router;