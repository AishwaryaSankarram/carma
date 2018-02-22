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
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    handleClick(e){
        console.log("click on polyline vertex----------->", e);
        let latLng = e.latLng;
        let existingLine =  this.refs.gPolyLine;
        let vertex = e.vertex; 
        if(vertex > -1){
            let speed = prompt("Please enter the speed at this point.");
            if(speed > 0){
               let point = existingLine.getPath().getAt(vertex);
               point.speed = speed;
               existingLine.getPath().setAt(vertex, point);
            }
        }
        
    }

    createPoly(poly){
        let p = []; 
        for(let i=0; i< poly.length; i++) {
            let obj = {lat: poly[i].lat(), lng: poly[i].lng()};    
             if(typeof(poly[i].speed) !== 'undefined') 
                obj.speed = poly[i].speed; 
            p.push(obj);
        }
        return p;
    }

    method = (event) => {
        console.log("Child method");
        console.log(this.refs.gPolyLine);
        let poly = this.refs.gPolyLine.getPath().getArray();
        let gPolyLine = this.createPoly(poly);
        return gPolyLine;
    }

    render() {
        let x = <Polyline ref="gPolyLine"
        path={ this.props.pathCoordinates }
        options={ this.state.lineOptions }
        editable={ true }
        draggable={ true }
        onClick={this.handleClick}
        />;
        return (
            x
        );
    }
}