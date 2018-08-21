var Constants = {
    events: {
        "LOGIN": {"event": "User login", "category": "User"},
        "REGISTER": {"event": "User register", "category": "User"},
        "RECENT_SEARCH_PRESSED": {event: "Recent search pressed", category: 'Dashboard'},
        "RECENT_FAV_PRESSED": {event: "Recent favourite pressed", category: 'Dashboard'},
        "DASHBOARD_SUBSCRIBE": {event: 'Subscribe pressed', category: 'Dashboard'},
        "HISTORY_SUBSCRIBE": {event: 'Subscribe pressed', category: 'History'},
        "FAVOURITES_SUBSCRIBE": {event: 'Subscribe pressed', category: 'Favourites'},
    },
    pages: {},
    strings: {},

    simulate: {
        SUBSCRIBED: false,
        LOGGED_IN: false,
        PRE_FILLED_REGISTER: false,
        ALL_FAVES_REMOVED_EXTERNALLY: false,
        EXPIRY: false // Doesn't work unless subscribed is set to true
    }
};

module.exports = Constants;
