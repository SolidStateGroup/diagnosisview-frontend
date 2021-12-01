import Recaptcha from 'react-recaptcha-that-works';
import {  Component } from "react";

export default class Captcha extends Component {
    state = {}
    handleOpenPress = () => {
    }
    componentDidMount() {
        this.handleOpenPress()
    }
    render() {
        const { onSuccess} =this.props
        return (
        <div className="mb-2">
            <Recaptcha
                ref={(ref)=>this.ref = ref}
                lang="en"
                siteKey={Project.captchaSiteKey}
                baseUrl={Project.captchaBaseUrl}
                size="normal"
                theme="light"
                onExpire={() => alert('onExpire event')}
                onVerify={(res)=>{
                    onSuccess(res);
                }}
            />
        </div>
        )

    }
}
