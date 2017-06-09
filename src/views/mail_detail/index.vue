<template>
    <div v-loading.body="loading" class="app-container calendar-list-container">
        <el-row class="tool-bar">
            <el-button-group>
                <el-button v-waves @click="reply()" type="primary" icon="edit" size="small">回复</el-button>
                <el-button v-waves @click="reply(true)" type="primary" icon="edit" size="small">回复全部</el-button>
                <el-button v-waves @click="forward" type="primary" icon="share" size="small">转发</el-button>
                <el-button v-waves @click="deleteMail" type="primary" icon="delete" size="small">删除</el-button>
    
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
        <div class="mail-info">
            <div class="title-info">
                <span class="mail-title">{{mail.title}}</span>
                <el-tag v-for="(label, index) in mail.labelList" :key="label.id" :closable="true" :color="label.color" :close-transition="false" @close="delLabel(index)" class="label-item">
                    {{label.name}}
                </el-tag>
            </div>
            <div>
                <el-tag type="primary" class="info-tag">发件人</el-tag>
                <span class="send-name">{{mail.sender}}</span>
                <{{mail.sendMail}}>;
            </div>
            <div>
                <el-tag type="primary" class="info-tag">时间&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>{{showMailTime | parseTime }}
            </div>
            <el-row>
                <el-col :span="1">
                    <el-tag type="primary">收件人</el-tag>
                </el-col>
                <el-col :span="22">
                    <span v-for="item in mail.target" :key="item.mail" class="target-item">
                        <span class="target-name">{{item.name}}</span>
                        <{{item.mail}}>;
                    </span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="1">
                    <el-tag type="primary">抄送&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
                </el-col>
                <el-col :span="22">
                    <span v-for="item in mail.copy" :key="item.mail" class="target-item">
                        <span class="target-name">{{item.name}}</span>
                        <{{item.mail}}>;
                    </span>
                </el-col>
            </el-row>
        </div>
        <div class="mail-content" v-html="mail.content"></div>
    </div>
</template>

<script>
import * as mailDetailAPI from 'api/mail_detail';
import { parseTime } from 'utils/index';

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
            loading: true,
            activeGroup: ['target'],
            mailType: ''
        }
    },
    created() {
        this.getDetail();
    },
    computed: {
        showMailTime: function () {
            return this.mail.receiveDate || this.mail.sendData;
        }
    },
    methods: {
        getDetail() {
            this.loading = true;
            const mailId = this.$store.getters.mailId;
            const mailType = this.$store.getters.mailType;
            this.mailType = this.$store.getters.mailType;
            mailDetailAPI.fetchDetail({ mailId, mailType }).then(res => {
                this.loading = false;
                this.mail = res.data;
            })
        },
        reply(isALL) {
            if (isALL) {
                this.$store.commit('SET_PAGE_TYPE', 'replyAll');
            } else {
                this.$store.commit('SET_PAGE_TYPE', 'reply');
            }
            this.$store.commit('SET_MAIL_TYPE', 'rececive');
            this.$router.push({ path: '/mail_send/index' });
        },
        forward() {
            this.$store.commit('SET_PAGE_TYPE', 'forward');
            this.$store.commit('SET_MAIL_TYPE', this.mailType);
            this.$router.push({ path: '/mail_send/index' });
        },
        deleteMail() {
            this.$confirm('是否删除这封邮件', '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                mailDetailAPI.delMail().subscribe({
                    next: () => {
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                            duration: 1000
                        });
                        setTimeout(() => this.$router.go(-1), 1000);
                    },
                    error: () => this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
                })
            }).catch();
        },
        delLabel(index) {
            this.mail.labelList.splice(index, 1);
        }
    }
}
</script>

<style>
.tool-bar {
    background-color: #E5E9F2;
    margin-top: -20px;
    margin-left: -20px;
}

.mail-info {
    background-color: #EFF2F7;
}

.mail-info div {
    font-size: 14px;
    margin: 4px;
}

.mail-info .el-tag {
    margin-right: 6px;
}

.title-info {
    padding: 2px 5px;
}

.mail-title {
    font-size: 18px;
    vertical-align: -3px
}

.label-item {
    margin-left: 5px;
}

.info-tag {
    margin-left: inherit;
}

.target-board {
    display: inline-block;
}

.send-name,
.target-name {
    color: #1FAB89;
    font-weight: 600;
}

.el-collapse-item__header {
    height: 30px;
    line-height: 30px;
    padding-left: 0;
    color: #20A0FF;
    font-size: 13px;
}

.el-collapse-item__content {
    padding: 2px;
}
</style>
