var alexa = require('alexa-app');
var app = new alexa.app('datasquadron-faq');
const t = require('./datasquadron-faq-text.json');

app.invocationName = 'data squadron';

app.pre = function(req, res, type) {
	if (req.applicationId != "amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c") {
    // fail ungracefully
    throw "Invalid applicationId";
    // `return response.fail("Invalid applicationId")` will also work
	};
};

app.launch(function(req, res) {
	res.say(t.WELCOME_MESSAGE);
	res.say(t.HELP_PROMPT);
	res.shouldEndSession(false);
	res.reprompt(t.HELP_REPROMPT);
});

app.intent("AMAZON.HelpIntent", {
		"slots": {},
		"utterances": []
	},
	function(req, res) {
		res.say(t.HELP_PROMPT);
		res.shouldEndSession(false);
		res.reprompt(t.HELP_REPROMPT);
	}
);

app.intent("AMAZON.CancelIntent", {
		"slots": {},
		"utterances": []
	},
	function(req, res) {
		res.say(t.STOP_MESSAGE);
		res.shouldEndSession(true);
	}
);

app.intent("AMAZON.StopIntent", {
		"slots": {},
		"utterances": []
	},
	function(req, res) {
		res.say(t.STOP_MESSAGE);
		res.shouldEndSession(true);
	}
);

app.intent("SquadronHello", {
		"slots": {},
		"utterances": []
	},
	function(req, res) {
		res.say(t.HELLO_MESSAGE);
		res.shouldEndSession(false);
		res.reprompt(t.LISTENING_MESSAGE);
	}
);

app.intent("SquadronWhoIntent", {
		"slots": {},
		"utterances": [
            "who",
            "who are you",
            "who you are",
		]
	},
	function(req, res) {
		res.say(t.SQUADRON_WHO);
		res.say(t.SQUADRON_WHO_PROMPT);
		res.shouldEndSession(false);
		res.reprompt(t.HELP_REPROMPT);
	}
);

app.intent("SquadronWhatIntent", {
		"slots": {},
		"utterances": [
            "what",
            "what do you do",
		]
	},
	function(req, res) {
		res.say(t.SQUADRON_WHAT);
		res.say(t.SQUADRON_WHAT_PROMPT);
		res.shouldEndSession(false);
		res.reprompt(t.HELP_REPROMPT);
	}
);

app.intent("SquadronWhyIntent", {
		"slots": {},
		"utterances": [
            "why",
            "why should I work with you",
            "why should I use you",
            "why should I hire you",
		]
	},
	function(req, res) {
		res.say(t.SQUADRON_WHY);
		res.shouldEndSession(false);
		res.reprompt(t.HELP_REPROMPT);
	}
);

app.intent("SquadronWhereIntent", {
        "slots": {},
        "utterances": [
            "where are you",
            "{location|city|state|country}",
            "what {location|city|state|country} are you in",
            "where are you {located|headquartered|based}",
            "where are your {headquarters|offices}",
        ]
	},
	function(req, res) {
		res.say(t.SQUADRON_WHERE);
		res.shouldEndSession(false);
		res.reprompt(t.HELP_REPROMPT);
	}
);

app.intent("SquadronForWhomIntent", {
        "slots": {},
        "utterances": [
            "for whom",
            "tell me who you work with",
            "who works with you",
            "who works with",
            "who do you work with",
            "{customers|clients}",
            "about your {customers|clients}",
            "who are your {customers|clients}",
            "tell me who your {customers|clients} are",
        ]
	},
	function(req, res) {
		res.say(t.SQUADRON_FOR_WHOM);
		res.shouldEndSession(false);
		res.reprompt(t.HELP_REPROMPT);
	}
);

app.intent("SquadronTechIntent", {
        "slots": {},
        "utterances": [
            "{technologies|tech|software|platforms|tools|databases|programming languages}",
            "what {technologies|tech|software|platforms|tools|databases|programming languages}",
            "what {technologies|tech|software|platforms|tools|databases|programming languages} do you use",
            "what {technologies|tech|software|platforms|tools|databases|programming languages} is used by",
        ]
	},
	function(req, res) {
		res.say(t.SQUADRON_TECH);
		res.say(t.SQUADRON_TECH_REPROMPT);
		res.shouldEndSession(false);
		res.reprompt(t.SQUADRON_TECH_REPROMPT);
	}
);

app.intent("SquadronTechMoreIntent", {
        "slots": {},
        "utterances": [
            "more {technologies|tech|software|platforms|tools|databases|programming languages}",
            "more about {technologies|tech|software|platforms|tools|databases|programming languages}",
            "tell me more about {technologies|tech|software|platforms|tools|databases|programming languages}",
            "tell me more about the {technologies|tech|software|platforms|tools|databases|programming languages} you use",
        ]
	},
	function(req, res) {
		res.say(t.SQUADRON_TECH_MORE);
		res.shouldEndSession(false);
		res.reprompt(t.HELP_REPROMPT);
	}
);

function isUnmatchedPhrase(intent) {
    var unmatchedPhrase = intent && intent.slots &&
        intent.slots.UnmatchedPhrase && intent.slots.UnmatchedPhrase.value;
    return unmatchedPhrase;
};

app.intent("SquadronContactIntent", {
        "slots": {},
        "utterances": [
        	"how can I {contact|reach|email|phone|get in touch with} you",
        	"what is your {email address|phone number}"
        ]
	},
	function(req, res) {
		res.say(t.SQUADRON_CONTACT);
		res.shouldEndSession(false);
		res.reprompt(t.SQUADRON_CONTACT_REPROMPT);
	}
);

app.intent("SquadronUnmatchedIntent", {
        "slots": {
            "UnmatchedPhrase": "AMAZON.SearchQuery"
        },
        "utterances": [
            "do you know anything about {-|UnmatchedPhrase}",
            "about {-|UnmatchedPhrase}",
            "for {-|UnmatchedPhrase}",
            "tell me about {-|UnmatchedPhrase}",
            "what do you think about {-|UnmatchedPhrase}",
            "I would like to know about {-|UnmatchedPhrase}",
            "something about {-|UnmatchedPhrase}",
            "can you tell me about {-|UnmatchedPhrase}"
        ]
	},
	function(req, res) {
        var unmatchedPhrase = isUnmatchedPhrase(req.data.request.intent);
        console.log('Unmatched phrase is ' + unmatchedPhrase);
        var unmatchedResponse = t.UNMATCHED_MESSAGE + unmatchedPhrase + '. ' + t.UNMATCHED_REPROMPT;
		res.say(unmatchedResponse);
		res.shouldEndSession(false);
		res.reprompt(t.UNMATCHED_REPROMPT);
	}
);

app.intent("Unhandled", {
		"slots": {},
		"utterances": []
	},
	function(req, res) {
		res.say(t.UNHANDLED_MESSAGE);
		res.shouldEndSession(false);
		res.reprompt(t.UNHANDLED_REPROMPT);
	}
);

module.exports = app;
