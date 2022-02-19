
  import React from 'react';
  import {
      BrowserRouter as Router,
      Switch,
      Route,
      Link,
      Redirect
    } from "react-router-dom";
  import UserProfile from './UserProfile.jsx';

  function RouteSwitch(props) {
      return (
          <Switch>
              <Route path="/login">
                  Please log in
              </Route>
              <Route exact path="/">
                <Redirect to="/videos" />
              </Route>
              <PrivateRoute exact path="/videos">
                <UserProfile {...props} />
              </PrivateRoute>
          </Switch>
      )
    }
  
  export default RouteSwitch;
  
  function PrivateRoute({ children, ...rest }) {
      const isAuthenticated = !!Meteor.userId();
      return (
        <Route
          {...rest}
          render={({ location }) =>
              isAuthenticated ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            )
          }
        />
      );
    }