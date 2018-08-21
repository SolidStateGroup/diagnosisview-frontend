/**
 * Created by kylejohnson on 07/09/15.
 */
import merge from 'lodash/merge';
window.Styles = StyleSheet.create(merge({},
    require('./base/'),
    require('./project/style_base'),
    require('./project/style_utilities'),
    require('./project/style_type'),
    require('./project/style_buttons'),
    require('./project/style_navs'),
    require('./project/style_forms'),
    require('./project/style_lists'),
    require('./project/style_modals'),
    require('./project/style_layout'),

    require('./project/style_platform'),
    require('./components/style_upload'),

));
