var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');
var async = require('async');
var moment = require('moment');

var Scraper = function(config) {

  function getDate() {
    return moment().format('YYYY-MM-DD');
  }

  function getHTML(url) {
    return new Promise(function(resolve, reject) {
      request(url, function(err, res, html) {
        if(err) reject(new Error(err));
        resolve(html);
      });
    });
  }

  function getAllEvents($) {
    var categories = [];
    return new Promise(function(resolve, reject) {
      $('.announcement-category').each(function(i, element) {
        var cat = {};
        cat.type = $(this).children('h3').text();
        cat.events = [];

        $('div', this).children('p').each(function(i, element) {
          var evt = {};
          evt.name = $(this).text();
          evt.href = 'https://www.odu.edu' + $(this).children('a').attr('href');
          cat.events.push(evt);
        });

        categories.push(cat);
      });
      resolve(categories);
    });
  }

  function getType($, type) {
    return new Promise(function(resolve, reject) {
      $('.tab-content').each(function(i, element) {
        var title = $(this).children('h2').text();
        if(title.toLowerCase().indexOf(type) > -1) {
          getAllEvents(cheerio.load($(this).html())).then(function(categories) {
            resolve({
              type: type,
              categories: categories
            });
          });
        }
      });
    });
  }

  function getAnnouncements(html) {
    var json = {};
    return new Promise(function(resolve, reject) {
      var $ = cheerio.load(html);
      async.parallel([
        function(callback) {
          getType($, 'student').then(function(cat) {
            callback(null, cat);
          });
        },
        function(callback) {
          getType($, 'faculty').then(function(cat){
            callback(null, cat);
          });
        }
      ],
      function(err, res){
        json.announcements = res;
        json.date = getDate();
        resolve(json);
      });
    });
  }

  function scrape(url) {
    return new Promise(function(resolve, reject) {
      getHTML(url).then(function(html) {
        getAnnouncements(html).then(function(data) {
          resolve(data);
        });
      }).catch(function(err) {
        reject(new Error(err));
      });
    });
  }

  return {
    getAnnouncementsJSON: function() {
      return new Promise(function (resolve, reject) {
        scrape(config.announcementUrl).then(function(data){
          resolve(data);
        }).catch(function(err){
          reject(err);
        });
      });
    }
  }
};

module.exports = Scraper;
