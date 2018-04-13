import React, {Component} from 'react';
import { FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {MuiThemeProvider,RaisedButton}  from 'material-ui';
//import axios from 'axios';
import '../css/car.css';
const apiData = require('../utils/api.jsx');


export class Car extends Component {
	constructor(props) {
    super(props);
    let carLabel = this.props.sourceCar.carLabel ? this.props.sourceCar.carLabel + "_1" : "";
    carLabel = carLabel.length === 0 ? this.props.car.carLabel || "" : carLabel ;
    let speed = this.props.sourceCar.speed || "";
    speed = speed.length === 0 ? this.props.car.speed || ""  : speed ;
    this.state = {
      carLabel: carLabel,
	    speed: speed
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  validateForm() {
    return (this.state.carLabel.length > 0 && parseFloat(this.state.speed) > 0) ? true : false; //TODO: Validations for the form
  }

  handleChange = (event, item) => {
    if(item){
      this.setState({
        [item]: event.target.checked
      });
    }else{
      this.setState({
        [event.target.id]: event.target.value
      });
    }

  }

  handleSubmit = (event) => {
    event.preventDefault();
    const gpsCanServers = ["192.168.1.74","192.168.1.75","192.168.1.76","192.168.1.77","192.168.1.78"];
    const v2xServers = ["192.168.1.64","192.168.1.65","192.168.1.66","192.168.1.67","192.168.1.68"];
    var defaultParams = {
      stepSize:"1",
      startAtSec: new Date().getTime(),
      v2xServer: v2xServers[this.props.carIndex % 5],
      gpsCanServer: gpsCanServers[this.props.carIndex % 5],
      remoteIp: apiData.remoteIp,
      remotePath:apiData.remotePath,
      remotePass:apiData.remotePass,
      remoteUser:apiData.remoteUser
    };
    let sourceCar = this.props.sourceCar;
    if(Object.keys(sourceCar).length > 0){
      defaultParams = Object.assign(defaultParams, sourceCar); //Adding old car params
      //Following params will have to be updated for new car
      defaultParams.startAtSec =  new Date().getTime();
      defaultParams.v2xServer = v2xServers[this.props.carIndex % 5];
      defaultParams.gpsCanServer = gpsCanServers[this.props.carIndex % 5];
      defaultParams.isSaved = false;
    }
    let carData = Object.assign(defaultParams, this.state); //Adding current params
    carData.carId = this.props.car? this.props.car.carId : "";
    console.log("saving carData------" , carData);
    this.props.onSave(carData);
  }

  handleCancel(){
    this.props.onClose();
  }

  render() {
    return (
      <div className="Car">
        <MuiThemeProvider>
        <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="carLabel" bsSize="sm">
            <ControlLabel>Car Label</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.carLabel}
              placeholder="Car Label"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="speed" bsSize="sm">
            <ControlLabel>Initial Speed</ControlLabel>
            <FormControl
              type="text"
              value={this.state.speed}
              placeholder="Miles per hour"
              onChange={this.handleChange}
            />
          </FormGroup>
          
          <div className="modal-footer">
            <RaisedButton className="action-btns" disabled={!this.validateForm()} label="Save" primary={true} type="submit"/>
            <RaisedButton className="action-btns" label="Cancel" onClick={this.handleCancel}/>
          </div>
        </form>
        </MuiThemeProvider>
      </div>
    );
  }
}
