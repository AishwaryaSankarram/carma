import React, { Component } from 'react';
import {MuiThemeProvider, RaisedButton, TextField} from 'material-ui';
import axios from 'axios';
import Login from './Login.jsx';

const style = {
  margin: 15,
  customWidth:{
    width:200
  }
};

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;
export default class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      name:'',
      email:'',
      password:'',
      loginmessage:'',
      registerRole:["ROLE_USER"]
    }
  }

  handleClick(event){
    event.preventDefault();
    var apiBaseUrl = apiUrl;
    var self = this;
    if(this.state.name.length>0  && this.state.email.length>0 && this.state.password.length>0){
      var payload={
        "name": this.state.name,
        "emailId":this.state.email,
        "password":this.state.password,
        "roles":this.state.registerRole
      }
      console.log("payload : " +payload);

      axios.post(apiBaseUrl+'user/create', payload).then(function (response) {
       console.log(response);
       if(response.status === 200){
        //  console.log("registration successfull");
         var loginscreen=[];
         var loginmessage = <div className="alert-success">Successfully Registered</div>;

         loginscreen.push(<Login parentContext={this} appContext={self.props.appContext} loginmessage={loginmessage} isLogin={true}/>);
         self.props.appContext.setState({loginPage:[loginscreen]});
       }
       else{
         console.log("some error ocurred",response.status);
         self.setState({
           loginmessage: (
             <div className="alert-danger">
               some error ocurred! Try to register again.
             </div>
           )
         });
       }
     }).catch(function (error) {
        console.log(error);
     });
    }
    else{
      self.setState({
        loginmessage: (
          <div className="alert-danger">
            Please fill all the detail(s).
          </div>
        )
      });
    }
  }
  
  render() {
    return <div>
        <MuiThemeProvider>
          <form action="/" method="POST" onSubmit={event => this.handleClick(event)}>
            <div>
              <div className="header_part">
                <div className="page_logo">
                  <figure className="logo">
                    <img src="http://carmanetworks.com/img/assets/Carma%20Network.png" alt="Carma Networks" title="Carma Networks" />
                  </figure>
                </div>
                <div className="header_title">Carma Route Planner</div>
              </div>
              {this.state.loginmessage}

              <div className="sing_in_wrapper">
                <TextField hintText="Enter your name" floatingLabelText="Name" onChange={(event, newValue) => this.setState(
                      { name: newValue }
                    )} />
                <br />
                <TextField hintText="Enter your email address" floatingLabelText="Email Address" onChange={(event, newValue) => this.setState(
                      { email: newValue }
                    )} />
                <br />
                <TextField type="password" hintText="Enter your password" floatingLabelText="Password" onChange={(event, newValue) => this.setState(
                      { password: newValue }
                    )} />
                <div className="login_footer">
                <RaisedButton label="Register" primary={true} style={style} onClick={event => this.handleClick(event)} />
                <RaisedButton label="Login" primary={true} style={style} onClick={event => this.login(event)} />
                </div>
              </div>
            </div>
          </form>
        </MuiThemeProvider>
      </div>;
  }

  login(event){
    let self=this;
    let registerPage = <Login  appContext={self.props.appContext}/> ;
    self.props.appContext.setState({loginPage:[registerPage]});

  }
  // handleMenuChange(value){
  //   var registerRole1;
  //   if(value===1){
  //     registerRole1 =["ROLE_ADMIN","ROLE_USER"];
  //   }else{
  //     registerRole1= ["ROLE_USER"];
  //   }
  //   this.setState({menuValue:value,
  //                  registerRole:registerRole1})
  // }


}
