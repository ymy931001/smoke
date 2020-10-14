import React from "react";
import {
    Table,
    Layout,
    Button,
    Input,
    Select,
    Col,
    Tabs,
    Row,
    DatePicker
} from "antd";


import "./monitor.css";
import moment from 'moment';

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoListDataSource: [],
            device_ip: null,
            typenone: "inline-block",
            datalist: [],
        };

    }

    componentWillMount() {
        document.title = "实时监控";
    }

    componentDidMount() {
        // var ws = new WebSocket("ws://121.41.5.169:9099/websocket/websocket");
        var ws = new WebSocket("ws://47.98.110.30:8088/zs/smoke/websocket/monitor");

        ws.onopen = function () {
            // ws.send("发送数据");
            // alert("数据发送中...");
        };
        var that = this
        ws.onmessage = function (evt) {
            if (document.getElementById("os") != undefined) {
                that.setState({
                    datalist: JSON.parse(evt.data)
                })
            } else {
                console.log(111)
                ws.close()
            }
        };

        // ws.onclose = function () {
        //     // 关闭 websocket
        //     alert("连接已关闭...");
        // };

    }

    render() {
        const { datalist } = this.state
        return (
            <Layout id="monitor">
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <div className="headercont">
                            <div>
                                <div className="headertitle">
                                    系统环境监控
                                </div>
                                <div className="headertitles">
                                    1秒刷新一次
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <div className="bodycont">
                                        <div className="bodyheader">
                                            系统信息
                                        </div>
                                        <div className="bodyline">
                                            <div className="bodytext" id="os">
                                                操作系统：{datalist.os}
                                            </div>
                                            <div className="bodytext">
                                                Java版本：{datalist.jvmJavaVersion}
                                            </div>
                                            <div className="bodytext">
                                                程序启动时间：{datalist.runTime}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <div className="bodycont">
                                        <div className="bodyheader">
                                            CPU
                                        </div>
                                        <div className="bodyline">
                                            <div className="bodytext">
                                                CPU信息：{datalist.cpuInfo}
                                            </div>
                                            <div className="bodytext">
                                                CPU使用率：{datalist.cpuUseRate}%
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12} >
                                    <div className="bodycont">
                                        <div className="bodyheader">
                                            内存
                                        </div>
                                        <div className="bodyline">
                                            <div className="bodytext">
                                                内存总量：{datalist.ramTotal}（G）
                                            </div>
                                            <div className="bodytext">
                                                空闲内存：{datalist.ramUsed}（G）
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <div className="bodycont">
                                        <div className="bodyheader">
                                            磁盘
                                        </div>
                                        <div className="bodyline">
                                            <div className="bodytext">
                                                磁盘总量：{datalist.diskTotal}（G）
                                            </div>
                                            <div className="bodytext">
                                                空闲磁盘：{datalist.diskUsed}（G）
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <div className="bodycont">
                                        <div className="bodyheader">
                                            JVM堆内存
                                        </div>
                                        <div className="bodyline">
                                            <div className="bodytext">
                                                初始大小：{datalist.jvmHeapInit}（M）
                                            </div>
                                            <div className="bodytext">
                                                最大可用：{datalist.jvmHeapMax}（M）
                                            </div>
                                            <div className="bodytext">
                                                已使用：{datalist.jvmHeapUsed}（M）
                                            </div>
                                            <div className="bodytext">
                                                已申请：{datalist.jvmHeapCommitted}（M）
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <div className="bodycont">
                                        <div className="bodyheader">
                                            JVM非堆内存
                                        </div>
                                        <div className="bodyline">
                                            <div className="bodytext">
                                                初始大小：{datalist.jvmNonHeapInit}（M）
                                            </div>
                                            <div className="bodytext">
                                                最大可用：{datalist.jvmNonHeapMax}（M）
                                            </div>
                                            <div className="bodytext">
                                                已使用：{datalist.jvmNonHeapUsed}（M）
                                            </div>
                                            <div className="bodytext">
                                                已申请：{datalist.jvmNonHeapCommitted}（M）
                                            </div>
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
