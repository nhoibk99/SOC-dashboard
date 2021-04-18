import React from 'react';
import Homepage from './views/homepage/homepage.page';
import AlertManagement from './views/alertManagement/alertManagement'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

function App() {
  return (
    // <div className="App">
    //   <Homepage />
    // </div>
    <Router>
      <div className="App">
          <Route path="/" exact component={Homepage} />
          <Route path="/alert" component={AlertManagement} />
      </div>
    </Router>
  );
}

export default App;
