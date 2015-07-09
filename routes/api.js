var express = require('express');
var router = express.Router();
var fs = require('fs');

var User = require('../models/user').User;
var Item = require('../models/user').Item;

function handleError(err, res){
    console.log(err.toString());
    res.sendStatus(404); // should it be 404?
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.sendStatus(403);
}

function isItemOwner(req, res, next){
    // request should have :item_id on the path
    Item.findOne({_id: req.params.item_id}).populate('owner').exec(function(err, item){
        if(err) return handleError(err, res);
        if(item.owner._id.toString() != req.user._id){
            res.sendStatus(403);
        }
        else next();
    });
}

router.use(isLoggedIn);

router
.get('/is_logged_in', function(req, res){
    res.json(req.user);
})
.get('/user_item', function(req, res){
    User
    .findOne({'email': req.user.email})
    .populate('items')
    .exec(function(err, user){
        if(err) return handleError(err, res);
        res.json(user.items);
    });
})
.post('/user_item', function(req, res){
    User.findOne({'email': req.user.email}, function(err, user){
        if(err) return handleError(err, res);
        var newItem = new Item({
            title: req.body.title,
            description: req.body.description,
            detail: req.body.detail,
            status: req.body.status,
            owner: user._id
        });
        var image = 'public/images/no_image_available.svg';
        console.log(req.body.image);
        if(req.body.image){
            console.log('yes?');
            var regex = /^data:.+\/(.+);base64,(.*)$/;
            var matches = req.body.image.match(regex);
            var ext = matches[1];
            var data = matches[2];
            var buffer = new Buffer(data, 'base64');
            image = 'tmp/data.' + ext;
            fs.writeFileSync(image, buffer);
        }
        newItem.attach('image', {path: image}, function(err){
            if(err) return handleError(err, res);
            newItem.save(function(err){
                if(err) return handleError(err, res);
                user.items.push(newItem._id);
                user.save();
                res.json(newItem);
            });
        });

    });
})
.get('/items', function(req, res){
    Item
    .find({status: 'on_sale'}, '_id title description detail owner image')
    .populate('owner', '_id name contacts')
    .exec(function(err, items){
        if(err) return handleError(err, res);
        res.json(items);
    });
})
.get('/full/item/:item_id', isItemOwner, function(req, res){
    Item.findOne({_id: req.params.item_id}).populate('owner').exec(function(err, item){
        if(err) return handleError(err, res);
        res.json(item);
    });
})
.get('/item/:item_id', function(req, res){
    Item
    .findOne({_id: req.params.item_id}, '_id title description detail image')
    .populate('owner', '_id name contacts')
    .exec(function(err, item){
        if(err) return handleError(err, res);
        res.json(item);
    });
})
.put('/item/:item_id', isItemOwner, function(req, res){ // do it with PATCH ??
    Item.findOne({_id: req.params.item_id}, function(err, item){
        if(err) return handleError(err, res);
        item.title = req.body.title || item.title;
        item.status = req.body.status || item.status;
        item.description = req.body.description || item.description;
        item.detail = req.body.detail || item.detail;
        if( req.body.actualPrice === 0) item.actualPrice = 0;
        else item.actualPrice = req.body.actualPrice || item.actualPrice;
        item.discount = req.body.discount || item.discount;

        item.soldDate = Date.now;

        item.save(function(err){
            if(err) return handleError(err, res);
            res.json(item);
        });
    });
})
.get('/get_my_info', function(req, res){
    User.findOne({_id: req.user._id}).exec(function(err, user){
        if(err) return handleError(err, res);
        res.json(user);
    });
})
.post('/contact', function(req, res){
    User.findOne({_id: req.user._id}).exec(function(err, user){
        if(err) return handleError(err, res);
        var contact = user.contacts.create({
            type: req.body.type,
            value: req.body.value
        });
        contact.save();
        user.contacts.push(contact);
        user.save();
        res.json(contact);
    });
})
.delete('/contact/:contactId', function(req, res){
    User.findOne({_id: req.user._id}).exec(function(err, user){
        if(err) return handleError(err, res);
        user.contacts.pull({_id: req.params.contactId});
        user.save(function(err){
            if(err) return handleError(err, res);
            res.json(user);
        });
    });
});

module.exports = router;