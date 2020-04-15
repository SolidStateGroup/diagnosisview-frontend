window.Project = require('../../common/project');
window.Dispatcher = require('../../common/dispatcher/dispatcher');
window.AppActions = require('../../common/dispatcher/app-actions');
window.Actions = require('../../common/dispatcher/action-constants');
window.Format = require('../../common/utils/format');
window.ES6Component = require('../../common/ES6Component');

window.AccountStore = require('../../common/stores/account-store');
window.AccountProvider = require('../../common/providers/AccountProvider');
window.FavouritesStore = require('../../common/stores/favourites-store');
window.FavouritesProvider = require('../../common/providers/FavouritesProvider');
window.HistoryStore = require('../../common/stores/history-store');
window.HistoryProvider = require('../../common/providers/HistoryProvider');
window.DiagnosisStore = require('../../common/stores/diagnosis-store');
window.CodesProvider = require('../../common/providers/CodesProvider');
window.UsersProvider = require('../../common/providers/UsersProvider');
window.UsersStore = require('../../common/stores/users-store');
window.LinkTransformProvider = require('../../common/providers/LinkTransformProvider');
window.LinkTransformStore = require('../../common/stores/link-transform-store');
window.LinkLogoProvider = require('../../common/providers/LinkLogoProvider');
window.LinkLogoStore = require('../../common/stores/link-logo-store');
window.SettingsProvider = require('../../common/providers/SettingsProvider');
window.SettingsStore = require('../../common/stores/settings-store');

window.RenderInfo = require('../../common/providers/RenderInfo');

//Useful components
window.Row = require('../components/base/grid/Row');
window.Flex = require('../components/base/grid/Flex');
window.Column = require('../components/base/grid/Column');
window.Input = require('../components/base/forms/Input');
window.Button = require('../components/base/forms/Button');
window.Panel = require('../components/base/grid/Panel');
window.FormGroup = require('../components/base/grid/FormGroup');
window.InputGroup = require('../components/base/forms/InputGroup');
window.Panel = require('../components/base/grid/Panel');
window.FormGroup = require('../components/base/grid/FormGroup');
window.InputGroup = require('../components/base/forms/InputGroup');


window.PanelSearch = require('../components/PanelSearch');

//Useful for components used all the time within a project
window.Loader = () => (
    <svg version="1.1" id="loader-1" x="0px" y="0px"
         width="40px" height="40px" viewBox="0 0 50 50" style={{enableBackground: '0 0 50 50'}}>
        <path fill="#4f98a3"
              d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
            <animateTransform attributeType="xml"
                              attributeName="transform"
                              type="rotate"
                              from="0 25 25"
                              to="360 25 25"
                              dur="0.6s"
                              repeatCount="indefinite"/>
        </path>
    </svg>
);


window.Tooltip = require('../components/Toolip');
