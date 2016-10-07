'use strict';
let dynasty = require('dynasty')({region: 'eu-west-1'});
let BEDTIMEFAIRY_DATA_TABLE_NAME = 'bedtimefairy';

if (process.env.DEBUG) {
  const localUrl = 'http://dynamodb:8000';
  const localCredentials = {
    region: 'us-east-1',
    accessKeyId: 'fake',
    secretAccessKey: 'fake'
  };
  dynasty = require('dynasty')(localCredentials, localUrl);
  createTable();
}

if (process.env.TEST) {
  const localUrl = 'http://localhost:4000';
  const localCredentials = {
    region: 'us-east-1',
    accessKeyId: 'fake',
    secretAccessKey: 'fake'
  };
  dynasty = require('dynasty')(localCredentials, localUrl);
  BEDTIMEFAIRY_DATA_TABLE_NAME = 'bedtimefairy_test';
}

let bedTimeFairyTable = dynasty.table(BEDTIMEFAIRY_DATA_TABLE_NAME);

function setDynasty(newDynasty) {
  dynasty = newDynasty;
}

function getChildren(userId) {
  return findUser(userId)
    .then((user) => {
      if (!user) throw { code: 404, description: 'Unable to find user' };
      return user.children;
    });
}

function getBedTime(userId, childName) {
  function containsName(child) {
    return childName.toLocaleLowerCase().indexOf(child.fullName.toLocaleLowerCase()) !== -1;
  }

  return findUser(userId)
    .then((user) => {
      if (!user) throw { code: 404, description: 'Unable to find user' };
      const filtered = user.children.filter(containsName);
      if (filtered.length === 0) throw { code: 404, description: 'Unable to find child' };
      return filtered[0].bedTime;
    });
}

function updateChildInUser(user, childName, bedTime) {
  const bedTimeFairyTable = dynasty.table(BEDTIMEFAIRY_DATA_TABLE_NAME);
  const userId = user.userId;
  delete user.userId;
  if (!user.children) user.children = [];

  function containsName(child) {
    return child.fullName.toLocaleLowerCase() === childName.toLocaleLowerCase();
  }

  // If the name is already in our list, return error
  if (user.children.filter(containsName).length === 0) {
    throw { code: 404, description: 'Child not found for this user' };
  } else {
    user.children = user.children.map((child) => {
      if (containsName(child)) {
        return { fullName: childName, bedTime };
      } else {
        return child;
      }
    });
  }

  return bedTimeFairyTable.update(userId, user);
}

function findUser(userId) {
  return bedTimeFairyTable.find(userId)
}

function addChildToUser(userId, childName, bedTime) {
  function containsName(child) {
    return child.fullName.toLocaleLowerCase() === childName.toLocaleLowerCase();
  }

  return findUser(userId)
    .then((record) => {
      delete record.userId;
      let children = record.children || [];

      // If the name is already in our list, return error
      if (children.length === 0 || children.filter(containsName).length === 0) {
        children.push({fullName: childName, bedTime});
      } else {
        throw { code: 409, description: 'Child with that name already exists'};
      }
      return bedTimeFairyTable.update(userId, { children });
    })
    .then((result) => {
      return result;
    })
    .error((error) => {
      throw(error);
    });

}

function insertNewUserRecord(userId) {
  return bedTimeFairyTable.insert({userId})
    .then(() => {
      return bedTimeFairyTable.find(userId);
    });
}

function addChild(userId, childName, bedTime) {
  return bedTimeFairyTable.find(userId)
    .then((record) => {
      if (record) {
        return record;
      } else {
        return insertNewUserRecord(userId);
      }
    })
    .then(() => {
      return addChildToUser(userId, childName, bedTime);
    });
}

function updateChild(userId, childName, bedTime) {
  return bedTimeFairyTable.find(userId)
    .then((record) => {
      if (record) {
        return updateChildInUser(record, childName, bedTime);
      } else {
        throw { code: 404, description: 'Cannot find user' };
      }
    })
    .catch((error) => {
      throw { code: 404, description: 'Cannot find user' };
    });
}

function removeChild(userId, childName) {
  function containsName(child) {
    return child.fullName.toLocaleLowerCase() === childName.toLocaleLowerCase();
  }
  return bedTimeFairyTable.find(userId)
    .then(user => {
      delete user.userId;

      if (user.children.filter(child => containsName(child)).length === 0) {
        throw { code: 404, description: 'Unable to delete, child name not found' }
      }

      user.children = user.children.filter(child => !containsName(child));

      return bedTimeFairyTable.update(userId, user)
        .then((resp) => {
          return resp;
        });

    });
}

function findChild(userId, childName) {
  return getChildren(userId)
    .then((children) => {
      for (let child of children) {
        if (child.fullName.toLocaleLowerCase() === childName.toLocaleLowerCase()) {
          return child;
        }
      }

      return null;
    });
}

function createTable() {
  return dynasty.list()
    .then(function(resp) {
      for (const tableName of resp.TableNames) {
        if (tableName === BEDTIMEFAIRY_DATA_TABLE_NAME) {
          return;
        }
      }
      return dynasty.create(BEDTIMEFAIRY_DATA_TABLE_NAME, {
        key_schema: {
          hash: ['userId', 'string']
        }
      })
    })
    .then(() => {
      bedTimeFairyTable = dynasty.table(BEDTIMEFAIRY_DATA_TABLE_NAME);
      return bedTimeFairyTable;
    });
}

function dropTable() {
  return dynasty.drop(BEDTIMEFAIRY_DATA_TABLE_NAME)
    .then(() => {
      return;
    })
    .catch((error) => {
      console.log(error);
      return;
    });
}


module.exports = {
  getChildren,
  createTable,
  dropTable,
  addChild,
  updateChild,
  removeChild,
  getBedTime,
  setDynasty,
  findChild
};
