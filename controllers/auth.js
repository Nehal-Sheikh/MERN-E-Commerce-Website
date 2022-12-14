const bcrypt = require('bcryptjs');
const { condition } = require('sequelize');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];                            //here we are storing the cookie value in the variable to use it in othe request, split and trim function helps to extract out only the required value and we are using array to point out the position of cookie at which it is in
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/login', {path: '/login', pageTitle: 'Login', csrfToken: req.csrfToken(), errorMessage: message});
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/signup', {path: '/signup', pageTitle: 'Signup', isAuthenticated: false, errorMessage: message})
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email})                                                             //here we are not writing code findById method because moongose will do it automatically it is defined in mongoose by default
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password!')
            return res.redirect('/login')
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {                                                                       //here we are using the save() because the frontend is not updating we have to refresh it to see the changes because sometimes database takes some more times to update the data and then we have difficulty in showing the updated data so this insures that first we update the date then show it
                    console.log(err);
                    res.redirect('/')
                });   
            }
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login')
        });  
    })
    .catch(err => console.log(err));
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')                                             //we can add here Max-Age=10 here 10 means in seconds, and we can also add secure in the place of HttpOnly
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})                                                                         //here we are comparing both the email that we are getting from the signup form page and from the database 
    .then(userDoc => {
        if (userDoc) {
            req.flash('error', 'E-Mail already Exists!')
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User ({
            email: email,
            password: hashedpassword,
            cart: {items: []}
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {                                                                          //here we are using destroy method which always takes an argument
        console.log(err);
        res.redirect("/");
    });
};