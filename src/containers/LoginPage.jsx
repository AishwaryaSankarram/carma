import React, { Component } from 'react';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import RaisedButton from 'material-ui/RaisedButton';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';

/*const style={
  margin: 15,
};*/

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    // var loginButtons=[];
    // loginButtons.push(
    //   <div>
    //   <MuiThemeProvider>
    //     <div>
    //        <RaisedButton label={"Register Here"} primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
    //    </div>
    //    </MuiThemeProvider>

    //   </div>
    // )
    this.state = {
      username:'',
      password:'',
      loginscreen:[],
      loginmessage:'',
      isLogin:true
    }
  }
  componentWillMount(){
    var loginscreen=[];
    loginscreen.push(<Login key="login-page"  parentContext={this} appContext={this.props.appContext}/>);
    var loginmessage = "";
    this.setState({
                  loginscreen:loginscreen,
                  loginmessage:loginmessage
                    })
  }
  handleClick(event){
    var loginmessage, loginscreen=[];
    if(this.state.isLogin){
      loginscreen.push(<Register key="register-page" parentContext={this} appContext={this.props.appContext}/>);
      loginmessage ='';
      
      // loginButtons.push(
      //   // <div>
      //   // <MuiThemeProvider>
      //   //   <div>
      //   //      <RaisedButton label={"Login"} primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
      //   //  </div>
      //   //  </MuiThemeProvider>
      //   // </div>
      // )
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     isLogin:false
                   })
    }
    // else{
    //   loginButtons.push(
    //     <div>
    //     <MuiThemeProvider>
    //       <div>
    //          <RaisedButton label={"Register Here"} primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
    //      </div>
    //      </MuiThemeProvider>
    //      </div>
    //   )
    //   loginscreen.push(<Login parentContext={this} appContext={this.props.appContext}/>);
    //   // loginmessage="Not Registered yet.Go to registration";
    //   this.setState({
    //                  loginscreen:loginscreen,
    //                 //  loginmessage:loginmessage,
    //                  loginButtons:loginButtons,
    //                  isLogin:true
    //                })
    // }
  }
  render() {
    return (
      <div className="loginscreen">
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          {/* {this.state.loginButtons} */}
        </div>
      </div>
    );
  }
}



