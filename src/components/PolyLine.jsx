import React from 'react';
import { Polyline } from "react-google-maps";
import {SpeedModal} from "../popup/SpeedModal.jsx";
let isDragging = false;
export class PolyLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lineOptions: {
                strokeColor: this.props.color,
                strokeOpacity: 1.0,
                strokeWeight: 2,
            },
            modalIsVisible: false,
            vertex: null
        }
        this.method = this.method.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.polyLineEle = this.polyLineEle.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentDidUpdate() {
        var path = this.refs.gPolyLine.getPath();
        let google = window.google;
        
        let self = this;
        google.maps.event.addListener(path, 'insert_at', function(e){
            // console.error("componentDidUpdate path insert_at event ", e);
            self.props.saveHandler();
        }); 
        google.maps.event.addListener(path, 'remove_at', function(e){
            // console.error("componentDidUpdate path remove_at event", e);
            self.props.saveHandler();
        }); 
        google.maps.event.addListener(path, 'set_at', function(e){
            // console.log("isDragging----------" + isDragging);
            if(!isDragging) {
                // console.error("componentDidUpdate  path set_at event==============>", e);
                let poly = self.refs.gPolyLine.getPath().getArray();
                let pathData = self.createPoly(poly);
                self.props.dragHandler(pathData);
                // self.props.saveHandler();
            }
            
        }); 
    }

    componentWillUnmount() {
        isDragging=false;
        let google = window.google;
        var path = this.refs.gPolyLine.getPath();
        google.maps.event.clearListeners(path, 'insert_at');
        google.maps.event.clearListeners(path, 'remove_at');
        google.maps.event.clearListeners(path, 'set_at');
        this.props.onRef(undefined);
    }

    handleClick(e){
        console.log("click on polyline vertex----------->", e);
        let vertex = e.vertex;
        if(vertex > -1){
            this.setState({vertex: vertex, modalIsVisible: true});
        }
    }

    closeDialog(){
        this.setState({modalIsVisible: false});
    }

    setSpeed(speed, vertex){
         console.log("Comes to setSpeed ---------->" , speed, vertex);
         this.setState({modalIsVisible: false});   
         if(speed > 0){
           let existingLine =  this.refs.gPolyLine;
           let point = existingLine.getPath().getAt(vertex);
           point.speed = speed;
           existingLine.getPath().setAt(vertex, point);
           this.props.saveHandler();
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

    handleDrag() {
        console.log("Handling drag event on the polyline--------");
        let p = this.refs.gPolyLine;
        let pathArray = p.getPath().getArray();
        let pathData = this.createPoly(pathArray);
        isDragging = false;
        this.props.dragHandler(pathData);
    }

    handleDragStart(){
        isDragging = true;
    }

    polyLineEle() {
        let lineOptions = {
            strokeColor: this.props.color,
            strokeOpacity: 1.0,
            strokeWeight: 2,
            zIndex: 150
        };
        console.log("Rendering red polyline----------" , lineOptions , this.props);
        return (
            <div>
                <Polyline ref="gPolyLine"
                path={ this.props.pathCoordinates }
                options={lineOptions}
                onClick={this.handleClick}
                onDragEnd={this.handleDrag}
                editable={this.props.allowEdit}
                draggable={this.props.allowEdit}
                onDragStart={this.handleDragStart}
                />
                {this.state.modalIsVisible && 
                      <SpeedModal title="Enter Speed" modalIsOpen={this.state.modalIsVisible}
                      okAction={this.setSpeed} cancelAction={this.closeDialog} vertex={this.state.vertex}/> }
            </div>
        );
    }
    render() {
        return this.polyLineEle();
    }
}
