var express = require('express');
var Tag = require('../models/tags');
var User = require('../models/profile');
var Question = require('../models/question');
var router = express.Router();


router.get('/alltags', function(req, res) {
  Tag.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    }
    res.send(docs);
  });
});


router.post('/register', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc) {
      var obj = {
        code: 200,
        valMsg: 'username already exists'
      }
      res.send(obj);
    } else {
      var user = new User({
        username: req.body.username,
        password: req.body.password,
        tags: req.body.tags
      });
      user.save(function(err, saved) {
        if (err) {
          console.log(err);
        } else {
          var user = JSON.parse(JSON.stringify(saved))
          var obj = {
            code: 200,
            msg: 'Registered',
            id: user._id
          }
          res.send(obj);
        }
      })
    }
  });
});

router.get('/login', function(req, res) {
  User.findOne({ username: req.query.username, password: req.query.password }, function(err, doc) {
    if (err) {
      console.log(err);
    }
    var obj = {};
    if (doc) {
      var user = JSON.parse(JSON.stringify(doc))
      obj = {
        code: 200,
        msg: 'Logged In',
        id: user._id
      }
      res.send(obj);
    } else {
      obj = {
        code: 200,
        valMsg: 'Invalid Credentials'
      }
      res.send(obj);
    }
  });
});


router.post('/addQuestion', function(req, res) {
  var question = new Question({
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    user:req.body.user
  });
  question.save(function(err, saved) {
    if (err) {
      console.log(err);
    } else {
      var doc = JSON.parse(JSON.stringify(saved));
      var obj = {
        code: 200,
        msg: 'Question Posted',
        id: doc._id
      }
      res.send(obj);
    }

  })
});

router.get('/getQuestion', function(req, res) {
  Question.findOne({ _id: req.query.id }).populate("comments.postedBy").exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc) {
      res.send(doc);
    } else {
      res.send({});
    }
  })
});

router.post('/addComment', function(req, res) {
  Question.findOneAndUpdate({ _id: req.body.qId }, {
    "$push": {
      comments: {
        "text": req.body.comment,
        "postedBy": req.body.user_id
      }
    }
  }, { new: true }).populate("comments.postedBy").exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    res.send(doc);
  })
});

router.post('/addLike', function(req, res) {
  Question.findOneAndUpdate({ _id: req.body.qId, "comments._id": req.body.commentId }, {
    "$push": {
      "comments.$.likes": req.body.userId
    }
  }, { new: true }).populate("comments.postedBy").exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    res.send(doc);
  })
});

router.get('/relatedContent', function(req, res) {
  User.findOne({ _id: req.query.user }, { tags: 1, _id: 0 }).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc) {
      var obj = JSON.parse(JSON.stringify(doc));
      console.log(obj);
      Question.find({ tags: { "$in": obj.tags } }).exec(function(err, docs) {
        if (err) {
          console.log(err);
        }
        res.send(docs);
      })
    }
  })
});

router.get('/myContent', function(req, res) {
  console.log(req.query.user);
  Question.find({user:req.query.user},function(err,docs){
      if(err){
        console.log(err);
      }
      res.send(docs);
  })

});


module.exports = router;
