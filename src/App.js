import React, { Component } from 'react';
import { } from 'antd';
import './App.css';
import {
  Layout,
  Menu,
  ConfigProvider
} from "antd";
import { Route, Switch, Link } from 'react-router-dom';
import { DashboardOutlined, PieChartOutlined, AlertOutlined, BankOutlined, LaptopOutlined, UserOutlined, ReadOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import alarm from "./alarm/alarm";
import unit from "./unit/unit";
import device from "./device/device";
import user from "./user/user";
import log from "./log/log";
import person from "./person/person";
import statistics from "./statistics/statistics";
import Headers from './headers';
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Content, Sider, Header } = Layout;
// const SubMenu = Menu.SubMenu;


class App extends Component {
  state = {
    mode: "inline",
    openKey: "",
    usertypenone: 'block',
    disnone: "none",
  };

  componentwillMount = () => {


  }
  componentDidMount() {

  }

  menuClick = e => {
    localStorage.setItem("menuid", e.key)
  };



  render() {

    return (
      <ConfigProvider locale={zh_CN}>
        <div className="bodymain">
          <Header>
            <Headers />
          </Header>
          <Layout>
            <div className="bodyleft">
              <Sider
                onMouseEnter={this.mouseenter}
                onMouseLeave={this.onmouseleave}
                collapsed={this.state.collapsed}
              >
                <Menu theme="dark"
                  onClick={this.menuClick}
                  mode="inline"
                  defaultSelectedKeys={'2'}
                  selectedKeys={[!localStorage.getItem("menuid") ? "2" : localStorage.getItem("menuid")]}
                >
                  <Menu.Item key="0"
                    style={{ display: this.state.lsdis }}
                  >
                    <a href={"http://datav.aliyuncs.com/share/ce68ba8cf5150b24f9e4e49cad95b377"} style={{ color: 'rgba(255, 255, 255, 0.65)' }} target="_blank">
                      <DashboardOutlined />
                      <span>仪表盘</span>
                    </a>
                  </Menu.Item>
                  <Menu.Item key="1"
                  >
                    <Link to="/app/statistics">
                      <PieChartOutlined />
                      <span>区域统计</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2"
                  >
                    <Link to="/app/alarm">
                      <AlertOutlined />
                      <span>告警管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="4"
                  >
                    <Link to="/app/device">
                      <LaptopOutlined />
                      <span>设备管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="3"
                  >
                    <Link to="/app/unit">
                      <BankOutlined />
                      <span>单位管理</span>
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="5"
                  >
                    <Link to="/app/user">
                      <UsergroupDeleteOutlined />
                      <span>账号管理</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="6"
                  >
                    <Link to="/app/person">
                      <UserOutlined />
                      <span>个人中心</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="7"
                  >
                    <Link to="/app/log">
                      <ReadOutlined />
                      <span>日志管理</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              </Sider>
            </div>
            <Layout>
              <Content id="Farmer">
                <Switch>
                  <Route exact path='/app' component={alarm} />
                  <Route path="/app/alarm" component={alarm} />
                  <Route path="/app/unit" component={unit} />
                  <Route path="/app/device" component={device} />
                  <Route path="/app/user" component={user} />
                  <Route path="/app/log" component={log} />
                  <Route path="/app/statistics" component={statistics} />
                  <Route path="/app/person" component={person} />
                </Switch>
              </Content>
            </Layout>
          </Layout>

        </div>
      </ConfigProvider >
    )
  }
}

export default App;