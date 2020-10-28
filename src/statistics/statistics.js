import React from "react";
import {
    Table,
    Layout,
    Button,
    Col,
    Row,
    // DatePicker,
    Tabs, Menu, Modal
} from "antd";
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Util
} from "bizcharts";
import { Route, Switch, Link } from 'react-router-dom';
import DataSet from "@antv/data-set";
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
} from '@ant-design/icons';
import {
    getBaseInfo, getUnitAlarmList, getDeviceAlarmList, getDistrictUnit, getSceneList,
    getNearMonthUnitTypeAlarmList, getSceneUnitAlarmList
} from '../axios';


import "./statistics.css";
// import moment from 'moment';

const { Content } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;

// const dateFormat = 'YYYY-MM-DD';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoListDataSource: [],
            devicealarmlist: [],
            districunit: [],
            scenetimelist: [],
            device_ip: null,
            typenone: "inline-block",
            pageNum: 1,
            datetype: 1,
            pageNumSize: 10,
            weekback: 'orange',
            yearback: '#fe8616',
            monthback: '#fe8616',
            collapsed: false,
            deviceList: JSON.parse(localStorage.getItem('unitTree')),
            deviceLists: JSON.parse(localStorage.getItem('unitTree')),
            selectname: null,
            selectcount: null,
            unitTypelist: null,
            menulist: [],
            unitType: 2,
        };

    }

    componentWillMount() {
        document.title = "告警管理";
    }

    componentDidMount() {
        getBaseInfo([
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    unitNum: res.data.data.unitNum,
                    deviceNum: res.data.data.deviceNum,
                    eventNum: res.data.data.eventNum,
                    dailyEventNum: res.data.data.dailyEventNum,
                })
            }
        });

        getSceneList([
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                var arr = {}
                for (var i in res.data.data) {
                    arr[res.data.data[i].type] = res.data.data[i].info
                }
                this.setState({
                    unitTypelist: arr,
                    menulist: res.data.data
                })
            }
        });






        getUnitAlarmList([
            2
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                for (var i in res.data.data) {
                    res.data.data[i].num = parseInt(i) + 1
                }
                this.setState({
                    unitalarmlist: res.data.data,
                })
            }
        });

        this.getdevicealarmlist()

        getNearMonthUnitTypeAlarmList([
            2
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                var arr = []
                var num = 0
                for (var i in res.data.data) {
                    arr.push(res.data.data[i])
                    num += parseInt(res.data.data[i].alarmNum)
                    res.data.data[i].item = res.data.data[i].info
                    res.data.data[i].count = res.data.data[i].alarmNum
                }
                console.log(arr)
                this.setState({

                    districunit: arr,
                    districunitnum: num,
                    selectname: '总计',
                    selectcount: num
                })
            }
        });


    }

    getdevicealarmlist = () => {
        getSceneUnitAlarmList([
            this.state.unitType,
            this.state.datetype,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                if (this.state.datetype === 3) {
                    for (var i in res.data.data.sceneAlarmList) {
                        res.data.data.sceneAlarmList[i].time = res.data.data.sceneAlarmList[i].time.substring(0, 7)
                        res.data.data.sceneAlarmList[i].type = res.data.data.unitType
                    }
                    var arr = res.data.data.sceneAlarmList
                    arr.sort(function (a, b) {
                        return a.time < b.time ? -1 : 1
                    });
                } else {
                    for (var i in res.data.data.sceneAlarmList) {
                        res.data.data.sceneAlarmList[i].time = res.data.data.sceneAlarmList[i].time.substring(5, 10)
                        res.data.data.sceneAlarmList[i].type = res.data.data.unitType
                    }
                }

                this.setState({
                    devicealarmlist: res.data.data.sceneAlarmList,
                    unitNums: res.data.data.unitNum,
                    deviceNums: res.data.data.deviceNum,
                })
                var arr = []
                console.log()
                for (var i = 6; i < 24; i++) {
                    arr.push({
                        "key": i + ":00",
                        "num": 0,
                        "value": i,
                    })
                }

                for (var i in res.data.data.eventList) {
                    for (var j in arr) {
                        if (parseInt(res.data.data.eventList[i].gmtCreate.substring(11, 13)) === arr[j].value) {
                            arr[j].num += 1
                        }
                    }
                }
                this.setState({
                    scenetimelist: arr
                })
            }
        });


    }

    monthdate = () => {
        this.setState({
            datetype: 2,
            monthback: 'orange',
            yearback: '#fe8616',
            weekback: '#fe8616',
        }, function () {
            this.getdevicealarmlist()
        })
    }

    yeardate = () => {
        this.setState({
            datetype: 3,
            yearback: 'orange',
            monthback: '#fe8616',
            weekback: '#fe8616',
        }, function () {
            this.getdevicealarmlist()
        })
    }

    weekdate = () => {
        this.setState({
            weekback: 'orange',
            yearback: '#fe8616',
            monthback: '#fe8616',
            datetype: 1
        }, function () {
            this.getdevicealarmlist()
        })
    }

    menuchange = (e) => {
        console.log(e)
        this.setState({
            unitType: e.key
        }, function () {
            this.getdevicealarmlist()
        })
    }


    render() {

        const { DataView } = DataSet;
        const { Html } = Guide;
        const { selected, selectedIdx } = this.state;
        const dv = new DataView();
        dv.source(this.state.districunit).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = (val * 100).toFixed(2) + "%";
                    return val;
                }
            }
        };

        const colss = {
            month: {
                range: [0, 1]
            }
        };


        const unitcols = {
            sales: {
                tickInterval: 20
            }
        };

        this.unitalarmColumns = [
            {
                title: "",
                dataIndex: "num",
                width: "25px",
                render: (text, record, index) => {
                    if (text === 1) {
                        return (
                            <div className="firsttitle">
                                <span className="firstcircle">1</span>
                            </div>
                        )
                    }
                    else if (text === 2) {
                        return (
                            <div className="firsttitle">
                                <span className="twocircle"> 2</span>
                            </div>
                        )
                    }
                    else if (text === 3) {
                        return (
                            <div className="firsttitle">
                                <span className="threecircle"> 3</span>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className="firsttitle">
                                {text}
                            </div>
                        )
                    }
                }
            },
            {
                title: "单位名称",
                dataIndex: "unit",
            },
            {
                title: "设备数量",
                dataIndex: "deviceNum",
            }, {
                title: "告警总量",
                dataIndex: "eventNum",
                render: (text, record, index) => {
                    return (
                        <div style={{ color: '#fe8114', fontWeight: 'bold' }}>
                            {text}
                        </div>
                    )
                }

            }
        ];

        const contmenu = this.state.menulist.map((province) =>
            <Menu.Item key={province.type}
            >
                <Link to={province.type}>
                    <span>{province.info}</span>
                </Link>
            </Menu.Item>
        );
        return (
            <Layout id="statistics" >
                <Layout>
                    <Content style={{ margin: "20px 0px", marginRight: '20px' }} >
                        <div className="headercont">
                            数据统计
                        </div>
                        <div>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={6}>
                                    <div className="dashboard">
                                        <img src={require('../images/dashboard1.png')} alt="" style={{ width: '20%', marginRight: '8%' }} />
                                        <div>
                                            <div className="dashtext">
                                                <span className="dashtxt">
                                                    {this.state.dailyEventNum}
                                                </span>
                                                {/* <span>个</span> */}
                                            </div>
                                            <div className="dashbottxt">
                                                今日告警
                                                    </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <div className="dashboard">
                                        <img src={require('../images/dashboard2.png')} alt="" style={{ width: '20%', marginRight: '8%' }} />
                                        <div>
                                            <div className="dashtext1">
                                                <span className="dashtxt">
                                                    {this.state.eventNum}
                                                </span>
                                                {/* <span>个</span> */}
                                            </div>
                                            <div className="dashbottxt">
                                                告警总数
                                                    </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <div className="dashboard">
                                        <img src={require('../images/dashboard3.png')} alt="" style={{ width: '20%', marginRight: '8%' }} />
                                        <div>
                                            <div className="dashtext2">
                                                <span className="dashtxt">
                                                    {this.state.deviceNum}
                                                </span>
                                                <span>个</span>
                                            </div>
                                            <div className="dashbottxt">
                                                设备总数
                                                    </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <div className="dashboard">
                                        <img src={require('../images/dashboard4.png')} alt="" style={{ width: '20%', marginRight: '8%' }} />
                                        <div>
                                            <div className="dashtext3">
                                                <span className="dashtxt">
                                                    {this.state.unitNum}
                                                </span>
                                                <span>个</span>
                                            </div>
                                            <div className="dashbottxt">
                                                单位总数
                                                    </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col className="gutter-row" span={18}>
                                    <div className="tongji">
                                        <div className="righthead">
                                            <div>
                                                场景单位告警统计
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <span className="sceneleft">单位数量：<span className="scenetxt"> {this.state.unitNums} </span>个</span>
                                            <span className="sceneleft">设备数量： <span className="scenetxt"> {this.state.deviceNums} </span>个</span>
                                            <Button type="primary" style={{ marginLeft: '30px', marginRight: '10px', background: this.state.weekback }} onClick={this.weekdate}  >
                                                近一周
                                                </Button>
                                            <Button type="primary" onClick={this.monthdate} style={{ marginRight: '10px', background: this.state.monthback }}>
                                                近一月
                                                </Button>
                                            <Button type="primary" onClick={this.yeardate} style={{ background: this.state.yearback }} >
                                                近一年
                                                </Button>
                                        </div>
                                        <Row gutter={24}>
                                            <Col className="gutter-row" span={5}>
                                                <div style={{ borderRight: '1px solid #ffd7b8',minHeight:'650px' }} id="menulist">
                                                    <Menu
                                                        defaultSelectedKeys={['2']}
                                                        // defaultOpenKeys={['sub1']}
                                                        mode="inline"
                                                        theme="dark"
                                                        inlineCollapsed={this.state.collapsed}
                                                        style={{ marginTop: "20px" }}
                                                        onSelect={this.menuchange}
                                                    >
                                                        {contmenu}
                                                    </Menu>
                                                </div>
                                            </Col>
                                            <Col className="gutter-row" span={19}>
                                                <div>
                                                    <Chart height={300} data={this.state.devicealarmlist} scale={colss} forceFit padding="auto">
                                                        <Legend />
                                                        <Axis name="time" />
                                                        <Axis
                                                            name="alarmNum"
                                                            label={{
                                                                formatter: val => `${val}`
                                                            }}
                                                        />
                                                        <Tooltip
                                                            crosshairs={{
                                                                type: "y"
                                                            }}
                                                        />
                                                        <Geom
                                                            type="line"
                                                            position="time*alarmNum"
                                                            size={2}
                                                            color={"#ffc13f"}
                                                            shape={"smooth"}
                                                            tooltip={[
                                                                "time*alarmNum",
                                                                (time, alarmNum) => {
                                                                    return {
                                                                        name: "告警总数" + "：",
                                                                        value: ` ${alarmNum} 个`
                                                                    };
                                                                }
                                                            ]}
                                                        />
                                                        <Geom
                                                            type="point"
                                                            position="time*alarmNum"
                                                            size={4}
                                                            shape={"hollowCircle"}
                                                            color={"#ffc13f"}
                                                            style={{
                                                                stroke: "#fff",
                                                                lineWidth: 1
                                                            }}
                                                            tooltip={[
                                                                "time*alarmNum",
                                                                (time, alarmNum) => {
                                                                    return {
                                                                        name: "告警总数" + "：",
                                                                        value: ` ${alarmNum} 个`
                                                                    };
                                                                }
                                                            ]}
                                                        />
                                                        <div style={{ textAlign: 'center' }}>
                                                            设备告警统计
                                                    </div>
                                                    </Chart>

                                                </div>
                                                <div style={{ height: '350px' }}>
                                                    <Chart height={300} data={this.state.scenetimelist} scale={unitcols} forceFit padding="auto">
                                                        <Axis name="key" />
                                                        <Axis name="num" />
                                                        <Tooltip
                                                        />
                                                        <Geom type="interval" position="key*num" color="#ffcc8a" >
                                                            <Label
                                                                content="num"
                                                                textStyle={{
                                                                    fill: '#fd7a12', // 文本的颜色
                                                                    textBaseline: 'middle'
                                                                }}
                                                            // tooltip={[
                                                            //     "key*num",
                                                            //     (key, num) => {
                                                            //         return {
                                                            //             name: "告警数量" + "：",
                                                            //             value: ` ${num} 个`
                                                            //         };
                                                            //     }
                                                            // ]}
                                                            />
                                                        </Geom>
                                                        <div style={{ textAlign: 'center' }}>
                                                            24小时告警趋势图
                                                        </div>
                                                    </Chart>

                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6} style={{ marginTop: '20px' }}>
                                    <div className="areastatistics">
                                        <div className="righthead">
                                            近一月告警总量分布图
                                        </div>
                                        <div>
                                            <Chart
                                                height={300}
                                                data={dv}
                                                scale={cols}
                                                // padding={[0, 0, 40, 0]}
                                                padding="auto"
                                                forceFit
                                                // 设置选中
                                                onPlotClick={ev => {
                                                    console.log(ev);
                                                    // this.setState({
                                                    //     selectname: ev.data._origin.item,
                                                    //     selectcount: ev.data._origin.count,
                                                    // }) 

                                                }}
                                            >
                                                <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                                                <Axis name="percent" />
                                                <Legend
                                                    position="bottom"
                                                />
                                                <Tooltip
                                                    showTitle={false}
                                                    itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                                                />
                                                <Guide>
                                                    <Guide.Text
                                                        top
                                                        position={['50%', '50%']}
                                                        content={`${this.state.selectcount}`}
                                                        style={{ textAlign: 'center', fontSize: 24, color: "#333", fontWeight: 'bold' }}
                                                    // className="circlestyle"
                                                    />
                                                    {/* <Html
                                                        position={["50%", "50%"]}
                                                        html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>
                                                        <span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>
                                                        台</div>"
                                                        alignX="middle"
                                                        alignY="middle"
                                                    /> */}
                                                </Guide>
                                                <Geom
                                                    type="intervalStack"
                                                    position="percent"
                                                    color="item"
                                                    tooltip={[
                                                        "item*percent",
                                                        (item, percent) => {
                                                            return {
                                                                name: item,
                                                                value: ` ${Math.round((percent.toFixed(2)) * this.state.districunitnum)} 个`
                                                            };
                                                        }
                                                    ]}
                                                    style={{
                                                        lineWidth: 1,
                                                        stroke: "#fff"
                                                    }}
                                                >
                                                    {/* <Label
                                                        content="percent"
                                                        formatter={(val, item) => {
                                                            return `${item.point.item} ${Math.round((parseInt(val) / 100) * this.state.districunitnum)} 个`;
                                                            // return item.point.item + ": " + val;
                                                        }}
                                                    /> */}
                                                </Geom>
                                            </Chart>
                                        </div>
                                    </div>
                                    <div className="areastatistics">
                                        <div className="righthead">
                                            近一月单位告警排行
                                        </div>
                                        <div className="alarmtable">
                                            <div>
                                                <span className="tdfirst"></span>
                                                <span className="tdtwo">单位名称</span>
                                                <span className="tdthree">设备数量</span>
                                                <span className="tdfour">告警总量</span>
                                            </div>
                                            <div className="tablescoll">
                                                <Table
                                                    dataSource={this.state.unitalarmlist}
                                                    columns={this.unitalarmColumns}
                                                    showHeader={false}
                                                    pagination={false}
                                                // scroll={{ y: 270 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                </Layout >
            </Layout >
        );
    }
}

export default App;
