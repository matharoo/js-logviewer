import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Row from "./components/Row";
// Author: Rupinder Matharoo, https://www.linkedin.com/in/matharoo/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      headers: [],
      filter: "",
      file:"",
      haserror: false
    };

    this.sortObj = this.sortObj.bind(this);
    this.comparison = this.comparison.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.resetViewer = this.resetViewer.bind(this);
  }

  componentDidMount() {
    console.log("Author: Rupinder Matharoo, https://www.linkedin.com/in/matharoo/")
  }

  //sorting function for sorting the keys by asc in the JSON
  sortObj = (key => {
    let newarr = [...this.state.logs];
    newarr.sort(this.comparison(key));
    this.setState({ logs: newarr });
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
    if (event.target.length === 0) {
      // console.log("cancel was clicked");
      // dont do anything.
    }
    else {
        //reading file and loading the list into logs state and also keeping state for filename and headers for table
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.fileName = file.name;
        reader.onload = (readerEvt) => {
          // console.log(reader.result);
          try{
          let json = JSON.parse(reader.result);
          
          this.setState({ logs: json,file:reader.fileName})
          const data = JSON.parse(reader.result);
          //get all the keys/headers from the objects in arrays, repeating ones are ignored and then save these header to state.
          let headers = data.reduce(function (arr, o) {
            return Object.keys(o).reduce(function (a, k) {
              if (a.indexOf(k) === -1) a.push(k);
              return a;
            }, arr)
          }, []);
          this.setState({ headers: headers,haserror: false })
        }
        catch(e){
          // console.log("Exception "+e);
          this.setState({ haserror: true })
        }
        }
        reader.readAsText(file);
      
    }
    //this allows to cancel if user opens file browser but cancels
    event.target.value = null;
  }

  //sets the value of filter state which is then used to filter records out logs state in render function
  handleFilter = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  //resets the viewer table when importing new file
  resetViewer = (e) => {
    // console.log("resetting viewer");
    this.setState({ logs: [], headers: [] });
  }

  render() {
    const { filter, logs } = this.state;
    //return the matching object from logs based on any value typed in filter input, if filter is empty gives back all the logs
    const filteredData = logs.filter(log => {
      return Object.keys(log).some((key) => {
        //convert the comparisons to lowercase to avoid case sensitivite chars
        return log[key].toLowerCase().includes(filter.toLowerCase())
      });
    })
    const jsonexample = `[
      {
        "datetime": "2013-10-15T09:05:05",
        "type": "INFO",
        "name": "PackedItem",
        "message": "You have decided to pack bullets",
        "source": "com.devcpu.oregantrail.poorBuffalo"
      },
      {
        "datetime": "2013-10-15T09:05:05",
        "type": "INFO",
        "name": "PackedItem",
        "message": "You have decided to pack 20 cast iron pans",
        "source": "com.devcpu.oregantrail.packinTime",
        "newcol": "testnewcol"
      },
      ........
]`;
    return (
      <div className="App">
        <header className="App-header">
          <div className="text-center"><h1>JS Log Viewer</h1>
          {
            this.state.haserror ?
            <div className="alert alert-warning" role="alert">
              File has invalid JSON. Check the example below or sample-log.json provided in project directory
            </div>
            :null
          }
          </div>
          <div className="container">
            <div className="row form-group">
              <div className="col-md-4 col-sm-4 col-xs-4"></div>
              {/* using these conditions to show and hide file browser and search bar before any data is laoded*/}
              {
                logs.length === 0 ?
                <div className="col-md-4 custom-file mt-2 mb-2">
                  <input type="file" accept=".json" onChange={this.onChange} className="custom-file-input" id="customFile" name="file" />
                  <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                  <div className="col-md-12 mt-2 text-left">
                  <p>HOW TO USE: <br/>Import JSON files with format of array of objects like:</p>
                    <pre><code className="aqua">{jsonexample}</code></pre>
                  </div>
                </div>
                : 
                <div className="col-md-4 mt-2 mb-2">
                    <button className="btn btn-primary" type="button" onClick={this.resetViewer.bind(this)}>Import a new file</button><br/>
                    <h5 className="mt-2"><pre className="text-white">Reading {this.state.file}</pre></h5>
                  </div>
              }
              <div className="col-md-4 mt-2 mb-2">
                {
                  logs.length > 1 ?
                  <input className="form-control" value={this.state.filter} onChange={this.handleFilter} placeholder="Search or filter records" name="filter" />
                  : 
                  null
                }
              </div>
            </div>
          </div>
          <div className="container">
            <div className="table-responsive">
              <table className="table table-hover table-dark">
                <thead>
                  <tr>
                    {
                      this.state.headers.length > 0 ? 
                        this.state.headers.map((header) => <th key={header} scope="col" onClick={this.sortObj.bind(this, header)}><u>{header}</u></th>) 
                        : 
                        null
                    }
                  </tr>
                </thead>
                <tbody>
                  {/* checking for headers otherwise the component doesnt recieve header prop cus it JS async :/ */}
                  {
                    filteredData.length > 0 && this.state.headers.length ? 
                      filteredData.map((rowData, index) => <Row key={index} {...rowData} header={this.state.headers} />) 
                      : 
                      null
                  }
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