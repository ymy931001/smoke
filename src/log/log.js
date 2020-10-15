import React from "react";
import {
    Table,
    Layout,
    Button,
    Input,
    Select,
    Pagination,
    Tabs,
    Modal,
    DatePicker
} from "antd";
import { getdevicelog, getactivitylog } from '../axios';


import "./log.css";
import moment from 'moment';

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
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
            pageNums: 1,
            pageNumSizes: 10,
            deviceList: JSON.parse(localStorage.getItem('unitTree')),
        };
        this.nodeInfoTableColumns = [
            {
                title: "设备类型",
                dataIndex: "deviceType",
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
                            <span style={{ color: '#fe8616', cursor: 'pointer' }} onClick={() => this.lookdevicelog(text, record, index)}>查看</span>
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
                            <span style={{ color: '#fe8616', cursor: 'pointer' }} onClick={() => this.lookpersonlog(text, record, index)}>查看</span>
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
        this.devicelog()

        this.activitylog()

    }



    //获取设备日志
    devicelog = () => {
        getdevicelog([
            this.state.pageNum,
            this.state.pageNumSize,
            this.state.keytext,
            this.state.devicetype,
            this.state.logtype,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    deviceloglist: res.data.data.list,
                    total: res.data.data.total
                })
            }
        });
    }

    //获取操作日志
    activitylog = () => {
        getactivitylog([
            this.state.pageNums,
            this.state.pageNumSizes,
            this.state.begintime,
            this.state.endtime
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    activelist: res.data.data.list,
                    devicetotal: res.data.data.total
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
        this.devicelog()
    }

    query = () => {
        this.activitylog()
    }


    //设备日志页数变化
    pagechange = (page, b) => {
        console.log(page, b)
        this.setState({
            pageNum: page,
            pageNumSize: b,
        }, function () {
            this.devicelog()
        })
    }

    //操作日志页数变化
    devicepagechange = (page, b) => {
        console.log(page, b)
        this.setState({
            pageNums: page,
            pageNumSizes: b,
        }, function () {
            this.activitylog()
        })
    }

    //查看设备日志内容
    lookdevicelog = (text, record, index) => {
        this.setState({
            devicelogvisible: true,
            devicelogcont: record.msg
        })
    }

    //查看操作日志内容
    lookpersonlog = (text, record, index) => {
        console.log(record)
        this.setState({
            personlogvisible: true,
            personlogcont: record.content
        })
    }


    //关闭弹窗
    handleCancel = () => {
        this.setState({
            devicelogvisible: false,
            personlogvisible: false
        })
    }

    //设备类型选择
    devicetype = (value) => {
        this.setState({
            devicetype: value,
            pageNum: 1,
            pageNumSize: 10,
        }, function () {
            this.devicelog()
        })
    }

    //日志类型选择
    logtype = (value) => {
        this.setState({
            logtype: value,
            pageNum: 1,
            pageNumSize: 10,
        }, function () {
            this.devicelog()
        })
    }

    //日志时间筛选
    logtime = (value, b) => {
        if (!value) {
            this.setState({
                begintime: null,
                endtime: null
            })
        } else {
            this.setState({
                begintime: moment(value[0]).format("YYYY-MM-DD 00:00:00"),
                endtime: moment(value[1]).format("YYYY-MM-DD 23:59:59"),
            })
        }

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
        
        const listion = <img src={require('../images/close.png')} alt="" />

        return (
            <Layout id="alarm" >
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="设备日志" key="1">
                                    <div className="contentmain">
                                        &nbsp;&nbsp;&nbsp;设备编号&nbsp;: &nbsp;&nbsp;&nbsp;
                                            <Input placeholder="请输入设备编号" style={{ width: '150px', marginRight: '10px' }}
                                            value={this.state.keytext}
                                            onChange={this.keytext}
                                        />
                                           &nbsp;&nbsp;&nbsp;设备类型&nbsp;: &nbsp;&nbsp;&nbsp;
                                        <Select placeholder="请选择设备类型" style={{ width: "150px", marginRight: '10px' }} onChange={this.devicetype} value={this.state.devicetype}>
                                            <Option value={1}>烟感</Option>
                                            <Option value={2}>摄像头</Option>
                                        </Select>
                                        &nbsp;&nbsp;&nbsp;日志类型&nbsp;: &nbsp;&nbsp;&nbsp;
                                        <Select placeholder="请选择日志类型" style={{ width: "150px", marginRight: '20px' }} onChange={this.logtype} value={this.state.logtype}>
                                            <Option value={1}>心跳数据</Option>
                                            <Option value={2}>报警数据</Option>
                                            <Option value={3}>上电数据</Option>
                                            <Option value={4}>下线数据</Option>
                                        </Select>
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
                                                dataSource={this.state.deviceloglist}
                                                columns={nodeInfoTableColumns}
                                                pagination={false}
                                                onChange={this.devicelogchange}
                                            />
                                        </div>
                                        <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                                            <Pagination
                                                onShowSizeChange={this.onShowSizeChange}
                                                current={this.state.pageNum}
                                                onChange={this.pagechange}
                                                total={this.state.total}
                                                hideOnSinglePage={true}
                                            />
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab="操作日志" key="2">
                                    <div className="contentmain">
                                        关键字搜索&nbsp;: &nbsp;&nbsp;&nbsp;
                                            <Input placeholder="请输入关键字" style={{ width: '200px', marginRight: '20px' }}
                                            value={this.state.keytext}
                                            onChange={this.keytext}
                                        />
                                        <RangePicker style={{ marginRight: '20px' }}
                                            onChange={this.logtime}
                                            ranges={{
                                                "今日": [moment(), moment()],
                                                '本月': [moment().startOf('month'), moment().endOf('month')],
                                            }}
                                        />
                                        <Button type="primary" onClick={this.query}>查询</Button>
                                        <div style={{ marginTop: '20px' }}>
                                            <Table
                                                dataSource={this.state.activelist}
                                                columns={sensorColumns}
                                                pagination={false}

                                            />
                                        </div>
                                        <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                                            <Pagination
                                                onShowSizeChange={this.onShowSizeChange}
                                                current={this.state.pageNums}
                                                onChange={this.devicepagechange}
                                                total={this.state.devicetotal}
                                                hideOnSinglePage={true}
                                            />
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                            <Modal
                                title="设备日志内容"
                                visible={this.state.devicelogvisible}
                                onCancel={this.handleCancel}
                                // okText="保存"
                                width="400px"
                                mask={false}
                                closeIcon={listion}
                                footer={null}
                                centered
                            >
                                {this.state.devicelogcont}
                            </Modal>
                            <Modal
                                title="操作日志内容"
                                visible={this.state.personlogvisible}
                                onCancel={this.handleCancel}
                                // okText="保存"
                                width="400px"
                                mask={false}
                                closeIcon={listion}
                                footer={null}
                                centered
                            >
                                {this.state.personlogcont}
                            </Modal>
                        </div>
                    </Content>
                </Layout>
            </Layout >
        );
    }
}

export default App;
