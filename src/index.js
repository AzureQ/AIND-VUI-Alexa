'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // can be replaced with your app ID if publishing
var facts = require('./facts');
var GET_FACT_MSG_EN = [
    "Here's your fact: ",
    "The fact is: ",
    "Did you know: ",
    "I'll provide you the fact: ",
    "The following is a fact: "
]
// Test hooks - do not remove!
exports.GetFactMsg = GET_FACT_MSG_EN;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks
/*
    TODO (Part 2) add messages needed for the additional intent
    TODO (Part 3) add reprompt messages as needed
*/

var GET_FACT_MSG_YEAR_EN = [
    "Here's your fact from the year " + this.year + "is: ",
    "Your fact from the year " + this.year + "is: ",
    "The following is a fact from the year " + this.year + ": ",
    "This happens in the year of " + this.year,
    "In the year of " + this.year,
    "During the year of " + this.year
]

var GET_REPROMPT_MESSAGE_EN = [
    "Would you like another AI fact"
]
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "My History Facts",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN,
            "GET_FACT_YEAR_MESSAGE": GET_FACT_MSG_YEAR_EN,
            "REPROMPT_MESSAGE": GET_REPROMPT_MESSAGE_EN,
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/*
    TODO (Part 2) add an intent for specifying a fact by year named 'GetNewYearFactIntent'
    TODO (Part 2) provide a function for the new intent named 'GetYearFact' 
        that emits a randomized fact that includes the year requested by the user
        - if such a fact is not available, tell the user this and provide an alternative fact.
    TODO (Part 3) Keep the session open by providing the fact with :askWithCard instead of :tellWithCard
        - make sure the user knows that they need to respond
        - provide a reprompt that lets the user know how they can respond
    TODO (Part 3) Provide a randomized response for the GET_FACT_MESSAGE
        - add message to the array GET_FACT_MSG_EN
        - randomize this starting portion of the response for conversational variety
*/

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random fact from the facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        // Create speech output
        var speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE")) + randomFact;
        this.emit(':askWithCard', speechOutput, this.t("SKILL_NAME"), randomFact, randomPhrase(this.t("REPROMPT_MESSAGE")))
    },
    'GetNewYearFactIntent': function () {
        //TODO your code here
        this.emit("GetYearFact")
    },
    'GetYearFact': function () {
        var factArr = this.t('FACTS');
        var chosenFact = randomPhrase(factArr);

        for (var i = 0; i < factArr.length; i++) {
            if (factArr[i].indexOf(this.event.request.intent.slots.FACT_YEAR.value) > 0) {
                chosenFact = factArr[i]
                break;
            }
        }

        // Create speech output
        var speechOutput = randomPhrase(this.t("GET_YEAR_FACT_MESSAGE")) + chosenFact;
        this.emit(':askWithCard', speechOutput, this.t("SKILL_NAME"), chosenFact, randomPhrase(this.t("REPROMPT_MESSAGE")))
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};
