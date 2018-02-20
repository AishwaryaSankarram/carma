import React from 'react';
import { Polyline, InfoWindow } from "react-google-maps";
export class MultiPolyLine extends React.Component {
	constructor(props){
		super(props);
		this.state = {lineOptions: {
                                strokeColor: '#0000FF',
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                          		},
          isOpen: false                              
	   }
     this.onToggleOpen = this.onToggleOpen.bind(this);
	}

  onToggleOpen() {
    this.setState({isOpen: !this.state.isOpen});
  }

 
	render(){
    console.log("Rendering Multiple Polylines--------------");
    let that = this;
    let pl = this.props.routes.map(function(line, index) {
            return (
              <Polyline key={index + "_polyline"}  path={line} options={that.state.lineOptions} editable={false} draggable={false} onMouseOver={that.state.onToggleOpen}> 
                {that.state.isOpen && <InfoWindow onCloseClick={that.onToggleOpen}>
                  {"Routes for index---" + index}
                </InfoWindow>}
              </Polyline>
              );
        });
    console.log("All Polylines------------>", pl)
    return <div>{pl}</div>;
	}
}