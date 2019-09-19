import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Row from "./components/Row";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      logs: [],
      filter: ""
     };
     
     this.sortObj = this.sortObj.bind(this);
     this.comparison = this.comparison.bind(this);
     this.onChange = this.onChange.bind(this);
     this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    
  }
 
  sortObj = (key => {
    let newarr = [...this.state.logs];
    newarr.sort(this.comparison(key));
    this.setState({logs: newarr});
  });

  comparison = (key => {
    return function (a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  })

  onChange = (event) => {
    console.log(event);
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      this.setState({ logs: JSON.parse(reader.result) })
    }
    //TODO: fix cancel crashing fileupload
    reader.readAsText(file);
  }

  handleFilter = (e) => {
    // console.log(e.target.value);
    const logs = this.state.logs;
    // let filtered= [];
    console.log("filtered data: ");
    this.setState({[e.target.name]: e.target.value});
    // this.setState({logs: filtered});
  }

  render() {
    const {filter, logs}= this.state;
    //return the matching object from logs based on any value typed in filter input, if filter is empty gives back all the logs
    const filteredData = logs.filter(log=>{
      return Object.keys(log).some(key =>
        log[key].toLowerCase().includes(filter.toLowerCase())
      );
    })
    // TODO: make it more dynamic for handling jsons...
    return (
      <div className="App">
      <header className="App-header">
      <div className="text-center"><h2>JS Log Viewer</h2></div>
      <div className="row">
        <div className="col-md-6">
          <input type="file" onChange={this.onChange} />
        </div>
        <div className="col-md-6">
        {logs.length>1 ? 
        <input value={this.state.filter} onChange={this.handleFilter} placeholder="Search or filter records" name="filter"/>
        : null }
        </div>
      </div>
          <div className="row">
            <table className="table table-hover table-dark">
              <thead>
              {logs.length>1 ? 
                <tr>
                  <th scope="col" onClick={() => this.sortObj('datetime')}>#</th>
                  <th scope="col" onClick={() => this.sortObj('type')}>Type</th>
                  <th scope="col" onClick={() => this.sortObj('name')}>Name</th>
                  <th scope="col" onClick={() => this.sortObj('message')}>Message</th>
                  <th scope="col" onClick={() => this.sortObj('source')}>Source</th>
                </tr> : null }
              </thead>
              <tbody>
                {filteredData.length>1 ? filteredData.map( (rowData,index) => <Row key={index} {...rowData} />): null }
              </tbody>
            </table>
          </div>
      </header>
    </div>
    );
  }
}

export default App;