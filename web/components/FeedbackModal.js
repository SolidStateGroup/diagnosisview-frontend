import React from 'react';
import { Component } from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import data from "../../common/stores/base/_data";

class TheComponent extends Component {
    state = {
        feedback:""
    }
    sendFeedback = () => {
        this.setState({ sending: true, error: '' });
        data.post(Project.api + 'user/feedback', {
            body: this.state.feedback.replace(/\n/g, '<br />')
        }).then(() => {
            this.setState({sending:false, success:true})
        }).catch(e => {
            AjaxHandler.error(null, e);
            this.setState({ sending: false, error: 'Sorry there was a problem sending your feedback. Check you\'re connected to the internet' });
        })
    }
    render() {
        return (
            <Modal
                isOpen={this.props.modalOpen}
                toggle={()=>{
                    this.props.onToggle()
                }}
            >
                <ModalHeader>
                    Give us some feedback
                </ModalHeader>
                <ModalBody>
                    <p>
                        This message will include your email address for replies. We read all, but may not be able to reply personally to all.
                    </p>
                    <textarea maxLength={1000} value={this.state.feedback} rows={5} onChange={(e)=>this.setState({feedback:Utils.safeParseEventValue(e)})}/>
                    {this.state.error && (
                        <div className="text-danger mv-2">{this.state.error}</div>
                    )}

                    {this.state.success && (
                        <div className="text-success mv-2">Your feedback has been sent</div>
                    )}

                    <div className="mt-4 text-right">
                        {this.state.success ? (
                            <Row>
                                <Flex/>
                                <Button onClick={this.props.onToggle} className={'btn btn-lg btn--primary mr-2 nav__button'}>
                                    <span className="nav__button__text">Continue</span>
                                </Button>
                            </Row>
                        ): (
                            <Row>
                                <Flex/>
                                <Button disabled={this.state.sending} onClick={this.sendFeedback} className={'btn btn-lg btn--primary mr-2 nav__button'}>
                                    <span className="nav__button__text">Submit</span>
                                </Button>
                                <Button onClick={this.props.onToggle} className={'className={\'btn btn-lg button--outline-dark nav__button'}>
                                    <span className="nav__button__text">Cancel</span>
                                </Button>
                            </Row>
                        )}


                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

export default TheComponent
