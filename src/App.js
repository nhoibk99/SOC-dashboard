import React from 'react';
import Homepage from './views/homepage/homepage.page';
import AlertManagement from './views/alertManagement/alertManagement'
import TopoGraph from './views/topoGraph/topoGraph'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
          <Route path="/" exact component={Homepage} />
          <Route path="/alert" component={AlertManagement} params={'liem'} />
          <Route path="/topo" component={TopoGraph} />
      </div>
    </Router>
  );
}

export default App;
