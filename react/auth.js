var React = require('react/addons');
var $ = require('jquery');

/*
var Button = bs.Button;
var Navbar = bs.Navbar;
var Grid = bs.Grid;
var Row = bs.Row;
var Col = bs.Col;
var Input = bs.Input;
var ButtonInput = bs.ButtonInput;
*/

var { Button, Navbar, Grid, Row, Col, Input, ButtonInput } = require('react-bootstrap');
var { Navigation } = require('react-router');

var AuthForm = React.createClass({
    mixins: [React.addons.LinkedStateMixin, Navigation],
    getInitialState(){
        return{
            emailValue: '',
            passwordValue: '',
            passwordValue2: '',
            nameValue: '',
            creating_account: false
        }
    },
    validateEmail(){
        if(this.state.emailValue.length > 0) return 'success';
        return 'error';
    },
    validatePassword(){
        return 'success';
    },
    validatePassword2(){
        return 'success';
    },
    validateName(){
        if(this.state.nameValue.length > 0) return 'success';
        return 'error';
    },
    handleCreateAccount(){
        if(!this.state.creating_account){ // first time
            this.setState({creating_account: true});
            $('.authForm-hidden').slideDown('fast');
            $('.authForm-create-button').animate({width: '100%'}, 'fast');
            $('.authForm-login-button').animate({width: 'toggle'}, 'fast');
        }
        else{ // second time
            $.ajax({
                url: '/signup',
                dataType: 'json',
                type: 'POST',
                data:{
                    email: this.state.emailValue,
                    password: this.state.passwordValue,
                    name: this.state.nameValue
                },
                success: function(user){
                    this.transitionTo('app');
                    alert('Hello, ' + user.name);
                }.bind(this),
                error: function(xhr, status, err){
                    console.error('/signup', status, err.toString());
                    //alert('Error: ' + err.toString());
                }.bind(this)
            });
        }
    },
    handleLogIn(){
        $.ajax({
            url: '/login',
            dataType: 'json',
            type: 'POST',
            data: {
                email: this.state.emailValue,
                password: this.state.passwordValue
            },
            success: function(user){
                this.transitionTo('app');
                alert(user.name + ', you logged in!');
            }.bind(this),
            error: function(xhr, status, err){
                alert('Incorrect username password combination');
                console.error('/login', status, err.toString());
            }
        });
    },
    render: function(){
        return(
            <form className='authForm'>
                <Input
                    type='text'
                    valueLink={this.linkState('emailValue')}
                    addonAfter='@umich.edu'
                    placeholder='Your unique name'
                    ref='email' />
                <Input
                    type='password'
                    valueLink={this.linkState('passwordValue')}
                    placeholder='Password of length 16 or less'
                    bsStyle={this.validatePassword()}
                    ref='password' />
                <div className='authForm-hidden'>
                    <Input
                        type='password'
                        valueLink={this.linkState('passwordValue2')}
                        placeholder='Re-enter password'
                        bsStyle={this.validatePassword2()}
                        ref='password2' />
                    <Input
                        type='text'
                        valueLink={this.linkState('nameValue')}
                        placeholder='Real name'
                        ref='name' />
                </div>
                <Button bsStyle='success' className='authForm-create-button' onClick={this.handleCreateAccount}>Create Account</Button>
                <Button bsStyle='primary' className='authForm-login-button' onClick={this.handleLogIn}>Log In</Button>
            </form>
        );
    }
});

var AuthBox = React.createClass({
    render: function(){
        return(
            <div className='authBox'>
                <Grid>
                    <Col sm={6} smOffset={1} xs={12} className='welcome-area'>
                        <h2>Moving in/out season is here.</h2>
                        <span>Sell your furniture to others.</span><br />
                        <span>Buy cheap second hand furniture from your seniors.</span>
                    </Col>
                    <Col sm={5} xs={12} className='auth-area'>
                        <AuthForm />
                    </Col>
                </Grid>
            </div>
        );
    }
});

module.exports = AuthBox;

