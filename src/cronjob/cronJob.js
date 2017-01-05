/**
 Seconds: 0-59
 Minutes: 0-59
 Hours: 0-23
 Day of Month: 1-31
 Months: 0-11
 Day of Week: 0-6
 */

var CronJob = require('cron').CronJob;
try{
  var job = new CronJob({
    cronTime: '*/10 * * * * *',
    onTick: function() {
      /*
       * Runs every weekday (Monday through Friday)
       * at 11:30:00 AM. It does not run on Saturday
       * or Sunday.
       */
      console.log('You will see this message every second');
    },
    start: false,
    timeZone: 'America/Los_Angeles'
  });
  job.start();
}
catch(ex){
  console.log("cron pattern not valid");
}
