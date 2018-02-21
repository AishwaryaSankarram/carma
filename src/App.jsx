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
    loginPage.push(<LoginPage appContext={this}/>);
    homePage.push(<Home appContext={this}/>);

    this.state={
      loginPage:loginPage,
      localData:localData,
      homePage:homePage

      // homePage:[]
    }
    
  }
  
  render() {

    var isLoggedIn = this.state.localData;

    return (
      <div className="App_login">
      {!isLoggedIn ? (this.state.loginPage):(this.state.homePage)}
      </div>
    );
  }
}
