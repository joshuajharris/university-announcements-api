# University Announcement API
![Heroku](http://heroku-badge.herokuapp.com/?app=university-announcements-api&root=/scraper)
![David](https://david-dm.org/joshuajharris/university-announcements-api.svg)  
ODU's Announcements, seen [here](https://www.odu.edu/announcements) and in the emails, in api form.

## Setup
---
### Installation
1. Clone the Repo
```bash
git clone git@github.com:joshuajharris/university-announcements-api.git
cd university-announcements-api
```
2. Install [Node JS](https://nodejs.org/en/)
    * on Mac OSX - `brew install node`
    * on Windows using chocolatey - `choco install nodejs`
3. Install dependencies `npm install`

## How to Run
1. In a terminal, in the project directory run `node index.js`
2. Set environment variables.
```bash
export MONGOLAB_URI=enter_your_uri_here # defaults to mongodb://localhost:27017
export HOST=enter_app_host # defaults to http://localhost
```

If running local mongo instance make a collection called "announcements".

## Endpoints
---
### [/scraper](https://university-announcements-api.herokuapp.com/scraper)
Scrapes university announcements and presents them in a json object

## Author

github: [@joshuajharris](https://www.github.com/joshuajharris)

![pic](https://avatars2.githubusercontent.com/u/10967744?v=3&u=8aa6e36a52c9df1cd5092838d5b7fec02dfb96c5&s=140)
