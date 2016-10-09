'use strict';
const moment = require('moment');


function makeAllTimesPM(incomingTime) {
  try {
    let timeParts = incomingTime.split(':');
    let hours = parseInt(timeParts[0]);
    if (hours < 12) hours += 12;
    return `${hours}:${timeParts[1]}`;
  } catch(error) {
    return incomingTime;
  }
}

function validTime(time) {
  if (!time || time.length < 5 || time.indexOf(':') === -1) {
    return false;
  }

  let timeParts = time.split(':');

  if (timeParts.length != 2) {
    return false;
  }

  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);

  if (hours < 0 || hours > 23) return false;
  if (minutes < 0 || minutes > 59) return false;

  return true;
}

function readableTime(time) {
  if (!validTime(time)) {
    return time;
  }

  let timeParts = time.split(':');
  let hours = parseInt(timeParts[0]);
  let minutes = timeParts[1];

  if (hours > 12) hours -= 12;

  return `${hours}:${minutes}pm`;
}

function timeFromNow(time) {
  const timeMins = convertToMins(time);
  const nowMins = convertToMins(moment().format('H:mm'));
  return timeMins - nowMins;
}

function convertToMins(time) {
  if (!time || time.length < 5 || time.indexOf(':') === -1) {
    return 99999;
  }

  let timeParts = time.split(':');

  if (timeParts.length != 2) {
    return false;
  }

  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);

  let total = minutes + (hours * 60);

  return total;
}


module.exports = { makeAllTimesPM, validTime, readableTime, timeFromNow };
