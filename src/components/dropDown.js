import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {MyModal} from '../popup/Modal.jsx';
const styles = {
  customWidth: {
    width: 250,
  },
};
export class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.scenarios,
      value: this.props.currentScenario,
      dialogVisible: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onSaveConfirm = this.onSaveConfirm.bind(this);
  }

  closeDialog(){
    this.props.changeHandler(this.state.value);
    this.setState({dialogVisible: false});
  }

  handleChange(event, index, value) {
    this.setState({
      value: value,
      dialogVisible: true
    });

  }

  componentWillReceiveProps(nextProps){
    if(nextProps && (nextProps.scenarios.length !== this.state.items.length ||  JSON.stringify(nextProps.currentScenario) !== JSON.stringify(this.state.value)))
      this.setState({value: nextProps.currentScenario, items: nextProps.scenarios});
  }

  onSaveConfirm() {
    this.props.changeAndSave(this.state.value);
    this.setState({dialogVisible: false});
  }



  render() {
    console.info("Rendering scenario Actions----", this.state, this.props);
    let self = this;
    let menuElements = self.state.items.map( (item, index) => {
      return (
          <MenuItem key={index + "_" + item.id} value={item} primaryText={item.name} />
        );
    });
    menuElements.push(<MenuItem key={menuElements.length + "_" + 0} value="" primaryText="New Scenario" />);
    return(
      <div>
        <MuiThemeProvider >
        <div>
          <div className="scenario-dropdown">Scenario</div>
          <SelectField value={this.state.value} onChange={this.handleChange} style={styles.customWidth}>
            {menuElements}
          </SelectField>
          </div>
        </MuiThemeProvider>
        {this.state.dialogVisible && <MyModal title="Please Confirm" modalIsOpen={this.state.dialogVisible}
        content="Do you want to save this scenario before switching?"
        labelCancel="Discard Changes"
        data={this.state.value}
               okAction={this.onSaveConfirm} cancelAction={this.closeDialog} /> }
      </div>

    );
  }
}
