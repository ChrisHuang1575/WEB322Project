#### Encrypt the password

1. Install the package

   ` npm install bcryptjs`

2. require the package

   ` const bcryptjs = require("bcryptjs");`

3. Generate a unique SALT(SALT: A random value)

4. Hash the password using the generated SALT

5. hashed!

​		

```javascript
userSchema.pre("save", function (next) {

  let user = this;

  // Generate a unique SALT.

  bcryptjs.genSalt()

    .then(salt => {

      // Hash the password using the generated SALT.

      bcryptjs.hash(user.password, salt)

        .then(hashedPwd => {

         // The password was hashed.

        user.password = hashedPwd;

          next();

        })

        .catch(err => {

          console.log(`Error occurred when hasing ... ${err}`);

        });

    })

    .catch(err => {

      console.log(`Error occurred when salting ... ${err}`);

    });

});
```



#### Compare the encrypted password

1.  Use findOne() pull the password from db
2. compare the password by bcrypt.compare(in_pwd,db_pwd);

```javascript
// Search MongoDB for the matching document (based on email address).

  userModel.findOne({

​    email: req.body.email

  })

​    .then(user => {

​      // Completed the search.

​      if (user) {

​        // Found the user document.

​        // Compare the password submitted to the password in the document.

​        bcrypt.compare(req.body.password, user.password)

​          .then(isMatched => {

​            // Done comparing passwords.

​            if (isMatched) {

​              // Passwords match.

​              // Create a new session and store the user object.

​              req.session.user = user;

​              res.render("user/login", {

​                errors

​              });

​            }

​            else {

​              // Passwords are different.

​              errors.push("Password does not match the database.");

​              console.log(errors[0]);

​              res.render("user/login", {

​                errors

​              });

​            }

​          })

​      }

​      else {

​        // User was not found.

​        errors.push("Email was not found in the database.");

​        console.log(errors[0]);

​        res.render("user/login", {

​          errors

​        });

​      }

​    })

​    .catch(err => {

​      // Couldn't query the database.

​      errors.push("Error finding the user in the database ... " + err);

​      console.log(errors[0]);

​      res.render("user/login", {

​        errors

​      });

​    });

});
```



####  Create session

1.  Install "express-session"

2. Require the module :

   ` require('express-session’); `

3. configure the middleware

```javascript
app.use(session({ secret: “…”, resave: false, saveUninitialized: true }));

app.use((req,res,next)=>{

  // After a session is created, inject data into views.

  res.locals.user = req.session.user;

  next();

});
```

- use ` req.session.user` to store or access session data
- use ` req.session.destroy()` to clear a session