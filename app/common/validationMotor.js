const MSG = require('./message');

module.exports = {
  string: function(value) {
    let error = '';
    if (!value || value == 'undefined') error = MSG.fieldBlank;
    return error;
  },

  number: function(value) {
    let error = '';
    const reg = /^\d*$/;
    if (!value || value == 'undefined') {
      error = MSG.fieldBlank;
    } else if (!reg.test(value)) {
      error = MSG.numberOnly;
    }
    return error;
  },

  date: function(value) {
    let error = '';
    const reg = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!value || value == 'undefined') {
      error = MSG.fieldBlank;
    } else if (!reg.test(value.trim())) {
      error = MSG.invalidDate;
    }
    return error;
  },
  
}