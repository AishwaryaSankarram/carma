import React from 'react';
import { Polyline } from "react-google-maps";
import {Icon} from "./icon.jsx";

export class Route extends React.Component {
    constructor(props) {
        super(props);
        this.polyLineEle = this.polyLineEle.bind(this);
    }

    handleClick(){
        // console.log("Clicking on other PL------");
        this.props.switchCar(this.props.carId);
    }

    polyLineEle() {
        let lineOptions = {
            strokeColor: this.props.color,
            strokeOpacity: 1.0,
            strokeWeight: 4,
            zIndex: 100
        };
        console.log("Rendering non-editable route----------" , lineOptions , this.props);
        return (
            <div>
                <Polyline path={ this.props.pathCoordinates }
                options={lineOptions}
                clickable={true}
                onClick={this.handleClick.bind(this)}
                />
                <Icon markerPos={this.props.pathCoordinates} allowEdit={this.props.allowEdit} color={this.props.color}
                carId={this.props.carId} switchCar={this.props.switchCar}/>
            </div>
        );
    }

    render() {
        return this.polyLineEle();
    }
}
