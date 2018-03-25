# Data Squadron FAQ Alexa Skill

An Alexa Skill that answers frequently asked questions about Data Squadron.

"Alexa, ask Data Squadron 'who are you?'"

Uses [alexa-app](https://github.com/alexa-js/alexa-app) framework.

Custom Skill configured via Alexa Skill Kit at https://developer.amazon.com/alexa.

Intent handlers deployed to Lambda with [apex](https://github.com/apex/apex).

Test
```
npm test
```

Deploy
```
apex deploy
```
Then generate Skill Builder schema

```
node output-schema.js > schema.json
```
And paste this into the Alexa Skill Builder JSON editor.


