import React, {Component} from 'react';
import {MuiThemeProvider, RaisedButton, TextField} from 'material-ui';
import Autocomplete from "react-google-autocomplete";
import AddIcon from 'material-ui/svg-icons/content/add';

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
		let address = props.address;
		this.state = {
			focus:false,
			scenario: (!props.scenario.name ||  props.scenario.length === 0) ?  {name: "", id: ""} : props.scenario,
          	autoComplete: {
            	address: address ? address.formattedAddress : "" ,
            	placeId: address ? address.placeId : "",
            	location: {type:"point", coordinates: address ? address.location.coordinates : []}
         	}
		}
		//Action Methods below
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addCar = this.addCar.bind(this);
		//AutoComplete methods below
		this.addClass=this.addClass.bind(this);
        this.getClass = this.getClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
        this.onChangeAutoComplete = this.onChangeAutoComplete.bind(this);
	}

	componentWillReceiveProps(nextProps){
		let address = nextProps.address;
		this.setState({
			scenario: (!nextProps.scenario.name ||  nextProps.scenario.length === 0) ?  {name: "", id: ""} : nextProps.scenario,
			focus:false,
          	autoComplete: {
            	address: address ? address.formattedAddress : "" ,
            	placeId: address ? address.placeId : "",
            	location: {type:"point", coordinates: address ? address.location.coordinates : []}
         	}
		});
	}


	handleSubmit(){
		console.log("Submit Clicked on ScenarioActions");
		if(this.state.scenario.name && this.state.scenario.name.length > 0){
			let scenarioObj= {
			scenario: this.state.scenario,
			address: this.state.autoComplete
		}
			this.props.handleSubmit(scenarioObj);	
		}
	}

	addCar(){
		this.props.addCarHandler();
	}

	setPlace(place){
      console.log(place);
      this.setState({
        autoComplete: {
            address: place.formatted_address,
            placeId: place.place_id,
            location: {type:"point", coordinates:[place.geometry.location.lat(),place.geometry.location.lng()]}
          }
      });
      this.props.onAddressChange(place) ;
    }

	getClass(){
        let self = this;
        if(self.state.focus === false && this.state.autoComplete.address && this.state.autoComplete.address.length > 0) {
          return "auto_address scenario_val focus_false_at_data_avail";
        } else if (self.state.focus === false && !this.state.autoComplete.address && !this.state.autoComplete.address.length > 0) {
          return "auto_address scenario_val";
        } else
          return "auto_address scenario_val focus_auto_address";
    }

    addClass(){
      let self = this;
      self.setState({ focus: true });
    }

    removeClass(){
      let self = this;
      self.setState({ focus: false });
    }

    onChangeAutoComplete(event){
      this.setState({
	      	autoComplete: {
	        	address: event.target.value
	        }
       });
    }

    handleChange = (event) => {
      var scenario_name = event.target.value;
      var scenarioObj = this.state.scenario;
      scenarioObj.name = scenario_name;
      this.setState({
        scenario: scenarioObj
      });
    }  
  
	render(){
		return(
			<MuiThemeProvider>
	  			<div id="btn-submit-container" className="pull-right ">
	  				<div className={this.getClass()}>
                  		<Autocomplete className="autoComplete" types={["address"]} placeholder="Address"
			                    value={this.state.autoComplete.address} onChange={event=> this.onChangeAutoComplete(event)}
			                    onFocus={this.addClass} onBlur={this.removeClass}
			                    onPlaceSelected={place => this.setPlace(place)}
			                    title={this.state.autoComplete.address}/>
                    	<div className="autoComplete_placeholder">Address</div>
                  		<div className="autoBorder"></div>
                	</div>
            <TextField className="scenario_val" hintText="Scenario name" floatingLabelText="Scenario Name"
             		   value={this.state.scenario.name} onChange={this.handleChange} required/>
		  			<RaisedButton className="saveBtn" labelStyle={labelStyle} labelPosition="after" 
		  					icon={<AddIcon />} label="Add Car"
		  			 		primary={true} style={style} onClick={this.addCar} />
		  			<RaisedButton label="Save" primary={true} style={style} disabled={this.props.disabled}
		  										onClick={event => this.handleSubmit(event)} />
	  			</div>
			</MuiThemeProvider>
		);

	}
}
