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
		this.props.handleSubmit();
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
          return "auto_address focus_false_at_data_avail";
        } else if (self.state.focus === false && !this.state.autoComplete.address && !this.state.autoComplete.address.length > 0) {
          return "auto_address";
        } else 
          return "auto_address focus_auto_address";
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
		  				<TextField className="scenario_val" hintText="Scenario name" floatingLabelText="Scenario Name" />
                  		<Autocomplete className="autoComplete" types={["address"]} placeholder="Enter your Address"
			                    value={this.state.autoComplete.address} onChange={event=> this.onChangeAutoComplete(event)}
			                    onFocus={this.addClass} onBlur={this.removeClass} 
			                    onPlaceSelected={place => this.setPlace(place)} 
			                    title={this.state.autoComplete.address} />
                    	<div className="autoComplete_placeholder">Address</div>
                  		<div className="autoBorder"></div>
                	</div>
		  			<RaisedButton className="saveBtn" labelStyle={labelStyle} labelPosition="after" icon={<AddIcon />} label="Add Car" 
		  			 		primary={true} style={style} onClick={this.addCar}/>
		  			<RaisedButton label="Save" primary={true} style={style} onClick={event => this.handleSubmit(event)} />
	  			</div>
			</MuiThemeProvider>
		);

	}
}
		