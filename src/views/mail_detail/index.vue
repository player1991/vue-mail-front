<template>
    <div v-loading.body="loading" class="app-container calendar-list-container">
        <el-row class="tool-bar">
            <el-button-group>
                <el-button v-waves type="primary" icon="edit" size="small">回复</el-button>
                <el-button v-waves type="primary" icon="edit" size="small">回复全部</el-button>
                <el-button v-waves type="primary" icon="share" size="small">转发</el-button>
                <el-button v-waves type="primary" icon="delete" size="small">删除</el-button>
    
            </el-button-group>
            <el-dropdown split-button type="primary" size="small">
                标记为
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item>双皮奶</el-dropdown-item>
                    <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown split-button type="primary" size="small">
                附件
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item>双皮奶</el-dropdown-item>
                    <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown split-button type="primary" size="small">
                录音
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item>双皮奶</el-dropdown-item>
                    <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <el-row>
            <div class="mail-title">{{mail.title}}
            <el-tag v-for="(label, index) in mail.labelList" :key="label.id" :closable="true" :color="label.color" :close-transition="false" @close="handleDel(index)">
                {{label.name}}
            </el-tag>
            </div>
        </el-row>
        <el-row>
    
        </el-row>
    </div>
</template>

<script>
import * as mailDetailAPI from 'api/mail_detail';

export default {
    name: 'mail_detail',
    data() {
        return {
            mail: {
                id: '',
                title: '',
                target: [],
                copy: [],
                sender: '',
                sendMail: '',
                receiveDate: '',
                sendDate: '',
                oldFileList: [],
                oldAudioList: [],
                labelList: []
            },
            loading: true
        }
    },
    created() {
        this.getDetail();
    },

    methods: {
        getDetail() {
            this.loading = true;
            const mailId = this.$store.getters.mailId;
            const mailType = this.$store.getters.mailType;
            mailDetailAPI.fetchDetail({ mailId, mailType }).then(res => {
                this.loading = false;
                this.mail = res.data;
            })
        }
    }
}
</script>

<style>
.tool-bar {
    background-color: #CBF1F5;
    margin-top: -20px;
    margin-left: -20px;
}
.mail-title {
    font-size: 18px;
    padding: 2px 5px;
}
</style>
