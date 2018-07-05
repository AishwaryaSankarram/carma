import React, {Component} from 'react';
import {Dropdown} from '../components/dropDown';

export class Header extends Component {

  constructor(props){
    super(props);
    this.menuClick = this.menuClick.bind(this);
    this.scenarioChangeHandler = this.scenarioChangeHandler.bind(this);
  }

  menuClick(){
    this.props.menuClickIns();
  }

  scenarioChangeHandler(){
    this.props.scenarioChangeHandler("");
  }



  render(){
    var loginData=JSON.parse(localStorage.getItem("loginData"));
    let userName=loginData ? loginData.name : "";
    console.log("username: ", loginData);
    return (<div className="header_part">
        <div className="page_logo">
          <figure className="logo">
            <img src="http://carmanetworks.com/img/assets/Carma%20Network.png" alt="Carma Networks" title="Carma Networks" />
          </figure>
        </div>
        <div className="header_title">Carma Route Planner</div>
        <div className="add_car">
          <button className="logout_icon new_car" title={"Logged in as "+userName} onClick={this.menuClick}>
            <i className="fa fa-user-circle">  {userName}</i>
          </button>
        </div>
        <div className="add_car" >
          <button className="add-scenario new_car" title="Create Scenario" onClick={this.scenarioChangeHandler}>
            <i className="fa fa-plus">ADD SCENARIO</i>
          </button>
        </div>
        <div className="scenario_option">
          <Dropdown scenarios={this.props.scenarios} currentScenario={this.props.currentScenario} 
                      changeHandler={this.props.scenarioChangeHandler} />
        </div>
      </div>);
  }
}
