<template>
    <div class="app-container calendar-list-container">
    
        <div class="filter-container">
            <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
                <el-button v-waves @click="add" type="primary" icon="plus" class="tool-item filter-item btn-add"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="发送选择的联系人" placement="bottom-start">
                <el-button v-waves @click="sendMail()" type="primary" class="tool-item filter-item btn-send">
                    <i class="fa fa-send"></i>
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="发送全部" placement="top-start">
                <el-button v-waves @click="sendMail(true)" type="primary" class="tool-item filter-item btn-send-to-all">
                    <i class="fa fa-send"></i>
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除选中的联系人" placement="bottom-start">
                <el-button v-waves @click="del" type="danger" icon="delete" class="tool-item filter-item btn-del"></el-button>
            </el-tooltip>
    
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name">
            </el-input>
    
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="邮箱" v-model="listQuery.mail">
            </el-input>
    
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="text" icon="document" @click="handleDownload">导出</el-button>
        </div>
    
        <el-row>
            <el-col :span="8" v-for="(item, index) in list" :key="index">
                <el-card>
                    <div slot="header" class="clearfix">
                        <el-checkbox v-model="item.selected"></el-checkbox>
                    </div>
                    <img :src="item.avatarUrl" class="avatar-image">
                    <div class="constact-right">
                        <p>
                            <i class="fa fa-user user-icon"></i>{{item.name}}
                            <el-button v-waves @click="edit(item.id)" type="primary" icon="edit" size="small" class="card-btn card-btn-edit"></el-button>
                            <el-button v-waves @click="sendMail(item)" type="primary" size="small" class="btn-send-mail">
                                <i class="fa fa-send send-mail-icon"></i>
                            </el-button>
                        </p>
                        <div class="mail-container">
                            <i class="el-icon-message mail-icon"></i>
                            <span>{{item.mail}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    
    </div>
</template>
<script>
import * as contactsAPI from 'api/mail_contacts';

export default {
    name: 'contacts_list',
    data() {
        return {
            list: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20,
                name: '',
                mail: ''
            },
            selected: []
        }
    },
    created() {
        this.getContacts();
    },
    methods: {
        getContacts() {
            this.listLoading = true;
            contactsAPI.fetchList(this.listQuery).then(res => {
                this.list = res.data.contacts;
                this.list.forEach(item => item.selected = false);
                this.total = res.data.total;
                this.listLoading = false;
            })
        },
        handleFilter() {
            this.getContacts();
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getContacts();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getContacts();
        },
        add() {

        },
        edit() {

        },
        del() {
            debugger
            console.log(this.list)
        },

        handleDownload() {
            require.ensure([], () => {
                const { export_json_to_excel } = require('vendor/Export2Excel');
                const tHeader = ['姓名', '邮箱'];
                const filterVal = ['name', 'mail'];
                const data = this.formatJson(filterVal, this.list);
                export_json_to_excel(tHeader, data, parseTime(Date.now()) + '通讯录数据');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        }
    }
}
</script>
<style>
.el-card {
    margin: 12px;
}

.avatar-image {
    float: left;
    margin-right: 10px;
    width: 80px;
    height: 80px;
}

.user-icon {
    margin-right: 5px;
    color: #F38181;
}

.mail-icon {
    margin-right: 5px;
    color: #F38181;
}

.card-btn {
    margin-left: 5px;
    vertical-align: 1px;
}
</style>
