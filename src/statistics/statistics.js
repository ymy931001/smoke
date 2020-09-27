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
                this.setState({
                    districunit: arr,
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
                    val = val * 100 + "%";
                    return val;
                }
            }
        };

        const data = [
            {
                month: "Jan",
                city: "Tokyo",
                temperature: 7
            },
            {
                month: "Jan",
                city: "London",
                temperature: 3.9
            },
            {
                month: "Feb",
                city: "Tokyo",
                temperature: 6.9
            },
            {
                month: "Feb",
                city: "London",
                temperature: 4.2
            },
            {
                month: "Mar",
                city: "Tokyo",
                temperature: 9.5
            },
            {
                month: "Mar",
                city: "London",
                temperature: 5.7
            },
            {
                month: "Apr",
                city: "Tokyo",
                temperature: 14.5
            },
            {
                month: "Apr",
                city: "London",
                temperature: 8.5
            },
            {
                month: "May",
                city: "Tokyo",
                temperature: 18.4
            },
            {
                month: "May",
                city: "London",
                temperature: 11.9
            },
            {
                month: "Jun",
                city: "Tokyo",
                temperature: 21.5
            },
            {
                month: "Jun",
                city: "London",
                temperature: 15.2
            },
            {
                month: "Jul",
                city: "Tokyo",
                temperature: 25.2
            },
            {
                month: "Jul",
                city: "London",
                temperature: 17
            },
            {
                month: "Aug",
                city: "Tokyo",
                temperature: 26.5
            },
            {
                month: "Aug",
                city: "London",
                temperature: 16.6
            },
            {
                month: "Sep",
                city: "Tokyo",
                temperature: 23.3
            },
            {
                month: "Sep",
                city: "London",
                temperature: 14.2
            },
            {
                month: "Oct",
                city: "Tokyo",
                temperature: 18.3
            },
            {
                month: "Oct",
                city: "London",
                temperature: 10.3
            },
            {
                month: "Nov",
                city: "Tokyo",
                temperature: 13.9
            },
            {
                month: "Nov",
                city: "London",
                temperature: 6.6
            },
            {
                month: "Dec",
                city: "Tokyo",
                temperature: 9.6
            },
            {
                month: "Dec",
                city: "London",
                temperature: 4.8
            }
        ];

        const colss = {
            month: {
                range: [0, 1]
            }
        };


        this.unitalarmColumns = [
            {
                title: "",
                dataIndex: "num",
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
                                                            percent = percent * 100 + "%";
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
