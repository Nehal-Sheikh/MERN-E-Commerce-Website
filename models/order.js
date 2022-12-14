const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{                                                               //here as we can have a multiple products arranged in the array thats why we are implementing array method
        product: {type: Object, required: true},
        quantity: {type: Number, required: true}
    }],
    email: {
        name: {type:String, required: true},
        userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'}
    }
});

module.exports = mongoose.model('Order', orderSchema);