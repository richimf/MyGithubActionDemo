
// const core = require('@actions/core')
// const github = require('@actions/github')

// try {
//     // `who-to-greet` input defined in action metadata file
//     const nameToGreet = core.getInput('who-to-greet');
//     console.log(`Hello ${nameToGreet}!`);
//     const time = (new Date()).toTimeString();
//     core.setOutput("time", time);
//     // Get the JSON webhook payload for the event that triggered the workflow
//     const payload = JSON.stringify(github.context.payload, undefined, 2)
//     //console.log(`The event payload: ${payload}`);
//   } catch (error) {
//     core.setFailed(error.message);
//   }

import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const
      titleRegex = core.getInput('title-regex', {required: true}),
      titleRegexFlags = core.getInput('title-regex-flags') || 'g',
      errorMessage = core.getInput('error-message') || `Please fix your PR title to match "${titleRegex}" with "${titleRegexFlags}"`,
      title = github.context!.payload!.pull_request!.title;

    core.info(`Checking "${titleRegex}" with "${titleRegexFlags}" flags against the PR title: "${title}"`);

    if (!title.match(new RegExp(titleRegex, titleRegexFlags))) {
      core.setFailed(errorMessage);

      const autoCloseMessage = core.getInput('auto-close-message'),
        githubToken = core.getInput('github-token');
      if (autoCloseMessage) {
        if (!githubToken) {
          core.setFailed('To use auto-close feature you must provide github-token. See: https://github.com/seferov/pr-lint-action#auto-close');

          return;
        }

        const client: github.GitHub = new github.GitHub(githubToken),
        pr = github.context.issue;

        client.pulls.createReview({
          owner: pr.owner,
          repo: pr.repo,
          pull_number: pr.number,
          body: autoCloseMessage.replace('%pattern%', titleRegex),
          event: 'COMMENT'
        });
        client.pulls.update({
          owner: pr.owner,
          repo: pr.repo,
          pull_number: pr.number,
          state: 'closed'
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();