
const core = require('@actions/core')
const github = require('@actions/github')

try {
    // `who-to-greet` input defined in action metadata file
    //const nameToGreet = core.getInput('who-to-greet');
    const titleRegex = core.getInput('title-regex');
    const titleRegexFlags = core.getInput('title-regex-flags') || 'g';
    //console.log(`Hello ${nameToGreet}!`);
    // const time = (new Date()).toTimeString();
    // core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    //console.log(`The event payload: ${payload}`);
    const title = github.context.eventName;

    if (!title.match(new RegExp(titleRegex, titleRegexFlags))) {
      core.setFailed(errorMessage);
    } else {
      core.setOutput("message", "All good :P");
    }

  } catch (error) {
    core.setFailed(error.message);
  }