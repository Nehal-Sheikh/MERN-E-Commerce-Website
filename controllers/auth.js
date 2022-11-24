const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];                            //here we are storing the cookie value in the variable to use it in othe request, split and trim function helps to extract out only the required value and we are using array to point out the position of cookie at which it is in
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {path: '/login', pageTitle: 'Login', isAuthenticated: false});
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {path: '/signup', pageTitle: 'Signup', isAuthenticated: false})
};

exports.postLogin = (req, res, next) => {
    User.findById('635dafbb21a73226342325f5')                                                             //here we are not writing code findById method because moongose will do it automatically it is defined in mongoose by default
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {                                                                       //here we are using the save() because the frontend is not updating we have to refresh it to see the changes because sometimes database takes some more times to update the data and then we have difficulty in showing the updated data so this insures that first we update the date then show it
            console.log(err);
            res.redirect("/");
        })   
    })
    .catch(err => console.log(err));
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')                                             //we can add here Max-Age=10 here 10 means in seconds, and we can also add secure in the place of HttpOnly
};

exports.postSignup = (req, res, next) => {

};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {                                                                          //here we are using destroy method which always takes an argument
        console.log(err);
        res.redirect("/");
    });
};