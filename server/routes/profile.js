var express = require('express');
var Tag = require('../models/tags');
var User = require('../models/profile');
var Question = require('../models/question');
var router = express.Router();

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey('AAAAMtWJJnw:APA91bGM56g5cU0HOIrCt7AP-TZhc-PNvHCKMiz1cQeFtaItBhfebaRDu8eaq5ZnfPL__WKBjv2To3LHjcdoiPeac8V86q96b1jnHGKt9TwdEFZXqGtFjkA1LNTztx011IddOsDziLtj');


const options = {
  gcmAPIKey: 'AAAAMtWJJnw:APA91bGM56g5cU0HOIrCt7AP-TZhc-PNvHCKMiz1cQeFtaItBhfebaRDu8eaq5ZnfPL__WKBjv2To3LHjcdoiPeac8V86q96b1jnHGKt9TwdEFZXqGtFjkA1LNTztx011IddOsDziLtj',
  vapidDetails: {
    subject: 'mailto:prituppalapati@gmail.com',
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey
  },
  TTL: 10,
  headers: {
    
  }
}

///push notifications logic

webpush.setVapidDetails(
  'mailto:prituppalapati@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

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
    user: req.body.user
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
      sendNotificationToAll(req.body.user, req.body.tags, doc)
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
      Question.find({ tags: { "$in": obj.tags } }).exec(function(err, docs) {
        if (err) {
          console.log(err);
        }
        res.send(docs);
      })
    }
  })
});

router.get('/relatedContentSearch', function(req, res) {
  User.findOne({ _id: req.query.user }, { tags: 1, _id: 0 }).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc) {
      var obj = JSON.parse(JSON.stringify(doc));
      Question.find({ 'title': { '$regex': req.query.search, '$options': 'i' }, tags: { "$in": obj.tags } }).exec(function(err, docs) {
        if (err) {
          console.log(err);
        }
        res.send(docs);
      })
    }
  })
});

router.get('/myContentSearch', function(req, res) {
  Question.find({ user: req.query.user, 'title': { '$regex': req.query.search, '$options': 'i' } }, function(err, docs) {
    if (err) {
      console.log(err);
    }
    res.send(docs);
  })
});


router.get('/myContent', function(req, res) {
  Question.find({ user: req.query.user }, function(err, docs) {
    if (err) {
      console.log(err);
    }
    res.send(docs);
  })

});

router.post('/subscription', function(req, res) {
  User.findOne({ _id: req.body.user, "subscription.endpoint": req.body.data.endPoint }, function(err, doc) {
    if (err) {
      console.log(err);
    }
    if (!doc) {
      User.findOneAndUpdate({ _id: req.body.user }, {
        "$push": {
          "subscription": {
            "endpoint": req.body.data.endPoint,
            "p256dh": req.body.data.keys.p256dh,
            "auth": req.body.data.keys.auth
          }
        }
      }, { new: true }).exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        res.send(doc);
      })
    } else {
      res.send({});
    }
  })
});

router.get('/getVpad', function(req, res) {
  res.send({val:vapidKeys.publicKey})
});


function sendNotificationToAll(user, tags, doc) {
  var obj={
    'docId':doc._id,
    'text':doc.title
  }
  User.find({ tags: { "$in": tags } }, { _id: 0, subscription: 1 }).exec(function(err, docs) {
    var arr = [];
    if (docs && docs.length > 0) {
      for (var i = 0; i < docs.length; i++) {
        for (var j = 0; j < docs[i].subscription.length; j++) {
          if (docs[i].subscription[j]) {
            arr.push(docs[i].subscription[j])
          }
        }
      }
      for (var k = 0; k < arr.length; k++) {
        if(arr[k].endpoint && arr[k].auth){
          var pushSubscription = {
            endpoint: arr[k].endpoint,
            keys: {
              auth: arr[k].auth,
              p256dh: arr[k].p256dh
            }
          };
          console.log(arr[k]);
          webpush.sendNotification(
            pushSubscription,
            JSON.stringify(obj),
            options
          ).then(function(err){
            console.log(err);
          });
          // webpush.sendNotification(pushSubscription, 'Your Push Payload Text').then(function(res){console.log(res)});
        }
      }
    }
  });
}

module.exports = router;
