
const core = require('@actions/core')
const github = require('@actions/github')

try {
    // const regex = core.getInput('title-regex');
    const regex = core.getInput('title-regex', {required: true});  
    const errorMessage = core.getInput('error-message', {required: true}) || 'Error';  
    //const regexFlags = core.getInput('title-regex-flags') || 'g';
    // const title = github.context.eventName; 
    const title = github.context.payload.pull_request.title
    console.log(`title is ${title}`);
    console.log(`errorMessage is ${errorMessage}`);

    if (!title.match(new RegExp(regex, ''))) {
      core.setFailed(errorMessage);
    } else {
      core.setOutput("message", "All good :P");
    }

  } catch (error) {
    core.setFailed(error.message);
  }
