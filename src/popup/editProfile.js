import React, { Component } from 'react';
import {MuiThemeProvider,RaisedButton, TextField}  from 'material-ui';
import axios from 'axios';

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;

export class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
          name: props.loginData.name || "",
          password: "",
          oldPassword: "",
          headerMsg:'',
        };
    }

    handleSave(event){
      event.preventDefault();
      var apiBaseUrl = apiUrl;
      var self = this;
      if(this.state.name.length>0){
          let payload = {
            name: this.state.name
          };

          if(this.state.oldPassword.length === 0 && this.state.password.length > 0){
            self.setState({
              headerMsg: <div className="alert-danger">Old password is mandatory while changing passwords.</div>
            });
            return;
          }

          if(this.state.password.length > 0 && this.state.oldPassword.length > 0){
            payload.password = this.state.password;
            payload.oldPassword = this.state.oldPassword;
          }
          
        let config = {
          auth: {
            username: this.props.loginData.uuid,
            password: this.props.pwd
          }
        };

        console.log("payload : " +payload);

        axios.put(apiBaseUrl + 'scenario/updateAddress', payload, config).then(function (response) {
         console.log(response);
         if(response.status === 200){
           var headerMsg = <div className="alert-success">Successfully updated changes to profile.</div>;
           // Update local storage here
            let loginData = self.props.loginData;
            loginData.name = payload.name;
            localStorage.setItem("loginData",JSON.stringify(loginData));
            localStorage.setItem("pwd",payload.password);
            self.setState({headerMsg: headerMsg});
            self.props.saveAction();
         }
         else{
           console.log("some error ocurred",response.status);
           self.setState({
             headerMsg: <div className="alert-danger">Error updating profile. Please Try again.</div>
           });
         }
         
       }).catch(function (error) {
            console.log("Catch block------", error);
            let msg = error.response ? error.response.data.message : "Error updating profile. Please Try again.";
            self.setState({
              headerMsg: <div className="alert-danger">{msg}</div>
            });  
       });
      } 
      else{
        self.setState({
              headerMsg: <div className="alert-danger">Please fill all the detail(s).</div>
        });
      }
    }

    cancel(event){
      this.props.cancelAction();
    }

    render(){
      return (
          <div>
         {this.state.headerMsg} 
          <MuiThemeProvider>
          <form action="/" method="POST" onSubmit={event => this.handleClick(event)}>
            <div>
              <div id="edit-profile">
                <TextField hintText="Enter name" floatingLabelText="Name" value={this.state.name}
                        onChange={(event, newValue) => this.setState({ name: newValue })} className="profile-input"
                        required/>
                <br />
                <TextField type="password" hintText="Enter old password" floatingLabelText="Old Password"  value={this.state.oldPassword}
                        onChange={(event, newValue) => this.setState({ oldPassword: newValue })}  className="profile-input"
                        required={this.state.password.length > 0}/>
                <br/>       

                <TextField type="password" hintText="Enter new password" floatingLabelText="Password"  value={this.state.password}
                        onChange={(event, newValue) => this.setState({ password: newValue })}  className="profile-input"
                        />
                 <div className="modal-footer">
                <RaisedButton label="Save" primary={true} className="action-btns" onClick={event => this.handleSave(event)} />
                <RaisedButton label="Cancel"  className="action-btns" onClick={event => this.cancel(event)} />
                </div>
              </div>
            </div>
          </form>
        </MuiThemeProvider>
        </div>
      );
    }
}
