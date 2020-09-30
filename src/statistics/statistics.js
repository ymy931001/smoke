import React from "react";
import {
    Table,
    Layout,
    Button,
    Col,
    Row,
    // DatePicker,
    Tabs, message, Modal
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
    Facet,
    Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import { getBaseInfo, getUnitAlarmList, getDeviceAlarmList, getDistrictUnit } from '../axios';


import "./statistics.css";
// import moment from 'moment';

const { Content } = Layout;
// const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// const dateFormat = 'YYYY-MM-DD';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoListDataSource: [],
            devicealarmlist: [],
            districunit: [],
            device_ip: null,
            typenone: "inline-block",
            pageNum: 1,
            pageNumSize: 10,
            deviceList: JSON.parse(localStorage.getItem('unitTree')),
            deviceLists: JSON.parse(localStorage.getItem('unitTree')),
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
                })
            }
        });

        getUnitAlarmList([
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

        getDeviceAlarmList([
            1
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                var arr = []
                for (var i in res.data.data) {
                    if (res.data.data[i].deviceType === 2) {
                        res.data.data[i].deviceType = "摄像头告警"
                    }
                    if (res.data.data[i].deviceType === 1) {
                        res.data.data[i].deviceType = "传感器告警"
                    }
                }
                this.setState({
                    devicealarmlist: res.data.data,
                })
            }
        });

        getDistrictUnit([

        ]).then(res => {
            if (res.data && res.data.message === "success") {
                var arr = []
                arr.push({
                    "item": "嵊泗县",
                    "count": res.data.data.cenSiNum
                }, {
                    "item": "定海区",
                    "count": res.data.data.dingHaiNum
                }, {
                    "item": "普陀区",
                    "count": res.data.data.puTuoNum
                }, {
                    "item": "岱山县",
                    "count": res.data.data.daiSanNum
                })
                var newarr = []
                for (var i in arr) {
                    if (arr[i].count != 0) {
                        newarr.push(arr[i])
                    }
                }
                this.setState({
                    districunit: newarr,
                })
            }
        });




    }





    render() {

        const { DataView } = DataSet;
        const { Html } = Guide;

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


        this.unitalarmColumns = [
            {
                title: "",
                dataIndex: "num",
                width: "40px",
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


        return (
            <Layout id="statistics" >
                <Layout>
                    <Content style={{ margin: "20px 0px", marginRight: '20px' }} >
                        <div className="headercont">
                            区域统计
                        </div>
                        <div>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={18}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" span={8}>
                                            <div className="dashboard">
                                                <img src={require('../images/dashboard1.png')} alt="" style={{ width: '20%', marginRight: '8%' }} />
                                                <div>
                                                    <div className="dashtext">
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
                                        <Col className="gutter-row" span={8}>
                                            <div className="dashboard">
                                                <img src={require('../images/dashboard2.png')} alt="" style={{ width: '20%', marginRight: '8%' }} />
                                                <div>
                                                    <div className="dashtext1">
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
                                        <Col className="gutter-row" span={8}>
                                            <div className="dashboard">
                                                <img src={require('../images/dashboard3.png')} alt="" style={{ width: '20%', marginRight: '8%' }} />
                                                <div>
                                                    <div className="dashtext2">
                                                        <span className="dashtxt">
                                                            {this.state.eventNum}
                                                        </span>
                                                        <span>次</span>
                                                    </div>
                                                    <div className="dashbottxt">
                                                        告警总数
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="tongji">
                                        <div className="righthead">
                                            设备告警统计
                                        </div>
                                        <div>
                                            <Chart height={470} data={this.state.devicealarmlist} scale={colss} forceFit>
                                                <Legend />
                                                <Axis name="alarmTime" />
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
                                                    position="alarmTime*alarmNum"
                                                    size={2}
                                                    color={"deviceType"}
                                                    shape={"smooth"}
                                                />
                                                <Geom
                                                    type="point"
                                                    position="alarmTime*alarmNum"
                                                    size={4}
                                                    shape={"circle"}
                                                    color={"deviceType"}
                                                    style={{
                                                        stroke: "#fff",
                                                        lineWidth: 1
                                                    }}
                                                />
                                            </Chart>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <div className="areastatistics">
                                        <div className="righthead">
                                            区域所属单位统计
                                        </div>
                                        <div>
                                            <Chart
                                                height={300}
                                                data={dv}
                                                scale={cols}
                                                padding={[80, 100, 80, 80]}
                                                forceFit
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
                                                {/* <Guide>
                                                    <Html
                                                        position={["50%", "50%"]}
                                                        html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>主机<br><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>台</div>"
                                                        alignX="middle"
                                                        alignY="middle"
                                                    />
                                                </Guide> */}
                                                <Geom
                                                    type="intervalStack"
                                                    position="percent"
                                                    color="item"
                                                    tooltip={[
                                                        "item*percent",
                                                        (item, percent) => {
                                                            percent = (percent * 100).toFixed(2) + "%";
                                                            return {
                                                                name: item,
                                                                value: percent
                                                            };
                                                        }
                                                    ]}
                                                    style={{
                                                        lineWidth: 1,
                                                        stroke: "#fff"
                                                    }}
                                                >
                                                    <Label
                                                        content="percent"
                                                        formatter={(val, item) => {
                                                            return item.point.item + ": " + val;
                                                        }}
                                                    />
                                                </Geom>
                                            </Chart>
                                        </div>
                                    </div>
                                    <div className="areastatistics">
                                        <div className="righthead">
                                            单位告警排行
                                        </div>
                                        <div className="alarmtable">
                                            <Table
                                                dataSource={this.state.unitalarmlist}
                                                columns={this.unitalarmColumns}
                                                pagination={false}
                                                scroll={{ y: 270 }}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                </Layout>
            </Layout >
        );
    }
}

export default App;
