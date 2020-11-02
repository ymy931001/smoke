import React from "react";
import {
    Table,
    Layout,
    Button,
    Input,
    Cascader,
    Pagination,
    Tabs, message, Modal, DatePicker, Select
} from "antd";
import { getalarmList, getAlarmVideoUrl } from '../axios';


import "./alarm.css";
import moment from 'moment';

const { Content } = Layout;
// const { RangePicker } = DatePicker;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const { Option } = Select;

const scenelist = {
    1: '医院',
    2: '酒店',
    3: '网吧',
    4: '车站码头',
    5: '写字楼',
    6: '商场',
    7: '其他',
}
// const dateFormat = 'YYYY-MM-DD';

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
            deviceLists: JSON.parse(localStorage.getItem('unitTree')),
            imglist: [],
            videourl: undefined,
        };
        this.nodeInfoTableColumns = [
            {
                title: "设备ID",
                dataIndex: "deviceId",
            },
            {
                title: "单位名称",
                dataIndex: "unit",
            }, {
                title: "所属场景",
                dataIndex: "unitType",
                // filters: [
                //     { text: "医院", value: 1 },
                //     { text: "酒店", value: 2 },
                //     { text: "网吧", value: 3 },
                //     { text: "车站码头", value: 4 },
                //     { text: "写字楼", value: 5 },
                //     { text: "商场", value: 6 },
                //     { text: "其他", value: 7 },
                // ],
                // onFilter: (value, record) => record.unitType == value,  //eslint-disable-line 
                render: (text, record, index) => {
                    return (
                        <div >
                            {scenelist[text]}
                        </div>
                    )
                }
            }, {
                title: "所属区域",
                dataIndex: "address",
            },
            {
                title: "设备位置",
                dataIndex: "location",
            },
            {
                title: "视频画面",
                dataIndex: "result",
                render: (text, record, index) => {
                    return (
                        <div>
                            <span style={{ color: '#fe8616', cursor: 'pointer' }} onClick={() => this.lookvideo(text, record, index)}>查看</span>
                        </div>
                    )
                }
            },
            {
                title: "抓拍图片",
                dataIndex: "result",
                render: (text, record, index) => {
                    return (
                        <div>
                            <span style={{ color: '#fe8616', cursor: 'pointer' }} onClick={() => this.lookimg(text, record, index)}>查看</span>
                        </div>
                    )
                }
            },
            {
                title: "告警时间",
                dataIndex: "gmtCreate",
                sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
            },
        ];


        this.sensorColumns = [
            {
                title: "设备ID",
                dataIndex: "deviceId",
            },
            {
                title: "单位名称",
                dataIndex: "unit",
            }, {
                title: "所属场景",
                dataIndex: "unitType",
                // filters: [
                //     { text: "医院", value: 1 },
                //     { text: "酒店", value: 2 },
                //     { text: "网吧", value: 3 },
                //     { text: "车站码头", value: 4 },
                //     { text: "写字楼", value: 5 },
                //     { text: "商场", value: 6 },
                //     { text: "其他", value: 7 },
                // ],
                // onFilter: (value, record) => record.unitType == value,  //eslint-disable-line 
                render: (text, record, index) => {
                    return (
                        <div >
                            {scenelist[text]}
                        </div>
                    )
                }
            }, {
                title: "所属区域",
                dataIndex: "address",
            },
            {
                title: "设备位置",
                dataIndex: "location",
            },
            {
                title: "告警时间",
                dataIndex: "gmtCreate",
                sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
            },
        ];



    }

    componentWillMount() {
        document.title = "告警管理";
    }

    componentDidMount() {
        this.cameraalarm()
        this.sensoralarm()
    }

    cameraalarm = () => {
        getalarmList([
            localStorage.getItem('token'),
            2,
            31,
            this.state.cityid,
            this.state.areaid,
            this.state.siteId,
            this.state.keytext,
            this.state.pageNum,
            this.state.pageNumSize,
            this.state.begintime,
            this.state.endtime,
            this.state.unitType
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    cameraalarmlist: res.data.data.list,
                    cameratotal: res.data.data.total
                }, function () {
                    console.log(this.state.cameratotal)
                })
            }
        });
    }

    sensoralarm = () => {
        getalarmList([
            localStorage.getItem('token'),
            1,
            31,
            this.state.cityids,
            this.state.areaids,
            this.state.siteIds,
            this.state.keytexts,
            this.state.pageNums,
            this.state.pageNumSizes,
            null,
            null,
            this.state.unitTypes
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    sensoralarmlist: res.data.data.list,
                    sensortotal: res.data.data.total
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



    //设备位置选择
    addresschange = (e) => {
        console.log(e)
        this.setState({
            addresslist: e,
            cityid: e[0] === undefined ? null : e[0],
            areaid: e[1] === undefined ? null : e[1],
            siteId: e[2] === undefined ? null : e[2]
        });
    }

    //设备位置选择
    addresschanges = (e) => {
        console.log(e)
        this.setState({
            addresslists: e,
            cityids: e[0] === undefined ? null : e[0],
            areaids: e[1] === undefined ? null : e[1],
            siteIds: e[2] === undefined ? null : e[2]
        });
    }



    lookimg = (text, record, index) => {
        if (record.images === null) {
            message.error('暂无图片')
        } else {
            if (JSON.parse(record.images).length === 0) {
                message.error('暂无图片')
            } else {
                this.setState({
                    imgvisible: true,
                    imglist: JSON.parse(record.images)
                }, function () {
                    var arr = this.state.imglist
                    if (record.imageInfraRed) {
                        arr.push("http://smoke.terabits.cn" + record.imageInfraRed)
                        this.setState({
                            imglist: arr
                        }, function () {
                            console.log(this.state.imglist)
                        })
                    }
                    console.log(this.state.imglist)
                })
            }
        }

    }

    //关闭
    handleCancel = () => {
        this.setState({
            videovisible: false,
            videourl: undefined,
        })
    }




    handleCancels = () => {
        this.setState({
            imgvisible: false,
        })
    }

    //摄像头查询
    cameraquery = () => {
        this.cameraalarm()
    }

    //传感器查询
    query = () => {
        this.sensoralarm()
    }

    //摄像头关键字
    keytext = (e) => {
        this.setState({
            keytext: e.target.value
        })
    }

    //传感器关键字
    keytexts = (e) => {
        this.setState({
            keytexts: e.target.value
        })
    }


    lookvideo = (text, record, index) => {
        getAlarmVideoUrl([
            record.deviceId,
            record.eventTime
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                if (res.data.data != undefined) {
                    this.setState({
                        videovisible: true,
                        videourl: "http://smoke.terabits.cn" + res.data.data + "?t=20190201"
                    })
                }
            } else {
                message.error(res.data.message)
            }
        });
    }

    //摄像头页数变化
    pagechange = (page, b) => {
        console.log(page, b)
        this.setState({
            pageNum: page,
            pageNumSize: b,
        }, function () {
            this.cameraalarm()
        })
    }

    //传感器页数变化
    sensorpagechange = (page, b) => {
        console.log(page, b)
        this.setState({
            pageNums: page,
            pageNumSizes: b,
        }, function () {
            this.sensoralarm()
        })
    }

    //报警时间筛选
    alarmtime = (value, b) => {
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

    //所属场景筛选
    unitType = (value) => {
        console.log(value)
        this.setState({
            unitType: value,
            pageNum:1,
            pageNumSize:10,
        }, function () {
            this.cameraalarm()
        })
    }


    //所属场景筛选
    unitTypes = (value) => {
        console.log(value)
        this.setState({
            unitTypes: value,
            pageNums:1,
            pageNumSizes:10,
        }, function () {
            this.sensoralarm()
        })
    }


    render() {
        const imgoption = this.state.imglist.map((img) =>
            <a href={img} target="_blank">
                <img src={img} alt="" style={{ width: '100%' }} />
            </a>
        );
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

        const bodyStyle = {
            maxHeight: document.body.clientHeight * 0.7,
            overflowX: "auto",
        }

        return (
            <Layout id="alarm" >
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="摄像头告警" key="1">
                                    <div className="contentmain">
                                        &nbsp;&nbsp;&nbsp;设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                                        <Cascader
                                            fieldNames={{ label: 'name', value: 'id' }}
                                            options={this.state.deviceList}
                                            onChange={this.addresschange}
                                            value={this.state.addresslist}
                                            changeOnSelect
                                            style={{ width: "350px", marginRight: '20px' }}
                                            placeholder="选择酒店" />
                                                设备编号&nbsp;: &nbsp;&nbsp;&nbsp;
                                            <Input placeholder="请输入设备编号" style={{ width: '200px', marginRight: '20px' }}
                                            value={this.state.keytext}
                                            onChange={this.keytext}
                                        />

                                        <div style={{ marginTop: '20px' }}>
                                            &nbsp;&nbsp;&nbsp;告警时间&nbsp;: &nbsp;&nbsp;&nbsp;
                                            <RangePicker style={{ marginRight: '20px' }}
                                                onChange={this.alarmtime}

                                                ranges={{
                                                    "今日": [moment(), moment()],
                                                    '本月': [moment().startOf('month'), moment().endOf('month')],
                                                }}
                                            />
                                            <span>所属场景：</span>
                                            <Select placeholder="请选择所属场景" style={{ width: '150px', marginRight: "20px", }} onChange={this.unitType} value={this.state.unitType}>
                                                <Option value={null}>全部</Option>
                                                <Option value={1}>医院</Option>
                                                <Option value={2}>酒店</Option>
                                                <Option value={3}>网吧</Option>
                                                <Option value={4}>车站码头</Option>
                                                <Option value={5}>写字楼</Option>
                                                <Option value={6}>商场</Option>
                                                <Option value={7}>其他</Option>
                                            </Select>
                                            <Button type="primary" onClick={this.cameraquery}>查询</Button>
                                        </div>
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
                                                pagination={false}
                                            />
                                        </div>
                                        {/* <div>
                                        <Pagination defaultCurrent={6} total={500} />
                                        </div> */}
                                        <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                                            <Pagination
                                                onShowSizeChange={this.onShowSizeChange}
                                                defaultCurrent={1}
                                                onChange={this.pagechange}
                                                total={this.state.cameratotal}
                                                hideOnSinglePage={true}
                                                current={this.state.pageNum}
                                            />
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab="传感器告警" key="2">
                                    <div className="contentmain">
                                        &nbsp;&nbsp;&nbsp;设备位置&nbsp;: &nbsp;&nbsp;&nbsp;
                                        <Cascader
                                            fieldNames={{ label: 'name', value: 'id' }}
                                            options={this.state.deviceLists}
                                            onChange={this.addresschanges}
                                            value={this.state.addresslists}
                                            changeOnSelect
                                            style={{ width: "350px", marginRight: '20px' }}
                                            placeholder="选择酒店" />
                                                设备编号&nbsp;: &nbsp;&nbsp;&nbsp;
                                            <Input placeholder="请输入设备编号" style={{ width: '200px', marginRight: '20px' }}
                                            value={this.state.keytexts}
                                            onChange={this.keytexts}
                                        />
                                        <span>所属场景：</span>
                                        <Select placeholder="请选择所属场景" style={{ width: '150px', marginRight: "20px", }} onChange={this.unitTypes} value={this.state.unitTypes}>
                                            <Option value={null}>全部</Option>
                                            <Option value={1}>医院</Option>
                                            <Option value={2}>酒店</Option>
                                            <Option value={3}>网吧</Option>
                                            <Option value={4}>车站码头</Option>
                                            <Option value={5}>写字楼</Option>
                                            <Option value={6}>商场</Option>
                                            <Option value={7}>其他</Option>
                                        </Select>
                                        <Button type="primary" onClick={this.query}>查询</Button>
                                        <div style={{ marginTop: '20px' }}>
                                            <Table
                                                dataSource={this.state.sensoralarmlist}
                                                columns={sensorColumns}
                                                pagination={false}
                                            />
                                        </div>
                                        <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                                            <Pagination
                                                onShowSizeChange={this.onShowSizeChange}
                                                defaultCurrent={1}
                                                onChange={this.sensorpagechange}
                                                total={this.state.sensortotal}
                                                hideOnSinglePage={true}
                                                current={this.state.pageNums}
                                            />
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Content>
                    <Modal
                        title="报警视频"
                        visible={this.state.videovisible}
                        width="80%"
                        centered
                        onCancel={this.handleCancel}
                        footer={null}
                        closeIcon={listion}
                    >
                        <video width="100%" controls="controls" type="video/mp4" autoPlay="autoplay" loop="loop" id="example-video" src={this.state.videourl}  >
                        </video>
                    </Modal>
                    <Modal
                        title="抓拍图片"
                        visible={this.state.imgvisible}
                        width="50%"
                        bodyStyle={bodyStyle}
                        centered
                        onCancel={this.handleCancels}
                        closeIcon={listion}
                        footer={null}
                    >
                        {/* <Carousel effect="fade"  autoplay> */}
                        {imgoption}
                        {/* </Carousel> */}
                    </Modal>
                </Layout>
            </Layout >
        );
    }
}

export default App;
