'use strict';

const childDataHelper = require('../data/childdatahelper');

const criteria = {
  'utterances': [
    'list {|all|my|our} children {|living in this house|living here|here}'
  ]
};

function action(req, res) {

  childDataHelper.getChildren(req.data.session.user.userId)
    .then((children) => {
      let prompt = getChildListPhrase(children);
      res.say(prompt).reprompt(prompt).shouldEndSession(true);
      res.send();
    })
    .catch(() => {
      let prompt = generateNoChildList();
      res.say(prompt).reprompt(prompt).shouldEndSession(true);
      res.send();
  });

  return false;
}

function getChildListPhrase(children) {
  if (!children || children.length === 0) {
    return generateNoChildList();
  } else if (children.length === 1) {
    return generateSingleChildList(children[0])
  }
  return generateMultipleChildListPhrase(children);
}

function generateMultipleChildListPhrase(children) {
  let prompt =  `You have added ${children.length} children, their names are: `;

  for (let pos = 0; pos < children.length; pos += 1) {
    const child = children[pos];
    if (pos == children.length - 1) {
      prompt += `and ${child.name}.`
    } else if (pos == children.length - 2) {
      prompt += `${child.name} `
    } else {
      prompt += `${child.name}, `
    }

  }

  return prompt;
}

function generateSingleChildList(child) {
  return `You have added one child, ${child.name}.${child.name} goes to bed at ${child.bedTime}`;
}

function generateNoChildList() {
  return 'You have not added any children yet.'
}


module.exports = {
  criteria,
  action,
  getChildListPhrase
};
