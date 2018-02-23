import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import AppBar from 'material-ui/AppBar'
import Home from '../containers/HomePage.jsx';
import '../css/Login.css';
import Register from './Register'

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;
const style = {
    margin: 15,
// backgroundColor:"#93c849",
};

export default class Login extends Component{
    constructor(props){
        super(props);
        var loginComponent=[];
        
        loginComponent.push(
            <MuiThemeProvider key="login-fields">
                <div className="sing_in_wrapper clearfix">
                         <TextField
                           hintText="Enter your email id"
                           floatingLabelText="Email Id"
                           onChange={(event,newValue) => this.setState({emailId:newValue})}
                          />
                  <br/>
                         <TextField
                           type="password"
                           hintText="Enter your password"
                           floatingLabelText="Password"
                           onChange={(event,newValue) => this.setState({password:newValue})}
                          />
                  <br/>
                           <RaisedButton className='login_button' label="Login" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
                           <RaisedButton className='login_button' label="Sing Up" primary={true} style={style} onClick={(event) => this.register(event)}/>
               </div>
           </MuiThemeProvider>
        )

        this.state={
            emailId:'',
            password:'',
            loginComponent:loginComponent,
        }
        this.populateHomePage = this.populateHomePage.bind(this);
    }
    componentWillReceiveProps(nextProps){
        console.log("login component page received props: ",nextProps);
      }
    register(event){
        let self = this;
        let registerPage = <Register  appContext={self.props.appContext}/> ;
        self.props.appContext.setState({loginPage:[registerPage]});
    }
    handleClick(event){
        var self = this;

        var payload={
            "emailId":this.state.emailId,
            "password":this.state.password
    
        }

        axios({
            method: 'post',
            url: apiUrl + "user/login",
            data: payload,
            validateStatus: (status) => {
              return true; // I'm always returning true, you may want to do it depending on the status received
            },
        })
        .then(function(response){
            console.log("====>"+response)
            if(response.status === 200){
                console.log("Login successful : "+JSON.stringify(response));
                console.log("uuid==>"+response.data.uuid);
                var header={"uuid":response.data.uuid,"password":payload.password, id: response.data.id};
                // alert("successfully logged in");
                localStorage.setItem("loginData",JSON.stringify(response.data));
                localStorage.setItem("pwd",payload.password);

                // localStorage.setItem("password",payload.password);
                  self.populateHomePage(header);
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

    populateHomePage(header) {
      let self = this;
      console.log("Api url----------->" + apiUrl);
        var apiBaseUrl = apiUrl + "granular/getGranularPoints/";
        let params = { page: 0, size: 10};
        let auth = { username: header.uuid, password: header.password  }
         axios.get(apiBaseUrl + header.id, {params: params, auth: auth}).then(function (response) {
              console.log(response);
              let cars = self.formCarArray(response.data);
               if(response.status === 200){
                console.log("Rest Hit successful");
               }
               else{
                console.log("Oops...! Get Cars failed with--------" + response.status);
               }
               let homepage = [];
               homepage.push(<Home key="home-page" appContext={self.props.appContext} cars={cars} count={cars.length} />);
               self.props.appContext.setState({loginPage: homepage});
          }).catch(function (error) {
                  console.log("The error is------------", error);
          });
    }

    formCarArray(cars){
      let carArray= [], ids = [];
      for(let i=0; i< cars.length; i++){
          let c=cars[i];
          if(ids.indexOf(c.carId) === -1){
            c.isSaved=true;
            let poly = [];
            c.poly.map(function(p) {
                if(p.parent){
                  poly.push({lat: parseFloat(p.lat), lng: parseFloat(p.lng)});
                }
            });
            c.poly = poly;
            c.drawPolyline = true;
            c.markerCount = 2;
            c.showMarker = true;
            let last_index = poly.length -1;
            c.markers = [];
            c.markers.push({lat: poly[0].lat, lng: poly[0].lng});
            c.markers.push({lat: poly[last_index].lat, lng: poly[last_index].lng});
            carArray.push(c);
            ids.push(c.carId);  
          }
      }
      return carArray;
    }

    render() {
        return (
          <div>
            <MuiThemeProvider>
              <div className="header_part">
                  <div className="page_logo">
                      <figure className="logo"><img src="http://carmanetworks.com/img/assets/Carma%20Network.png" alt="Carma Networks" title="Carma Networks" /></figure>
                  </div>
              </div>
            </MuiThemeProvider>
           {this.state.loginComponent}
           {this.props.loginmessage}
          </div>
        );
      }
    
}