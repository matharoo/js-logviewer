import React, { Component } from 'react';
//Dynamic row component which accepts all the object props and also recieves headers and then displays based on headers values.. so JSON can have as many properties inside the object. It will work fine as long as we have Object Array like sample-log file.
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
    if (this.props.type !== undefined) {
      this.setState({ color: this.props.type.toLowerCase() })
    }
    //save the props.header to header state for row which we commpare to whats passed to us.
    this.setState({ headers: this.props.header })
  }

  //important logic to update state after we are filtering and sorting.. this makes sure its rendered properly with right styles.
  componentDidUpdate(prevProps, prevState) {
    // console.log("comoponent updated!!");
    // console.log("new type is "+this.props.type); 
    if (prevProps.type !== this.props.type) {
      this.setState({ color: this.props.type.toLowerCase() })
    }
  }

  // renders each table row.. can actually move the whole table in here so that it becomes a full table component
  render() {
    return (
      <tr className={this.state.color + " " + this.props.datetime}>
        {this.state.headers.map((val, ind) => {
          if (this.props.hasOwnProperty(val)) {
            return <td key={val}>{this.props[val]}</td>
          }
          else {
            return <td key={val}><pre className="text-white">---------</pre></td>
          }
        })
        }
      </tr>
    );
  }
}

export default Row;