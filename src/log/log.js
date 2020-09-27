import React from "react";
import {
    Table,
    Layout,
    Button,
    Input,
    Cascader,
    // DatePicker,
    Tabs
} from "antd";
import { getdevicelog, getactivitylog } from '../axios';


import "./log.css";
// import moment from 'moment';

const { Content } = Layout;
// const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// const dateFormat = 'YYYY-MM-DD';
const datatype = {
    1: '心跳数据',
    2: '报警数据',
    3: '上电数据',
    4: '下线数据',
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoListDataSource: [],
            device_ip: null,
            typenone: "inline-block",
            pageNum: 1,
            pageNumSize: 10,
            deviceList: JSON.parse(localStorage.getItem('unitTree')),
        };
        this.nodeInfoTableColumns = [
            {
                title: "设备类型",
                dataIndex: "deviceType",
                filters: [
                    { text: "烟雾传感器", value: 1 },
                    { text: "摄像头", value: 2 },
                ],
                onFilter: (value, record) => record.deviceType == value,  //eslint-disable-line 
                render: (text, record, index) => {
                    if (text === 1) {
                        return (
                            <div>
                                烟雾传感器
                            </div>
                        )
                    }
                    if (text === 2) {
                        return (
                            <div>
                                摄像头
                            </div>
                        )
                    }
                }
            },
            {
                title: "设备编号",
                dataIndex: "deviceId",
            }, {
                title: "日志类型",
                dataIndex: "dataType",
                filters: [
                    { text: "心跳数据", value: 1 },
                    { text: "报警数据", value: 2 },
                    { text: "上电数据", value: 3 },
                    { text: "下线数据", value: 4 },
                ],
                onFilter: (value, record) => record.dataType == value,  //eslint-disable-line 
                render: (text, record, index) => {
                    return (
                        <div>
                            {datatype[text]}
                        </div>
                    )
                }
            },

            {
                title: "日志内容",
                dataIndex: "msg",
                render: (text, record, index) => {
                    return (
                        <div>
                            <span style={{ color: '#fe8616' }}>查看</span>
                        </div>
                    )
                }
            }, {
                title: "上报时间",
                dataIndex: "gmtCreate",
            }
        ];


        this.sensorColumns = [
            {
                title: "日志类型",
                dataIndex: "title",
            },
            {
                title: "操作人",
                dataIndex: "username",
            }, {
                title: "ip地址",
                dataIndex: "ipAddress",
            },
            {
                title: "操作内容",
                dataIndex: "content",
                render: (text, record, index) => {
                    return (
                        <div>
                            <span style={{ color: '#fe8616' }}>查看</span>
                        </div>
                    )
                }
            },
            {
                title: "操作时间",
                dataIndex: "gmtcreate",
            },

        ];



    }

    componentWillMount() {
        document.title = "告警管理";
    }

    componentDidMount() {
        getdevicelog([

        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    cameraalarmlist: res.data.data
                })
            }
        });

        getactivitylog([

        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    sensoralarmlist: res.data.data
                })
            }
        });
    }


    //关键字录入
    keytext = (e) => {
        this.setState({
            keytext: e.target.value
        })
    }

    devicequery = () => {
        getdevicelog([
            this.state.keytext
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    cameraalarmlist: res.data.data
                })
            }
        });
    }

    render() {
        const nodeInfoTableColumns = this.nodeInfoTableColumns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        const sensorColumns = this.sensorColumns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <Layout id="alarm" >
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="设备日志" key="1">
                                    <div className="contentmain">
                                        &nbsp;&nbsp;&nbsp;设备编号&nbsp;: &nbsp;&nbsp;&nbsp;
                                            <Input placeholder="请输入设备编号" style={{ width: '200px', marginRight: '20px' }}
                                            value={this.state.keytext}
                                            onChange={this.keytext}
                                        />
                                        <Button type="primary" onClick={this.devicequery}>查询</Button>
                                        {/* 时间&nbsp;:
                                        <RangePicker
                                            style={{ marginLeft: '20px', marginRight: '20px', width: '300px' }}
                                            format={dateFormat}
                                            ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                                            onChange={this.timeonChange}
                                            value={[this.state.begintime, this.state.endtime]}
                                        /> */}
                                        {/* <div style={{ marginTop: "20px" }}>
                                        
                                            <Button onClick={this.reset} style={{ marginLeft: '15px' }}>重置</Button>
                                        </div> */}

                                        <div style={{ marginTop: '20px' }}>
                                            <Table
                                                dataSource={this.state.cameraalarmlist}
                                                columns={nodeInfoTableColumns}

                                            />
                                        </div>
                                        {/* <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                                            <Pagination
                                                onShowSizeChange={this.onShowSizeChange}
                                                defaultCurrent={1}
                                                onChange={this.pagechange}
                                                total={this.state.total}
                                                hideOnSinglePage={true}
                                            />
                                        </div> */}
                                    </div>
                                </TabPane>
                                <TabPane tab="操作日志" key="2">
                                    <div className="contentmain">
                                        &nbsp;&nbsp;&nbsp;设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                                        <Cascader
                                            fieldNames={{ label: 'name', value: 'adcode' }}
                                            options={this.state.deviceList}
                                            onChange={this.addresschange}
                                            value={this.state.addresslist}
                                            changeOnSelect
                                            style={{ width: "350px", marginRight: '20px' }}
                                            placeholder="选择酒店" />
                                                关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                                            <Input placeholder="请输入关键字" style={{ width: '200px', marginRight: '20px' }}
                                            value={this.state.keytext}
                                            onChange={this.keytext}
                                        />
                                        <Button type="primary" onClick={this.query}>查询</Button>
                                        <div style={{ marginTop: '20px' }}>
                                            <Table
                                                dataSource={this.state.sensoralarmlist}
                                                columns={sensorColumns}
                                            />
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Content>
                </Layout>
            </Layout >
        );
    }
}

export default App;
