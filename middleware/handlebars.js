const moment = require("moment");

const compare = function (obj1, obj2) {
  return obj1 === obj2;
};

const numList = function (from, to) {
  let list = [];
  for (i = from, j = to; i < j; i++) list.push(i);
  return list;
};

const formatDate = function (date, format) {
  return moment(date).local().format(format);
};

module.exports = { compare, numList, formatDate };
