var schedule = require('node-schedule');
var config = require('../config.json');
var gBankerJob = require('./gBankerJob.js');
var gBankerJob2 = require('./gBankerJob2.js');
var testJob = require('./testJob.js');

var allJob = function() {};
module.exports = new allJob();

allJob.prototype.main = function() {
	//schedule.scheduleJob('0,10,20,30,40,50 * * * * *', testJob.main);
    //schedule.scheduleJob(config.gbankerTimes, gBankerJob.main);
    schedule.scheduleJob(config.gbankerTimes, gBankerJob2.main);
    //gBankerJob.main();
}