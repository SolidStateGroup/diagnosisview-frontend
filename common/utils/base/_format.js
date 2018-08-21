module.exports = {

  enumeration: {
    get: function (value) { // MY_CONSTANT > My constant
      if (!value) {
        return "";
      }
      return Format.camelCase(value.replace(/_/g," "));
    },
    set: function (value) { //My Constant > MY_CONSTANT
      return value.replace(/ /g,"_").toUpperCase();
    }
  },

  age: function (value) { //DATE > 10
    if (value) {
      var a = moment(),
        b = moment(value);
      return a.diff(b, 'years');
    }
    return value;
  },

  camelCase: function (val) { //hello world > Hello world
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  },

  cssImage: function (value) { //lol.jpg  > url('lol.jpg')
    return value ? 'url("' + value + '")' : 'none';
  },

  ordinal: function (value) {
    var s = ["th", "st", "nd", "rd"],
      v = value % 100;
    return value ? value + (s[(v - 20) % 10] || s[v] || s[0]) : '';
  },

  truncateText: function (text, numberOfChars) { //lol,1 > l...
    if (text) {
      if (text.length > numberOfChars) {
        return text.substring(0, numberOfChars) + '...';
      }
    }
    return text;
  },

  removeAccents: function (str) { //Sergio Agüero > Sergio Aguero
    if (!str) {
      return str;
    }

    for (var i = 0; i < Utils.accents.length; i++) {
      str = str.replace(Utils.accents[i].letters, Utils.accents[i].base);
    }

    return str;
  }
};
