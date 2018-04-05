import React, {Component} from 'react';
import axios from 'axios';
import {MuiThemeProvider, RaisedButton, TextField} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';


const apiData = require('../utils/api.jsx');
const apiUrl = apiData.baseUrl;
const style = {
  margin: 15,
  customWidth:{
    width:100
  }
};

const labelStyle = {
	position: "relative",
	opacity: 1,
	fontSize: 14,
	letterSpacing: 0,
	textTransform: "uppercase",
	fontWeight: 500,
	margin: 0,
	paddingLeft: 0,
	paddingRight: 16
}

export class ScenarioActions extends Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(){
		console.log("Submit Clicked on ScenarioActions");
		this.props.handleSubmit();
	}

	render(){
		return(
			<MuiThemeProvider>
	  			<div id="btn-submit-container"  className="pull-right ">
		  			 <TextField className="scenario_val" hintText="Enter scenario name" floatingLabelText="Scenario Name" />
		  			 <TextField className="profile_val" hintText="Enter an address" floatingLabelText="Your Address" />
		  			 <RaisedButton className="saveBtn" labelStyle={labelStyle} labelPosition="after" icon={<AddIcon />} label="Add Car" primary={true} style={style} />
		  			 <RaisedButton label="Save" primary={true} style={style} onClick={event => this.handleSubmit(event)} />
	  			</div>
			</MuiThemeProvider>
		);

	}
}
