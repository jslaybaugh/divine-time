'use strict';
var Alexa = require("alexa-sdk");
var prettyMs = require('pretty-ms');
var dateFormat = require('dateformat');
var appId = 'amzn1.ask.skill.3f497e10-e5f8-4754-848b-127a101ac880'; //'amzn1.echo-sdk-ams.app.your-skill-id';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    "GetDivineTimeIntent": function() {
        var first = this.event.request.intent.slots.First.value;
        var last = this.event.request.intent.slots.Last.value;
        var firstMS = Date.parse(first);
        var lastMS = Date.parse(last);
        var isNow = false;

        if (isNaN(firstMS))
        {
          this.emit(":tell", "Sorry. I didn't understand your start date.");
          return;
        }
        if (isNaN(lastMS))
        {
          lastMS = new Date().getTime();
          isNow = true;
        }

        var firstFormatted = dateFormat(new Date(firstMS), "dddd, mmmm dS, yyyy, h:MM:ss TT");
        var lastFormatted = dateFormat(new Date(lastMS), "dddd, mmmm dS, yyyy, h:MM:ss TT");

        var humanMS = lastMS - firstMS;
        var divineRatio = (1) / (1000 * 365.2422);
        var divineMS = humanMS * divineRatio;

        var pretty = prettyMs(divineMS, {"verbose" : true });

        var message = "The divine time between " + firstFormatted + " and " + (isNow ? "now" : lastFormatted) + " is " + pretty + ". Would you like me to do another?";
        this.emit(':ask', message, message);
    },
    "LaunchRequest": function () {
      var message = "Welcome!! I'll tell you the divine time between two dates (including now or today). For example, you can say.... What is the divine time between July 1st 1981 and today? Are you ready to start?";
      this.emit(':ask', message, message);
    },
    "AMAZON.HelpIntent": function() {
        var message = "You can say things like... What is the divine time between July 1st 1981 and today? Or... What is the divine time between today and November 3rd 2020? Go ahead. Ask away!";
        this.emit(':ask', message, message);
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");
    },
    "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");
    },
    "AMAZON.YesIntent": function() {
      var message = "Okay! Ask away! Or if you need help, say Help.";
      this.emit(":ask", message, message);
    },
    "AMAZON.NoIntent": function() {
      this.emit(":tell", "Okay! I'm here if you need me. TTFN. Tah Tah for now!");
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        //this.attributes['endedSessionCount'] += 1;
        this.emit(":tell", "Goodbye!");
    }
};
