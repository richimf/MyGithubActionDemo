
const core = require('@actions/core')
const github = require('@actions/github')

try {
    const regex = core.getInput('title-regex');
    const regexFlags = core.getInput('title-regex-flags') || 'g';
    const title = github.context.eventName;

    if (!title.match(new RegExp(regex, regexFlags))) {
      core.setFailed("No funciona");
    } else {
      core.setOutput("message", "All good :P");
    }

  } catch (error) {
    core.setFailed(error.message);
  }