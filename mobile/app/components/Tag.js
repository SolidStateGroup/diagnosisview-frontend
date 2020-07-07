export default (props) => {
    const { navigator, tag } = props;
    return (
        <TouchableOpacity
            style={[Styles.tag, { backgroundColor: Constants.tagColours[tag.code] || pallette.primary }]}
            onPress={() => routeHelper.showTagDescription(navigator, tag)}
            disabled={!Constants.tagDescriptions[tag.code]}
        >
            <Text style={[Styles.tagText]}>{tag.description}</Text>
        </TouchableOpacity>
    );
};
