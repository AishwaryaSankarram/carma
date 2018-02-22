import React from 'react';
import { Polyline } from "react-google-maps";
export class PolyLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lineOptions: {
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                editable: true,
                draggable: true
            }
        }
        this.method = this.method.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    method = (event) => {
        console.log("Child method");
        console.log(this.refs.gPolyLine);
        let gPolyLine = this.refs.gPolyLine.getPath().getArray();
        return gPolyLine;
    }

    render() {
        let x = < Polyline ref = "gPolyLine"
        path={ this.props.pathCoordinates }
        options={ this.state.lineOptions }
        editable={ true }
        draggable={ true }
        />;
        return (
            x
        );
    }
}