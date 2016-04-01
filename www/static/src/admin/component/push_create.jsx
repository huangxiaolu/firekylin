import React from 'react';
import ReactDom from 'react-dom';
import Base from 'base';
import {Link} from 'react-router';
import classnames from 'classnames';
import { Form, ValidatedInput } from 'react-bootstrap-validation';

import BreadCrumb from 'admin/component/breadcrumb';
import PushAction from 'admin/action/push';
import PushStore from 'admin/store/push';
import TipAction from 'common/action/tip';

export default class extends Base {
  initialState() {
    return Object.assign({
      submitting: false,
      pushInfo: {
        key: '',
        title: ''
      }
    });
  }
  constructor(props){
    super(props);
    this.state = this.initialState();
    this.id = this.props.params.id;
  }

  componentWillMount() {
    this.listenTo(PushStore, this.handleTrigger.bind(this));
    if(this.id){
      PushAction.select(this.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.id = nextProps.params.id | 0;
    if( this.id ) {
      PushAction.select(this.id);
    }
    this.setState(this.initialState());
  }
  /**
   * hanle trigger
   * @param  {[type]} data [description]
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  handleTrigger(data, type){
    switch(type){
      case 'savePushFailed':
        TipAction.fail(data.message);
        this.setState({submitting: false});
        break;
      case 'savePushSuccess':
        TipAction.success(this.id ? '保存成功' : '添加成功');
        this.setState({submitting: false});
        setTimeout(() => this.redirect('push/list'), 1000);
        break;
      case 'getPushInfo':
        this.setState({pushInfo: data});
        break;
    }
  }
  /**
   * save
   * @return {}       []
   */
  handleValidSubmit(values){
    this.setState({submitting: true});
    if(this.id){
      values.appKey = this.id;
    }
    PushAction.save(values);
  }
  /**
   * render
   * @return {} []
   */
  render(){
    let props = {}
    if(this.state.submitting){
      props.disabled = true;
    }

    //如果是在编辑状态下在没有拿到数据之前不做渲染
    //针对 react-bootstrap-validation 插件在 render 之后不更新 defaultValue 做的处理
    if( this.id && !this.state.pushInfo.title ) {
      return null;
    }

    return (
      <div className="fk-content-wrap">
        <BreadCrumb {...this.props} />
        <div className="manage-container">
          <Form
            model={this.state.pushInfo}
            className="tag-create clearfix"
            onValidSubmit={this.handleValidSubmit.bind(this)}
          >
            <ValidatedInput
                name="title"
                type="text"
                label="网站名称"
                labelClassName="col-xs-1"
                wrapperClassName="col-xs-4"
                value={this.state.pushInfo.title}
                validate="required"
                onChange={e => {
                  this.state.pushInfo.title = e.target.value;
                  this.forceUpdate();
                }}
                errorHelp={{
                    required: '请填写网站名称'
                }}
            />
            <ValidatedInput
                name="url"
                type="text"
                label="网站地址"
                labelClassName="col-xs-1"
                wrapperClassName="col-xs-4"
                value={this.state.pushInfo.url}
                validate="required"
                onChange={e => {
                  this.state.pushInfo.url = e.target.value;
                  this.forceUpdate();
                }}
                errorHelp={{
                    required: '请填写网站地址'
                }}
            />
            <ValidatedInput
                name="appKey"
                type="text"
                label="推送公钥"
                labelClassName="col-xs-1"
                wrapperClassName="col-xs-4"
                value={this.state.pushInfo.appKey}
                validate="required"
                onChange={e => {
                  this.state.pushInfo.appKey = e.target.value;
                  this.forceUpdate();
                }}
                errorHelp={{
                    required: '请填写推送公钥'
                }}
            />
            <ValidatedInput
                name="appSecret"
                type="text"
                label="推送秘钥"
                labelClassName="col-xs-1"
                wrapperClassName="col-xs-4"
                value={this.state.pushInfo.appSecret}
                validate="required"
                onChange={e => {
                  this.state.pushInfo.appSecret = e.target.value;
                  this.forceUpdate();
                }}
                errorHelp={{
                    required: '请填写推送秘钥'
                }}
            />
            <div className="form-group col-xs-12">
              <button type="submit" {...props} className="btn btn-primary">{this.state.submitting ? '提交中...' : '提交'}</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
