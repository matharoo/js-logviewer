import React, { Component } from 'react';
//if header is equal to props.[header]
//if obj key matches with one in header then we show it up otherwise leave it blank byt setting its value to blank
// for each row go over headers for 0 to headers.length then compare the header if its present in the obj keys if its then put the value otherwise leave it blank

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      headers: [],
      color: ""
     };
  }

  componentDidMount() {
    // console.log("props "+typeof this.props.header);
    if(this.props.type!==undefined){
      this.setState({color: this.props.type.toLowerCase()})
    }
    this.setState({headers: this.props.header})
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("comoponent updated!!");
    // console.log("new type is "+this.props.type); 
    if (prevProps.type !== this.props.type) {
      this.setState({color:this.props.type.toLowerCase()})
    }
  }

  render() {
    return (
      <tr className={this.state.color+" "+this.props.datetime}>
      {this.state.headers.map((val,ind)=>{
          if(this.props.hasOwnProperty(val)){
            return <td key={val}>{this.props[val]}</td>
          }
          else{
            return <td key={val}><pre className="text-white">---------</pre></td>
          }
        })
      }
      </tr>
    );
  }
}

export default Row;