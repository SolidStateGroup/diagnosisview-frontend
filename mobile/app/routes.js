import {Navigation} from "react-native-navigation";

//BASE Routes
Navigation.registerComponent('/webmodal', () => require('./components/base/NativeWebModal'));
Navigation.registerComponent('/select', () => require('./components/base/SelectModal'));
Navigation.registerComponent('/select-contact', () => require('./components/base/ContactSelectModal'));

// Screens
Navigation.registerComponent('/dashboard', () => require('./screens/DashboardPage'));
Navigation.registerComponent('/history', () => require('./screens/HistoryPage'));
Navigation.registerComponent('/favourites', () => require('./screens/FavouritesPage'));
Navigation.registerComponent('/account', () => require('./screens/AccountPage'));
Navigation.registerComponent('/search', () => require('./screens/SearchPage'));
Navigation.registerComponent('/category', () => require('./screens/CategoryPage'));
Navigation.registerComponent('/diagnosis', () => require('./screens/DiagnosisDetailPage'));

// Other
Navigation.registerComponent('side-menu', () => require('./components/SideMenu'));
Navigation.registerComponent('about', () => require('./screens/AboutLightbox'));
Navigation.registerComponent('brokenLink', () => require('./screens/BrokenLinkLightbox'));
Navigation.registerComponent('logoheader', () => require('./components/LogoHeader'));
Navigation.registerComponent('welcome', () => require('./screens/WelcomeLightbox'));
Navigation.registerComponent('changePassword', () => require('./screens/ChangePasswordLightbox'));
Navigation.registerComponent('favouriteComplexity', () => require('./screens/FavouriteComplexityLightbox'));
