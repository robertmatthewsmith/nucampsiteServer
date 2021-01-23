const express = require('express');
const Favorite = require('../models/favorites')
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsites')
      .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      })
      .catch(err => next(err));

})
.post(
    cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
      Favorite.findOne({ user: req.user._id })
        .then(favorite => {
          if (favorite) {
            req.body.forEach(fav => {
              if (!favorite.campsites.includes(fav._id)) {
                favorite.campsites.push(fav._id);
              }
            });
            favorite.save().then(favorite => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            });
          } else {
            Favorite.create({ user: req.user._id, campsites: req.body });
          }
        })
        .catch(err => next(err));
    }
  )
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status = 403;
    res.send('PUT not supported');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
        .then(response => {
            res.statusCode = 200;
            res.json(response);
        })
        .catch(err => next(err));
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
        if (!favorite) {
          Favorite.create({user: req.user._id,
            campsites: [{ _id: req.params.campsiteId }], })
         .then((favorite) => {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          });
        } else if (!favorite.campsites.includes(req.params.campsiteId)) {
          favorite.campsites.push(req.params.campsiteId);
          favorite.save().then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          });
        } else {
          res.send("Campsite already favorited");
        }
      })
      .catch((error) => next(error));
  })
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status = 403;
    res.send('PUT not supported');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorite => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index >= 0) {
            favorite.campsites.splice(index, 1);
          }
          favorite.save()
            .then(favorite => {
              Favorite.findById(favorite._id).then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              });
            })
            .catch(err => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
        }
      })
      .catch(err => next(err));
  });


module.exports = favoriteRouter;

