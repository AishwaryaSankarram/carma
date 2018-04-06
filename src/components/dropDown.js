import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';
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
      value: this.props.currentScenario
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event, index, value) {
    console.log("EVENT =>", event);
    this.setState({value: value});
    // this.props.fetchCars(index);
  }

  componentWillReceiveProps(nextProps){
    console.log("again------", nextProps);
    if(nextProps && nextProps.scenarios !== this.state.items)
      this.setState({value: nextProps.currentScenario, items: nextProps.scenarios});
  }
  
  render() {
    let self = this;
    console.log("MENU ITEMS =>", self.state.items, self.props.scenarios);
    let menuElements = self.state.items.map( (item, index) => {
      return (
          <MenuItem key={index + "_" + item.id} value={item} primaryText={item.name} />
        );
    });
    menuElements.push(<MenuItem key={menuElements.length + "_" + 0} value="" primaryText="New Scenario" />);
    console.log("menuElements =>", menuElements);
    return(
      <div>
        <MuiThemeProvider >
          <SelectField value={this.state.value} onChange={this.handleChange} style={styles.customWidth}>
            {menuElements}
          </SelectField>
        </MuiThemeProvider>
      </div>
    );
  }
}
