const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);                       //here we are giving the an argument session 

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDbStore({                                                        //here we are configuring the mongodb to store the session in the database
    uri: 'mongodb://localhost:27017/test',
    collection: 'sessions'
})

app.set('view engine', 'pug');                                                           //here we are configuring the template engine
app.set('views', 'views');                                                               //here the first argument is telling that the views folder is changed by the second folder and the second argument is telling the other folder name.  we have to do this in case if we have folder name other than views

const adminRoutes = require('./routes/admin');                                             //here we are importing the route file
const shopRoutes = require('./routes/shop');                                               //here we are importing the route file
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))       //here we are setting up our session which is manage my express middleware
app.use((req, res, next) => {
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)                                                             //here we are not writing code findById method because moongose will do it automatically it is defined in mongoose by default
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);                                                           //here we are initializing our route middleware and the "/admin" means that the url first starts with /admin then the rest of the url continues
app.use(shopRoutes);                                                                      //here we are initializing our route middleware
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb://localhost:27017/test')
.then(result => {
    User.findOne().then(user => {                                                         //here findOne method is also predefined by default in mongoose . we are not giving any argument in findOne() so the findOne() will give all the available user
        if(!user){
            const user = new User({
                name: 'Max',
                email: 'Max@test.com',
                cart: {
                    items: []
                }
            });
            user.save()  
        }
    });
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
