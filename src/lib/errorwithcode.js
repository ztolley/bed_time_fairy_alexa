// Create a new object, that prototypically inherits from the Error constructor
function ErrorWithCode(message, code) {
  this.name = 'ErrorWithCode'
  this.message = message
  this.code = code
  this.stack = (new Error()).stack
}

ErrorWithCode.prototype = Object.create(Error.prototype)
ErrorWithCode.prototype.constructor = ErrorWithCode

module.exports = ErrorWithCode
