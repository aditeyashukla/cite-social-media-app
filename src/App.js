import './App.css';
import React from "react";
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from "./components/home";
import NewPost from "./components/newpost";
import Post from "./components/post";
import Account from "./components/account";
import UserProvider from "./providers/UserProvider";


function App() {
  return (
      <FirebaseDatabaseProvider>
      <UserProvider>
        <div className="App">
          <Router>
            <div>
              {/*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
            */}
              <Switch>
                <Route exact path="/">
                  <Home/>
                </Route>
                <Route path="/new">
                  <NewPost/>
                </Route>
                <Route path="/post/:PID">
                  <Post/>
                </Route>
                <Route path="/account">
                  <Account/>
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      </UserProvider>
      </FirebaseDatabaseProvider>
  );
}

export default App;
