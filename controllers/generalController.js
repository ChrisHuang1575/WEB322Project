const express = require("express");
const router = express.Router();
const rentalList = require("../models/rentals-db");

// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", function (req, res) {
    res.render("general/home",{
        rentals: rentalList.getFeaturedRentals
    });
});

// setup another route to listen on /login
router.get("/login", function (req, res) {
    res.render("general/login");
});

// setup another route to listen on /regist
router.get("/regist", function (req, res) {
    res.render("general/regist");
});

// setup "post" route to listen on /login with data
router.post("/login", function (req, res) {
    console.log(req.body);
    //getting data from req object
    const { email, password } = req.body;
    //set indicate for validation
    let passedValidation = true;
    let validationMessages = {};
    //check the data if empty
    if(typeof email !== "string" || email.trim().length === 0){
        passedValidation = false;
        validationMessages.email = "Please enter your email.";
    }
    if(typeof password !== "string" || password.trim().length === 0){
        passedValidation = false;
        validationMessages.password = "Please enter your password.";
    }
    if(passedValidation){
        res.render("general/home",{
            values: req.body
        });
    }
    else{
        res.render("general/login",{
            title: "Login",
            validationMessages,
            values: req.body
        });
    }
    
});

//set rout of "regist" post 
router.post("/regist", function (req, res){
    //pattern for email and password validation
    let e_pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let p_pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;
    let passedValidation = true;
    let validationMessages = {};
    console.log(req.body);
    const {name, email, password, rep_password} = req.body;
    //check if empty for all data
    //name
    if(typeof name !== "string" || name.trim().length === 0){
        passedValidation = false;
        validationMessages.name = "Please enter your name.";
    }
    //email
    
    if(typeof email !== "string" || email.trim().length === 0){
        passedValidation = false;
        validationMessages.email = "Please enter your email.";
    }else if(!email.match(e_pattern)){
        //Email address validation
        passedValidation = false;
        validationMessages.email = "Your email is not vaild.";
    }

    //password
    if(typeof password !== "string" || password.trim().length === 0){
        passedValidation = false;
        validationMessages.password = "Please enter your password.";
    }else if(!password.match(p_pattern)){
        //Password validation
        
        passedValidation = false;
        validationMessages.password = "Your password is not vaild.";
    }

    //rep_password
    if(typeof rep_password !== "string" || rep_password.trim().length === 0){
        passedValidation = false;
        validationMessages.rep_password = "Please repeat your password.";
    }else if (rep_password !== password) {
        passedValidation = false;
        validationMessages.rep_password = "Repeated password is different.";
    }
  
    //if validation pass
    if (passedValidation) {
        // Continue and submit contact us form.
        const sgMail = require("@sendgrid/mail");
        console.log(process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: email,
            from: "yhuang291@myseneca.ca",
            subject: "Welcome Message!",
            html:
                `Welcome: ${name}<br>
                User's Email Address: ${email}<br>
                My name is Yongan Huang. Here is Rental Company BRIGHT!<br>
                `
        };

        sgMail.send(msg)
            .then(() => {
                res.render("general/welcome", {
                    title: "Welcome Page",
                    values: req.body
                 });;
            })
            .catch(err => {
                console.log(err);

                res.render("general/regist", {
                    title: "registion",
                    validationMessages,
                    values: req.body
                });
            });
        

    }else{//if not
        res.render("general/regist",{
            title: "Login",
            validationMessages,
            values: req.body
        });
    }
})

module.exports = router;