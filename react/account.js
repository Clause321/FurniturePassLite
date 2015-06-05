var React = require('react/addons');
var $ = require('jquery');

var { Button, Grid, Row, Col, Input, Glyphicon } = require('react-bootstrap');

function findArrayItemById(array, id){
    return array.findIndex(function(item, index, array){
        return item._id === id;
    });
}

var ContactView = React.createClass({
    handleContactDelete: function(){
        this.props.handleContactDelete(this.props.contact._id);
    },
    render: function(){
        return(
            <Row>
                <b>{this.props.contact.type}: </b><span>{this.props.contact.value}</span>
                <Button bsStyle='danger' onClick={this.handleContactDelete}>
                    Delete <Glyphicon glyph='trash' />
                </Button>
            </Row>
        );
    }
});

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function(){
        return{
            adding: false,
            user: {contacts: []},
            contactTypeValue: '',
            contactValueValue: ''
        }
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
    handleContactDelete: function(id){
        $.ajax({
            url: '/api/contact/' + id,
            dataType: 'json',
            type: 'DELETE',
            success: function(){
                var user = this.state.user;
                var i = findArrayItemById(user.contacts, id);
                if(i === -1) return;
                user.contacts.splice(i, 1);
                this.setState({
                    user: user
                });
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to delete contact');
                console.error('/api/contact/' + id, status, err.toString());
            }
        });
    },
    handleAdd: function(){
        this.setState({
            adding: true
        });
    },
    handleCancel: function(){
        this.setState({
            adding: false,
            contactTypeValue: '',
            contactValueValue: ''
        });
    },
    handleSubmit: function(){
        $.ajax({
            url: '/api/contact',
            dataType: 'json',
            type: 'POST',
            data: {
                type: this.state.contactTypeValue,
                value: this.state.contactValueValue
            },
            success: function(contact){
                var user = this.state.user;
                user.contacts.push(contact);
                this.setState({
                    adding: false,
                    user: user,
                    contactTypeValue: '',
                    contactValueValue: ''
                });
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to submit');
                console.error('/api/contact', status, err.toString());
            }.bind(this)
        });
    },
    render: function(){
        var user = this.state.user;
        return(
            <Grid>
                <div>
                    <h3>Contacts</h3>
                    {user.contacts.map(function(contact){
                     return <ContactView contact={contact} key={contact._id} handleContactDelete={this.handleContactDelete} />
                    }.bind(this))}
                    <div hidden={this.state.adding}>
                        <Button bsStyle='success' onClick={this.handleAdd}>Add <Glyphicon glyph='plus' /></Button>
                    </div>
                    <form hidden={!this.state.adding}>
                        <Input
                            type='text'
                            valueLink={this.linkState('contactTypeValue')}
                            placeholder='Contact type'
                            ref='contactType' />
                        <Input
                            type='text'
                            valueLink={this.linkState('contactValueValue')}
                            placeholder='Your email address, contact number, etc.'
                            ref='contactValue' />
                        <Button bsStyle='warning' onClick={this.handleCancel}>Cancel <Glyphicon glyph='remove' /></Button>
                        <Button bsStyle='success' onClick={this.handleSubmit}>Submit <Glyphicon glyph='ok' /></Button>
                    </form>
                </div>

            </Grid>
        );
    }
});