import Recaptcha from 'react-native-recaptcha-that-works';
import {  Component } from "react";
import { TouchableOpacity } from "react-native";

export default class Captcha extends Component {
    state = {}
    handleOpenPress = () => {
        this.ref.open();
    }
    handleClosePress = () => {
        this.props.onClose && this.props.onClose()
        this.ref.close();
    }
    componentDidMount() {
        this.handleOpenPress()
    }

    render() {
        const { onSuccess} =this.props
        return   <Recaptcha
            ref={(ref)=>this.ref = ref}
            lang="en"
            headerComponent={<View style={{backgroundColor:"black"}}>
                <TouchableOpacity style={[Styles.padded, {backgroundColor:"black", alignItems:'flex-end'}]} onPress={this.handleClosePress}>
                    <ION style={{fontSize: em(2), color: 'white'}} name="md-close"/>
                </TouchableOpacity>
            </View>}
            siteKey={Project.captchaSiteKey}
            baseUrl={Project.captchaBaseUrl}
            size="normal"
            theme="light"
            onExpire={() => alert('onExpire event')}
            onVerify={(res)=>{
                this.handleClosePress();
                setTimeout(()=>{
                    onSuccess(res);
                },0)
            }}
        />;
    }
}
