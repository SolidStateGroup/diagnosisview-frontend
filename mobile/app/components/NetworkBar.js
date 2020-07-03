module.exports = (props) => (
	<NetworkProvider>
		{(isConnected, isDBDown) => (
			<View>
				<SlideUp duration={200}
						style={ [{backgroundColor: pallette.third}]}
						value={!isConnected || isDBDown} height={64}>
					<Row>
						<Column>
							<ION style={{fontSize: em(2), color: 'white'}} name="md-warning"/>
						</Column>
						<Column>
							<Text style={[Styles.barText]}>
								{props.message || "The server connection appears to be down. Please try again later."}
							</Text>
						</Column>
					</Row>
				</SlideUp>
			</View>
		)}
	</NetworkProvider>
)
