var React = require('react');
var Router = require('react-router');
var $ = require('jquery');

require('babelify/polyfill');

/*
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;
*/

var {Route, DefaultRoute, RouteHandler, State, Navigation} = Router;


var Navi = require('./navi');
var Footer = require('./footer');

var App = React.createClass({
    mixins: [State, Navigation],
    getInitialState: function(){
        return{
            loggedIn: false
        }
    },
    componentWillMount: function(){
        if(this.getPathname() !== '/auth') $.ajax({
            url: '/api/is_logged_in',
            dataType: 'json',
            type: 'GET',
            success: function(user){
                this.setState({
                    loggedIn: true
                });
                // alert('Hello, ' + user.name);
            }.bind(this),
            error: function(xhr, status, err){
                if(xhr.status === 403){
                    this.setState({
                        loggedIn: false
                    });
                    this.transitionTo('/auth');
                }
                else console.error('/is_logged_in', status, err.toString());
            }.bind(this)
        })
    },
    render: function(){
        return(
            <div>
                <Navi loggedIn={this.state.loggedIn} />
                <RouteHandler />
                <Footer />
            </div>
        )
    }
});

var Auth = require('./auth');
var Index = require('./index');
var MyItems = require('./userItems');
var EditItem = require('./editItem');
var Account = require('./account');

var routes = (
    <Route name='app' handler={App} path='/'>
        <DefaultRoute handler={Index} />
        <Route name='auth' handler={Auth} />
        <Route name='my_items' handler={MyItems} />
        <Route name='edit_item' handler={EditItem} path='edit_item/:itemId' />
        <Route name='account' handler={Account} />
    </Route>
);

Router.run(routes, function(Handler){
    React.render(<Handler />, document.getElementById('content'));
});