var React = require('react/addons');
var $ = require('jquery');
var getMedia = require('./utils/getMedia');

var { Button, Grid, Input, Glyphicon, Col } = require('react-bootstrap');
var { Navigation } = require('react-router');

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin, Navigation],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function(){
        return{
            titleValue: '',
            descriptionValue: '',
            detailValue: '',
            statusValue: 'off_shelf',
            actualPriceValue: 0,
            discountValue: 'n/a',
            imageValue: null,
            originImageValue: ''
        }
    },
    componentDidMount: function(){
        $.ajax({
            url: 'api/full/item/' + this.context.router.getCurrentParams().itemId,
            dataType: 'json',
            type: 'GET',
            success: function(item){
                this.setState({
                    titleValue: item.title,
                    descriptionValue: item.description,
                    detailValue: item.detail,
                    statusValue: item.status,
                    actualPriceValue: item.actualPrice,
                    discountValue: item.discount,
                    originImageValue: item.image ? item.image.large.url : null
                });
            }.bind(this),
            error: function(xhr, status, err){
                alert('Unable to obtain item');
                console.error('api/full/item/' + this.context.router.getCurrentParams().itemId, status, err.toString());
            }.bind(this)
        });
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
        $.ajax({
            url: '/api/item/' + this.context.router.getCurrentParams().itemId,
            dataType: 'json',
            type: 'PUT',
            data: {
                title: this.state.titleValue,
                description: this.state.descriptionValue,
                detail: this.state.detailValue,
                status: this.state.statusValue,
                actualPrice: this.state.actualPriceValue,
                discount: this.state.discountValue,
                image: this.state.imageValue
            },
            success: function(){
                this.transitionTo('my_items');
            }.bind(this),
            error: function(){
                alert('Unable to submit');
                console.error('/api/item/' + this.context.router.getCurrentParams().itemId, status, err.toString());
            }.bind(this)
        });
    },
    handleCancel: function(){
        this.transitionTo('my_items');
    },
    handleImageCancel: function(){
        this.setState({
            imageValue: null
        });
        document.getElementById('editItems-square-image').value = '';
    },
    render: function(){
        var noImage = 'images/no_image_available.svg';
        var image_src = this.state.imageValue || getMedia(this.state.originImageValue) || noImage;
        var image = <img src={image_src} className='editItems-add-image' for='editItems-square-image' />;
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
            <Grid>
                <form className='editItem-form'>
                    <Col xs={12} md={5}>
                        <Input
                            type='file'
                            help={help}
                            label={image}
                            id='editItems-square-image'
                            ref='image'
                            display='none'
                            onChange={this.handleFile} />
                    </Col>
                    <Col xs={12} md={7}>
                        <Input
                            type='text'
                            valueLink={this.linkState('titleValue')}
                            label='Title'
                            ref='title' />
                        <Input
                            type='textarea'
                            valueLink={this.linkState('descriptionValue')}
                            label='Short description'
                            rows='7'
                            ref='description' />
                        {/*
                        <Input
                            type='textarea'
                            valueLink={this.linkState('detailValue')}
                            label='Detail'
                            ref='detail' />
                        */}
                        <Input
                            type='select'
                            valueLink={this.linkState('statusValue')}
                            label='Status'
                            ref='status'>
                            <option value='off_shelf'>Off Shelf</option>
                            <option value='on_sale'>On Sale</option>
                        </Input>
                        <Input
                            type='select'
                            label='Discount rate'
                            valueLink={this.linkState('discountValue')}>
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
                        <Button bsStyle='success' onClick={this.handleSubmit}>Submit <Glyphicon glyph='ok' /></Button>
                        <Button bsStyle='warning' onClick={this.handleCancel}>Cancel <Glyphicon glyph='remove' /></Button>
                    </Col>
                </form>
            </Grid>
        )
    }
});