const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
    Product.find()                                                                                                   //here we are not writing code for find() method because mongoose automatically do it this method is defined in the mongoose by default
    .then(products => {
        res.render('shop/product-list', {prods: products, pageTitle: 'All Products', path: '/products'});          //in this 'shop/product-list' link the shop is the folder in the views folder and the product-list is the file in the shop folder
    })
    .catch(err => {
        console.log(err)
    })
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)                                                                  //here we again do not write code for findById() method because mongoose will automatically do it this method is defined in the mongoose by default
    .then(product => {
        res.render('shop/product-detail', {product: product, pageTitle: product.title, path: '/products'})
    })
    .catch(err => {
        console.log(err)
    });
};
    
exports.getIndex = (req,res, next) => {
    Product.find()
    .then(products => {
        // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1]; 
        res.render('shop/index', {prods: products, pageTitle: 'Shop', path: '/'});
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')                                                   //populate() method does not give a promise in the earlier versions of mongoose but after mongoose 6 populate() does give the promise. before the mongoose verion 6 we have to use execPopulate() populate() method to give the promise
    .then(user => {
        const products = user.cart.items;
        res.render('shop/cart', {pageTitle: 'Your Cart', path: '/cart', products: products});
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
    .then(result => {
        res.redirect('/cart')
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')                                                   //populate() method does not give a promise in the earlier versions of mongoose but after mongoose 6 populate() does give the promise. before the mongoose verion 6 we have to use execPopulate() populate() method to give the promise
    .then(user => {
        console.log(user.cart.items);
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: { ...i.productId._doc }};                              //here we are using map() to map our data to the new variables becuase we have some nested data in the database
        });
        const order = new Order({                                                                 //here we are creating new order Object by using order model constructor
            user: {
                email: req.user.email,                                                              //here req.user gives the complete user object fetched from the database so it haves all the data about the user
                userId: req.user
            },
            products: products
        });
        return order.save()
    })                                                                
    .then(result => {
        return req.user.clearCart();
    })
    .then( () => res.redirect('/orders') )
    .catch(err => {
        console.log(err)
    });
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id})
    .then(orders => {
        res.render('shop/orders', {pageTitle: 'Your Orders', path: '/orders', orders: orders});
    })
    .catch(err => {
        console.log(err)
    })
};
                                                                                              //here we are giving different arguments for different functions the second argument is setting the page title as defualt and the third argument is setting the path wehere we are
exports.getCheckout = (res, req, next) => {
    res.render('shop/checkout', {pageTitle: 'Checkout', path: '/checkout'});
};
