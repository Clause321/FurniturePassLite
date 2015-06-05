var React = require('react/addons');
var $ = require('jquery');

var { Button, Grid, Row, Col, Input, Glyphicon } = require('react-bootstrap');

var ItemView = React.createClass({
    render: function(){
        var item = this.props.item;
        return(
            <Grid>
                <Row>
                    <Col sm={5} xs={12} >
                        <img src='/images/no_image_available.svg' />
                    </Col>
                    <Col sm={7} xs={12} >
                        <h4>{item.title}</h4>
                        <div className='index-owner-name'>by {item.owner.name}</div>
                        <div>{item.description}</div>
                    </Col>
                </Row>
                <div>
                    {item.detail}
                </div>
            </Grid>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function(){
        return{
            item: {}
        };
    },
    componentDidMount: function(){
        $.ajax({
            url: '/api/get_my_info/',
            dataType: 'json',
            type: 'GET',
            success: function(user){
                this.setState({
                    user: user
                });
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to obtain user info');
                console.error('api/get_user_info/', status, err.toString());
            }.bind(this)
        });
    },
    render: function(){
        var user = this.state.user;
        return(
            <ItemView item={this.state.item} />
        );
    }
});