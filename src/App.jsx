import React, { Component } from 'react';
import './css/App.css';
import LoginPage from './containers/LoginPage.jsx'
import Home from './containers/HomePage.jsx'

export default class App extends Component {
  constructor(props){
    super(props);
    var loginPage=[],homePage=[];
    
    var localData=[];
    localData=localStorage.getItem("loginData");
    loginPage.push(<LoginPage key="app-login-page" appContext={this}/>);
    homePage.push(<Home key="app-home-page" appContext={this}/>);
    //
    this.state={
      loginPage:loginPage,
      localData:localData,
      homePage:homePage
    }
    
  }
  
  render() {

    var isLoggedIn = this.state.localData;

    return (
      <div key="app-login-page" className="App_login">
      {!isLoggedIn ? (this.state.loginPage):(this.state.homePage)}
      </div>
    );
  }
}
