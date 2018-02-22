import React, {Component} from 'react';
export class Header extends Component {
  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
  }
  handleBtnClick() {
    
    this.props.onBtnClick(true);
  }

  logout(){
    this.props.logout(true);
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
              <button className="logout_icon new_car" title="Logout" onClick={this.logout}>
                <i className="fa fa-power-off"> </i>
              </button>
          </div>
          <div className="add_car">
              <button onClick={this.handleBtnClick} className="new_car" title="Add Car">
              <i className="fa fa-plus"> Add Car</i>
              </button>
          </div>

        </div>
    );
  }
}

