const mongoose = require("mongoose");


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

module.exports = {
    rentalModel : rentalModel
}

//module.exports.insertdummy = function(res,req){
    
    
// for (let i = 0; i < dummyRentals.length; i++) {
//     let headline = dummyRentals[i].headline;
//     let numSleeps = dummyRentals[i].numSleeps;
//     let numBedrooms= dummyRentals[i].numBedrooms;
//     let pricePerNight= dummyRentals[i].pricePerNight;
//     let city= dummyRentals[i].city;
//     let province= dummyRentals[i].province;
//     let imageUrl= dummyRentals[i].imageUrl;
//     let featuredRental= dummyRentals[i].featuredRental;
//     let newR = new rentalModel({
//         headline,
//         numSleeps,
//         numBedrooms,
//         pricePerNight,
//         city,
//         province,
//         imageUrl,
//         featuredRental,
//     });
//     newR.save()
//         .then(() => {
//             console.log("Created a name document for: " + headline);
            
//         })
//         .catch(err => {
//             console.log("Couldn't create the name: " + headline);
            
//         });
// }



let rentals= [];

rentalModel.find()
    .then(data=>{
        rentals = data.map(value=>value.toObject());
        console.log('rentals pull success!');
    });

//pull the data
function pullRentals(){
    rentalModel.find()
    .then(data=>{
        rentals = data.map(value=>value.toObject());
        console.log('rentals pull success!');
    });
}



module.exports.getAllRentals = function(){
    pullRentals();
    return rentals;
    
}

module.exports.getFeaturedRentals = function(){
    pullRentals();
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
    pullRentals();
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