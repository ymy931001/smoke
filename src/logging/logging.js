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
import $ from 'jquery'
import "./logging.css";

const { Content } = Layout;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoListDataSource: [],
            device_ip: null,
            typenone: "inline-block",
            datalist: "",
        };

    }

    componentWillMount() {
        document.title = "实时日志";
    }

    componentDidMount() {

        // var ws = new WebSocket("ws://121.41.5.169:9099/websocket/websocket");
        var ws = new WebSocket("ws://47.98.110.30:8088/zs/smoke/websocket/logging");

        ws.onopen = function () {

            // ws.send("发送数据");
            // alert("数据发送中...");
        };
        var arr = []

        ws.onmessage = function (evt) {
            if (document.getElementById("oss") != undefined) {
                if (evt.data != null && evt.data != "") {
                    $('#oss').append(evt.data + "</br>")
                }
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

    clearcont = () => {
        document.getElementById("oss").innerHTML = ""
    }


    gotobot = () => {
        document.getElementById("oss").scrollTop = document.getElementById("oss").scrollHeight
    }

    beginscroll

    render() {
        return (
            <Layout id="logging">
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <div className="headercont">
                            <div>
                                <div className="headertitle">
                                    实时日志
                                </div>
                                <div className="headertitles">
                                    1秒刷新一次
                                </div>
                            </div>
                        </div>
                        <div className="logmain" id="oss" escape="false">

                        </div>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <Button type="primary" onClick={this.clearcont} style={{ marginRight: '10px' }} >
                                清屏
                            </Button>
                            <Button type="primary" onClick={this.gotobot} >
                                滚至底部
                            </Button>
                        </div>
                    </Content>
                </Layout>
            </Layout >
        );
    }
}

export default App;
