var rentals = [
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

module.exports. getRentalsByCityAndProvince = function(){
    // let filtered1 = [];
    // let filtered2 = [];
    // let city1 = [];
    // let city2 = [];
    // let result = [];

    // //get Scugog
    // for (let i = 0; i < rentals.length; i++) {
    //     if (rentals[i].city == "Kirkfield" && rentals[i].province == "Ontario") {
    //         filtered1.push(rentals[i]);
    //     }
    // };
    // city1 = [{cityProvince:"Kirkfield, Ontario",rentals:filtered1}]
    
    // for (let i = 0; i < rentals.length; i++) {
    //     if (rentals[i].city == "Haliburton" && rentals[i].province == "Ontario") {
    //         filtered2.push(rentals[i]);
    //     }
    // };
    // city2 = [{cityProvince:"Haliburton, Ontario",rentals:filtered2}]
    // result.push(city1);
    // result.push(city2);

    // console.log(result);
    // return result;

    
    let filtered = [];
    //get Kirkfield
    for (let i = 0; i < rentals.length; i++) {
        if (rentals[i].city == "Kirkfield" && rentals[i].province == "Ontario") {
            filtered.push(rentals[i]);
        }
    };
    // get Haliburton
    for (let i = 0; i < rentals.length; i++) {
        if (rentals[i].city == "Haliburton" && rentals[i].province == "Ontario") {
            filtered.push(rentals[i]);
        }
    };
    console.log(filtered);
    return filtered;
    
}