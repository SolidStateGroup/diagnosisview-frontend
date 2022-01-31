import Recaptcha from 'react-recaptcha-that-works';
import {  Component } from "react";

export default class Captcha extends Component {
    state = {}
    handleOpenPress = () => {
    }
    componentDidMount() {
        this.handleOpenPress()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.ts !== this.props.ts) {
            this.setState({revalidate:true})
            setTimeout(()=>{
                this.setState({revalidate:false})
            },500)
        }
    }

    render() {
        const { onSuccess} =this.props
        if(this.state.revalidate) {
            return null
        }
        return (
        <div className="mb-2">
            <Recaptcha
                ref={(ref)=>this.ref = ref}
                lang="en"
                siteKey={Project.captchaSiteKey}
                baseUrl={Project.captchaBaseUrl}
                size="normal"
                theme="light"
                onVerify={(res)=>{
                    onSuccess(res);
                }}
            />
        </div>
        )

    }
}
