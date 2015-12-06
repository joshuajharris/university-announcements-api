var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');

function getHTML(url) {
  return new Promise(function(resolve, reject) {
    try {
      var options = {
        method: 'GET',
        url: url
      };
      request(options, function(err, res, data) {
        if (err) reject(err);
        if (res.statusCode !== 200) reject(new Error(res.body));
        resolve(data);
      });
    } catch (apiErr) {
      reject(apiErr);
    }
  });
}

function parseCategory($) {
  var events = [];
  $('div.ann-academic').each(function(i, element) {
    $(this).children('p').each(function(i, element) {
      console.log($(this).text());
      events.push($(this).text());
    });
  });
  return events;
}

function parseCategories($) {
  var cats = [];
  $('.announcement-category').each(function(i, element) {
    var cat = {};
    var catName = $(this).children('h3').text();
    console.log(catName);
    cat[catName] = parseCategory( new cheerio.load( $(this).html() ) );
    cats.push(cat);
  });
  return cats;
}

function parseAnnouncements($) {
  var announcements = {};
  $('.tab-content').each(function(i, element) {
    var title = $(this).children('h2').text().toLowerCase();
    console.log(title);
    if(title.indexOf('student') > -1) {
      announcements.student = parseCategories(new cheerio.load ( $(this).html() ) );
    } else if (title.indexOf('faculty') > -1) {
      announcements.faculty = parseCategories(new cheerio.load ( $(this).html() ) );
    }
  });
  return announcements;
}

var Scraper = function(config) {
  return {
    getAnnouncementsJSON: function() {
      return new Promise(function (fulfill, reject){
        getHTML(config.announcementUrl).then(function(html) {
          var announcements = {};
          if(html !== '') {
            var $ = cheerio.load( html );
            announcements = parseAnnouncements($);
            console.log(announcements);
            fulfill(announcements);
          }
        });
      });
    }
  }
};

module.exports = Scraper;
