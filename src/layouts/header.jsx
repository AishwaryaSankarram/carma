import React, {Component} from 'react';
import {Dropdown} from '../components/dropDown';
import {MuiThemeProvider, RaisedButton} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';

const labelStyle = {
  position: "relative",
  opacity: 1,
  fontSize: 14,
  letterSpacing: 0,
  textTransform: "uppercase",
  fontWeight: 500,
  margin: 0,
  paddingRight: "15px",
  paddingLeft: "0px",
  fontFamily: "Roboto, sans-serif"
};

export class Header extends Component {

  constructor(props){
    super(props);
    this.state = {
      addScenarioDisabled: false
    }
    this.menuClick = this.menuClick.bind(this);
    this.scenarioChangeHandler = this.scenarioChangeHandler.bind(this);
  }

  scenarioButtonHandler(state) {
    this.setState({addScenarioDisabled: state});
  }

  menuClick(){
    this.props.menuClickIns();
  }

  scenarioChangeHandler(){
    this.props.scenarioChangeHandler("");
  }

  componentDidMount() {
    this.props.onHeaderMount(this);
  }



  render(){
    var loginData=JSON.parse(localStorage.getItem("loginData"));
    let userName=loginData ? loginData.name : "";
    console.log("username: ", loginData);
    return (<MuiThemeProvider>
      <div className="header_part">
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
        <RaisedButton className="add_car" labelStyle={labelStyle} labelPosition="after"
                    icon={<AddIcon />} label="Add Scenario" title="Create Scenario"
                    primary={true}
                    disabled={this.state.addScenarioDisabled}
                    onClick={this.scenarioChangeHandler} />

        <div className="scenario_option">
          <Dropdown scenarios={this.props.scenarios} currentScenario={this.props.currentScenario}
                      changeHandler={this.props.scenarioChangeHandler} />
        </div>
      </div>
      </MuiThemeProvider>);
  }
}
