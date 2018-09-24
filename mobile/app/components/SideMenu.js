import React, {Component, PropTypes} from 'react';

const SideMenuLink = (props) => (
    <TouchableOpacity onPress={()=>props.onPress(props.to)} style={Styles.menuItem}>
        <Row style={{flexWrap: 'nowrap'}}>
            {/*<Column>*/}
            {/*{props.image ?*/}
            {/*<Image style={Styles.menuItemImage} source={props.image} /> :*/}
            {/*<ION style={Styles.menuItemIcon} name={props.icon} />*/}
            {/*}*/}
            {/*</Column>*/}
            <Column>
                <Text style={Styles.menuItemText}>
                    {props.text}
                </Text>
            </Column>
        </Row>
    </TouchableOpacity>
);

SideMenuLink.displayName = "SideMenuLink";

SideMenuLink.propTypes = {
    children: OptionalObject
};

const TheComponent = class extends Component {

    displayName: 'TheComponent'

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }


    linkPressed = (link) => {
        routeHelper.closeDrawer(this.props.navigator);
        this.props.navigator.handleDeepLink({
            link
        });
    };

    onAbout = () => {
        routeHelper.closeDrawer(this.props.navigator);
        routeHelper.showAbout(this.props.navigator);
    }

    logout = () => {
        routeHelper.closeDrawer(this.props.navigator);
        Alert.alert('Confirm', 'Are you sure you wish to log out?' + (AccountStore.isSubscribed() ? ' Your history and favourites will no longer be saved against your account' : ''), [
            {text: 'No', style: 'cancel'},
            {text: 'Yes', onPress: AppActions.logout}
        ]);
    }

    render() {
        return (
            <AccountProvider>
                {({user})=>(
                    <LinearGradient
                        style={[{flex: 1, backgroundColor: pallette.primary}, Styles.statusContent, Styles.menuShadow]}
                        colors={[pallette.fromGradient, pallette.toGradient]}>
                        <TouchableOpacity style={styles.closeButton}>
                            <ION name="ios-close-circle-outline"/>
                        </TouchableOpacity>
                        <Flex style={{marginTop: 50}}>
                            <SideMenuLink onPress={this.linkPressed} text="Home" to="goDashboard" icon="ios-home"/>
                            {!user ? (
                                <View>
                                    <SideMenuLink onPress={this.linkPressed} text="Register Account" to="goRegister"
                                                  icon="ios-unlock"/>
                                    <SideMenuLink onPress={this.linkPressed} text="Login" to="goLogin"
                                                  icon="ios-log-in"/>
                                </View>
                            ) : (
                                <View>
                                    <SideMenuLink onPress={this.linkPressed}
                                                  text={user.firstName ? user.firstName + ' ' + user.lastName : user.username}
                                                  to="goAccount" icon="ios-person"/>
                                    <SideMenuLink onPress={this.logout} text="Logout" icon="ios-log-out"/>
                                </View>
                            )}
                            <SideMenuLink onPress={this.onAbout} text="About"
                                          image={require('../images/icons/home_active.png')}/>
                        </Flex>
                        {/* <FormGroup>
                         <SideMenuLink onPress={this.linkPressed} text="Logout" to="logout" icon="ios-exit"/>
                         </FormGroup> */}
                        <View style={Styles.sideNavHeader}>
                            <AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]}
                                             source={require('../images/brand-medium-white.png')}/>
                        </View>
                    </LinearGradient>
                )}
            </AccountProvider>
        );
    }
};

var styles = StyleSheet.create({
    closeButton: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: -100,
        zIndex: 10
    }
})

TheComponent.propTypes = {};

module.exports = TheComponent;
