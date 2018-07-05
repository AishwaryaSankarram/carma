import React, {Component} from 'react';
import Modal from 'react-modal';
import {MuiThemeProvider,RaisedButton,RadioButton, RadioButtonGroup, MenuItem, SelectField}  from 'material-ui';
import '../css/modal.css';

const style = {
  button: {
    margin: 15
  },
  customWidth:{
    width:200,
    marginTop: -12
  },
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

export class NewScenario extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalIsOpen: this.props.modalIsOpen,
      cloneFrom: this.props.data
		};
    this.cloneType = "start-new";
    this.closeModal = this.closeModal.bind(this);
    this.cancelAction = this.cancelAction.bind(this);
    this.onSave = this.onSave.bind(this);
	}

  componentWillMount() {
    Modal.setAppElement('div');
  }

	closeModal() {
    let new_scenario = this.props.message.length === 0 ?
                    {scenario: this.props.message, cloneFrom: this.state.cloneFrom, cloneType: this.cloneType} : 
                    {scenario: this.props.message, cloneFrom: "", cloneType: ""};
    this.setState({modalIsOpen: false});       
    this.props.cancelAction(new_scenario);
  }

  onSave() {
    let new_scenario = this.props.message.length === 0 ?
                            {scenario: this.props.message, cloneFrom: this.state.cloneFrom, cloneType: this.cloneType} : 
                            {scenario: this.props.message, cloneFrom: "", cloneType: ""};
    this.setState({modalIsOpen: false});                            
    this.props.okAction(new_scenario);
  }

  handleChange(event, index, value) {
    this.setState({
      cloneFrom: value
    });
  }

  cancelAction(){
    this.setState({modalIsOpen: false});  
    this.props.closeModal();
  }

  handleSwitch(event, value) {
    this.cloneType = value;
  }

	render(){
    let menuElements = this.props.scenarios.map( (item, index) => {
      return (
          <MenuItem key={index + "_" + item.id} value={item} primaryText={item.name} />
        );
    });
    let selectItem = <SelectField value={this.state.cloneFrom} onChange={this.handleChange.bind(this)} style={style.customWidth}>
                      {menuElements}
                  </SelectField>;
		return (
		<Modal isOpen={this.state.modalIsOpen}
          shouldCloseOnOverlayClick={false}
          contentLabel="Create New Scenario" className="new-scenario" >
          <MuiThemeProvider>
    					<div className="confirmation-modal">
        					<div className="modal-header">
        					     <h4 className="modal-title">{this.props.message.length === 0 ? "Create New Scenario" : "Change Scenario"}</h4>
        					</div>
                  <div className="modal-body">
                     <div style={{marginBottom: 20,height:20}}>{this.props.isDirty && "Do you want to save this scenario before switching?"}</div>              
        					   {this.props.message.length === 0 && 
                      <RadioButtonGroup name="cloneType" defaultSelected={this.cloneType} onChange={this.handleSwitch.bind(this)}>
                      <RadioButton
                        value="start-new"
                        label="Create new scenario from start"
                        style={style.radioButton}
                      />
                      <RadioButton className="clone-existing-option"
                        value="clone-from"
                        label="Clone using existing scenario"
                        style={style.radioButton}
                      />
                    </RadioButtonGroup>}
                    {this.props.message.length === 0 && selectItem}
                  </div>
                  <div className="modal-footer">
                      <RaisedButton label="Save and Create" primary={true} style={style.button} onClick={this.onSave}/>
                      <RaisedButton label="Discard Changes"  style={style.button} onClick={this.closeModal} />
                      <RaisedButton label="Cancel"  style={style.button} onClick={this.cancelAction} />
                  </div>
    					</div>
          </MuiThemeProvider>
    </Modal>
    );
	}

}
