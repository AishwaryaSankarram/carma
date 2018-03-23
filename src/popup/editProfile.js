import React, { Component } from 'react';
import {MuiThemeProvider,RaisedButton, TextField}  from 'material-ui';
import axios from 'axios';
import Autocomplete from "react-google-autocomplete";

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;

export class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
          name: props.loginData.name || "",
          password: "",
          oldPassword: "",
          dataSource: [],
          headerMsg:'',
          focus:false,
          autoComplete: {
            address: props.loginData.userAddress ? props.loginData.userAddress.address : "" ,
            placeId: props.loginData.userAddress ? props.loginData.userAddress.placeId : "",
            location: {type:"point", coordinates: props.loginData.userAddress ? props.loginData.userAddress.location.coordinates : []}
         }
        };
        this.addClass=this.addClass.bind(this);
        this.getClass = this.getClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
        this.onChangeAutoComplete = this.onChangeAutoComplete.bind(this);
    }

    setPlace(place){
      console.log(place);
      this.setState({
        autoComplete: {
            address: place.formatted_address,
            placeId: place.place_id,
            location: {type:"point", coordinates:[place.geometry.location.lat(),place.geometry.location.lng()]}
          }
      });
    }

    handleSave(event){
      event.preventDefault();
      var apiBaseUrl = apiUrl;
      var self = this;
      if(this.state.name.length>0  && this.state.password.length>0){
        let payload = {
          name: this.state.name,
          password: this.state.password,
          oldPassword: this.state.oldPassword,
          userAddress: this.state.autoComplete,
        }
        let config = {
          auth: {
            username: this.props.loginData.uuid,
            password: this.props.pwd
          }
        };

        console.log("payload : " +payload);

        axios.put(apiBaseUrl + 'granular/updateAddress', payload, config).then(function (response) {
         console.log(response);
         if(response.status === 200){
           var headerMsg = <div className="alert-success">Successfully updated chnages to profile.</div>;
           // Update local storage here
            let loginData = self.props.loginData;
            loginData.name = payload.name;
            loginData.userAddress = payload.userAddress;
            localStorage.setItem("loginData",JSON.stringify(loginData));
            localStorage.setItem("pwd",payload.password);
            self.setState({headerMsg: headerMsg});
         }
         else{
           console.log("some error ocurred",response.status);
           self.setState({
             headerMsg: <div className="alert-danger">Error updating profile. Please Try again.</div>
           });
         }
         self.props.saveAction();
       }).catch(function (error) {
            console.log(error);
            self.setState({
              headerMsg: <div className="alert-danger">Error updating profile. Please Try again.</div>
            });  
            self.props.saveAction();
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

    getClass(){
        let self = this;
        if(self.state.focus === false && this.state.autoComplete.address && this.state.autoComplete.address.length > 0) {
          return "auto_address focus_false_at_data_avail";
        } else if (self.state.focus === false && !this.state.autoComplete.address && !this.state.autoComplete.address.length > 0) {
          return "auto_address";
        } else 
          return "auto_address focus_auto_address";
    }

    addClass(){
      let self = this;
      self.setState({ focus: true }); 
    }

    removeClass(){
      let self = this;
      self.setState({ focus: false });
    }

    onChangeAutoComplete(event){
      this.setState({ autoComplete: {
        address: event.target.value
      } });
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
                        required/>
                <br/>       

                <TextField type="password" hintText="Enter new password" floatingLabelText="Password"  value={this.state.password}
                        onChange={(event, newValue) => this.setState({ password: newValue })}  className="profile-input"
                        />

                <div className={this.getClass()}>
                  <Autocomplete className="autoComplete" types={["address"]} placeholder="Enter your Address"
                    value={this.state.autoComplete.address} onChange={event=> this.onChangeAutoComplete(event)}
                    onFocus={this.addClass} onBlur={this.removeClass} 
                    onPlaceSelected={place => this.setPlace(place)}  />
                    <div className="autoComplete_placeholder">Address</div>
                  <div className="autoBorder"></div>
                </div>
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
