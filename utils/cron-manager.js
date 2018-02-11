const CronJobManager = require('cron-job-manager');

//Intialise jobs stack
var manager = new CronJobManager( // this creates a new manager and adds the arguments as a new job.
'check-events',
'09 10 00 * * *', // the crontab schedule
function() { console.log("Task to do") },
{
// extra options.. 
// see https://github.com/ncb000gt/node-cron/blob/master/README.md for all available
  start:true,
  timeZone:"Europe/Paris",
  completion: function() {console.log("check-events is ok")}
} 
);