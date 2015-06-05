var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var discount_t = 'n/a 0to15 15to30 30to50 50to70 70to100 100plus'.split(' ');

var itemSchema = Schema({
    title: String,
    status: String, // 'on_sale' or 'off_shelf'
    description: String,
    detail: String,
    date: {
        type: Date,
        default: Date.now
    },
    soldData: {
        type: Date,
        default: Date.now
    },
    actualPrice: {
        type: Number,
        default: 0
    },
    discount: {
        type: String,
        default: 'n/a',
        enum: discount_t
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

var contactSchema = Schema({
    type: String,
    value: String
});

var userSchema = Schema({
    email: String,
    password: String,
    name: String,
    contacts: [contactSchema],
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }]
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports.User = mongoose.model('User', userSchema);
module.exports.Item = mongoose.model('Item', itemSchema);