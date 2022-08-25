//Import React, Switch, Route, Link, and Bootstrap
import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//Import Custom Components
import AddReview from './components/add-review';
import Restaurant from './components/restaurants';
import RestaurantsList from './components/restaurants-list';
import Login from './components/login-review';

function App() {
// Create User variable in the state using React Hooks
  const [user, setUser] = React.useState(null)

// Login Function
  async function login(user = null) {
    //Update user using setUser setter function
    setUser(user);
  }
// Logout Function
  async function logout() {
    setUser(null)
  }
    //Dev Note - this is a lightweight, simple login system. Future development in order.

  return (
    <div>
    {/*NavBar*/}
    <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          {/* Ternerary Statement - Login or Logout with Users name */}
          <li className="nav-item" >
            { user ? (
              // onClick, run logout function
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (        
              // if there's no user, link to login screen
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}
          </li>
        </div>
      </nav>

{/* Rest of Page Routes - Use Switch to switch between different routes*/}
      <div className="container mt-3">
        <Switch>
          {/* Restaurants List Component under <url>/restaurants or <url>/ */}
          <Route exact path={["/", "/restaurants"]} component={RestaurantsList} />
          {/* Restaurant Reviews - using render to pass in props to AddReview component */}
          <Route 
            path="/restaurants/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          />
          {/* Specific Restaurants - load Restaurant Component */}
          <Route 
            path="/restaurants/:id"
            render={(props) => (
              <Restaurant {...props} user={user} />
            )}
          />
          {/* Login - Render Login Component */}
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
