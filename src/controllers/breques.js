const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');


//import database models
const Breque = require('../models/breque.js');
const User = require('../models/user.js');


exports.breques_get_all = (req, res, next) => {
    Breque.find()
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            breques: docs
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.breques_get_one = (req, res, next) => {
    Breque.find({brequeId: req.params.brequeId})
    .exec()
    .then(breque => {
        if (!breque || breque.length < 1) {
            return res.status(404).json({ 
                message: 'Breque not found'
            });
        }

        res.status(200).json({
            breque: breque
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}



exports.breques_get_random = (req, res, next) => {
    // Get the count of all users
    Breque.find().select('brequeId').exec()
    .then(items => {
        var playlistItems = shuffle(items).map((breque)=>{
            return breque.brequeId
        }); //return an shuffled array with brequeId. ex [3,1,5,4,2]

        res.status(200).json({
            shuffledItems: playlistItems
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.breques_add = async (req, res, next) => {
    console.log('add');
    
    try{
        //creating breque and saving
        const breque = new Breque({
            _id: new mongoose.Types.ObjectId(), //string
            title: req.body.title,
            youtubeUrl: req.body.youtubeUrl,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            user: req.body.userId,
            categories: req.body.categories
        });
        breque.save();

        return res.status(200).json({
            message: "breque created",
            breque: breque
        });

    } catch {
        return res.status(200).json({
            message: "breque creation failed",
            breque: breque
        });
    }
}