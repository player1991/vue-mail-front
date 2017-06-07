<template>
    <div v-loading.body="loading" class="app-container calendar-list-container">
        <el-row :gutter="10">
            <el-col :span="2">
                <el-tag class="target-label" color="#36c6d3">收件人
                    <i class="fa fa-user-plus"></i>
                </el-tag>
            </el-col>
            <el-col :span="20">
                <multiselect v-model="target" :options="contacts" :multiple="true" :taggable="true" @tag="addContact" :clear-on-select="false" :hide-target="true" placeholder="请选择或输入联系人" label="show" track-by="mail"></multiselect>
            </el-col>
            <el-col :span="2">
                <el-button type="danger" @click="cleanTarget">清空</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="2">
                <el-tag class="target-label" color="#36c6d3">抄送
                    <i class="fa fa-user-plus"></i>
                </el-tag>
            </el-col>
            <el-col :span="20">
                <multiselect v-model="copy" :options="contacts" :multiple="true" :taggable="true" @tag="addContact" :clear-on-select="false" :hide-target="true" placeholder="请选择或输入联系人" label="show" track-by="mail"></multiselect>
            </el-col>
            <el-col :span="2">
                <el-button type="danger" @click="cleanCopy">清空</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="2">
                <el-tag class="target-label" color="#36c6d3">主题
                </el-tag>
            </el-col>
            <el-col :span="20">
                <el-input v-model="mail.title" placeholder="请输入主题"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span='12'>
                <el-upload class="upload-file" :before-upload="handleBefore" :on-preview="handlePreview" :on-success="handleSuccess" :on-remove="handleRemove" :show-file-list="true" :file-list="mail.fileList" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                    <i class="el-icon-upload"></i>
                    <i class="el-upload__text">将文件拖到此处，或
                        <em>点击上传</em>
                    </i>
                </el-upload>
                <ul v-show="!!mail.oldFileList.length" class="old-file-list"></ul>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" :disabled="isRecording" @click="startRecorder" size="small">开始录音</el-button>
                <el-button type="primary" :disabled="!isRecording" @click="stopRecorder" size="small">结束录音</el-button>
                <ul v-show="!!mail.oldAudioList.length" class="old-audio-list"></ul>
                <ul class="audio-list">
                    <li v-for="(audio, index) in mail.audioList">
                        <audio :src="audio.url" controls></audio>
                        <el-input class="audio-name" v-model="audio.name" size="small"></el-input>
                        <i class="fa fa-trash-o del-audio" @click="delAudio(index)"></i>
                    </li>
                </ul>
            </el-col>
        </el-row>
    
        <div class="editor-container">
            <Tinymce :id="editorId" :height=editorHeight ref="editor" v-model="mail.content"></Tinymce>
        </div>
    
        <el-row>
            <el-col :span="12" :offset="9">
                <el-button type="primary" @click="sendSubmit" class="send-btn">发送</el-button>
                <el-button type="primary" @click="cancelSend" class="cancel-btn">取消</el-button>
            </el-col>
        </el-row>
    
    </div>
</template>

<script>
import * as contactsAPI from 'api/contacts';
import * as mailSendAPI from 'api/mail_send';
import { isEmail, isEmpty, getType } from 'utils/validate';
import Tinymce from 'components/Tinymce';
import { parseTime, getNowFormatDate } from 'utils';

export default {
    name: 'mail_send',
    components: { Tinymce },
    data() {
        return {
            loading: true,
            mail: {
                title: '',
                oldFileList: [],
                oldAudioList: [],
                content: '',
                target: [],
                copy: [],
                fileList: [],
                audioList: []
            },
            target: [],
            copy: [],
            isRecording: false,
            recorder: null,
            contacts: [],
            editorId: 'mail_send_ediotr',
            editorHeight: null
        }
    },
    created() {
        this.getContacts();
        this.editorHeight = window.innerHeight - 420;
    },
    methods: {
        getContacts() {
            this.loading = true;
            contactsAPI.fetchContacts().then(response => {
                response.data.forEach(item => {
                    item.show = item.name + '<' + item.mail + '>';
                });
                this.contacts = response.data;
                this.loading = false;
            })
        },
        addContact(newTag) {
            if (!isEmail(newTag)) {
                this.$message({
                    showClose: true,
                    message: '输入的邮箱不合法',
                    type: 'warning',
                    duration: 1200
                })
                return;
            }
            const tag = {
                name: newTag,
                show: newTag,
                mail: newTag
            }
            this.contacts.push(tag)
            this.target.push(tag)
        },
        cleanTarget() {
            this.target = [];
        },
        cleanCopy() {
            this.copy = [];
        },
        handleBefore(file) {
            // 上传前可以对要上传文件进行控制
        },
        handleSuccess(file, fileInfo) {
            this.mail.fileList.push({
                name: fileInfo.name,
                uuid: fileInfo.uid,
                url: fileInfo.url
            })
        },
        handlePreview(file) {
            // 预览
            window.open(file.url);
        },
        handleRemove(file) {
            // 移除
            this.mail.fileList.forEach((item, index) => {
                if (item.uuid === file.uid) {
                    this.mail.fileList.splice(index, 1);
                }
            })
        },
        startRecorder() {
            Recorder.get(rec => {
                this.recorder = rec;
                this.recorder.start();
            });
            this.isRecording = true;
        },
        stopRecorder() {
            this.recorder.stop();
            this.isRecording = false;
            this.mail.audioList.push({
                name: getNowFormatDate(),
                blob: this.recorder.getBlob(),
                url: window.URL.createObjectURL(this.recorder.getBlob())
            })
        },
        delAudio(index) {
            this.mail.audioList.splice(index, 1);
        },
        sendSubmit() {
            if (this.target.length < 1) {
                this.$message({
                    showClose: true,
                    message: '收件人不能为空',
                    type: 'warning',
                    duration: 1200
                })
                return;
            }
            // 添加到formData前应该根据需求处理数据
            this.target.forEach(item => {
                this.mail.target.push(item.mail);
            });
            this.copy.forEach(item => {
                this.mail.copy.push(item.mail);
            });
            const mailForm = new FormData()
            this.appendToFormData(mailForm, this.mail);
            const mailDTO = mailForm;
            this.loading = true;
            mailSendAPI.sendMail(mailDTO).subscribe({
                next: () => {
                    this.$message({
                        type: 'success',
                        message: '发送成功',
                        duration: 1200
                    })
                    this.loading = false;
                    this.initMail();
                },
                error: () => {
                    this.$message({
                        type: 'error',
                        message: '发送失败',
                        duration: 2000
                    });
                    this.loading = false;
                }
            })
        },
        cancelSend() {
            this.$confirm('是否离开页面？', '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then().catch();
        },
        // 添加到formData
        appendToFormData(form, data) {
            for (const field in data) {
                if (typeof data[field] === 'object' && !isEmpty(data[field])) {
                    if (getType(data[field]) === 'Array') {
                        data[field].forEach((item, index) => {
                            if (getType(item) === 'Object') {
                                for (const itemField in item) {
                                    form.append(field + '[' + index + '].' + itemField, item[itemField]);
                                }
                            } else {
                                form.append(field + '[' + index + ']', item);
                            }
                        });
                    } else {
                        // 非数组的对象
                        for (const fieldKey in data[field]) {
                            form.append(field + '.' + fieldKey, data[field][fieldKey])
                        }
                    }
                } else {
                    form.append(field, data[field]);
                }
            }
        },
        initMail() {
            for (const field in this.mail) {
                if (getType(this.mail[field]) === 'String') {
                    this.mail[field] = '';
                } else if (getType(this.mail[field]) === 'Array') {
                    this.mail[field] = [];
                }
            }
            debugger
            this.target = [];
            this.copy = [];
            tinymce.get(this.editorId).setContent('');
        }
    }
}
</script>

<style>
* {
    padding: 0;
    margin: 0;
}

ul {
    list-style: none;
}

.el-row {
    margin-bottom: 10px;
}

.target-label {
    font-size: 14px;
    padding: 0px 12px;
    margin: 2px 0;
    height: 35px;
    line-height: 35px;
}

.target-label i {
    margin-left: 3px;
}

.upload-file {
    display: inline-block;
    vertical-align: middle;
}

.el-upload-dragger {
    height: 30px;
}

.el-upload-dragger .el-icon-upload {
    font-size: 30px;
    line-height: 20px;
    margin: 3px 0;
}

.audio-name {
    width: 200px;
    vertical-align: 12px;
}

.del-audio {
    margin-left: 5px;
    cursor: pointer;
    vertical-align: 10px;
    font-size: 20px;
    color: #00ADB5;
}
.send-btn{
    margin-top: 10px;
    margin-right: 60px;
}
.cancel-btn{
    margin-top: 10px;
}
</style>

