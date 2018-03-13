import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AutoComplete from "material-ui/AutoComplete";
import axios from 'axios';
import Login from './Login.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Autocomplete from "react-google-autocomplete";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
const mystyle1={
  outline:"unset",
  border:"unset"
}


const mystyle = {
  root: {
    position: "relative",
    paddingBottom: "0px"
  },
  input: {
    display: "inline-block",
    width: "100%",
    padding: "10px"
  },
  autocompleteContainer: {
    position: "absolute",
    top: "100%",
    backgroundColor: "white",
    border: "1px solid #555555",
    width: "100%"
  },
  autocompleteItem: {
    backgroundColor: "#ffffff",
    padding: "10px",
    color: "#555555",
    cursor: "pointer"
  },
  autocompleteItemActive: {
    backgroundColor: "#fafafa"
  }
};
const style = {
  margin: 15,
  customWidth:{
    width:200,
  },
};
const cssClasses = {
  // root: "root-auto-complete",
  // input: "input",
  // root: "root",
  // autocompleteItem: "autocomplete-item",
  autocompleteContainer: "autocomplete-container",
  // autocompleteItemActive: "autocomplete-item-active"
};

const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;
var testArray=[];
export default class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      address: "San Francisco, CA",
      dataSource: [],
      name:'',
      email:'',
      password:'',
      loginmessage:'',
      registerRole:["ROLE_USER"],
    }
    this.onChange = address => this.setState({ address });
    
  }
  componentWillReceiveProps(nextProps){
    console.log("register page received props: ",nextProps);
  }

  handleUpdateInput = (value) => {
    geocodeByAddress(value)
      .then(results => this.showSuggestion(results,value))
      .catch(error => console.error(error));
   
      console.log("test")
  };
  
showSuggestion(results,value){
  // testArray=[];
  var resp = (results);
   console.log("resp-- original",resp)
   for (let i = 0; i < resp.length; i++) {
     testArray.push(resp[i].formatted_address);
     console.log("resp obj===>" + testArray);
   }

   this.setState({ dataSource: testArray });
}
  handleClick(event){
    event.preventDefault();
    var apiBaseUrl = apiUrl;
    // console.log("values in register handler",role);
    var self = this;
    if(this.state.name.length>0  && this.state.email.length>0 && this.state.password.length>0){
      var payload={
        "name": this.state.name, 
        "emailId":this.state.email,
        "password":this.state.password,
        "roles":this.state.registerRole
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
                <AutoComplete hintText="address" floatingLabelText="Address" dataSource={this.state.dataSource} onUpdateInput={this.handleUpdateInput} />

                <br />
                <Autocomplete className="AutoComplete" onPlaceSelected={place => {
                    console.log(place);
                  }} types={["address"]} />
                <label>address</label>
                <PlacesAutocomplete classNames={cssClasses} inputProps={inputProps} />

                <RaisedButton label="Register" type="submit" primary={true} style={style} onClick={event => this.handleClick(event)} />
                <RaisedButton label="Login" primary={true} style={style} onClick={event => this.login(event)} />
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




