import React, { Component } from 'react';


class Headers extends Component {
    state = {
        user: '',
        visible: false,
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    out = () => {
        localStorage.removeItem("token");
        localStorage.clear();
        window.location.reload();
    }
    componentWillMount = () => {

    }
    render() {
        return (
            <div className="headermain">
                <div className="headerleft">
                    <img src='http://disimg.terabits.cn/smokelogo.png' alt="" style={{ marginRight: '15px', width: '30px' }} /> 舟山市违禁吸烟管理平台
                </div>
                <div className="headerright">

                    <span style={{ fontSize: '16x', display: 'flex', alignItems: 'center' }}>
                        <img src={require('./touxiang.jpg')} alt="" style={{ width: '35px', marginTop: '-8px', marginRight: '10px' }} />
                        欢迎您，
                    {/* <Avatar icon="user" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> */}

                    </span>
                    <span style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                        {localStorage.getItem("realname")}
                    </span>
                    <span onClick={this.out} style={{ cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                        <img src={require('./out.png')} alt="" style={{ marginRight: '20px', width: '20px' }} />
                              退出
                        </span>
                </div>
            </div>
        )
    }
}
export default Headers;
