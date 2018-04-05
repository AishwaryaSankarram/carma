import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
const styles = {
  customWidth: {
    width: 250,
  },
};
export class Header extends Component {
  constructor(props){
    super(props);
    this.menuClick = this.menuClick.bind(this);
    this.state = {
      value: 1,
    };
  }

  menuClick(){
    this.props.menuClickIns();
  }

  render(){
    var loginData=JSON.parse(localStorage.getItem("loginData"));
    let userName=loginData ? loginData.name : "";
    console.log("username: ", loginData);
    return <div className="header_part">
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
        <div className="add_car hide">
          <button className="logout_icon new_car" title="Start Simulation">
            <i className="fa fa-play"> </i>
          </button>
        </div>
        <div className="scenario_option">
        <MuiThemeProvider >
        <SelectField
          value={this.state.value}
          onChange={this.handleChange} style={styles.customWidth}>
          <MenuItem value={1} primaryText="New Scenario" />
          <MenuItem value={2} primaryText="options -1" />
          <MenuItem value={3} primaryText="options -1" />
        </SelectField>
        </MuiThemeProvider>
        </div>
      </div>
  }
}
