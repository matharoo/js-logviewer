import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Row from "./components/Row";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      logs: [],
      headers: [],
      filter: "",
     };
     
     this.sortObj = this.sortObj.bind(this);
     this.comparison = this.comparison.bind(this);
     this.onChange = this.onChange.bind(this);
     this.handleFilter = this.handleFilter.bind(this);
     this.resetViewer = this.resetViewer.bind(this);
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
    // console.log(event);
    if(event.target.length === 0 ){
      // console.log("cancel was clicked");
      // dont do anything.
    }
    else{
      var file = event.target.files[0];
      var reader = new FileReader();
      
      reader.onload = () => {
        // console.log(reader.result);
        this.setState({ logs: JSON.parse(reader.result) })
        const data= JSON.parse(reader.result);
        // console.log("data is :"+data);
        let headers = data.reduce(function(arr, o) {
          return Object.keys(o).reduce(function(a, k) {
            if (a.indexOf(k) === -1) a.push(k);
            return a;
          }, arr)
        }, []);
        // console.log(headers);
        this.setState({ headers: headers })
      }
      reader.readAsText(file);
    }
    event.target.value = null;
  }

  handleFilter = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  resetViewer = (e) =>{
    // console.log("resetting viewer");
    this.setState({logs: [],headers:[]});
  }

  render() {
    const {filter, logs}= this.state;
    //return the matching object from logs based on any value typed in filter input, if filter is empty gives back all the logs
    const filteredData = logs.filter(log=>{
      return Object.keys(log).some((key) => {
        return log[key].toLowerCase().includes(filter.toLowerCase())
      });
    })
    return (
      <div className="App">
      <header className="App-header">
      <div className="text-center"><h2>JS Log Viewer</h2></div>
      <div className="container">
        <div className="row form-group">
          <div className="col-md-4"></div>
          {logs.length===0 ? 
          <div className="col-md-4 custom-file">
            <input type="file" onChange={this.onChange} className="custom-file-input" id="customFile" name="file"/>
            <label className="custom-file-label" htmlFor="customFile">Choose file</label>
          </div>
          :<button className="btn btn-primary" type="button" onClick={this.resetViewer.bind(this)}>Import a new file</button>}
          <div className="col-md-4">
          {logs.length>1 ? 
          <input className="form-control" value={this.state.filter} onChange={this.handleFilter} placeholder="Search or filter records" name="filter"/>
          : null }
          
        </div>
        </div>
      </div>
        <div className="container">
          <div className="row">
            <table className="table table-hover table-dark">
              <thead>
                <tr>
                {this.state.headers.length>0 ? this.state.headers.map( (header) => <th key={header} scope="col" onClick={this.sortObj.bind(this, header)}><u>{header}</u></th>) : null }
                </tr>
              </thead>
              <tbody>
              {/* checking for headers otherwise the component doesnt recieve header prop */}
                {filteredData.length>0 && this.state.headers.length ? filteredData.map( (rowData,index) => <Row key={index} {...rowData} header={this.state.headers} />): null }
              </tbody>
            </table>
          </div>
          </div>
      </header>
    </div>
    );
  }
}

export default App;