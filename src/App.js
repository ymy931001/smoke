import React, { Component } from 'react';
import { } from 'antd';
import './App.css';
import {
  Layout,
  Menu,
  ConfigProvider
} from "antd";
import { Route, Switch, Link } from 'react-router-dom';
import { DashboardOutlined, PieChartOutlined, AlertOutlined, BankOutlined, LaptopOutlined, UserOutlined, ReadOutlined, UsergroupDeleteOutlined, CompassOutlined, AlignCenterOutlined } from '@ant-design/icons';
import alarm from "./alarm/alarm";
import unit from "./unit/unit";
import device from "./device/device";
import user from "./user/user";
import log from "./log/log";
import person from "./person/person";
import statistics from "./statistics/statistics";
import monitor from "./monitor/monitor";
import logging from "./logging/logging";
import Headers from './headers';
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Content, Sider, Header } = Layout;


const icon = {
  6: <PieChartOutlined />,
  3: <AlertOutlined />,
  2: <LaptopOutlined />,
  5: <BankOutlined />,
  4: <UsergroupDeleteOutlined />,
  10: < UserOutlined />,
  9: <ReadOutlined />,
  11: <CompassOutlined />,
  18: <AlignCenterOutlined />
}

const path = {
  6: '/app/statistics',
  3: '/app/alarm',
  2: '/app/device',
  5: '/app/unit',
  4: '/app/user',
  10: '/app/person',
  9: '/app/log',
  11: '/app/monitor',
  18: '/app/logging',
}

class App extends Component {
  state = {
    mode: "inline",
    openKey: "",
    usertypenone: 'block',
    disnone: "none",
    datavdis: "none",
    menulist: []
  };

  componentwillMount = () => {


  }
  componentDidMount() {
    // console.log()
    var arr = []
    var a = JSON.parse(localStorage.getItem('menulist'))
    for (var i in a) {
      if (a[i].id === 1) {
        this.setState({
          datavdis: ""
        })
      } else {
        arr.push(a[i])
      }
    }
    this.setState({
      menulist: arr
    })

  }

  menuClick = e => {
    console.log(e.key)
    localStorage.setItem("menuid", e.key)
    console.log(localStorage.getItem("menuid"))
  };



  render() {
    const menuoption = this.state.menulist.map((province) =>
      <Menu.Item key={province.id}
      >
        <Link to={path[province.id]}>
          {icon[province.id]}
          <span>{province.name}</span>
        </Link>
      </Menu.Item>
    );
    return (
      <ConfigProvider locale={zh_CN}>
        <div className="bodymain">
          <Header >
            <Headers />
          </Header>
          <Layout>
            <div className="bodyleft">
              <Sider
                onMouseEnter={this.mouseenter}
                onMouseLeave={this.onmouseleave}
                collapsed={this.state.collapsed}
                // style={{
                //   overflow: 'auto',
                //   height: '100vh',
                //   position: 'fixed',
                //   left: 0,
                // }}
              >
                <Menu theme="dark"
                  onClick={this.menuClick}
                  mode="inline"
                  // defaultSelectedKeys={'3'}
                  selectedKeys={localStorage.getItem("menuid")}
                >
                  <Menu.Item key="100"
                    style={{ display: this.state.datavdis }}
                  >
                    <a href={"http://datav.aliyuncs.com/share/ce68ba8cf5150b24f9e4e49cad95b377?unitId=4"} style={{ color: 'rgba(255, 255, 255, 0.65)' }} target="_blank">
                      <DashboardOutlined />
                      <span>数字大屏</span>
                    </a>
                  </Menu.Item>
                  {menuoption}
                  {/* 
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
                  </Menu.Item> */}
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
                  <Route path="/app/monitor" component={monitor} />
                  <Route path="/app/logging" component={logging} />
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