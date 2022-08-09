
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
// import ReactGA from 'react-ga';


import "./App.scss";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import { store } from "store";
import { connect, Provider } from "react-redux";
import SignInSide from "views/Auth/Login";
import Dashboard from "views/Dashboard/Dashboard";
import Error404 from "views/Common/Error404";

const hist = createBrowserHistory();

const mapStateToProps = (state) => {
    return {
        user: state.userReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)((props) => {
    useEffect(() => {
        console.log(props)
        if (!props.user?.isAuthenticated) {
            // hist.replace("/login");
        } else {
            // hist.replace("/admin/dashboard");
        }
    }, [props.user]);

    // ReactGA.initialize('UA-121337419-1');
    // console.log('analytics' + ReactGA.pageview('/Fisherman'));

    // console.log(props.user?.isAuthenticated );
    return (
        <Router history={hist}>
            {
                props.user?.isAuthenticated ?
                    <Switch>
                        <Route path="/login" component={SignInSide} />
                        <Route path="/admin" component={Admin} />
                        <Route path="/rtl" component={RTL} />
                        {/* <Route path="/" exact component={Admin} /> */}
                        <Redirect exact from="/" to="/admin/dashboard" />
                        <Route component={Error404} />
                    </Switch>
                    :
                    <Switch>
                        <Route path="/login" component={SignInSide} />
                        <Route path="/" component={SignInSide} />
                        <Redirect from="/" to="/login" />
                    </Switch>
            }
        </Router>
    );
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);