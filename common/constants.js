var Constants = {
    webPayments: true,
    linkIcons: {
        'NHS_CHOICES': '/images/nhs-choices.png',
        'MEDLINE_PLUS': '/images/logo-medlineplus.png',
        'NICE_CKS': '/images/nice.png',
        'CUSTOM': '/images/default-link.png',
    },
    difficultyLevels: (difficultyLevel)=> {
        let colour, text;
        switch (difficultyLevel && difficultyLevel.toLowerCase()) {
            case 'green':
            default:
                colour = 'Green';
                text = 'suitable for students or professionals new to the topic.';
                break;

            case 'amber':
                colour = 'Amber';
                text = 'for practitioners and advanced students.';
                break;

            case 'red':
                colour = 'Red';
                text = 'advanced info.';
                break;
        }
        return {colour,text}
    },
    events: {
        "LOGIN": {"event": "User login", "category": "User"},
        "REGISTER": {"event": "User register", "category": "User"},
        "RECENT_SEARCH_PRESSED": {event: "Recent search pressed", category: 'Dashboard'},
        "RECENT_FAV_PRESSED": {event: "Recent favourite pressed", category: 'Dashboard'},
        "DASHBOARD_SUBSCRIBE": {event: 'Subscribe pressed', category: 'Dashboard'},
        "HISTORY_SUBSCRIBE": {event: 'Subscribe pressed', category: 'History'},
        "FAVOURITES_SUBSCRIBE": {event: 'Subscribe pressed', category: 'Favourites'},
    },
    occupations: [{value: 'Healthcare Student'}, {value: 'Healthcare Practitioner'}, {value: 'Patient'}, {value: 'Other'}],
    pages: {},
    strings: {},

    simulate: true ? {
        SUBSCRIBED: false,
        MANAGE_SUBSCRIPTION: true,
        LOGGED_IN: false,
        PRE_FILLED_REGISTER: false,
        ALL_FAVES_REMOVED_EXTERNALLY: false,
        EXPIRY: false, // Doesn't work unless subscribed is set to true
        SHOW_WELCOME: false
    }: {},

    tagColours: {
        'CORE_CONDITION': 'rgba(81, 204, 81, 0.8)',
        'CORE_PRESENTATION': 'rgba(220, 200, 0, 0.78)',
    },
};

module.exports = Constants;
