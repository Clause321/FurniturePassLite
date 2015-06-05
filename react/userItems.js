var React = require('react/addons');
var $ = require('jquery');

var { Button, Navbar, Grid, Row, Col, Input, ButtonInput, Label, Glyphicon, Modal, OverlayMixin } = require('react-bootstrap');
var { Navigation } = require('react-router');

function findArrayItemById(array, id){
    return array.findIndex(function(item, index, array){
        return item._id === id;
    });
}

var ItemView = React.createClass({
    mixins: [Navigation],
    handleEdit: function(){
        this.transitionTo('edit_item', {itemId: this.props.item._id});
    },
    handleSold: function(){
        this.props.handleSold(this.props.item._id);
    },
    render: function(){
        var statusLabel = this.props.item.status === 'on_sale' ? <Label bsStyle='danger' className='userItems-status-button'>On Sale</Label>
                                                          : <Label bsStyle='default' className='userItems-status-button'>Off Shelf</Label>;
        return(
            <Row className='userItems-row'>
                <Col xs={8} md={7} lg={8}>
                    {statusLabel}
                    <span>{this.props.item.title}</span>
                </Col>
                <Col md={2} className='visible-md visible-lg'>
                    <span><b>Sold at:</b> ${this.props.item.actualPrice}</span>
                </Col>
                <Col xs={4} md={3} lg={2}>
                    <Button bsStyle='warning' onClick={this.handleSold} className='userItems-sold-button'>
                        {this.props.item.status === 'on_sale' ? 'Sold' : 'Sell'} <Glyphicon glyph='usd' />
                    </Button>
                    <Button bsStyle='primary' onClick={this.handleEdit} className='userItems-edit-button'>
                        Edit <Glyphicon glyph='edit' />
                    </Button>
                </Col>
            </Row>
        )
    }
});

var ItemList = React.createClass({
    handleSold: function(id){
        this.props.handleSold(id);
    },
    render: function(){
        return(
            <div>
                {this.props.myItems.map(function(item){
                    return <ItemView item={item} key={item._id} handleSold={this.handleSold} />
                }.bind(this))}
            </div>
        );
    }
});

var AddForm = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState(){
        return{
            titleValue: '',
            descriptionValue: '',
            detailValue: '',
            statusValue: 'off_shelf'
        }
    },
    handleAdd: function(){
        $('.userItems-add-button').hide();
        $('.userItems-add-hidden').show();
    },
    handleCancel: function(){
        $('.userItems-add-hidden').hide();
        $('.userItems-add-button').show();
        this.setState({
            titleValue: '',
            descriptionValue: '',
            detailValue: '',
            statusValue: 'off_shelf'
        });
    },
    handleSubmit: function(){
        var item = {
            title: this.state.titleValue,
            description: this.state.descriptionValue,
            detail: this.state.detailValue,
            status: this.state.statusValue
        };
        this.props.handleAddItem(item, function(){
            this.handleCancel();
        }.bind(this));
    },
    render: function(){
        return(
            <form className='userItems-add'>
                <div className='userItems-add-hidden' hidden='true'>
                    <Input
                        type='text'
                        valueLink={this.linkState('titleValue')}
                        placeholder='Title of this item'
                        ref='title' />
                    <Input
                        type='textarea'
                        valueLink={this.linkState('descriptionValue')}
                        placeholder='Short description'
                        ref='description' />
                    {/*
                    <Input
                        type='textarea'
                        valueLink={this.linkState('detailValue')}
                        placeholder='Details of this item'
                        ref='detail' />
                        */}
                    <Input
                        type='select'
                        valueLink={this.linkState('statusValue')}
                        placeholder='Status'
                        ref='status'>
                            <option value='off_shelf'>Off Shelf</option>
                            <option value='on_sale'>On Sale</option>
                    </Input>
                    <Button bsStyle='success' onClick={this.handleSubmit}>Submit <Glyphicon glyph='ok' /></Button>
                    <Button bsStyle='warning' onClick={this.handleCancel}>Cancel <Glyphicon glyph='remove' /></Button>
                </div>
                <Button bsStyle='success' onClick={this.handleAdd} className='userItems-add-button'>Add <Glyphicon glyph='plus' /></Button>
            </form>
        )
    }
});

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin, OverlayMixin],
    getInitialState: function(){
        return {
            items: [],
            itemId: '',
            isModalOpen: false,
            // for modal form
            actualPriceValue: 0,
            discountValue: 'n/a'

        };
    },
    componentDidMount: function(){
        $.ajax({
            url: '/api/user_item',
            dataType: 'json',
            type: 'GET',
            success: function(items){
                this.setState({
                    items: items
                });
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to obtain user items');
                console.error('/api/user_item', status, err.toString());
            }
        });
    },
    handleModalToggle: function(){
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            // for modal form
            actualPriceValue: 0,
            discountValue: 'n/a'
        });
    },
    handleItemSold: function(){
        $.ajax({
            url: '/api/item/' + this.state.itemId,
            dataType: 'json',
            type: 'PUT',
            data: {
                status: 'off_shelf',
                actualPrice: this.state.actualPriceValue,
                discount: this.state.discountValue
            },
            success: function(item){
                var i = findArrayItemById(this.state.items, this.state.itemId);
                if(i === -1) return;
                var items = this.state.items;
                items[i] = item;
                this.setState({
                    items: items
                });
                this.handleModalToggle();
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to submit');
                console.error('/api/item/' + this.state.itemId, status, err.toString());
            }.bind(this)
        });
    },
    handleSold: function(id){
        var i = findArrayItemById(this.state.items, id);
        if(i === -1) return;
        if(this.state.items[i].status === 'on_sale'){
            this.setState({itemId: id});
            this.handleModalToggle();
        }
        else{ // off_shelf
            $.ajax({
                url: '/api/item/' + id,
                dataType: 'json',
                type: 'PUT',
                data: {
                    status: 'on_sale',
                    actualPrice: 0
                },
                success: function(item){
                    var items = this.state.items;
                    items[i] = item;
                    this.setState({
                        items: items
                    });
                }.bind(this),
                error: function(xhr, status, err){
                    alert('Unable to submit');
                    console.error('/api/item/' + this.state.itemId, status, err.toString());
                }.bind(this)
            });
        }
    },
    handleAddItem: function(item, done){
        $.ajax({
            url: '/api/user_item',
            dataType: 'json',
            type: 'POST',
            data: item,
            success: function(data){
                this.setState({
                    items: this.state.items.concat(data)
                });
                done();
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to submit');
                // console.error('/api/user_item', status, err.toString());
            }
        });
    },
    render: function(){
        return(
            <Grid className='userItems'>
                <ItemList myItems={this.state.items} handleSold={this.handleSold} />
                <AddForm handleAddItem={this.handleAddItem} />
            </Grid>
        );
    },
    renderOverlay: function(){
        if(!this.state.isModalOpen){
            return <span/>;
        }
        return(
            <Modal title='Confirm item sold' onRequestHide={this.handleModalToggle}>
                <div className='modal-body'>
                    The information you are providing will only be used for statistics
                    <form className='form-horizontal'>
                        <Input
                            type='select'
                            label='Discount rate'
                            valueLink={this.linkState('discountValue')}
                            placeholder='Choose the smaller on if exactly on boarder'>
                                <option value='n/a'>n/a</option>
                                <option value='0to15'>0% ~ 15%</option>
                                <option value='15to30'>15% ~ 30%</option>
                                <option value='30to50'>30% ~ 50%</option>
                                <option value='50to70'>50% ~ 70%</option>
                                <option value='70to100'>70% ~ 100%</option>
                                <option value='100plus'>Above 100%</option>
                        </Input>
                        <Input
                            type='text'
                            label='Trade price'
                            valueLink={this.linkState('actualPriceValue')}
                            addonBefore='$'
                            placeholder='Enter 0 if not applicable' />
                    </form>
                </div>
                <div className='modal-footer'>
                    <Button bsStyle='warning' onClick={this.handleModalToggle}>Cancel <Glyphicon glyph='remove' /></Button>
                    <Button bsStyle='success' onClick={this.handleItemSold}>Submit <Glyphicon glyph='ok' /></Button>
                </div>
            </Modal>
        );
    }
});