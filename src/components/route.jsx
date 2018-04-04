import React from 'react';
import { Polyline } from "react-google-maps";
import {Icon} from "./icon.jsx";

export class Route extends React.Component {
    constructor(props) {
        super(props);
        this.polyLineEle = this.polyLineEle.bind(this);
    }

    polyLineEle() {
        let lineOptions = {
            strokeColor: this.props.color,
            strokeOpacity: 1.0,
            strokeWeight: 2,
            zIndex: 150
        };
        console.log("Rendering non-editable route----------" , lineOptions , this.props);
        return (
            <div>
                <Polyline path={ this.props.pathCoordinates }
                options={lineOptions}
                editable={this.props.allowEdit}
                draggable={this.props.allowEdit}
                />
                <Icon markerPos={this.props.pathCoordinates} allowEdit={this.props.allowEdit} color={this.props.color}/>
            </div>
        );
    }

    render() {
        return this.polyLineEle();
    }
}
