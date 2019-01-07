module.exports = Object.assign({}, require('./base/_utils'), {
  getLinkLogo: (rules, link) => {
    let imageUrl;
    if (rules && rules.length) {
      _.each(rules, rule => {
        if (link.link.indexOf(rule.startsWith) === 0) {
          imageUrl = `${Project.api}${rule.imageUrl.substr(5)}`;
          if (rule.overrideDifficultyLevel && rule.overrideDifficultyLevel !== 'DO_NOT_OVERRIDE') {
            link.difficultyLevel = rule.overrideDifficultyLevel;
          }
          return;
        }
      })
    }
    return imageUrl;
  },
});
