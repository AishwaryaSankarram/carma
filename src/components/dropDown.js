import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
    this.setState({value: value});
    this.props.changeHandler(value);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps && (nextProps.scenarios.length !== this.state.items.length ||  nextProps.currentScenario !== this.state.value))
      this.setState({value: nextProps.currentScenario, items: nextProps.scenarios});
  }

  render() {
    // console.info("Rendering scenario Actions----", this.state, this.props);
    let self = this;
    let menuElements = self.state.items.map( (item, index) => {
      return (
          <MenuItem key={index + "_" + item.id} value={item} primaryText={item.name} />
        );
    });
    menuElements.push(<MenuItem key={menuElements.length + "_" + 0} value="" primaryText="New Scenario" />);
    return(
      
        <MuiThemeProvider >
        <div>
          <div className="scenario-dropdown">Scenario</div>
          <SelectField value={this.state.value} onChange={this.handleChange} style={styles.customWidth}>
            {menuElements}
          </SelectField>
          </div>
        </MuiThemeProvider>
      
    );
  }
}
