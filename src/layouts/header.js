import React, {Component} from 'react';
export class Header extends Component {
  constructor(props){
    super(props);
    this.handleBtnClick = this.handleBtnClick.bind(this);
  }
  handleBtnClick() {
    this.props.onBtnClick(true);
  }
  render(){
    return (
        <div className="header_part">
          <div className="page_logo">
              <figure className="logo">
                <img src="http://carmanetworks.com/img/assets/Carma%20Network.png" alt="Carma Networks" title="Carma Networks"/>
              </figure>
          </div>
          <div className="header_title">Route Planner</div>
          <div className="add_car">
              <button onClick={this.handleBtnClick} className="new_car" title="Add Car"><i className="fa fa-plus">Add Car</i></button>
          </div>
        </div>
    );
  }
}

