var React = require('react');
var {Row, Col, Grid} = require('react-bootstrap');
var $ = require('jquery');

var ItemView = React.createClass({
    render: function(){
        var item = this.props.item;
        return(
            <Row className='itemView'>
                <Col sm={3} xs={4}>
                    <img src='/images/no_image_available.svg' />
                </Col>
                <Col sm={6} xs={8}>
                    <h4>{item.title}</h4>
                    <div className='index-owner-name'>by {item.owner.name}</div>
                    <div>{item.description}</div>
                </Col>
                <Col sm={3} >
                    <h5>Contact the seller:</h5>
                    {item.owner.contacts.map(function(contact){
                        return (<div><b>{contact.type}:</b> <span>{contact.value}</span></div>);
                    })}
                </Col>
            </Row>
        );
    }
});

var ItemList = React.createClass({
    render: function(){
        return(
            <Grid>
                <h2 hidden={this.props.items.length}>No items yet!</h2>
                {this.props.items.map(function(item){
                    return <ItemView
                        key={item._id}
                        item={item} />
                })}
            </Grid>
        );
    }
});

var Index = React.createClass({
    getInitialState: function(){
        return{
            items: []
        };
    },
    componentDidMount: function(){
        $.ajax({
            url: 'api/items',
            dataType: 'json',
            type: 'GET',
            success: function(data){
                this.setState({
                    items: data
                });
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to obtain items');
                console.error('/api/items', status, err.toString());
            }
        })
    },
    render: function(){
        return(
            <ItemList items={this.state.items} />
        )
    }
});

module.exports = Index;