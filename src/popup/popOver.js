/*import React, {Component} from 'react';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import { InfoWindow } from 'react-google-maps';
// import Input, { InputAdornment } from 'material-ui/Input';
// import { FormControl, FormHelperText } from 'material-ui/Form';
import {MuiThemeProvider, TextField}  from 'material-ui';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import '../css/modal.css';

export class SpeedModal extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      // modalIsOpen: this.props.modalIsOpen, 
      speed: this.props.speed || ""
    };
  this.closeModal = this.closeModal.bind(this);
  this.onSave = this.onSave.bind(this);
  }

   closeModal() {
    // this.setState({modalIsOpen: false});
    this.props.cancelAction();
  }

  onSave = (event) => {
    event.preventDefault();
    // this.setState({modalIsOpen: false});
    this.props.okAction(this.state.speed, this.props.vertex);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  onKeyPress(event){
    console.log("event------->", event);
  }



  render(){
    return (
          <InfoWindow options={{alignBottom: true}}
          position={this.props.coordinates} onCloseClick={this.closeModal} >
          <div style={{background: 'white'}}>
           <MuiThemeProvider>
           {/*<form onSubmit={this.onSave}>
                 <TextField
                    id="speed" autoFocus={true}
                    value={this.state.speed}
                    onChange={this.handleChange}
                    suffix="mph"
                    // placeholder="Miles per hour"
                    floatingLabelText="Speed"
                  />
               </form>*/}
                <form onSubmit={this.onSave}>
             <FormGroup controlId="speed" bsSize="sm">
                 <FormControl
                   autoFocus
                   type="text"
                   // maxLength={3}
                   style={{float: "left", width: 45}}
                   value={this.state.speed}
                   placeholder="Miles per hour"
                   onChange={this.handleChange}
                   onKeyPress={this.onKeyPress.bind(this)}
                 /><span style={{marginTop: 5}}>&nbsp; mph</span>
                 </FormGroup>
                 </form>

             </MuiThemeProvider>
           </div>
           </InfoWindow>
    );
   }

}*/




/*import React from 'react';
import {Popover, MuiThemeProvider} from 'material-ui';
import Typography from 'material-ui/styles/typography';
// import { withStyles } from 'material-ui/styles';
// import Grow from 'material-ui/transitions/Grow';
// import Paper from 'material-ui/Paper';
import { Manager, Target, Popper } from 'react-popper';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit,
  },
  popover: {
    pointerEvents: 'none',
  },
  popperClose: {
    pointerEvents: 'none',
  },
});

class MouseOverPopover extends React.Component {
  state = {
    anchorEl: null,
    popperOpen: false,
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.target });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  handlePopperOpen = () => {
    this.setState({ popperOpen: true });
  };

  handlePopperClose = () => {
    this.setState({ popperOpen: false });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, popperOpen } = this.state;
    const open = !!anchorEl;

    return (
        
        <MuiThemeProvider >
        <div>
        <div onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose}>
          Hover with a Popover.
        </div>
        <Popover
          // className={classes.popover}
          // classes={{
            // paper: classes.paper,
          // }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <div>I use Popover.</div>
        </Popover>
    
        </div>
            </MuiThemeProvider >

    )
  }
}
  export default MouseOverPopover;*/