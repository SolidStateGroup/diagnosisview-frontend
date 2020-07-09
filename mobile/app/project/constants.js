module.exports = {
  linkIcons: {
    'NHS_CHOICES': require('../images/nhs-choices.png'),
    'MEDLINE_PLUS': require('../images/logo-medlineplus.png'),
    'NICE_CKS': require('../images/nice.png'),
    'CUSTOM': require('../images/default-link.png'),
  },
  tagDescriptions: {
    'CORE_CONDITION': (
      <Text style={Styles.paragraph}>
        {`What is a core condition? `}<Text onPress={() => Linking.openURL('https://blogs.ed.ac.uk/diagnosisview/about/core-conditions')} style={[Styles.hyperlink]}>More Info.</Text>
      </Text>
    ),
  },
}