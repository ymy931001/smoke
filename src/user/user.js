import React, { useState } from "react";
import {
    Card,
    Layout,
    Button,
    Input,
    Table,
    Drawer,
    Switch,
    Modal,
    message,
    Tree,
    Select,
    Cascader,
    InputNumber, Form, Popconfirm
} from "antd";
import {
    getaccount, getrole, addrole, deleterole,
    addaccount, deleteaccount, updateaccount
    , getroleMenu, updateroleMenu, changeaccount, getallmemu
} from '../axios';
import "./user.css";

const rolelists = {
    1: "超级管理员",
    2: "单位管理员",
    3: "区域管理员",
    4: "市级管理员",
}


const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const TreeNode = Tree.TreeNode;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rolelist: [],
            permissionlist: [],
            deviceList: JSON.parse(localStorage.getItem('unitTree')),
            deviceLists: JSON.parse(localStorage.getItem('unitTree'))
        };


        this.rolecolumn = [
            {
                title: "角色",
                dataIndex: "name",
            },
            {
                title: "用户数量",
                dataIndex: "userNum",
            }, {
                title: "权限分配",
                dataIndex: "address",
                render: (text, record, index) => {
                    return (
                        <div>
                            <span onClick={() => this.showModal(text, index, record)} style={{ color: '#fd7a12', cursor: 'pointer' }}>
                                选择权限
                        </span>
                            <span style={{ marginLeft: '10px' }}>
                            </span>
                        </div>
                    );
                },
            },
            {
                title: "操作",
                dataIndex: "deviceQuantity",
                render: (text, record, index) => {
                    return (
                        <div>
                            <span onClick={() => this.onDelete(text, record, index)} style={{ cursor: 'pointer' }}>
                                <img src={require('../images/delete.png')} alt="" />
                            </span>
                        </div>
                    );
                }
            }
        ];

        if (localStorage.getItem('usertype') === "1") {
            this.nodeInfoTableColumns = [
                {
                    title: "用户名",
                    dataIndex: "userName",
                },
                {
                    title: "姓名",
                    dataIndex: "realName",
                }, {
                    title: "联系电话",
                    dataIndex: "phone",
                },
                {
                    title: "邮箱",
                    dataIndex: "email",
                },
                {
                    title: "所属单位",
                    dataIndex: "unit",
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
                    title: "角色",
                    dataIndex: "userType",
                    filters: [
                        { text: "超级管理员", value: 1 },
                        { text: "单位管理员", value: 2 },
                        { text: "区域管理员", value: 3 },
                        { text: "市级管理员", value: 4 },
                    ],
                    onFilter: (value, record) => record.userType == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        return (
                            <div >
                                {rolelists[text]}
                            </div>
                        )
                    }
                },
                {
                    title: "账号状态",
                    dataIndex: "status",
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
                    title: "操作",
                    dataIndex: "gmtCreate",

                    render: (text, record, index) => {
                        return (
                            <div>
                                <span style={{ marginLeft: '10px' }} onClick={() => this.edit(text, record, index)}>
                                    <a><img src={require('../images/edit.png')} alt="" /></a>
                                </span>
                                <span style={{ marginLeft: '10px' }} onClick={() => this.accountdelete(text, record, index)}>
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
                    title: "用户名",
                    dataIndex: "userName",
                },
                {
                    title: "姓名",
                    dataIndex: "realName",
                }, {
                    title: "联系电话",
                    dataIndex: "phone",
                },
                {
                    title: "邮箱",
                    dataIndex: "email",
                },
                {
                    title: "所属单位",
                    dataIndex: "unit",
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
                    title: "角色",
                    dataIndex: "userType",
                    filters: [
                        { text: "超级管理员", value: 1 },
                        { text: "单位管理员", value: 2 },
                        { text: "区域管理员", value: 3 },
                        { text: "市级管理员", value: 4 },
                    ],
                    onFilter: (value, record) => record.userType == value,  //eslint-disable-line 
                    render: (text, record, index) => {
                        return (
                            <div >
                                {rolelists[text]}
                            </div>
                        )
                    }
                },
            ];
        }


    }

    componentWillMount() {
        document.title = "用户管理";
        if (localStorage.getItem("usertype") === "1") {
            this.setState({
                typedis: 'inline-block'
            })
        } else {
            this.setState({
                typedis: 'none'
            })
        }
    }

    componentDidMount() {
        this.accountlist()
    }

    accountlist = () => {
        getaccount([
            localStorage.getItem('token')
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    userlist: res.data.data
                }, function () {
                    if (this.state.userlist.length > 10) {
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

    rolelist = () => {
        getrole([
            localStorage.getItem('token')
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    roledata: res.data.data
                }, function () {
                    var arr = []
                    for (var i in this.state.roledata) {
                        arr.push({
                            "id": this.state.roledata[i].id,
                            "value": this.state.roledata[i].name
                        })
                    }
                    this.setState({
                        rolelist: arr
                    })
                    if (this.state.roledata.length < 10) {
                        this.setState({
                            rolepage: false
                        })
                    } else {
                        this.setState({
                            rolepage: true
                        })
                    }
                })
            }
        });
    }

    //检测状态
    switchchange = (text, record, index) => {
        updateaccount([
            localStorage.getItem('token'),
            record.id,
            record.status === 1 ? 0 : 1
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success("状态修改成功");
                this.accountlist()
            } else {
                message.error(res.data.message)
            }
        });
    }


    //编辑单位
    edit = (text, record, index) => {
        console.log(record)
        this.setState({
            email: record.email,
            realname: record.realName,
            phone: record.phone,
            accountid: record.id,
            changeaccountvisible: true,
        })
    }

    changesubmit = () => {
        changeaccount([
            this.state.accountid,
            this.state.realname,
            this.state.phone,
            this.state.email,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('修改成功')
                this.setState({
                    changeaccountvisible: false,
                })
                this.accountlist()
            }
        });
    }


    //打开角色管理抽屉
    openrole = () => {
        this.rolelist()
        this.setState({
            rolevisible: true,
        })
    }

    //关闭角色管理抽屉
    onClose = () => {
        this.setState({
            rolevisible: false,
        })
    }

    //打开删除角色弹窗
    onDelete = (text, record, index) => {
        this.setState({
            deletevisible: true,
            roleid: record.id
        })
    }


    //打开删除账号弹窗
    accountdelete = (text, record, index) => {
        this.setState({
            deleteuservisible: true,
            userid: record.id
        })
    }



    //打开添加角色弹窗
    addrole = () => {
        this.setState({
            addrolevisible: true,
        })
    }


    //打开添加账号弹窗
    addaccount = () => {
        this.rolelist()
        this.setState({
            addaccountvisible: true,
        })
    }


    //关闭弹窗
    handleCancel = () => {
        this.setState({
            deletevisible: false,
            addrolevisible: false,
            addaccountvisible: false,
            deleteuservisible: false,
            menuvisible: false,
            changeaccountvisible: false,
            email: undefined,
            realname: undefined,
            phone: undefined,
        })
    }

    //角色名称输入
    rolename = (e) => {
        this.setState({
            rolename: e.target.value
        })
    }


    //添加角色
    addOk = () => {
        addrole([
            localStorage.getItem('token'),
            this.state.rolename,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('添加成功')
                this.setState({
                    addrolevisible: false,
                })
                this.rolelist()
            }
        });
    }

    //添加账户
    accountsubmit = () => {
        addaccount([
            localStorage.getItem('token'),
            this.state.roletype,
            31,
            this.state.cityid,
            this.state.areaid,
            this.state.siteId,
            this.state.username,
            this.state.password,
            this.state.realname,
            this.state.phone,
            this.state.email,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('添加成功')
                this.setState({
                    addaccountvisible: false,
                })
                this.accountlist()
            } else {
                message.error(res.data.message)
            }
        });
    }

    //删除角色
    deleteOk = () => {
        deleterole([
            localStorage.getItem('token'),
            this.state.roleid,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('删除成功')
                this.setState({
                    deletevisible: false,
                })
                this.rolelist()
            } else {
                message.error(res.data.message)
            }
        });
    }

    //删除账号
    deleteuser = () => {
        deleteaccount([
            localStorage.getItem('token'),
            this.state.userid,
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('删除成功')
                this.setState({
                    deleteuservisible: false,
                })
                this.accountlist()
            }
        });
    }

    //选择角色类型
    roletype = (value) => {
        console.log(value)
        this.setState({
            roletype: value,
            addresslist: [],
            cityid: undefined,
            areaid: undefined,
            siteId: undefined
        }, function () {
            if (this.state.roletype === "3") {
                this.setState({
                    deviceLists: JSON.parse(localStorage.getItem('AreaTree'))
                })
            } else {
                this.setState({
                    deviceLists: JSON.parse(localStorage.getItem('unitTree'))
                })
            }
        })
    }

    //添加账号设备位置选择
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
    findArea = (e) => {
        console.log(e)
        this.setState({
            addresslists: e,
            cityids: e[0] === undefined ? null : e[0],
            areaids: e[1] === undefined ? null : e[1],
            siteIds: e[2] === undefined ? null : e[2]
        });
    }



    //用户名
    username = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    //密码
    password = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    //真实姓名
    realname = (e) => {
        this.setState({
            realname: e.target.value
        })
    }

    //手机号
    phone = (e) => {
        this.setState({
            phone: e.target.value.replace(/[^0-9.]/g, '').length > 11 ? e.target.value.substring(0, 11) : e.target.value.replace(/[^0-9.]/g, '')
        })
    }

    //邮箱
    email = (e) => {
        this.setState({
            email: e.target.value
        })
    }


    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.name} key={item.id} dataRef={item}>
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }


    //打开权限弹框
    showModal = (text, index, record) => {
        this.setState({
            roleid: record.id
        })
        getallmemu([

        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    permissionlist: res.data.data
                }, function () {
                    getroleMenu([
                        record.name
                    ]).then(res => {
                        if (res.data && res.data.message === "success") {
                            this.setState({
                                checkedKeys: res.data.data[0].permission.split(','),
                                menuvisible: true,
                            })
                        }
                    });
                })
            }
        });

    }

    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: true,
        });
    }

    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({
            checkedKeys: checkedKeys,
        });
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    //修改权限
    saveOk = () => {
        updateroleMenu([
            this.state.checkedKeys.join(','),
            this.state.roleid
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                message.success('修改成功')
                this.setState({
                    menuvisible: false,
                })
            }
        });
    }

    //搜索框文字输入
    keyword = (e) => {
        this.setState({
            keyword: e.target.value
        })
    }

    //搜索
    onsearch = () => {
        getaccount([
            localStorage.getItem('token'),
            31,
            this.state.cityids,
            this.state.areaids,
            this.state.siteIds,
            this.state.keyword
        ]).then(res => {
            if (res.data && res.data.message === "success") {
                this.setState({
                    userlist: res.data.data
                }, function () {
                    if (this.state.userlist.length > 10) {
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

    render() {

        const prooptions = this.state.rolelist.map((province) => <Option key={province.id}  >{province.value}</Option>);

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
                }),
            };
        });

        const rolecolumn = this.rolecolumn.map((col) => {
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
                }),
            };
        });

        return (
            <Layout id="alarm" >
                <Layout>
                    <Content style={{ margin: "20px 0px" }} >
                        <Card title="账号管理" headStyle={{ color: '#2a2a2a', fontSize: '18px' }}
                            extra={
                                <div>
                                    <Button type="primary" style={{ marginRight: '10px', display: this.state.typedis }} onClick={this.openrole}  >
                                        角色管理
                                    </Button>
                                    <Button type="primary" onClick={this.addaccount} style={{ display: this.state.typedis }} >
                                        添加账号
                                    </Button>
                                </div>}
                        >
                            <div>
                                <span>所属单位：</span>
                                <Cascader
                                    fieldNames={{ label: 'name', value: 'id' }}
                                    options={this.state.deviceList}
                                    onChange={this.findArea}
                                    value={this.state.addresslists}
                                    changeOnSelect
                                    style={{ width: "300px", marginRight: '10px' }}
                                    placeholder="请选择单位" />
                                <Search placeholder="搜索用户名/姓名/手机号"
                                    onSearch={this.onsearch}
                                    onChange={this.keyword}
                                    value={this.state.keyword}
                                    enterButton
                                    style={{ marginBottom: '20px', width: '300px' }}
                                />
                                <Table
                                    dataSource={this.state.userlist}
                                    columns={nodeInfoTableColumns}
                                    pagination={this.state.page}
                                />
                            </div>
                        </Card>
                    </Content>
                    <Modal
                        title="删除角色"
                        visible={this.state.deletevisible}
                        onOk={this.deleteOk}
                        width="300px"
                        okText="删除"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        您确定要删除该角色吗？
                    </Modal>
                    <Modal
                        title="删除账号"
                        visible={this.state.deleteuservisible}
                        onOk={this.deleteuser}
                        width="300px"
                        okText="删除"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        您确定要删除该账号吗？
                    </Modal>
                    <Modal
                        title="添加角色"
                        visible={this.state.addrolevisible}
                        onOk={this.addOk}
                        width="400px"
                        okText="添加"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        <span>角色名称：</span>
                        <Input placeholder="请输入角色名称"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.rolename}
                            value={this.state.rolename}
                        />
                    </Modal>
                    <Modal
                        title="添加账号"
                        visible={this.state.addaccountvisible}
                        onOk={this.accountsubmit}
                        width="400px"
                        okText="确定"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        <span>角色类型：</span>
                        <Select
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            placeholder="请选择角色类型"
                            onChange={this.roletype}
                            value={this.state.roletype}
                        >
                            {prooptions}
                        </Select>
                        <span>所属单位：</span>
                        <Cascader
                            fieldNames={{ label: 'name', value: 'id' }}
                            options={this.state.deviceLists}
                            onChange={this.addresschange}
                            value={this.state.addresslist}
                            changeOnSelect
                            style={{ width: "100%", marginTop: '10px', marginBottom: "10px" }}
                            placeholder="请选择单位" />
                        <span>用户名：</span>
                        <Input placeholder="请输入用户名"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.username}
                            value={this.state.username}
                        />
                        <span>密码：</span>
                        <Input placeholder="请输入密码"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.password}
                            value={this.state.password}
                        />
                        <span>真实姓名：</span>
                        <Input placeholder="请输入真实姓名"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.realname}
                            value={this.state.realname}
                        />
                        <span>手机号：</span>
                        <Input placeholder="请输入手机号"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.phone}
                            value={this.state.phone}
                        />
                        <span>邮箱：</span>
                        <Input placeholder="请输入邮箱"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.email}
                            value={this.state.email}
                        />
                    </Modal>
                    <Modal
                        title="修改账号"
                        visible={this.state.changeaccountvisible}
                        onOk={this.changesubmit}
                        width="400px"
                        okText="确定"
                        centered
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        <span>真实姓名：</span>
                        <Input placeholder="请输入真实姓名"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.realname}
                            value={this.state.realname}
                        />
                        <span>手机号：</span>
                        <Input placeholder="请输入手机号"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.phone}
                            value={this.state.phone}
                        />
                        <span>邮箱：</span>
                        <Input placeholder="请输入邮箱"
                            style={{ width: '100%', marginBottom: "10px", marginTop: '10px' }}
                            autoComplete="off"
                            onChange={this.email}
                            value={this.state.email}
                        />
                    </Modal>

                    <Modal
                        title="选择权限"
                        visible={this.state.menuvisible}
                        onOk={this.saveOk}
                        onCancel={this.handleCancel}
                        okText="保存"
                        width="400px"
                        mask={false}
                        closable={false}
                        centered
                    >
                        <Tree
                            checkable
                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            defaultCheckedKeys={this.state.tree}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                        >
                            {this.renderTreeNodes(this.state.permissionlist)}
                        </Tree>
                    </Modal>
                    <Drawer
                        title="角色管理"
                        width={550}
                        onClose={this.onClose}
                        visible={this.state.rolevisible}
                    >
                        <div style={{ width: '100%' }}>
                            < Table
                                dataSource={this.state.roledata}
                                columns={rolecolumn}
                                bordered
                                pagination={this.state.rolepage}
                            />
                            <div className="addrole" onClick={this.addrole}>
                                <img src={require('../images/add.png')} alt="" style={{ marginRight: '5px' }} />   添加角色
                            </div>
                        </div>
                    </Drawer>
                </Layout>
            </Layout >
        );
    }
}

export default App;
