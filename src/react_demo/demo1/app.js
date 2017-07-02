import React from 'react';
import ReactDOM from 'react-dom';

let Demo = React.createClass({
  getInitialState: function(){
    return {clicked:0};
  },
  handleClick: function(){
    console.log(this.state);
    this.setState({clicked: this.state.clicked++});
    this.setState({clicked: this.state.clicked++});
  },
  render: function(){
    // return <input type="button" onClick={this.handleClick} value={this.state.clicked}/>;
    // return <h1>Hello {this.props.name}</h1>
    return (
      <div>
        <h1>Hello {this.props.name}</h1>
        <input type="button" onClick={this.handleClick} value={this.state.clicked}/>
      </div>
      )
  }
});

ReactDOM.render(
  <Demo name="Jack"/>,
  document.querySelector('#content')
);

