import React, {Component} from 'react';
import {MuiThemeProvider, RaisedButton, TextField} from 'material-ui';
import Autocomplete from "react-google-autocomplete";
import AddIcon from 'material-ui/svg-icons/content/add';
import {MyModal} from '../popup/Modal.jsx';

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
            modalIsVisible: false,
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
    //For new scenario, change in name not persisted
    let s;
    if((!nextProps.scenario.name ||  nextProps.scenario.length === 0) && this.state.scenario.id.length === 0) //Reloading empty scenario
        s = this.state.scenario;
    else if(!nextProps.scenario.name ||  nextProps.scenario.length === 0) //Change to new scenario
        s = {name: "", id: ""};
    else
        s = nextProps.scenario;

		this.setState({
			scenario: s,
			focus:false,
          	autoComplete: {
            	address: address ? address.formattedAddress : "" ,
            	placeId: address ? address.placeId : "",
            	location: {type:"point", coordinates: address ? address.location.coordinates : []}
         	}
		});
	}


	handleSubmit(){
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

  handleChange = (event) => {
    var scenario_name = event.target.value;
    var scenarioObj = this.state.scenario;
    scenarioObj.name = scenario_name;
    this.setState({
      scenario: scenarioObj
    });
    if(this.props.disabled) {
      this.props.onNameChange(this.state.scenario.name)
    }
  }

  deleteScenario(){
    this.setState({modalIsVisible: true});
  }

  confirmDelete(){
    this.setState({modalIsVisible: false});
    this.props.handleDelete(this.state.scenario);
  }

  closeModal(){
    this.setState({modalIsVisible: false});
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
                    icon={<AddIcon />} label="Add Car" title="Add Car"
	 									primary={true} style={style} onClick={this.addCar} />
		  			<RaisedButton label="Save" primary={true} style={style} disabled={this.props.disabled || this.state.scenario.name.length === 0}
		  										title="Save Scenario" onClick={event => this.handleSubmit(event)} />
            {this.state.modalIsVisible &&
               <MyModal title="Delete Scenario" modalIsOpen={this.state.modalIsVisible} 
                    content="Are you sure you want to delete this scenario?"
               		  okAction={this.confirmDelete.bind(this)} cancelAction={this.closeModal.bind(this)} />}
            {this.state.scenario.id.length > 0 &&     		  
          		 <div className="scenario-delete-container">
            				<div className="scenario-delete-icon" title="Delete Scenario" onClick={this.deleteScenario.bind(this)}><i className="fa fa-trash-o"></i></div>
          		 </div>}
	  			</div>
			</MuiThemeProvider>
		);

	}
}
