import React, { Component } from 'react';
import { Button, Menu, Input, Layout, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import { getpersonal } from '../axios';
import './person.css';
import Headers from '../headers';


const rolelists = {
  1: "超级管理员",
  2: "单位管理员",
  3: "区域管理员",
  4: "市级管理员",
}


const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

class journal extends Component {
  state = {
    collapsed: false,
    page: 1,
    size: 'small',
    selectedRowKeys: [],
    visible: false,

  }
  componentWillMount = () => {
    document.title = "个人中心";


    getpersonal([

    ]).then(res => {
      if (res.data && res.data.status === 1) {
        this.setState({
          id: res.data.data.id,
          info: res.data.data.info,
          email: res.data.data.email,
          username: res.data.data.userName,
          passwordnew: res.data.data.password,
          password: res.data.data.password.replace(/./g, '*'),
          phone: res.data.data.phone,
          realname: res.data.data.realName,
        });
      }
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }

  render() {
    return (
      <div id="highsetbody" >
        <Layout >
          <Layout style={{ background: 'white', padding: '20px', marginTop: '20px' }}>
            <Content >
              <div>
                <div style={{ fontSize: "20px", marginBottom: '50px' }}>基本信息</div>
                <div className="line">
                  <span className="personl">用户名：</span><span>{this.state.username}</span>
                </div>
                <div className="line">
                  <span className="personl">账户类型：</span><span>  {rolelists[this.state.info]}</span>
                </div>
                <div className="line">
                  <span className="personl">用户名密码：</span>  <span>{this.state.password}</span>
                  <span style={{ color: '#fe8616', marginLeft: '20px' }} onClick={this.showModal}>修改</span>
                  <Modal
                    title="初次登录，请修改密码,并查看用户手册"
                    visible={this.state.firstvisible}
                    onOk={this.handleOks}
                    onCancel={this.handleCancels}
                    mask={false}
                    cancelText={'取消'}
                    okText={'确认'}
                  >
                    <p>原密码:<Input value={this.state.passwordnew} style={{ width: '70%', marginLeft: '10px', marginRight: '10px' }} id="passwordago" autocomplete="off" /></p>
                    <p>新密码:<Input placeholder="请输入新密码" style={{ width: '70%', marginLeft: '10px', marginRight: '10px' }} id="passwordnow" type="password" autocomplete="off" /></p>
                    确认密码:<Input placeholder="请再次输入新密码" style={{ width: '70%', marginLeft: '10px', marginRight: '10px' }} id="confpassword" type="password" autocomplete="off" />
                  </Modal>

                  <Modal
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    mask={false}
                    cancelText={'取消'}
                    okText={'确认'}
                  >
                    <p>原密码:<Input placeholder="请输入原始密码" style={{ width: '70%', marginLeft: '10px', marginRight: '10px' }} id="passwordago" type="password" autocomplete="off" /></p>
                    <p>新密码:<Input placeholder="请输入新密码" style={{ width: '70%', marginLeft: '10px', marginRight: '10px' }} id="passwordnow" type="password" autocomplete="off" /></p>
                    确认密码:<Input placeholder="请再次输入新密码" style={{ width: '70%', marginLeft: '10px', marginRight: '10px' }} id="confpassword" type="password" autocomplete="off" />
                  </Modal>
                </div>
                <div className="line">
                  <span className="personl">手机号码： </span> <span>{this.state.phone}</span>
                  <span style={{ color: '#fe8616', marginLeft: '20px' }} onClick={this.phoneModal} >修改</span>
                  <Modal
                    title="修改手机号"
                    visible={this.state.phoneamend}
                    onOk={this.phoneOk}
                    onCancel={this.phoneCancel}
                    cancelText={'取消'}
                    okText={'下一步'}
                    mask={false}
                  >
                    <p>原手机号码:&nbsp;&nbsp;{this.state.phone}
                      <Button type="primary" style={{ float: 'right', marginLeft: '20px' }} onClick={this.getcode} disabled={this.state.codedisabled}>{this.state.code}</Button>
                    </p>
                    <p>
                      验证码:<Input placeholder="请输入验证码" style={{ width: '86%', marginLeft: '10px', marginTop: '5px' }} id="codenum" />
                    </p>
                  </Modal>
                  <Modal
                    title="修改手机号"
                    visible={this.state.phoneamends}
                    onOk={this.phoneOks}
                    onCancel={this.phoneCancel}
                    cancelText={'取消'}
                    okText={'确认'}
                    mask={false}
                  >
                    <p>
                      新手机号码:<Input placeholder="请输入手机号码" style={{ width: '43%', marginLeft: '10px', }} id="phonenums" />
                      <Button type="primary" style={{ float: 'right', marginLeft: '20px' }} onClick={this.getcodes} disabled={this.state.codedisableds}>{this.state.codes}</Button></p>
                    <p>
                      验证码:<Input placeholder="请输入验证码" style={{ width: '86%', marginLeft: '10px', marginTop: '5px' }} id="codenums" />
                    </p>
                  </Modal>
                </div>
                <div className="line">
                  <span className="personl">邮箱： </span> <span>{this.state.email}</span>
                  <span style={{ color: '#fe8616', marginLeft: '20px' }} onClick={this.emailModal}>修改</span>
                  <Modal
                    title="修改邮箱"
                    visible={this.state.emailamend}
                    onOk={this.emailOk}
                    onCancel={this.emailCancel}
                    cancelText={'取消'}
                    okText={'确认'}
                    mask={false}
                  >
                    <p>原邮箱:&nbsp;&nbsp;{this.state.email}</p>
                    新邮箱:<Input placeholder="请输入新邮箱" style={{ width: '70%', marginLeft: '10px', marginRight: '10px' }} id="emailnum" />
                  </Modal>
                </div>
                <div className="line">
                  <span className="personl">真实姓名：</span> <span>{this.state.realname}</span>
                </div>
                <div className="line">
                  <span className="personl">用户手册：</span>
                  <a href="" style={{ display: 'inline-block', color: '#fe8616' }}>
                    舟山市违禁吸烟管理平台使用手册
                  </a>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div >
    )
  }
}

export default journal = (journal);

