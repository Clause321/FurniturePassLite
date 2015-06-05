var React = require('react');
var bs = require('react-bootstrap');

var {Navbar, Nav, NavItem} = bs;
var { Navigation, Link } = require('react-router');



var Navi = React.createClass({
    mixins: [Navigation],
    render: function(){
        var Brand = (
            <Link to='app'>Furniture Pass</Link>
        );
        return(
            <Navbar className='navi' brand={Brand} staticTop>
                <Nav right>
                    <NavItem eventKey={1} href='#/account' >Account</NavItem>{/* bad... */}
                    <NavItem eventKey={2} href='#/my_items' >My Items</NavItem>{/* bad... */}
                </Nav>
            </Navbar>
        );
    }
});

module.exports = Navi;