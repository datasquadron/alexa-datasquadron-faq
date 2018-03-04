var express = require('express');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

const invalid_request_ssml = "<speak>Error: not a valid request</speak>";
const invalid_intent_ssml = "<speak>Sorry, the application didn't know what to do with that intent</speak>";

describe('Faq', function() {
	var server;

	beforeEach(function() {
		var app = express();
		var faq = require('../datasquadron-faq');
		faq.express({
			expressApp: app,
			router: express.Router(),
			debug: true,
			checkCert: false
		});
		server = app.listen(3000);
	});

	afterEach(function() {
		server.close();
	});

	it('rejects requests from wrong applicationId', function() {
		return request(server)
		.post('/datasquadron-faq')
		.send({
			session: {
				application: {
					applicationId: 'bad'
				},
				user: {
					userId: 'foo'
				}
			},
			context: {
				System: {
					application: {
						applicationId: 'bad'
					},
					user: {
						userId: 'foo'
					}
				}
			},
			request: {
				type: 'LaunchRequest',
			}
		})
		.expect(500)
	});

	it('responds to a LaunchRequest', function() {
		return request(server)
		.post('/datasquadron-faq')
		.send({
			session: {
				application: {
					applicationId: 'amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c'
				},
				user: {
					userId: 'foo'
				}
			},
			context: {
				System: {
					application: {
						applicationId: 'amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c'
					},
					user: {
						userId: 'foo'
					}
				}
			},
			request: {
				applicationId: 'amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c',
				type: 'LaunchRequest',
			}
		})
		.expect(200)
		.then(function(response) {
			var ssml = response.body.response.outputSpeech.ssml;
			return expect(ssml).to.not.eql(invalid_intent_ssml);
		});
	});

	const custom_intents = [
		'AMAZON.HelpIntent',
		'AMAZON.StopIntent',
		'AMAZON.CancelIntent',
		'Unhandled',
		'SquadronHello',
		'SquadronWhoIntent',
		'SquadronWhatIntent',
		'SquadronWhyIntent',
		'SquadronWhereIntent',
		'SquadronForWhomIntent',
		'SquadronTechIntent',
		'SquadronTechMoreIntent',
		'SquadronUnmatchedIntent'
	];

	custom_intents.forEach(function (intent) {
		it('responds to ' + intent, function() {
			return request(server)
			.post('/datasquadron-faq')
			.send({
				session: {
					application: {
						applicationId: 'amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c'
					},
					user: {
						userId: 'foo'
					}
				},
				context: {
					System: {
						application: {
							applicationId: 'amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c'
						},
						user: {
							userId: 'foo'
						}
					}
				},
				request: {
					type: 'IntentRequest',
					intent: {
						name: intent,
						confirmationStatus: 'NONE'
					}
				}
			})
			.expect(200)
			.then(function(response) {
				var ssml = response.body.response.outputSpeech.ssml;
				return expect(ssml).to.not.eql(invalid_intent_ssml);
			});
		});
	});

	it('captures and repeats unmatched phrase', function() {
		return request(server)
		.post('/datasquadron-faq')
		.send({
			session: {
				application: {
					applicationId: 'amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c'
				},
				user: {
					userId: 'foo'
				}
			},
			context: {
				System: {
					application: {
						applicationId: 'amzn1.ask.skill.629a6d11-a66e-4022-ba04-e46d51fb736c'
					},
					user: {
						userId: 'foo'
					}
				}
			},
			request: {
				type: "IntentRequest",
				intent: {
					name: "SquadronUnmatchedIntent",
					confirmationStatus: "NONE",
					slots: {
						UnmatchedPhrase: {
							name: "UnmatchedPhrase",
							value: "Pontiac firebirds",
							confirmationStatus: "NONE"
						}
					}
				}
			}
		})
		.expect(200)
		.then(function(response) {
			var ssml = response.body.response.outputSpeech.ssml;
			return expect(ssml).to.eql("<speak>Sorry, I don't know anything about Pontiac firebirds. Try asking a question like who, what, where, or why.</speak>");
		});
	});
});


