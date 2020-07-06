export default (props) => {
    const { navigator, paywalled } = props;
    return (
        <TouchableOpacity onPress={() => routeHelper.showPaywallDescription(navigator, paywalled)}>
            <ION style={[Styles.icon, Styles.ml5]} name={paywalled === 'LOCKED' ? 'md-lock' : 'md-unlock'} />
        </TouchableOpacity>
    );
};
