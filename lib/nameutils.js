'use strict';

function cleanName(childName) {

  childName = childName.toLocaleLowerCase();
  if (childName.charAt(childName.length-1) === 's') {
    childName = childName.substr(0, childName.length-1);
  }
  childName = childName.charAt(0).toUpperCase() + childName.slice(1);

  return childName;
}

module.exports = {
  cleanName
};
