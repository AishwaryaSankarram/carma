import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Login from './Login.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      name:'',
      email:'',
      password:'',
      registerRole:["ROLE_USER"],
    //   menuValue:2
    }
  }
  componentWillReceiveProps(nextProps){
    console.log("register page received props: ",nextProps);
  }
  handleClick(event){
    var apiBaseUrl = "http://localhost:8090";
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

      axios.post(apiBaseUrl+'/user/create', payload)
      .then(function (response) {
       console.log(response);
       if(response.status === 200){
        //  console.log("registration successfull");
         var loginscreen=[];
         loginscreen.push(<Login parentContext={this} appContext={self.props.appContext}/>);
         
         var loginmessage = "successfully registered";
         var loginButtons=[];
        //  loginButtons.push(
        //    <div>
        //    <MuiThemeProvider>
        //      <div>
        //         <RaisedButton label={"Register Here"} primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
        //     </div>
        //     </MuiThemeProvider>
        //    </div>
        //  )
         self.props.parentContext.setState({loginscreen:loginscreen,
         loginmessage:loginmessage,
         loginButtons:loginButtons,
         isLogin:true
          });
       }
       else{
         console.log("some error ocurred",response.status);
       }
     })
     .catch(function (error) {
       console.log(error);
     });
    }
    else{
      alert("Input field value is missing");
    }

  }
  render() {
    // console.log("props",this.props);
    return (
      <div>
        <MuiThemeProvider>
          <div>
          <AppBar  className="login_header"
             title="Register"
           />
           <TextField
             hintText="Enter your name"
             floatingLabelText="Name"
             onChange = {(event,newValue) => this.setState({name:newValue})}
             />
           <br/>
          <TextField
             hintText="Enter your email id"
             floatingLabelText="Email Id"
             onChange = {(event,newValue) => this.setState({email:newValue})}
             />
           <br/>
           <TextField
             type = "password"
             hintText="Enter your password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           {/* <div>
           <MuiThemeProvider>
                      <DropDownMenu value={this.state.menuValue}  onChange={(event,index,value)=>this.handleMenuChange(value)} style={style.customWidth} autoWidth={false}>
                           <MenuItem value={1} primaryText="Admin"/>
                           <MenuItem value={2} primaryText="User" />
                       </DropDownMenu>
           </MuiThemeProvider>
           </div> */}
           <RaisedButton label="Register" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
          </div>
         </MuiThemeProvider>
      </div>
    );
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


const style = {
  margin: 15,
  customWidth:{
    width:200,
  },
};

