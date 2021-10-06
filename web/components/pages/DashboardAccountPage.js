import React from 'react';
import { Component } from 'react';
import InputGroup from "../base/forms/InputGroup";


class TheComponent extends Component {

    constructor() {
        super();
        const user = AccountStore.getUser();

        this.state ={
            password:"",
            newPassword:"",
            repeatNewPassword:"",
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            occupation: user.occupation || '',
            institution: user.institution || ''
        }
    }
    save = (e)=> {
        e.preventDefault()
    }
    updatePassword = (e)=> {
        if(this.state.password || (this.state.newPassword !== this.state.confirmNewPassword))
            return
    }
    render() {
        return <div className="container-fluid">
            <h4>My Account</h4>


                <div className="row">
                    <div className="col-md-7">
                        <div className="panel--white">
                            <form className="mb-4" onSubmit={this.save}>

                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <InputGroup
                                        title="First name"
                                        value={this.state.firstName}
                                        placeholder="Enter first name"
                                        onChange={(e) => this.setState({ firstName: Utils.safeParseEventValue(e) })}
                                        inputClassName="input--default" />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <InputGroup
                                        title="Last name"
                                        value={this.state.lastName}
                                        placeholder="Enter first name"
                                        onChange={(e) => this.setState({ lastName: Utils.safeParseEventValue(e) })}
                                        inputClassName="input--default" />
                                </div>
                                <div className="col-md-12 mb-4">
                                    <InputGroup
                                        title="Email"
                                        type="email"
                                        placeholder="Enter email"
                                        inputProps={{readOnly:true}}
                                        value={this.state.username}
                                        onChange={(e) => this.setState({ email: Utils.safeParseEventValue(e) })}
                                        inputClassName="input--default" />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <InputGroup
                                        title="Occupation"
                                        placeholder="Enter password"
                                        onChange={(e) => this.setState({ confirmPassword: Utils.safeParseEventValue(e) })}
                                        component={(
                                            <select value={this.state.occupation} onChange={(e)=>this.setState({occupation:Utils.safeParseEventValue(e)})} className="custom-select">
                                                <option value="">
                                                    Please Select
                                                </option>
                                                {Constants.occupations.map((v)=>(
                                                    <option value={v.value} key={v.value}>
                                                        {v.value}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        inputClassName="input--default"/>
                                </div>
                                <SettingsProvider>
                                    {({settings, isLoading: settingsIsLoading, error: settingsError}) => {
                                        const selectedInstitution = !!settings && this.state.institution && _.find(settings.institutions, i => i.id === this.state.institution);
                                        return (
                                            <div className="col-md-6 mb-4">
                                                <Row>
                                                    <InputGroup
                                                        title="Institution"
                                                        onChange={(e) => this.setState({ confirmPassword: Utils.safeParseEventValue(e) })}
                                                        component={(
                                                            <select value={this.state.institution} onChange={(e)=>this.setState({institution:Utils.safeParseEventValue(e)})} className="custom-select">
                                                                <option value="">
                                                                    Enter Occupation
                                                                </option>
                                                                {settings && _.map(_.filter(settings.institutions, i => !i.hidden), institution => (
                                                                    <option key={institution.id} value={institution.id}>{institution.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                        inputClassName="input--default"/>
                                                    {selectedInstitution && selectedInstitution.logoUrl &&  (
                                                        <img style={{marginTop:30}} className="ml-2" height={42} src={selectedInstitution.logoUrl.indexOf('/api/') !== -1 ? Project.api + selectedInstitution.logoUrl.substr(5) : selectedInstitution.logoUrl}/>
                                                    )}
                                                </Row>
                                            </div>
                                        )
                                    }}

                                </SettingsProvider>
                            </div>

                                <Button className="btn btn--primary">
                                    Save
                                </Button>
                            </form>

                            <form onSubmit={this.updatePassword} className="mb-4">
                                <div className="row">
                                    <div className="col-md-4 mb-4">
                                        <InputGroup
                                            type="password"
                                            title="Password"
                                            inputProps={{autocomplete:"new-password"}}
                                            placeholder="Minimum 7 characters"
                                            value={this.state.password}
                                            onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
                                            inputClassName="input--default"/>
                                    </div>
                                    <div className="col-md-4 mb-4">
                                        <InputGroup
                                            type="password"
                                            title="New Password"
                                            placeholder="Minimum 7 characters"
                                            onChange={(e) => this.setState({ newPassword: Utils.safeParseEventValue(e) })}
                                            inputClassName="input--default"/>
                                    </div>
                                    <div className="col-md-4 mb-4">
                                        <InputGroup
                                            type="password"
                                            title="Confirm New Password"
                                            placeholder="Minimum 7 characters"
                                            onChange={(e) => this.setState({ confirmNewPassword: Utils.safeParseEventValue(e) })}
                                            inputClassName="input--default"/>
                                    </div>
                                </div>
                                <Button disabled={!this.state.password || (this.state.newPassword !== this.state.confirmNewPassword)} className="btn btn--primary">
                                    Update Password
                                </Button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-5">

                    </div>
                </div>
        </div>
    }
}

export default TheComponent
