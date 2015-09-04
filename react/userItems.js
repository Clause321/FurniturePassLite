var React = require('react/addons');
var $ = require('jquery');
var Toggle = require('react-toggle');

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
        this.props.handleSold(this.props.item._id, this.props.item.status);
    },
    handleSell: function(){
        this.props.handleSell(this.props.item._id);
    },
    handleOff: function(){
        this.props.handleOff(this.props.item._id);
    },
    handleDelete: function(){
        this.props.handleDelete(this.props.item._id, this.props.item.status);
    },
    render: function(){
        var onSale = this.props.item.status == 'on_sale';
        var soldOut = this.props.item.status == 'sold_out';
        var statusLabel = onSale  ? <Label bsStyle='danger' className='userItems-status-button'>On Sale</Label>  :
                          soldOut ? <Label bsStyle='warning' className='userItems-status-button'>Sold Out</Label> :
                                    <Label bsStyle='default' className='userItems-status-button'>Off Shelf</Label>;
        var soldButton = (
            <Button
                bsStyle='warning'
                onClick={this.handleSold}
                className='userItems-sold-button'
                disabled={soldOut}>
                    Sold <Glyphicon glyph='usd' />
            </Button>
        );
        var changeButton = (
            <Button
                bsStyle={onSale ? 'info' : 'success'}
                onClick={onSale ? this.handleOff : this.handleSell}
                className='userItems-change-button'
                disabled={soldOut}>
                    {onSale ? 'Off' : 'Sell'} <Glyphicon glyph={onSale ? 'arrow-down' : 'arrow-up'} />
            </Button>
        );
        var editButton = (
            <Button bsStyle='primary' onClick={this.handleEdit} className='userItems-edit-button'>
                Edit <Glyphicon glyph='edit' />
            </Button>
        );
        var deleteButton = (
            <Button
                bsStyle='danger'
                onClick={this.handleDelete}
                className='userItems-delete-button'
                disabled={soldOut}>
                    Delete <Glyphicon glyph='remove' />
            </Button>
        );
        return(
            <Row className='userItems-row'>
                <Col xs={6} md={6} lg={6}>
                    {statusLabel}
                    <span>{this.props.item.title}</span>
                </Col>
                <Col md={2} lg={2} className='visible-md visible-lg'>
                    <span><b>Sold at:</b> ${this.props.item.actualPrice}</span>
                </Col>
                <Col xs={6} md={4} lg={4}>
                    {soldButton}
                    {changeButton}
                    {editButton}
                    {deleteButton}
                </Col>
            </Row>
        )
    }
});

var ItemList = React.createClass({
    getInitialState: function(){
        return {
            showSold: false
        }
    },
    handleSold: function(id){
        this.props.handleSold(id);
    },
    handleSell: function(id){
        this.props.handleSell(id);
    },
    handleOff: function(id){
        this.props.handleOff(id);
    },
    handleDelete: function(id){
        this.props.handleDelete(id);
    },
    handleSoldChange: function(){
        this.setState({
            showSold: !this.state.showSold
        });
    },
    render: function(){
        var myItems = [];
        myItems['on_sale'] = [];
        myItems['off_shelf'] = [];
        myItems['sold_out'] = [];
        this.props.myItems.forEach(function(item){
            (myItems[item.status] || (myItems[items.status] = [])).push(item);
        });
        var items = myItems['on_sale'].concat(myItems['off_shelf']);
        if(this.state.showSold){
            items = items.concat(myItems['sold_out']);
        }
        return(
            <div>
                <Row>
                    <label>
                        <Toggle
                            defaultChecked={this.state.showSold}
                            onChange={this.handleSoldChange} />
                        <span className='label-text'>Show Sold Items</span>
                    </label>
                </Row>
                {items.map(function(item){
                    return(
                        <ItemView
                            item={item}
                            key={item._id}
                            handleSold={this.handleSold}
                            handleSell={this.handleSell}
                            handleOff={this.handleOff}
                            handleDelete={this.handleDelete}/>
                    )
                }.bind(this))}
            </div>
        );
    }
});

var AddForm = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function(){
        return{
            titleValue: '',
            descriptionValue: '',
            detailValue: '',
            statusValue: 'off_shelf',
            imageValue: null
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
            statusValue: 'off_shelf',
            imageValue: null
        });
    },
    handleImageCancel: function(){
        this.setState({
            imageValue: null
        });
        document.getElementById('userItems-square-image').value = '';
    },
    handleFile: function(e){
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onload = function(upload) {
            this.setState({
                imageValue: upload.target.result
            });
        }.bind(this);

        reader.readAsDataURL(file);
    },
    handleSubmit: function(){
        console.log(this.state.imageValue);
        var item = {
            title: this.state.titleValue,
            description: this.state.descriptionValue,
            detail: this.state.detailValue,
            status: this.state.statusValue,
            image: this.state.imageValue
        };
        this.props.handleAddItem(item, function(){
            this.handleCancel();
        }.bind(this));
    },
    render: function(){
        var image_src = this.state.imageValue || '/images/no_image_available.svg';
        var image = <img src={image_src} className='userItems-add-image' htmlFor='userItems-square-image' />;
        var help = (
            <div>
                <span>Make It Square! </span>
                <Button
                    bsStyle='warning'
                    onClick={this.handleImageCancel}>
                        Reset <Glyphicon glyph='refresh' />
                </Button>
            </div>
        );
        return(
            <form className='userItems-add'>
                <div className='userItems-add-hidden' hidden='true'>
                    <Row>
                        <Col xs={12} md={5}>
                            <Input
                                type='file'
                                help={help}
                                label={image}
                                id='userItems-square-image'
                                ref='image'
                                display='none'
                                onChange={this.handleFile} />
                        </Col>
                        <Col xs={12} md={7}>
                            <Input
                                type='text'
                                valueLink={this.linkState('titleValue')}
                                placeholder='Title of this item'
                                ref='title' />
                            <Input
                                type='textarea'
                                valueLink={this.linkState('descriptionValue')}
                                placeholder='Short description'
                                rows='7'
                                ref='description' />
                            <Input
                                type='select'
                                valueLink={this.linkState('statusValue')}
                                placeholder='Status'
                                ref='status'>
                                    <option value='off_shelf'>Off Shelf</option>
                                    <option value='on_sale'>On Sale</option>
                            </Input>
                            <Button
                                bsStyle='success'
                                onClick={this.handleSubmit}
                                className='right-button'>
                                    Submit <Glyphicon glyph='ok' />
                            </Button>
                            <Button
                                bsStyle='warning'
                                onClick={this.handleCancel}
                                className='right-button'>
                                    Cancel <Glyphicon glyph='remove' />
                            </Button>
                        </Col>
                    </Row>
                </div>
                <Button
                    bsStyle='success'
                    onClick={this.handleAdd}
                    className='userItems-add-button right-button'>
                        Add <Glyphicon glyph='plus' />
                </Button>
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
        var data = {
            status: 'sold_out',
            actualPrice: this.state.actualPriceValue,
            discount: this.state.discountValue
        };
        this.handleItemChange(this.state.itemId, data, this.handleModalToggle());
        //$.ajax({
        //    url: '/api/item/' + this.state.itemId,
        //    dataType: 'json',
        //    type: 'PUT',
        //    data: {
        //        status: 'off_shelf',
        //        actualPrice: this.state.actualPriceValue,
        //        discount: this.state.discountValue
        //    },
        //    success: function(item){
        //        var i = findArrayItemById(this.state.items, this.state.itemId);
        //        if(i === -1) return;
        //        var items = this.state.items;
        //        items[i] = item;
        //        this.setState({
        //            items: items
        //        });
        //        this.handleModalToggle();
        //    }.bind(this),
        //    error: function(xhr, status, err){
        //        alert('Unable to submit');
        //        console.error('/api/item/' + this.state.itemId, status, err.toString());
        //    }.bind(this)
        //});
    },
    handleItemChange: function(id, data, done=null){
        $.ajax({
            url: '/api/item/' + id,
            dataType: 'json',
            type: 'PUT',
            data: data,
            success: function(item){
                var i = findArrayItemById(this.state.items, id);
                if(i === -1) return;
                var items = this.state.items;
                items[i] = item;
                this.setState({
                    items: items
                });
                if(done !== null){
                    done();
                }
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to submit');
            }.bind(this)
        });
    },
    handleSold: function(id){
        var i = findArrayItemById(this.state.items, id);
        if(i == -1) return;
        this.setState({itemId: id});
        this.handleModalToggle();
        //var i = findArrayItemById(this.state.items, id);
        //if(i === -1) return;
        //if(this.state.items[i].status === 'on_sale'){
        //    this.setState({itemId: id});
        //    this.handleModalToggle();
        //}
        //else{ // off_shelf
        //    $.ajax({
        //        url: '/api/item/' + id,
        //        dataType: 'json',
        //        type: 'PUT',
        //        data: {
        //            status: 'on_sale',
        //            actualPrice: 0
        //        },
        //        success: function(item){
        //            var items = this.state.items;
        //            items[i] = item;
        //            this.setState({
        //                items: items
        //            });
        //        }.bind(this),
        //        error: function(xhr, status, err){
        //            alert('Unable to submit');
        //            console.error('/api/item/' + this.state.itemId, status, err.toString());
        //        }.bind(this)
        //    });
        //}
    },
    handleSell: function(id){
        var data = {status: 'on_sale'};
        this.handleItemChange(id, data);
    },
    handleOff: function(id){
        var data = {status: 'off_shelf'};
        this.handleItemChange(id, data);
    },
    handleDelete: function(id){
        $.ajax({
            url: '/api/item/' + id,
            dataType: 'json',
            type: 'DELETE',
            success: function(){
                var i = findArrayItemById(this.state.items, id);
                if(i == -1) return;
                var items = this.state.items;
                items.splice(i, 1);
                this.setState({
                    items: items
                });
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to submit');
            }
        });
    },
    handleAddItem: function(item, done){
        $.ajax({
            url: '/api/user_item',
            dataType: 'json',
            type: 'POST',
            data: item,
            success: function(data){
                this.setState({
                    items: this.state.items.concat(item)
                });
                done();
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to submit');
            }
        });
    },
    render: function(){
        return(
            <Grid className='userItems'>
                <ItemList
                    myItems={this.state.items}
                    handleSold={this.handleSold}
                    handleSell={this.handleSell}
                    handleOff={this.handleOff}
                    handleDelete={this.handleDelete} />
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