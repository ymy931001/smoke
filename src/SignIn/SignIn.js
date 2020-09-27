import React, { Component } from "react";
import { Button, Input, message } from "antd";
import { url } from '../axios';
import http from 'axios';
import "./SignIn.css";

class SignIn extends Component {
  state = {
    userID: "",
    password: ""
  };

  componentwillMount = () => {
    localStorage.clear();


  }
  componentDidMount = () => {

  };


  logindown = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit()
    }
  }

  handleSubmit = (e) => {
    if (this.state.userID === "") {
      message.error("请输入账号");
    }
    else if (this.state.password === "") {
      message.error("请输入密码");
    } else {
      this.setState({
        loading: true,
      })
      http.defaults.headers.get['Content-Type'] = "application/x-www-form-urlencoded"
      http.get(url + '/login?username=' + this.state.userID + '&password=' + this.state.password + '&type=user&grant_type=password', {
        auth: {
          username: "webApp",
          password: 'webApp',
        }
      }).then(res => {
        if (res.data.status === 1003) {
          message.error("用户名不存在！");
          this.setState({
            loading: false,
          })
        }
        if (res.data.status === 1004) {
          message.error("密码错误");
          this.setState({
            loading: false,
          })
        }
        if (res.data.status === -1) {
          message.error("账号已禁用");
        }
        if (res.data.status === 1) {
          message.success('登录成功');
          this.setState({
            loading: false,
          })
          localStorage.setItem('token', res.data.data.access_token);
          localStorage.setItem('usertype', res.data.data.type);
          localStorage.setItem('realname', res.data.data.realname);
          localStorage.setItem("currenttimes", new Date().getTime());
          localStorage.setItem("menulist", JSON.stringify(res.data.data.menu));
          localStorage.setItem("unitTree", JSON.stringify(res.data.data.unitTree[0].children));
          localStorage.setItem("AreaTree", JSON.stringify(res.data.data.AreaTree[0].children));
          setTimeout(() => {
            window.location.href = '/app/alarm';
          }, 1000)
        }
      })
    }
  }

  render() {
    return (
      <div id="signbody">
        <div style={{ display: "flex", flexDirection: 'column' }}>
          <div className="SignIn-body">
            <div className="cover">
              <div className="logo">
                <img src={require('./logo1.png')} alt="" style={{ width: "70px", marginRight: '20px' }} />
                舟山市违禁吸烟监控智能分析平台
              </div>
              <div className="loginmain">
                <div className="loginl">

                </div>
                <div className="loginr">
                  <span className="logintitle">
                    登录
                  </span>
                  <div>
                    <Input
                      size="large"
                      className="SignIn-Input"
                      placeholder="请输入用户名"
                      prefix={
                        <span style={{ borderRight: '1px solid #d9d9d9', paddingRight: '10px' }}>
                          <img src={require('./user.png')} alt="" style={{ width: "25px" }} />
                        </span>
                      }
                      onChange={e => this.setState({ userID: e.target.value })}
                      value={this.state.userID}
                      onKeyDown={this.logindown}
                    />
                  </div>
                  <div>
                    <Input
                      size="large"
                      className="SignIn-Inputs"
                      placeholder="请输入密码"
                      prefix={
                        <span style={{ borderRight: '1px solid #d9d9d9', paddingRight: '10px' }}>
                          <img src={require('./pass.png')} alt="" style={{ width: "25px" }} />
                        </span>
                      }
                      type="password"
                      onChange={e => this.setState({ password: e.target.value })}
                      value={this.state.password}
                      onKeyDown={this.logindown}
                    />
                  </div>
                  <div>
                    <Button
                      className="SignIn-requestbutton"
                      onClick={() => {
                        this.handleSubmit();
                      }}
                      style={{ height: '40px', width: '100%', fontSize: '18px', background: '#fc710f', color: 'white', border: 'none' }}
                    >
                      <span>登录</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bombtn">
                平台服务商：&nbsp;&nbsp;<a href="http://www.terabits.cn/" target="_blank" rel="noopener noreferrer" style={{ color: '#666666' }}>杭州钛比科技有限公司</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：&nbsp;&nbsp;0571-87755736
              </div>
              <div className="bombtns">
                浙ICP备16003817号-1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;网站标识码：3610782
              </div>
              <div className="bombtns">
                <img src={require('./bot.png')} alt="" style={{ width: '20px', marginRight: '10px' }} />
                <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602007808" target="_blank" rel="noopener noreferrer" style={{ color: '#666666' }}>浙公网安备33010602009975号</a>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default SignIn;