import React from "react";
import {
    Card,
    Layout,
    Button,
    Input,
    Table,
    Modal,
    Cascader, DatePicker, message, Select, Tooltip
} from "antd";
import { getunitList, addunit, deleteunit } from '../axios';


import "./unit.css";
import moment from 'moment';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const AMap = window.AMap;
// const dateFormat = 'YYYY-MM-DD';
const scenelist = {
    1: '医院',
    2: '酒店',
    3: '网吧',
    4: '车站码头',
    5: '写字楼',
    6: '商场',
    7: '其他',
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoListDataSource: [],
            device_ip: null,
            typenone: "inline-block",
            deviceList: JSON.parse(localStorage.getItem('AreaTree'))
        };

        if (localStorage.getItem('usertype') === "1") {
            this.nodeInfoTableColumns = [
                {
                    title: "单位名称",
                    dataIndex: "unit",
                }, {
                    title: "所属场景",
                    dataIndex: "unitType",
                    filters: [
                        { text: "医院", value: 1 },
                        { text: "酒店", value: 2 },
                        { text: "网吧", value: 3 },
                        { text: "车站码头", value: 4 },
                        { text: "写字楼", value: 5 },
                        { text: "商场", value: 6 },
                        { text: "其他", value: 7 },
                    ],
                    onFilter: (value, record) => record.unitType == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        return (
                            <div >
                                {scenelist[text]}
                            </div>
                        )
                    }
                },
                {
                    title: "负责人姓名",
                    dataIndex: "userName",
                }, {
                    title: "联系电话",
                    dataIndex: "phone",
                },

                {
                    title: "详细地址",
                    dataIndex: "address",
                }, {
                    title: "设备数量",
                    dataIndex: "deviceQuantity",
                    render: (text, record, index) => {
                        return (
                            <div>
                                <Tooltip title={"烟感数量：" + record.oneNetDeviceQuantity + "个  ~ 摄像头数量：" + record.ysyDeviceQuantity + "个"}>
                                    <span style={{ color: '#fe8616', cursor: 'pointer' }}>{text} </span>
                                </Tooltip>
                            </div>
                        )
                    }
                },
                {
                    title: "创建时间",
                    dataIndex: "gmtCreate",
                    sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
                },
                {
                    title: "操作",
                    dataIndex: "gmtCreate",
                    render: (text, record, index) => {
                        return (
                            <div>
                                <span onClick={() => this.edit(text, record, index)}>
                                    <a><img src={require('../images/edit.png')} alt="" /></a>
                                </span>
                                <span style={{ marginLeft: '10px' }} onClick={() => this.unitdelete(text, record, index)}>
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
                    title: "单位名称",
                    dataIndex: "unit",
                }, {
                    title: "所属场景",
                    dataIndex: "unitType",
                    filters: [
                        { text: "医院", value: 1 },
                        { text: "酒店", value: 2 },
                        { text: "网吧", value: 3 },
                        { text: "车站码头", value: 4 },
                        { text: "写字楼", value: 5 },
                        { text: "商场", value: 6 },
                        { text: "其他", value: 7 },
                    ],
                    onFilter: (value, record) => record.unitType == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        return (
                            <div >
                                {scenelist[text]}
                            </div>
                        )
                    }
                },
                {
                    title: "负责人姓名",
                    dataIndex: "userName",
                }, {
                    title: "联系电话",
                    dataIndex: "phone",
                },

                {
                    title: "详细地址",
                    dataIndex: "address",
                }, {
                    title: "设备数量",
                    dataIndex: "deviceQuantity",
                    render: (text, record, index) => {
                        return (
                            <div>
                                <Tooltip title={"烟感数量：" + record.oneNetDeviceQuantity + "个  ~ 摄像头数量：" + record.ysyDeviceQuantity + "个"}>
                                    <span style={{ color: '#fe8616', cursor: 'pointer' }}>{text} </span>
                                </Tooltip>
                            </div>
                        )
                    }
                },
                {
                    title: "创建时间",
                    dataIndex: "gmtCreate",
                    sorter: (a, b) => new Date(a) > new Date(b) ? 1 : -1,
                },
            ];
        }

    }

    componentWillMount() {
        document.title = "单位管理";
        if (localStorage.getItem("usertype") === "1") {
            this.setState({
                typedis: 'inline'
            })
        } else {
            this.setState({
                typedis: 'none'
            })
        }
        this.initMap()

    }

    componentDidMount() {

        this.unitlist()


    }

    unitlist = () => {
        getunitList([
            localStorage.getItem('token'),
            this.state.searchname
        ]).then(res => {
            console.log(res)
            if (res.data && res.data.message === "success") {
                this.setState({
                    sitelist: res.data.data
                }, function () {
                    if (this.state.sitelist.length > 10) {
                        this.setState({
                            page: true
                        })
                    } else {
                        this.setState({
                            page: false
                        })
                    }
                })
            }
        });
    }



    //调用地图
    initMap() {
        setTimeout(() => {
            var that = this
            var map = new AMap.Map("mapContainer", {
                resizeEnable: true,
                keyboardEnable: false,
                center: [122.11404, 30.01978],//地图中心点
                zoom: 15,//地图显示的缩放级别
            });

            AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
                var autoOptions = {
                    city: "3301", //城市，默认全国
                    citylimit: true,
                    input: "facilityLocation",//使用联想输入的input的id
                };
                var autocomplete = new AMap.Autocomplete(autoOptions);

                // var clickEventListener = map.on('click', function (e) {
                //     console.log(e)
                //     document.getElementById('longitudetext').innerHTML = e.lnglat.getLng();
                //     document.getElementById('latitudetext').innerHTML = e.lnglat.getLat();
                //     // alert(e.lnglat.getLng() + ',' + e.lnglat.getLat())
                // });
                var placeSearch = new AMap.PlaceSearch({
                    // city: '浙江',
                    map: map
                })
                AMap.event.addListener(autocomplete, "select",
                    function (e) {
                        console.log(e)
                        // console.log(e.poi.name)
                        // console.log(e.poi.adcode)
                        //TODO 针对选中的poi实现自己的功能
                        placeSearch.setCity(e.poi.adcode);
                        placeSearch.search(e.poi.name);
                        that.setState({
                            unitname: e.poi.name,
                            address: e.poi.district + e.poi.address,
                            area: e.poi.district,
                            longitude: e.poi.location.lng,
                            latitude: e.poi.location.lat,
                            areacode: e.poi.adcode,
                        })
                    },

                );
            });
        }, 0)


    }

    //关键字录入
    keytext = (e) => {
        this.setState({
            keytext: e.target.value
        })
    }


    //编辑单位
    edit = (text, record, index) => {
        console.log(record)
        console.log([record.cityId, record.districtId])
        this.initMap()
        this.setState({
            unitname: record.unit,
            address: record.address,
            unitid: record.id,
            scenetype: record.unitType,
            addresslists: [record.cityId, record.districtId],
            cityid: record.cityId,
            areaid: record.districtId,
            username: record.userName,
            phone: record.phone,
            unitvisible: true,
        })
    }

    //打开添加单位弹窗
    addunit = () => {
        this.initMap()
        // var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        // var maxPos = $chars.length;
        // var pwd = '';
        // for (var i = 0; i < 32; i++) {
        //     pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        // }
        this.setState({
            unitvisible: true,
            // uuid: pwd
        })
    }

    //关闭添加单位弹窗
    handleCancel = () => {
        this.setState({
            unitvisible: false,
            deleteunitvisible: false,
            unitid: undefined,
            unitname: undefined,
            address: undefined,
            scenetype: undefined,
            addresslists: [],
            cityid: undefined,
            areaid: undefined,
            username: undefined,
            phone: undefined,
        })
    }

    //设备位置选择
    findArea = (e) => {
        console.log(e)
        this.setState({
            addresslists: e,
            cityid: e[0] === undefined ? null : e[0],
            areaid: e[1] === undefined ? null : e[1],
        });
    }

    //单位名称
    unitname = (e) => {
        this.setState({
            unitname: e.target.value
        })
    }

    //单位地址
    address = (e) => {
        this.setState({
            address: e.target.value
        })
    }

    //负责人姓名
    username = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    //联系方式
    phone = (e) => {
        this.setState({
            phone: e.target.value.replace(/[^0-9.]/g, '')
        })
    }

    //添加单位
    addOk = () => {
        if (!this.state.unitname) {
            message.error('请输入单位名称')
        }
        else if (!this.state.address) {
            message.error('请输入详细地址')
        }
        else if (!this.state.scenetype) {
            message.error('请选择场景类型')
        }
        else if (!this.state.cityid || !this.state.areaid) {
            message.error('请选择所属区域')
        }
        else if (!this.state.username) {
            message.error('请输入负责人姓名')
        }
        else if (!this.state.phone) {
            message.error('请输入负责人联系电话')
        } else {
            addunit([
                this.state.unitname,
                this.state.address,
                31,
                this.state.cityid,
                this.state.areaid,
                this.state.username,
                this.state.phone,
                this.state.longitude,
                this.state.latitude,
                this.state.scenetype,
                this.state.unitid,
            ]).then(res => {
                if (res.data && res.data.message === "success") {
                    if (!this.state.unitid) {
                        message.success('添加成功')
                    } else {
                        message.success('修改成功')
                    }
                    this.setState({
                        unitvisible: false,
                        unitid: undefined
                    })
                    this.handleCancel()
                    this.unitlist()
                } else {
                    message.error(res.data.message)
                }
            });
        }
    }

    //打开删除单位弹窗
    unitdelete = (text, record, index) => {
        this.setState({
            deleteunitvisible: true,
            unitid: record.id
        })
    }

    //删除单位
    deleteunit = () => {
        deleteunit([
            this.state.unitid,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('删除成功')
                this.unitlist()
                this.setState({
                    deleteunitvisible: false,
                })
            } else {
                message.error(res.data.message)
            }
        });
    }


    //搜索框录入
    searchname = (e) => {
        this.setState({
            searchname: e.target.value
        })
    }

    //搜索
    onsearch = () => {
        this.unitlist()
    }

    //场景类型
    scenetype = (value) => {
        console.log(value)
        this.setState({
            scenetype: value
        })
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
        const listion = <img src={require('../images/close.png')} alt="" />

        const components = {
            // body: {
            //     row: EditableFormRow,
            //     cell: EditableCell,
            // },
        };
        return (
            <Layout id="alarm" >
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <Card title="单位管理" headStyle={{ color: '#2a2a2a', fontSize: '18px' }}
                            extra={
                                <div>
                                    <Button type="primary" onClick={this.addunit} style={{ display: this.state.typedis }}>
                                        添加单位
                                    </Button>
                                </div>}
                        >
                            <div>
                                <Search placeholder="搜索单位名称"
                                    onSearch={this.onsearch}
                                    onChange={this.searchname}
                                    value={this.state.searchname}
                                    enterButton style={{ marginBottom: '20px', width: '300px' }}
                                />
                                <Table
                                    dataSource={this.state.sitelist}
                                    columns={nodeInfoTableColumns}
                                    pagination={this.state.page}
                                    components={components}
                                />
                            </div>
                        </Card>
                    </Content>
                    <Modal
                        title="删除单位"
                        visible={this.state.deleteunitvisible}
                        onOk={this.deleteunit}
                        width="300px"
                        okText="删除"
                        centered
                        onCancel={this.handleCancel}
                        closeIcon={listion}
                    >
                        您确定要删除该单位吗？
                    </Modal>
                    <Modal
                        title="单位"
                        visible={this.state.unitvisible}
                        onOk={this.addOk}
                        width="900px"
                        okText="确认"
                        centered
                        onCancel={this.handleCancel}
                        closeIcon={listion}
                    >
                        <div className="clearfix" style={{ display: 'inline-block' }}>
                            <div className="mapcontainer">
                                <div id="mapContainer">
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'inline-block', float: 'right', width: '300px' }}>
                            <span>单位名称：</span>
                            <Input placeholder="请输入单位名称"
                                id="facilityLocation"
                                style={{ width: '100%', marginBottom: "7px", marginTop: '7px' }}
                                autoComplete="off"
                                onChange={this.unitname}
                                value={this.state.unitname}
                            />
                            <span>详细地址：</span>
                            <Input placeholder="请输入详细地址"
                                style={{ width: '100%', marginBottom: "7px", marginTop: '7px' }}
                                autoComplete="off"
                                onChange={this.address}
                                value={this.state.address}
                            />
                            <span>所属场景：</span>
                            <Select placeholder="请选择所属场景" style={{ width: "100%", marginBottom: "7px", marginTop: '7px' }} onChange={this.scenetype} value={this.state.scenetype}>
                                <Option value={1}>医院</Option>
                                <Option value={2}>酒店</Option>
                                <Option value={3}>网吧</Option>
                                <Option value={4}>车站码头</Option>
                                <Option value={5}>写字楼</Option>
                                <Option value={6}>商场</Option>
                                <Option value={7}>其他</Option>
                            </Select>
                            <span>所属区域：</span>
                            <Cascader
                                fieldNames={{ label: 'name', value: 'id' }}
                                options={this.state.deviceList}
                                onChange={this.findArea}
                                value={this.state.addresslists}
                                changeOnSelect
                                style={{ width: '100%', marginBottom: "7px", marginTop: '7px' }}
                                placeholder="请选择所属区域" />
                            <span>负责人：</span>
                            <Input placeholder="请输入负责人"
                                style={{ width: '100%', marginBottom: "7px", marginTop: '7px' }}
                                autoComplete="off"
                                onChange={this.username}
                                value={this.state.username}
                            />
                            <span>联系电话：</span>
                            <Input placeholder="请输入联系电话"
                                style={{ width: '100%', marginBottom: "7px", marginTop: '7px' }}
                                autoComplete="off"
                                onChange={this.phone}
                                value={this.state.phone}
                            />
                        </div>
                    </Modal>
                </Layout>
            </Layout >
        );
    }
}

export default App;
