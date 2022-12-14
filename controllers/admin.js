const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {                                               //we can use the same path url for any route we want if we have selected there different http method for both of them
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false});      //here we are giving different arguments for different functions the second argument is setting the page title as defualt and the third argument is setting the path wehere we are
};

exports.postAddProduct = (req, res, next) => {                                              //we can use the same path url for any route we want if we have selected there different http method for both of them 
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user});    //this creates the new product based on our model and in the userId we are only passing the req.user because mongoose will automatically pick the _id from there
    product.save()                                                                                              //we are writing the code for saving the product like we did in previous codes beacause mongoose will do it automatically
    .then(result => {
        console.log('Created product')
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err)
    });

};

exports.getEditProduct = (req, res, next) => {                                               //we can use the same path url for any route we want if we have selected there different http method for both of them 
    const editMode = req.query.edit;
    if (!editMode){
        return res.redirect('/');
    };
    const prodId = req.params.productId
    Product.findById(prodId)                                                                //here we again do not write code for findById() method because mongoose will automatically do it this method is defined in the mongoose by default
    .then(product => {
        if(!product){                                                                       //here we are checking that if there is no product then return to "/"
            return res.redirect('/');
        }
        res.render('admin/edit-product', {pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product});      //here we are giving different arguments for different functions the second argument is setting the page title as defualt and the third argument is setting the path wehere we are
    })
    .catch(err => {
        console.log(err)
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    
    Product.findById(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save()
    })
    .then(result => {
        console.log('Product Updated!');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err)
    });
}

exports.getProducts = (req, res, next) => {
    Product.find()                                                                                              //here we are not writing code for find() method because mongoose automatically do it this method is defined in the mongoose by default
    // .select('title price -_id')                                                                              //we can use these twi methods if we wanted a specific data or the complete data abot the user
    // .populate('userId', 'name')
    .then(products => {
        res.render('admin/products', {prods: products, pageTitle: 'Admin Products', path: '/admin/products'});
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postDeleteProducts = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
    .then(() => {
        console.log('Product Deleted!');
        res.redirect('/admin/products')
    })
    .catch(err => {
        console.log(err)
    })
}