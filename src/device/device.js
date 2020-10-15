import React from "react";
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import {
    Card,
    Layout,
    Button,
    Input,
    Table,
    Select,
    Modal, DatePicker, message, Cascader, Tabs, Switch, Pagination
} from "antd";
import {
    getdeviceList, getNotHaveList, getunitList, addsensor,
    addcamera, deletedevice, changestaus, getRealVideo, getdevicelog, activeDevice
} from '../axios';


import "./device.css";
import moment from 'moment';

const datatype = {
    1: '心跳数据',
    2: '报警数据',
    3: '上电数据',
    4: '下线数据',
}


const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// const dateFormat = 'YYYY-MM-DD';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoListDataSource: [],
            unbindcameralist: [],
            device_ip: null,
            typenone: "inline-block",
            pageNum: 1,
            pageNumSize: 10,
            pageNums: 1,
            pageNumSizes: 10,
            unitlist: [],
            deviceList: JSON.parse(localStorage.getItem('unitTree')),
            typedis: "none"
        };

        if (localStorage.getItem('usertype') === "1") {
            this.nodeInfoTableColumns = [
                {
                    title: "设备编号",
                    dataIndex: "deviceId",
                },
                {
                    title: "所属单位",
                    dataIndex: "unit",
                },
                {
                    title: "安装位置",
                    dataIndex: "location",
                }, {
                    title: "设备IMEI",
                    dataIndex: "imei",
                }, {
                    title: "信号强度",
                    dataIndex: "rssi",
                },
                {
                    title: "设备状态",
                    dataIndex: "statusConnect",
                    filters: [
                        { text: "在线", value: 1 },
                        { text: "离线", value: 0 },
                    ],
                    onFilter: (value, record) => record.statusConnect == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        if (text === 1) {
                            return (
                                <div style={{ color: '#1eb333', cursor: 'pointer' }} onClick={() => this.onlinelist(text, record, index)}>
                                    在线
                                </div>
                            )
                        }
                        if (text === 0) {
                            return (
                                <div style={{ color: '#f55238', cursor: 'pointer' }} onClick={() => this.onlinelist(text, record, index)}>
                                    离线
                                </div>
                            )
                        }
                    }
                },
                {
                    title: "短信推送",
                    dataIndex: "sendMsg",
                    render: (text, record, index) => {
                        return (
                            <div >
                                <Switch
                                    checked={text}
                                    checkedChildren="开启" unCheckedChildren="关闭"
                                    onChange={() => this.switchchange(text, record, index)}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "添加时间",
                    dataIndex: "gmtCreate",
                    sorter: (a, b) => new Date(a.gmtCreate) > new Date(b.gmtCreate) ? 1 : -1,
                },
                {
                    title: "最近连接时间",
                    dataIndex: "lastConnect",
                    sorter: (a, b) => new Date(a.lastConnect) > new Date(b.lastConnect) ? 1 : -1,
                    render: (text, record, index) => {
                        if (text === null) {
                            return (
                                <div>
                                    无
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    {text}
                                </div>
                            )
                        }
                    }
                },
                {
                    title: "操作",
                    dataIndex: "gmtCreate",
                    render: (text, record, index) => {
                        return (
                            <div>
                                <span onClick={() => this.sensoredit(text, record, index)}>
                                    <a><img src={require('../images/edit.png')} alt="" /></a>
                                </span>
                                <span style={{ marginLeft: '10px' }} onClick={() => this.devicedelete(text, record, index)}>
                                    <a><img src={require('../images/delete.png')} alt="" /></a>
                                </span>
                            </div>
                        );
                    }
                },

            ];

        } else {
            this.nodeInfoTableColumns = [
                {
                    title: "设备编号",
                    dataIndex: "deviceId",
                },
                {
                    title: "所属单位",
                    dataIndex: "unit",
                },
                {
                    title: "安装位置",
                    dataIndex: "location",
                }, {
                    title: "设备IMEI",
                    dataIndex: "imei",
                }, {
                    title: "信号强度",
                    dataIndex: "rssi",
                },
                {
                    title: "设备状态",
                    dataIndex: "statusConnect",
                    filters: [
                        { text: "在线", value: 1 },
                        { text: "离线", value: 0 },
                    ],
                    onFilter: (value, record) => record.statusConnect == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        if (text === 1) {
                            return (
                                <div style={{ color: '#1eb333', cursor: 'pointer' }} onClick={() => this.onlinelist(text, record, index)}>
                                    在线
                                </div>
                            )
                        }
                        if (text === 0) {
                            return (
                                <div style={{ color: '#f55238', cursor: 'pointer' }} onClick={() => this.onlinelist(text, record, index)}>
                                    离线
                                </div>
                            )
                        }
                    }
                },
                {
                    title: "添加时间",
                    dataIndex: "gmtCreate",
                    sorter: (a, b) => new Date(a.gmtCreate) > new Date(b.gmtCreate) ? 1 : -1,
                },
                {
                    title: "最近连接时间",
                    dataIndex: "lastConnect",
                    sorter: (a, b) => new Date(a.lastConnect) > new Date(b.lastConnect) ? 1 : -1,
                    render: (text, record, index) => {
                        if (text === null) {
                            return (
                                <div>
                                    无
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    {text}
                                </div>
                            )
                        }
                    }
                },

            ];

        }


    }

    componentWillMount() {
        document.title = "设备管理";
        if (localStorage.getItem("usertype") === "1") {
            this.setState({
                typedis: 'inline'
            })
        } else {
            this.setState({
                typedis: 'none'
            })
        }
    }

    componentDidMount() {
        this.getcameraList()
        this.getsensorlist()
        this.getunitList()
    }


    getsensorlist = () => {
        getdeviceList([
            localStorage.getItem('token'),
            1,
            31,
            this.state.cityid,
            this.state.areaid,
            this.state.siteId,
            this.state.searchnames,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    sensorlist: res.data.data
                }, function () {
                    if (this.state.sensorlist.length > 10) {
                        this.setState({
                            page: true,
                        })
                    } else {
                        this.setState({
                            page: false,
                        })
                    }
                })
            }
        });
    }


    getcameraList = () => {
        getdeviceList([
            localStorage.getItem('token'),
            2,
            31,
            this.state.cityid,
            this.state.areaid,
            this.state.siteId,
            this.state.searchname,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    cameralist: res.data.data
                }, function () {
                    if (this.state.cameralist.length > 10) {
                        this.setState({
                            camerapage: true,
                        })
                    } else {
                        this.setState({
                            camerapage: false,
                        })
                    }
                })
            }
        });
    }

    //打开添加设备弹窗
    adddevice = () => {
        this.getunitList()
        this.setState({
            devicevisible: true,
        })
    }

    //获取单位列表
    getunitList = () => {
        getunitList([
            localStorage.getItem('token'),
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                var arr = []
                for (var i in res.data.data) {
                    arr.push({
                        'id': res.data.data[i].id,
                        'name': res.data.data[i].unit,
                    })
                }
                this.setState({
                    unitlist: arr
                })
            }
        });
    }

    //检测状态
    switchchange = (text, record, index) => {
        changestaus([
            record.id,
            record.sendMsg === 1 ? 0 : 1
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success("状态修改成功");
                this.getcameraList()
                this.getsensorlist()
            } else {
                message.error(res.data.message)
            }
        });
    }


    //关闭弹窗
    handleCancel = () => {
        this.setState({
            devicevisible: false,
            devicedeletevisible: false,
            cameravisible: false,
            recordvisible: false,
            sensorid: undefined,
            cameraid: undefined,
            deviceIds: undefined,
            unitnames: undefined,
            locations: undefined,
            deviceId: undefined,
            imei: undefined,
            unitname: undefined,
            location: undefined,
            camerarecord: undefined,
            activevisible: false
        })
    }

    //关闭弹窗
    handleCancels = () => {
        this.setState({
            videovisible: false,
            videourl: undefined,
        })
        // this.getcameraList()
        window.location.reload()
    }


    //打开实时画面
    oprealLive = (text, record, index) => {
        if (record.statusConnect === 0) {
            message.error('设备离线')
        } else {
            getRealVideo([
                record.id,
            ]).then(res => {
                if (res.data && res.data.message === "success") {
                    this.setState({
                        videovisible: true,
                        videourl: res.data.data
                    })
                } else {
                    message.error(res.data.message)
                }
            });

        }

        // if (!text) {

        // } else {
        //     this.setState({
        //         videovisible: true,
        //         videourl: text
        //     })
        // }
    }




    //设备类型选择
    devicetype = (value) => {
        this.setState({
            devicetype: value
        }, function () {
            if (this.state.devicetype === 1) {
                this.setState({
                    disdevice: 'block'
                })
            } else {
                this.setState({
                    disdevice: 'none'
                })
            }
        })
    }

    //烟感编号
    deviceId = (e) => {
        this.setState({
            deviceId: e.target.value
        })
    }


    //摄像头编号
    deviceIds = (value) => {
        this.setState({
            deviceIds: value
        })
    }

    //设备位置
    location = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    //摄像头设备位置
    locations = (e) => {
        this.setState({
            locations: e.target.value
        })
    }

    //所属单位
    unitname = (value) => {
        this.setState({
            unitname: value
        })
    }

    //摄像头所属单位
    unitnames = (value) => {
        this.setState({
            unitnames: value
        })
    }

    //添加摄像头
    cameraOk = () => {
        addcamera([
            2,
            this.state.deviceIds,
            this.state.unitnames,
            this.state.locations,
            this.state.cameraid,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                if (!this.state.cameraid) {
                    message.success('添加成功')
                } else {
                    message.success('修改成功')
                }
                this.setState({
                    cameravisible: false,
                    cameraid: undefined
                })
                this.handleCancel()
                this.getcameraList()
            } else {
                message.error(res.data.message)
            }
        });
    }

    //添加烟感
    addOk = () => {
        addsensor([
            1,
            this.state.deviceId,
            this.state.imei,
            this.state.unitname,
            this.state.location,
            this.state.sensorid,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                if (!this.state.sensorid) {
                    message.success('添加成功')
                } else {
                    message.success('修改成功')
                }

                this.setState({
                    devicevisible: false,
                    sensorid: undefined,
                })
                this.handleCancel()
                this.getsensorlist()
            } else {
                message.error(res.data.message)
            }
        });
    }

    //打开删除设备弹窗
    devicedelete = (text, record, index) => {
        this.setState({
            devicedeletevisible: true,
            deviceid: record.id
        })
    }



    //删除设备
    deletedevice = () => {
        deletedevice([
            this.state.deviceid,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('删除成功')
                this.setState({
                    devicedeletevisible: false,
                })
                this.getcameraList()
                this.getsensorlist()
            } else {
                message.error(res.data.message)
            }
        });
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

    //搜索框录入
    searchname = (e) => {
        this.setState({
            searchname: e.target.value
        })
    }

    //传感器搜索框录入
    searchnames = (e) => {
        this.setState({
            searchnames: e.target.value
        })
    }

    //imei号输入
    imei = (e) => {
        this.setState({
            imei: e.target.value.replace(/[^0-9.]/g, '').length > 15 ? e.target.value.substring(0, 15) : e.target.value.replace(/[^0-9.]/g, '')
        })
    }


    //搜索
    onsearch = () => {
        this.getcameraList()
    }

    //传感器编号搜索
    onsearchs = () => {
        this.getsensorlist()
    }

    //打开摄像头弹窗
    addcamera = () => {
        this.getunitList()
        getNotHaveList([
            localStorage.getItem('token')
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                // var arr = []
                // for (var i in res.data.data) {
                //     for (var j in res.data.data[i]) {
                //         arr.push({
                //             "id": i,
                //             "channelNo": res.data.data[i][j].channelNo
                //         })
                //     }
                // }
                // console.log(arr)
                var arr = []
                for (var i in res.data.data) {
                    arr.push({
                        "id": i,
                        "value": i
                    })
                }
                this.setState({
                    unbindcameralist: arr
                })
            }
        });
        this.setState({
            cameravisible: true,
        })
    }

    //编辑传感器
    sensoredit = (text, record, index) => {
        this.setState({
            deviceId: record.deviceId,
            imei: record.imei,
            sensorid: record.id,
            unitname: record.unitId.toString(),
            location: record.location,
            devicevisible: true
        })
    }

    //编辑传感器
    cameraedit = (text, record, index) => {
        console.log(record)
        this.setState({
            deviceIds: record.deviceId,
            cameraid: record.id,
            unitnames: record.unitId.toString(),
            locations: record.location,
            cameravisible: true
        })
    }

    //传感器上下线记录
    onlinelist = (text, record, index) => {
        this.setState({
            deviceId: record.deviceId
        }, function () {
            getdevicelog([
                this.state.pageNums,
                this.state.pageNumSizes,
                record.deviceId,
                1,
                [1, 3, 4].join(',')
            ]).then(res => {
                if (res.data && res.data.message === "success") {
                    this.setState({
                        recordlist: res.data.data.list,
                        recordvisible: true,
                        sensortotal: res.data.data.total
                    })
                }
            });
        });
    }

    //传感器分页变化
    sensorchange = (page, b) => {
        console.log(page, b)
        this.setState({
            pageNums: page,
            pageNumSizes: b,
        }, function () {
            getdevicelog([
                this.state.pageNums,
                this.state.pageNumSizes,
                this.state.deviceId,
                1,
                [1, 3, 4].join(',')
            ]).then(res => {
                if (res.data && res.data.message === "success") {
                    this.setState({
                        recordlist: res.data.data.list,
                        recordvisible: true,
                        sensortotal: res.data.data.total
                    })
                }
            });
        })
    }


    //摄像头上下线记录
    lookcamera = (text, record, index) => {
        console.log(record)
        this.setState({
            deviceId: record.deviceId
        }, function () {
            getdevicelog([
                this.state.pageNum,
                this.state.pageNumSize,
                this.state.deviceId,
                2,
                [3, 4].join(',')
            ]).then(res => {
                if (res.data && res.data.message === "success") {
                    this.setState({
                        recordlist: res.data.data.list,
                        camerarecord: true,
                        cameratotal: res.data.data.total
                    })
                }
            });
        })

    }


    //摄像头页数变化
    pagechange = (page, b) => {
        console.log(page, b)
        this.setState({
            pageNum: page,
            pageNumSize: b,
        }, function () {
            getdevicelog([
                this.state.pageNum,
                this.state.pageNumSize,
                this.state.deviceId,
                2,
                [3, 4].join(',')
            ]).then(res => {
                if (res.data && res.data.message === "success") {
                    this.setState({
                        recordlist: res.data.data.list,
                        camerarecord: true,
                        cameratotal: res.data.data.total
                    })
                }
            });
        })
    }

    //激活设备
    activeion = (text, record, index) => {
        this.setState({
            cameraid: record.id,
            activevisible: true
        })
    }

    //输入激活码
    activenum = (e) => {
        this.setState({
            activenum: e.target.value
        })
    }

    //确认激活设备
    activeok = () => {
        activeDevice([
            this.state.activenum,
            this.state.cameraid,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('设备激活成功')
                this.getcameraList()
                this.setState({
                    activevisible: false,
                })
            } else {
                message.error(res.data.message)
            }
        });
    }


    render() {

        const prooptions = this.state.unitlist.map((province) => <Option key={province.id}  >{province.name}</Option>);
        const cameraprooptions = this.state.unbindcameralist.map((province) => <Option key={province.id}  >{province.value}</Option>);



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


        this.camerarecordColumns = [
            {
                title: "数据类型",
                dataIndex: "dataType",
                render: (text, record, index) => {
                    if (text === 3) {
                        return (
                            <div style={{ color: '#1eb333' }}>
                                在线
                            </div>
                        )
                    }
                    if (text === 4) {
                        return (
                            <div style={{ color: '#f55238' }}>
                                离线
                            </div>
                        )
                    }
                }
            },
            {
                title: "设备编号",
                dataIndex: "deviceId",
            },
            {
                title: "上报时间",
                dataIndex: "gmtCreate",
            },
        ]


        this.recordColumns = [
            {
                title: "数据类型",
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
                title: "设备编号",
                dataIndex: "deviceId",
            },
            {
                title: "上报时间",
                dataIndex: "gmtCreate",
            },
        ]


        if (localStorage.getItem('usertype') === "1") {
            this.cameraColumns = [
                {
                    title: "设备编号",
                    dataIndex: "deviceId",
                },
                {
                    title: "所属单位",
                    dataIndex: "unit",
                },
                {
                    title: "安装位置",
                    dataIndex: "location",
                },
                {
                    title: "设备状态",
                    dataIndex: "statusConnect",
                    filters: [
                        { text: "在线", value: 1 },
                        { text: "离线", value: 0 },
                    ],
                    onFilter: (value, record) => record.statusConnect == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        if (text === 1) {
                            return (
                                <div style={{ color: '#1eb333', cursor: 'pointer' }} onClick={() => this.lookcamera(text, record, index)} >
                                    在线
                                </div>
                            )
                        }
                        if (text === 0) {
                            return (
                                <div style={{ color: '#f55238', cursor: 'pointer' }} onClick={() => this.lookcamera(text, record, index)} >
                                    离线
                                </div>
                            )
                        }
                    }
                }, {
                    title: "激活状态",
                    dataIndex: "isActive",
                    filters: [
                        { text: "已激活", value: 1 },
                        { text: "未激活", value: 0 },
                    ],
                    onFilter: (value, record) => record.isActive == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        if (text === 1) {
                            return (
                                <div style={{ color: '#1eb333' }}>
                                    已激活
                                </div>
                            )
                        }
                        if (text === 0) {
                            return (
                                <div style={{ color: '#f55238', cursor: 'pointer' }} onClick={() => this.activeion(text, record, index)}>
                                    未激活
                                </div>
                            )
                        }
                    }
                }, {
                    title: "实时画面",
                    dataIndex: "realLive",
                    render: (text, record, index) => {
                        return (
                            <div style={{ color: '#fe8616', cursor: 'pointer' }} onClick={() => this.oprealLive(text, record, index)}>
                                查看
                            </div>
                        )
                    }
                },
                {
                    title: "短信推送",
                    dataIndex: "sendMsg",
                    render: (text, record, index) => {
                        return (
                            <div >
                                <Switch
                                    checked={text}
                                    checkedChildren="开启" unCheckedChildren="关闭"
                                    onChange={() => this.switchchange(text, record, index)}
                                />
                            </div>
                        )
                    }
                },
                {
                    title: "添加时间",
                    dataIndex: "gmtCreate",
                    sorter: (a, b) => new Date(a.gmtCreate) > new Date(b.gmtCreate) ? 1 : -1,
                },
                {
                    title: "最近连接时间",
                    dataIndex: "lastConnect",
                    sorter: (a, b) => new Date(a.lastConnect) > new Date(b.lastConnect) ? 1 : -1,
                    render: (text, record, index) => {
                        if (text === null) {
                            return (
                                <div>
                                    无
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    {text}
                                </div>
                            )
                        }
                    }
                },
                {
                    title: "操作",
                    dataIndex: "gmtCreate",
                    render: (text, record, index) => {
                        return (
                            <div>
                                <span onClick={() => this.cameraedit(text, record, index)}>
                                    <a><img src={require('../images/edit.png')} alt="" /></a>
                                </span>
                                <span style={{ marginLeft: '10px' }} onClick={() => this.devicedelete(text, record, index)}>
                                    <a><img src={require('../images/delete.png')} alt="" /></a>
                                </span>
                            </div>
                        );
                    }
                },
            ];
        } else {
            this.cameraColumns = [
                {
                    title: "设备编号",
                    dataIndex: "deviceId",
                },
                {
                    title: "所属单位",
                    dataIndex: "unit",
                },
                {
                    title: "安装位置",
                    dataIndex: "location",
                },
                {
                    title: "设备状态",
                    dataIndex: "statusConnect",
                    filters: [
                        { text: "在线", value: 1 },
                        { text: "离线", value: 0 },
                    ],
                    onFilter: (value, record) => record.statusConnect == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        if (text === 1) {
                            return (
                                <div style={{ color: '#1eb333', cursor: 'pointer' }} onClick={() => this.lookcamera(text, record, index)} >
                                    在线
                                </div>
                            )
                        }
                        if (text === 0) {
                            return (
                                <div style={{ color: '#f55238', cursor: 'pointer' }} onClick={() => this.lookcamera(text, record, index)} >
                                    离线
                                </div>
                            )
                        }
                    }
                }, {
                    title: "实时画面",
                    dataIndex: "realLive",
                    render: (text, record, index) => {
                        return (
                            <div style={{ color: '#fe8616', cursor: 'pointer' }} onClick={() => this.oprealLive(text, record, index)}>
                                查看
                            </div>
                        )
                    }
                },
                {
                    title: "添加时间",
                    dataIndex: "gmtCreate",
                    sorter: (a, b) => new Date(a.gmtCreate) > new Date(b.gmtCreate) ? 1 : -1,
                },
                {
                    title: "最近连接时间",
                    dataIndex: "lastConnect",
                    sorter: (a, b) => new Date(a.lastConnect) > new Date(b.lastConnect) ? 1 : -1,
                    render: (text, record, index) => {
                        if (text === null) {
                            return (
                                <div>
                                    无
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    {text}
                                </div>
                            )
                        }
                    }
                },
            ];
        }




        const components = {
            // body: {
            //     row: EditableFormRow,
            //     cell: EditableCell,
            // },
        };
        return (
            <Layout id="device" >
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <div>
                            <Tabs defaultActiveKey="2">
                                <TabPane tab="摄像头" key="2">
                                    <div className="contentmain">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <span>所属单位：</span>
                                                <Cascader
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={this.state.deviceList}
                                                    onChange={this.addresschange}
                                                    value={this.state.addresslist}
                                                    changeOnSelect
                                                    style={{ width: "300px", marginRight: '10px' }}
                                                    placeholder="请选择单位" />
                                                <Search placeholder="请输入设备编号"
                                                    onSearch={this.onsearch}
                                                    onChange={this.searchname}
                                                    value={this.state.searchname}
                                                    enterButton style={{ marginBottom: '20px', width: '300px' }}
                                                />
                                            </div>
                                            <Button type="primary" onClick={this.addcamera} style={{ display: this.state.typedis }} >
                                                添加设备
                                            </Button>
                                        </div>
                                        <Table
                                            dataSource={this.state.cameralist}
                                            columns={this.cameraColumns}
                                            pagination={this.state.camerapage}
                                            components={components}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tab="传感器" key="1">
                                    <div className="contentmain">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <span>所属单位：</span>
                                                <Cascader
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={this.state.deviceList}
                                                    onChange={this.addresschange}
                                                    value={this.state.addresslist}
                                                    changeOnSelect
                                                    style={{ width: "300px", marginRight: '10px' }}
                                                    placeholder="请选择单位" />
                                                <Search placeholder="请输入设备编号"
                                                    onSearch={this.onsearchs}
                                                    onChange={this.searchnames}
                                                    value={this.state.searchnames}
                                                    enterButton style={{ marginBottom: '20px', width: '300px' }}
                                                />
                                            </div>
                                            <Button type="primary" onClick={this.adddevice} style={{ display: this.state.typedis }} >
                                                添加设备
                                            </Button>
                                        </div>
                                        <Table
                                            dataSource={this.state.sensorlist}
                                            columns={nodeInfoTableColumns}
                                            pagination={this.state.page}
                                            components={components}
                                        />
                                    </div>
                                </TabPane>

                            </Tabs>

                        </div>
                    </Content>
                    <Modal
                        title="删除设备"
                        visible={this.state.devicedeletevisible}
                        onOk={this.deletedevice}
                        width="300px"
                        okText="删除"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        您确定要删除该设备吗？
                    </Modal>
                    <Modal
                        title="传感器上下线记录"
                        visible={this.state.recordvisible}
                        width="550px"
                        centered
                        footer={null}
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        <div className="modeltable">
                            <Table
                                dataSource={this.state.recordlist}
                                columns={this.recordColumns}
                                pagination={false}
                                bordered
                            />
                        </div>
                        <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                            <Pagination
                                onShowSizeChange={this.onShowSizeChange}
                                defaultCurrent={1}
                                onChange={this.sensorchange}
                                total={this.state.sensortotal}
                                hideOnSinglePage={true}
                            />
                        </div>
                    </Modal>
                    <Modal
                        title="摄像头上下线记录"
                        visible={this.state.camerarecord}
                        width="550px"
                        centered
                        footer={null}
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        <div className="modeltable">
                            <Table
                                dataSource={this.state.recordlist}
                                columns={this.camerarecordColumns}
                                pagination={false}
                                bordered
                            />
                        </div>
                        <div className="pageone" style={{ textAlign: 'right', marginTop: '10px' }}>
                            <Pagination
                                onShowSizeChange={this.onShowSizeChange}
                                defaultCurrent={1}
                                onChange={this.pagechange}
                                total={this.state.cameratotal}
                                hideOnSinglePage={true}
                            />
                        </div>
                    </Modal>
                    <Modal
                        title="实时画面"
                        visible={this.state.videovisible}
                        width="100%"
                        height="300"
                        centered
                        onCancel={this.handleCancels}
                        // closable={false}
                        footer={null}
                    >
                        {/* <video id="myVideo" controls style='width: 100%;height: auto'>
                            <source id="source" src={this.state.videourl} type="application/x-mpegURL"></source>
                        </video> */}
                        {/* <video width="100%" controls="controls" type="application/x-mpegURL" autoPlay="autoplay" loop="loop"  >
                            <source src={this.state.videourl} type="application/x-mpegURL" />
                        </video> */}
                        <VideoPlayer
                            // style={{ width: '100%', height: '200px' }}
                            src={this.state.videourl}
                        ></VideoPlayer>
                    </Modal>
                    <Modal
                        title="设备激活"
                        visible={this.state.activevisible}
                        width="330px"
                        centered
                        onOk={this.activeok}
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        <span>验证码：</span>
                        <Input
                            style={{ width: '200px', marginLeft: '10px' }}
                            autoComplete="off"
                            placeholder="请输入验证码"
                            value={this.state.activenum}
                            onChange={this.activenum}
                        />
                    </Modal>
                    <Modal
                        title="摄像头"
                        visible={this.state.cameravisible}
                        onOk={this.cameraOk}
                        width="400px"
                        okText="确认"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >

                        <span>设备类型：</span>
                        {/* <Select placeholder="请选择设备类型" style={{ width: "100%", marginBottom: "10px", marginTop: '10px' }} onChange={this.devicetype} value={this.state.devicetype}>
                            <Option value={2}>摄像头</Option>
                            <Option value={1}>烟雾传感器</Option>
                        </Select> */}
                        <Input
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            value="摄像头"
                        />
                        <span style={{ display: 'block' }}>设备编号：</span>
                        <Select
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            placeholder="请选择设备编号"
                            onChange={this.deviceIds}
                            value={this.state.deviceIds}
                        >
                            {cameraprooptions}
                        </Select>
                        <span>所属单位：</span>
                        <Select
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            placeholder="请选择所属单位"
                            onChange={this.unitnames}
                            value={this.state.unitnames}
                        >
                            {prooptions}
                        </Select>
                        <span>设备位置：</span>
                        <Input placeholder="请输入设备位置"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.locations}
                            value={this.state.locations}
                        />
                    </Modal>
                    <Modal
                        title="烟雾传感器"
                        visible={this.state.devicevisible}
                        onOk={this.addOk}

                        width="400px"
                        okText="确认"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >

                        <span>设备类型：</span>
                        {/* <Select placeholder="请选择设备类型" style={{ width: "100%", marginBottom: "10px", marginTop: '10px' }} onChange={this.devicetype} value={this.state.devicetype}>
                            <Option value={2}>摄像头</Option>
                            <Option value={1}>烟雾传感器</Option>
                        </Select> */}
                        <Input
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            value="烟雾传感器"
                        />
                        <span style={{ display: 'block' }}>设备编号：</span>
                        <Input placeholder="请输入设备编号"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.deviceId}
                            value={this.state.deviceId}
                        />
                        <div>
                            <span>设备IMEI号：</span>
                            <Input placeholder="请输入设备IMEI号"
                                style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                                autoComplete="off"
                                onChange={this.imei}
                                value={this.state.imei}
                            />
                        </div>
                        <span>所属单位：</span>
                        <Select
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            placeholder="请选择所属单位"
                            onChange={this.unitname}
                            value={this.state.unitname}
                        >
                            {prooptions}
                        </Select>
                        <span>设备位置：</span>
                        <Input placeholder="请输入设备位置"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.location}
                            value={this.state.location}
                        />
                    </Modal>
                </Layout>
            </Layout >
        );
    }
}

export default App;
