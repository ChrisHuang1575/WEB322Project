const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
const bcryptjs = require("bcryptjs");
//define schema
const userSchema = new mongoose.Schema({
    "name" : String,
    "email": String,
    "password": String,
    "userType": {"type": String, "default" : "u"},
});

//pre-encrypt the password
userSchema.pre("save",function(next){
    let user = this;
    bcryptjs.genSalt()
        .then(salt =>{
            bcryptjs.hash(user.password, salt)
                .then(hashedPwd=>{
                    user.password = hashedPwd;
                    next();
                })
                .catch(err=>{
                    console.log(`Error occurred when hasing ... ${err}`);
                })
        })
        .catch(err => {

            console.log(`Error occurred when salting ... ${err}`);
            
        });
})
//define model
const userModel = mongoose.model("users",userSchema);


//pull the data
let users = [];
userModel.find()
        .then(data=>{
            users = data.map(value=>value.toObject());
            console.log('users pull success!');
        });          


module.exports.addUser = function(req,res){
    
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

    
                
                let ifExist = false;
                //check if already exist
                for (let i = 0; i < users.length; i++) {
                    if (email === users[i].email){
                        ifExist = true;
                    }
                }

                if (!ifExist) {
                    const newUser = new userModel({
                        name,email, password
                    })
                    newUser.save()
                    .then(() => {
                        console.log("Created a user document for: " + name);
                    })
                    .catch(err => {
                        console.log("Couldn't create the user: " + name);
                        passedValidation = false;
                    });
                    
                }
                else{
                    
                    validationMessages.email = "Your email has been registered, please use another one.";
                    passedValidation = false;
                }
                 //if validation pass
                if (passedValidation) {
                    // Continue and submit contact us form.
                    //process.env.SENDGRID_API_KEY
                    //"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"
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
                             });
                        })
                        .catch(err => {
                            console.log(err);
                        
                            res.render("user/registration", {
                                title: "registion",
                                validationMessages,
                                values: req.body
                            });
                        });
                    
                    
                }else{//if not
                    res.render("user/registration",{
                        title: "registion",
                        validationMessages,
                        values: req.body
                    });
                }
}

module.exports.login = function(req,res){
    console.log(users);
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
    


    //check login without being encrypted
    // for (let i = 0; i < users.length; i++) {
    //     if (email === users[i].email) 
    //     {
    //         if (password === users[i].password) {
    //             passedValidation = true;
    //             validationMessages.email = {};
    //             break;
    //         }
    //         else
    //         {
    //             passedValidation = false;
    //             validationMessages.email = "Wrong password";
    //             break;
    //         }
    //     }
    //     else
    //     {
    //         passedValidation = false;
    //         validationMessages.email = "Your are not registered yet.";
    //     }
        
    // }

    
    if(passedValidation){
        
        //check encrypted password
        //pulling a user with email from db
        userModel.findOne({
            email: req.body.email
        })
            .then(user =>{
                //check if pulling success
                if (user) {
                    console.log("find!");
                    bcryptjs.compare(req.body.password, user.password)
                        .then(isMatched=>{
                            
                            //check the result if match
                            if (isMatched) 
                            {
                                //match!
                                //create a session and store the user object
                                console.log('match!')
                                req.session.user = user;
                                if (req.body.userType === user.userType) {
                                    //if this account is common user
                                    if (user.userType ==='u') {
                                        req.session.user.userType = ' '
                                        res.redirect("/cart")
                                    }
                                    else if (user.userType ==='c') {
                                        
                                        res.redirect("/rentals/list")
                                        
                                    }
                                }
                                else{
                                    //dont match user type
                                    console.log('user type dont match!')
                                    validationMessages.email ="Login in with wrong type!"
                                    res.render("user/login",{
                                    
                                    validationMessages ,
                                    values: req.body
                                })
                                }
                                
                            }
                            else
                            {   
                                //do not match!
                                console.log('dont match!')
                                validationMessages.password ="Password wrong!"
                                res.render("user/login",{
                                    
                                    validationMessages ,
                                    values: req.body
                                })
                            }
                        })
                }
                else
                {   
                    console.log('cant find')
                    validationMessages.email = "Email was not found in the database."
                    res.render("user/login",{
                        validationMessages,
                        values: req.body
                    })

                }
        })
    }
    else{
        res.render("user/login",{
            title: "Login",
            validationMessages,
            values: req.body
        });
    }
}