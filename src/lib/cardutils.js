'use strict'

function simpleCard (title, content) {
  return {
    type: 'Simple',
    title,
    content
  }
}

module.exports = {
  simpleCard
}
