'use strict';

function simpleCard(title, content) {
  return {
    type: 'simple',
    title,
    content
  };
}

module.exports = {
  simpleCard
};
