import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import AppBar from 'material-ui/AppBar'
import Home from '../containers/HomePage.jsx'
import '../css/Login.css';

export default class Login extends Component{
    constructor(props){
        super(props);
        var loginComponent=[];
        
        loginComponent.push(
            <MuiThemeProvider>
                <div>
                         <TextField
                           hintText="Enter your email id"
                           floatingLabelText="Email Id"
                           onChange = {(event,newValue) => this.setState({emailId:newValue})}
                          />
                  <br/>
                         <TextField
                           type="password"
                           hintText="Enter your password"
                           floatingLabelText="Password"
                           onChange = {(event,newValue) => this.setState({password:newValue})}
                          />
                  <br/>
                           <RaisedButton className='login_button' label="Login" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
               </div>
           </MuiThemeProvider>
        )

        this.state={
            emailId:'',
            password:'',
            loginComponent:loginComponent,
        }
    }
    componentWillReceiveProps(nextProps){
        console.log("login component page received props: ",nextProps);
      }
    handleClick(event){
        var self = this;

        var apiBaseUrl = "http://localhost:8090/";
        // var apiBaseUrl = "http://192.168.1.18:8090/";

        var payload={
            "emailId":this.state.emailId,
            "password":this.state.password
    
        }

        axios({
            method: 'post',
            url: apiBaseUrl+"user/login",
            data: payload,
            validateStatus: (status) => {
              return true; // I'm always returning true, you may want to do it depending on the status received
            },
        })
        .then(function(response){
            console.log("====>"+response)
            if(response.status === 200){
                console.log("Login successfull : "+JSON.stringify(response));
                console.log("uuid==>"+response.data.uuid);
                var header={"id":response.data.uuid,"password":payload.password};
                // alert("successfully logged in");
                var homepage=[];
                localStorage.setItem("loginData",JSON.stringify(response.data));
                localStorage.setItem("pwd",payload.password);

                // localStorage.setItem("password",payload.password);

                homepage.push(<Home  appContext={self.props.appContext}/>)
                self.props.appContext.setState({loginPage:homepage})
                }
            else if(response.status === 204){
                console.log("Username password do not match");
                alert(response.status)
              }
            else{
                console.log(response.data.message);
                alert(response.data.message);
              }
        })
        .catch(function(data){
            console.log("error :"+data);
        });
    }
    render() {
        return (
          <div>
            <MuiThemeProvider>
            <AppBar className="login_header"
                 title="Login"
               />
            </MuiThemeProvider>
           {this.state.loginComponent}
          </div>
        );
      }
    
}

const style = {
    margin: 15,
// backgroundColor:"#93c849",
  };
  