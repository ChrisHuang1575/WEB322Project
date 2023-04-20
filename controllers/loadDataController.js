const express = require("express");
const router = express.Router();
const rentalList = require("../models/rentalModel");
let rentalModel = rentalList.rentalModel;
//insert all dummy data into mongodb
let msg = {};
//dummy data
var dummyRentals = [
    {
        headline: "Baylight Cabin",
        numSleeps: 2,
        numBedrooms: 1,
        pricePerNight: 199,
        city: "Haliburton",
        province: "Ontario",
        imageUrl: "Baylight-Winter.jpg",
        featuredRental: true
    },
    {
        headline: "Big Rock Cabin",
        numSleeps: 3,
        numBedrooms: 2,
        pricePerNight: 189,
        city: "Haliburton",
        province: "Ontario",
        imageUrl: "Cabinscape-Big-Rock.jpg",
        featuredRental: false
    },
    {
        headline: "Bluebell Cabin",
        numSleeps: 2,
        numBedrooms: 1,
        pricePerNight: 149,
        city: "Kirkfield",
        province: "Ontario",
        imageUrl: "BluebellHeader.jpg",
        featuredRental: true
    },
    {
        headline: "Bone Cabin",
        numSleeps: 3,
        numBedrooms: 1,
        pricePerNight: 199,
        city: "Haliburton",
        province: "Ontario",
        imageUrl: "Bone_Winter.jpg",
        featuredRental: false
    },
    {
        headline: "Burdock Cabin",
        numSleeps: 3,
        numBedrooms: 1,
        pricePerNight: 199,
        city: "Kirkfield",
        province: "Ontario",
        imageUrl: "BurdockCabin2.jpg",
        featuredRental: true
    },
    {
        headline: "Buttercup Cabin",
        numSleeps: 2,
        numBedrooms: 1,
        pricePerNight: 149,
        city: "Kirkfield",
        province: "Ontario",
        imageUrl: "Buttercup.jpg",
        featuredRental: false
    },{
        headline: "Callalily Cabin",
        numSleeps: 2,
        numBedrooms: 1,
        pricePerNight: 149,
        city: "Kirkfield",
        province: "Ontario",
        imageUrl: "Callalily.jpg",
        featuredRental: false
    }
];
router.get("/rentals",(req,res)=>{
    if (req.session && req.session.user && req.session.user.userType==='c'){
        rentalModel.count().then(count=>{
            if(count === 0){
                rentalModel.insertMany(dummyRentals)
                    .then(()=>{
                        msg = "Added rentals to the database";
                        res.render('rentals/msg',{
                            msg
                        });
                    })
                    .catch(err => {
                        res.send("Couldn't insert the documents: " + err);
                    });
            }
            else{
                msg = "Rentals have already been added to the database";
                        res.render('rentals/msg',{
                            msg
                        });
            }
        })
        .catch(err => {
            res.send("Couldn't count the documents: " + err);
        });
    }else{
        msg = "You are not authorized to add rentals";
        res.status(401).render('rentals/msg',{
            msg
        });
    }
})

module.exports = router;