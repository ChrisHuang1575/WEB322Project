const mongoose = require("mongoose");
//dummy data
// var dummyRentals = [
//     {
//         headline: "Baylight Cabin",
//         numSleeps: 2,
//         numBedrooms: 1,
//         pricePerNight: 199,
//         city: "Haliburton",
//         province: "Ontario",
//         imageUrl: "Baylight-Winter.jpg",
//         featuredRental: true
//     },
//     {
//         headline: "Big Rock Cabin",
//         numSleeps: 3,
//         numBedrooms: 2,
//         pricePerNight: 189,
//         city: "Haliburton",
//         province: "Ontario",
//         imageUrl: "Cabinscape-Big-Rock.jpg",
//         featuredRental: false
//     },
//     {
//         headline: "Bluebell Cabin",
//         numSleeps: 2,
//         numBedrooms: 1,
//         pricePerNight: 149,
//         city: "Kirkfield",
//         province: "Ontario",
//         imageUrl: "BluebellHeader.jpg",
//         featuredRental: true
//     },
//     {
//         headline: "Bone Cabin",
//         numSleeps: 3,
//         numBedrooms: 1,
//         pricePerNight: 199,
//         city: "Haliburton",
//         province: "Ontario",
//         imageUrl: "Bone_Winter.jpg",
//         featuredRental: false
//     },
//     {
//         headline: "Burdock Cabin",
//         numSleeps: 3,
//         numBedrooms: 1,
//         pricePerNight: 199,
//         city: "Kirkfield",
//         province: "Ontario",
//         imageUrl: "BurdockCabin2.jpg",
//         featuredRental: true
//     },
//     {
//         headline: "Buttercup Cabin",
//         numSleeps: 2,
//         numBedrooms: 1,
//         pricePerNight: 149,
//         city: "Kirkfield",
//         province: "Ontario",
//         imageUrl: "Buttercup.jpg",
//         featuredRental: false
//     },{
//         headline: "Callalily Cabin",
//         numSleeps: 2,
//         numBedrooms: 1,
//         pricePerNight: 149,
//         city: "Kirkfield",
//         province: "Ontario",
//         imageUrl: "Callalily.jpg",
//         featuredRental: false
//     }
// ];

//define rentals schema and model
//rental schema
const rentalSchema = new mongoose.Schema({
    "headline": String,
    "numSleeps": Number,
    "numBedrooms": Number,
    "pricePerNight": Number,
    "city": String,
    "province": String,
    "imageUrl": String,
    "featuredRental": Boolean

});
//rentals model
const rentalModel = mongoose.model("rentals",rentalSchema);

//insert all dummy data into mongodb
module.exports.insertdummy = function(){    
for (let i = 0; i < dummyRentals.length; i++) {
    let headline = dummyRentals[i].headline;
    let numSleeps = dummyRentals[i].numSleeps;
    let numBedrooms= dummyRentals[i].numBedrooms;
    let pricePerNight= dummyRentals[i].pricePerNight;
    let city= dummyRentals[i].city;
    let province= dummyRentals[i].province;
    let imageUrl= dummyRentals[i].imageUrl;
    let featuredRental= dummyRentals[i].featuredRental;
    let newR = new rentalModel({
        headline,
        numSleeps,
        numBedrooms,
        pricePerNight,
        city,
        province,
        imageUrl,
        featuredRental,
    });
    newR.save()
        .then(() => {
            console.log("Created a name document for: " + headline);
            
        })
        .catch(err => {
            console.log("Couldn't create the name: " + headline);
            
        });
}
}


let rentals= [];
//pull the data
rentalModel.find()
        .then(data=>{
            rentals = data.map(value=>value.toObject());
            console.log('rentals pull success!');
        });


module.exports.getAllRentals = function(){
    return rentals;
    
}

module.exports.getFeaturedRentals = function(){
    let filtered = [];
    for (let i = 0; i < rentals.length; i++) {
        if (rentals[i].featuredRental) {
            filtered.push(rentals[i]);
        }
        
    }
    console.log(filtered);
    return filtered;
}

module.exports.getRentalsByCityAndProvince = function(){
    let filtered = [];

    //version 1
    // //get Kirkfield
    // for (let i = 0; i < rentals.length; i++) {
    //     if (rentals[i].city == "Kirkfield" && rentals[i].province == "Ontario") {
    //         filtered.push(rentals[i]);
    //     }
    // };
    // // get Haliburton
    // for (let i = 0; i < rentals.length; i++) {
    //     if (rentals[i].city == "Haliburton" && rentals[i].province == "Ontario") {
    //         filtered.push(rentals[i]);
    //     }
    // };
    //version 2
    // let tmp1 = {"cityProvince": "Kirkfield, Ontario","rentals": []};
    // let tmp2 = {"cityProvince": "Haliburton, Ontario","rentals": []};
    // for (let i = 0; i < rentals.length; i++) {
    //     if (rentals[i].city == "Kirkfield") {
    //         tmp1.rentals.push(rentals[i]);
    //     }
    // };
    // for (let i = 0; i < rentals.length; i++) {
    //     if (rentals[i].city == "Haliburton") {
    //         tmp2.rentals.push(rentals[i]);
    //     }
    // };
    // filtered.push(tmp1);
    // filtered.push(tmp2);
    //version3
    
    //get unique citys name
    let citys= [];
    rentals.forEach(r => citys.push(r.city));
    let uniCitys = citys.filter((value, index, array) => array.indexOf(value) === index);
    
    for (let i = 0; i < uniCitys.length; i++) {
        let tmp = {"cityProvince": uniCitys[i] + ", Ontario","rentals": []};
        for (let j = 0; j < rentals.length; j++) {
            if (uniCitys[i] == rentals[j].city) {
                tmp.rentals.push(rentals[j]);
            }
            
        }
        filtered.push(tmp);
        
    }
    console.log(rentals);
    console.log(filtered);
    return filtered;
    
}