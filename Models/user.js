const { MongoServerClosedError } = require('mongodb');
const mongoose = require('mongoose');
const passwordHash = require('password-hash');

let UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
       firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: Number,
    password: {
        type: String,
        required: true
    },
    about: String,
    token: {
        type: String,
        required: false,
        unique: true
    },
    type: {
        type: String,
        required: false,
        default: 'User'
    },
    currency: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        default: Date.now,
        required: false
    },
    profile: {        // single image attribute
        type: String,
        default: ''
    },
    top_seller: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    seller_request: {
        type: Boolean,
        default: false
    },
    seller_approval: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [{
            prod_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: false//
            },
            prod_name: {
                type: String,
                required: false//
            },
            prod_price: {
                type: Number,
                required: false//
            },
            qty: {
                type: Number,
                required: false//
            }
        }],
        totalPrice: Number
    },
    mobile_code:{
        type:String,
        required:false     
   },
});

UserSchema.methods.addToCart2 = function (product) {
    let cart = this.cart

    if (cart.items.length == 0) {
        cart.items.push({ prod_id: product._id, prod_name: product.name, prod_price: product.price, qty: 1 })
        cart.totalPrice = product.price;
    }
    else {
        const isExisting = cart.items.findIndex(objInItems => {
            return new String(objInItems.prod_id).trim() == new String(product._id).trim()
        })
        if (isExisting == -1) {
            cart.items.push({ prod_id: product._id, prod_name: product.name, prod_price: product.price, qty: 1 })
            cart.totalPrice += product.price
        }
        else {
            var existingProductInCart = cart.items[isExisting]
            existingProductInCart.qty += 1
            cart.totalPrice += product.price
        }
    }

    console.log('User in schema: ', this);
    return this.save();
}

UserSchema.methods.comparePassword = function (candidatePassword) {
    return passwordHash.verify(candidatePassword, this.password);
}

module.exports = mongoose.model("users", UserSchema);