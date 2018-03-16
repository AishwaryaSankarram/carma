import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Login from './Login.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Autocomplete from "react-google-autocomplete";

const style = {
  margin: 15,
  customWidth:{
    width:200,
  },
};

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;
var testArray=[];
export default class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      dataSource: [],
      name:'',
      email:'',
      password:'',
      loginmessage:'',
      registerRole:["ROLE_USER"],
      focus:false,
      autoComplete:"",
      placeId:"",
      lattitude:"",
      logitude:""
    }
    this.addClass=this.addClass.bind(this);
    this.getClass = this.getClass.bind(this);
    this.removeClass = this.removeClass.bind(this);
    // this.onChangeAutoComplete = this.onChangeAutoComplete.bind(this);

  }
  componentWillReceiveProps(nextProps){
    console.log("register page received props: ",nextProps);
  }

  handleClick(event){
    event.preventDefault();
    var apiBaseUrl = apiUrl;
    // console.log("values in register handler",role);
    var self = this;
    if(this.state.name.length>0  && this.state.email.length>0 && this.state.password.length>0){
      let userAddress={
       	"placeId":this.state.placeId,
	    	"address" :this.state.autoComplete,
	    	"location":{"type":"point","coordinates":[this.state.lattitude,this.state.longitude]}
	    }

      var payload={
        "name": this.state.name,
        "emailId":this.state.email,
        "password":this.state.password,
        "roles":this.state.registerRole,
        "userAddress":userAddress,
      }
      console.log("payload : " +payload);

      axios.post(apiBaseUrl+'user/create', payload)
      .then(function (response) {
       console.log(response);
       if(response.status === 200){
        //  console.log("registration successfull");
         var loginscreen=[];
         var loginmessage = <div className="alert-success">Successfully Registered</div>;

         loginscreen.push(<Login parentContext={this} appContext={self.props.appContext} loginmessage={loginmessage} isLogin={true}/>);
  //
         self.props.appContext.setState({loginPage:[loginscreen]
      });

        //  self.props.parentContext.setState({loginscreen:loginscreen,
        //  loginmessage:loginmessage,
        // //  loginButtons:loginButtons,
        //  isLogin:true
        //   });
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
     })
     .catch(function (error) {
       console.log(error);
     });
    }
    else{
      // alert("Input field value is missing");
      self.setState({
        loginmessage: (
          <div className="alert-danger">
            kindly fill the forms.
          </div>
        )
      });
    }

  }
  render() {
        var inputClass = this.getClass();

     const inputProps = { value: this.state.address, onChange: this.onChange ,label:'search address',placeholder:'search address...'}; // required for autocomplete api
    // console.log("props",this.props);
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
                <br />

                <div className={inputClass}>
                  <Autocomplete className="autoComplete" onFocus={this.addClass} onBlur={this.removeClass}  onPlaceSelected={place => this.setPlace(place) } types={["address"]}/>
                  <div className="autoComplete_placeholder">
                    Enter a Location
                  </div>
                </div>
                <RaisedButton label="Register" type="submit" primary={true} style={style} onClick={event => this.handleClick(event)} />
                <RaisedButton label="Login" primary={true} style={style} onClick={event => this.login(event)} />
              </div>
            </div>
          </form>
        </MuiThemeProvider>
      </div>;
  }
  
setPlace(place){
this.setState({
  autoComplete: place.formatted_address,
  placeId: place.place_id,
  lattitude: place.geometry.location.lat(),
  longitude: place.geometry.location.lng()
});
}

getClass(){
      let self = this;

      if (self.state.focus === false) return "auto_address";
      else return "auto_address focus_auto_address";
  }
addClass(){
      let self = this;

  self.setState({ focus: true });
  // console.log("addclass clicked focus " + this.state.focus);
  // console.log("address ",this.state.autoComplete)

  // focus_auto_address;
}
removeClass(){
  let self = this;

  console.log("addclass clicked" + this.state.focus);
 
  if(!this.state.autoComplete.length>0)self.setState({ focus: false });

  // focus_auto_address;
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
