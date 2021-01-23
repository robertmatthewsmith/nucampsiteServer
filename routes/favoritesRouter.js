const express = require('express');
const Favorite = require('../models/favorites')
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('campsite.user')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
        .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne( { user: req.user._id })
    .then((favorite) => {
        if (!favorite) {
            Favorite.create( { user: req.user._id, campsites: req.body})
            .then((favorite) => {
                res.statusCode = 200;
                res.jason(favorite);
            });
        }
        req.body.map((favor) => {
            if(!favorite.campsites.includes(fav._id)) {
                favorite.campsites.push(favor);
            }
        });
        favorite.save()
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        });
    })
        .catch(err = next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status = 403;
    res.send('PUT not supported');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
        .then(response => {
            res.statusCode = 200;
            res.jason(response);
        })
        .catch(err = next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status = 403;
    res.send('GET not supported');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite) {
            if (!favorite) {
                Favorite.create({user: req.user._id,
                    campsites: [{ _id: req.params.campsiteId }], })
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                      }); 
                    })
            }
        }
    }


})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status = 403;
    res.send('PUT not supported');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

})

module.exports = favoriteRouter;

