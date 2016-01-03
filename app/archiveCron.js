var request = require('request');
var CronJob = require('cron').CronJob;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var moment = require('moment-timezone');

var ArchiveCron = function(config) {
  var url = '';

  function getDate() {
    return moment().tz('America/New_York').format('YYYY-MM-DD');
  }

  function init() {
    url = config.host;
    url = (config.port) ? url + ':' + config.port : url + ':8080';
  };

  function getAnnouncements(callback) {
    request(url + '/scraper', function (err, res, body) {
      if (!err && res.statusCode == 200) {
        callback(JSON.parse(body));
      }
    });
  }

  var insertDocuments = function(announcements, db, callback) {
    // Get the documents collection
    var collection = db.collection('announcements');
    // Insert some documents
    collection.insert(
      announcements
    , function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      console.log("Inserted 1 documents into the document collection");
      callback(result);
    });
  };

  function saveAnnouncements(announcements) {
    MongoClient.connect(config.mongoLabUri, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");

      insertDocuments(announcements, db, function() {
          db.close();
      });
    });
  }

  function doTask() {
    getAnnouncements(function(announcements) {
      console.log(announcements);
      saveAnnouncements(announcements);
    });
  }

  var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('announcements');
    // Find some documents
    collection.find({date: getDate()}).toArray(function(err, docs) {
      // assert.equal(err, null);
      // assert.equal(1, docs.length);
      if(docs.length != 1) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  function hasBeenDone(callback) {
    MongoClient.connect(config.mongoLabUri, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");

      findDocuments(db, function(isDone){
        db.close();
        callback(isDone);
      });
    });
  }

  this.setup = function() {
    init();

    // if after dyno wakes it has missed the cron job time
    hasBeenDone(function(isDone) {
      if(!isDone) {
        console.log('has not been done');
        doTask();
      }
    });

    try {
      var job = new CronJob({
        cronTime: '0 1 0 * * 0-6',
        onTick: function() {
          /*
           * Runs every day (Sunday through Saturday)
           * at 00:01:00 AM, 12:01:00 AM
           */
           doTask();
        },
        start: true,
        timeZone: 'America/New_York'
      });
      // job.start();
    } catch(ex) {
        console.log("cron pattern not valid");
    }

    return job;

  };

  return this;
};

module.exports = ArchiveCron;
