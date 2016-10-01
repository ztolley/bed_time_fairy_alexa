'use strict';

function getChildren(userid) {
  return [
    { name: 'Johnny', bedTime: 2030 },
    { name: 'Jilly', bedTime: 1930 }
  ];
}

module.exports = {
  getChildren: getChildren
};
