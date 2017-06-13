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
                <el-upload class="upload-file" :before-upload="handleBefore" :on-preview="handlePreview" :on-success="handleSuccess" :on-remove="handleRemove" :show-file-list="true" :file-list="mail.oldFileList" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
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
                <ul v-show="!!mail.oldAudioList.length" class="old-audio-list">
                    <li v-for="(audio, index) in mail.oldAudioList">
                        <audio :src="audio.url" controls></audio>
                        <a class="old-audio-name" :href="audio.url" download>{{audio.name}}</a>
                        <i class="fa fa-trash-o del-audio" @click="delOldAudio(index)"></i>
                    </li>
                </ul>
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
import Tinymce from 'components/Tinymce';
import * as contactsAPI from 'api/mail_contacts';
import * as mailSendAPI from 'api/mail_send';
import * as mailDetailAPI from 'api/mail_detail';
import { isEmail, isEmpty, getType } from 'utils/validate';
import { getNowFormatDate } from 'utils';
import { Observable } from 'rxjs/Observable';

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
        this.initSendPage();
    },
    methods: {
        initSendPage() {
            this.getContacts().subscribe({
                next: () => { this.getContent() }
            });
            this.editorHeight = window.innerHeight - 420;
        },
        getContacts() {
            this.loading = true;
            return Observable.create(observer => {
                contactsAPI.fetchList().then(res => {
                    res.data.contacts.forEach(item => {
                        item.show = item.name + '<' + item.mail + '>';
                    });
                    this.contacts = res.data.contacts;
                    this.loading = false;
                    observer.next();
                })
            })
        },
        getContent() {
            const pageType = this.$store.getters.pageType;
            const mailId = this.$store.getters.mailId;
            const mailType = this.$store.getters.mailType;
            if (pageType && pageType !== 'add') {
                mailDetailAPI.fetchDetail({ mailId, mailType }).then(res => {
                    // 设定字段时要慎重，两边字段不匹配好累啊
                    const detail = res.data;
                    this.mail.title = detail.title;
                    this.mail.content = detail.content;
                    this.mail.oldFileList = detail.oldFileList;
                    this.mail.oldAudioList = detail.oldAudioList;
                    detail.target.forEach(item => {
                        item.show = item.name + '<' + item.mail + '>';
                    });
                    detail.copy.forEach(item => {
                        item.show = item.name + '<' + item.mail + '>';
                    });
                    const sender = {
                        name: detail.sender,
                        mail: detail.sendMail,
                        show: detail.sender + '<' + detail.sendMail + '>'
                    };
                    switch (pageType) {
                        case 'reply':
                            this.target.push(sender);
                            break;
                        case 'replyAll':
                            this.target = [sender].concat(detail.target, detail.copy);
                            break;
                        case 'edit':
                            this.target = detail.target;
                            this.copy = detail.copy;
                            break;
                        default:
                    }
                });
            } else if (pageType && pageType === 'add') {
                const target = this.$store.getters.target;
                if (target) {
                    if (target === 'all') {
                        this.target = this.contacts;
                    } else {
                        target.forEach(item => item.show = item.name + '<' + item.mail + '>');
                        this.target = target;
                    }
                    this.$store.commit('SET_TARGET', null);
                }
            }
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
            // 预览,一些文件因为格式问题无法预览。推荐使用a标签，src为文件的下载地址，点击即可下载,参照录音
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
        delOldAudio(index) {
            this.mail.oldAudioList.splice(index, 1);
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
        // 添加到formData，需要符合formData的格式
        appendToFormData(form, data) {
            // 遍历要添加的字段
            Object.keys(data).forEach(field => {
                // 如果该字段的值是对象
                if (typeof data[field] === 'object') {
                    if (!isEmpty(data[field])) { // 且不为空
                        if (getType(data[field]) === 'Array') { // 数组对象
                            data[field].forEach((item, index) => {
                                if (getType(item) === 'Object') {  // 数组项如果还是对象
                                    // 遍历数组项的属性
                                    Object.keys(item).forEach(itemField => {
                                        form.append(field + '[' + index + '].' + itemField, item[itemField]);
                                    })
                                } else {
                                    form.append(field + '[' + index + ']', item);
                                }
                            });
                        } else {
                            // 非数组的对象
                            Object.keys(data[field]).forEach(fieldKey => {
                                form.append(field + '.' + fieldKey, data[field][fieldKey])
                            })
                        }
                    }
                } else {
                    // 最简单的情况，字段值非对象，直接append
                    form.append(field, data[field]);
                }
            })
            // for (const field in data) {
            //     // 如果该字段的值是对象且不为空
            //     if (typeof data[field] === 'object' && !isEmpty(data[field])) {
            //         // 数组对象
            //         if (getType(data[field]) === 'Array') {
            //             data[field].forEach((item, index) => {
            //                 // 数组项如果还是对象
            //                 if (getType(item) === 'Object') {
            //                     // 遍历数组项的属性
            //                     for (const itemField in item) {
            //                         form.append(field + '[' + index + '].' + itemField, item[itemField]);
            //                     }
            //                 } else {
            //                     form.append(field + '[' + index + ']', item);
            //                 }
            //             });
            //         } else {
            //             // 非数组的对象
            //             for (const fieldKey in data[field]) {
            //                 form.append(field + '.' + fieldKey, data[field][fieldKey])
            //             }
            //         }
            //     } else {
            //         // 最简单的情况，字段值非对象，直接append
            //         form.append(field, data[field]);
            //     }
            // }
        },
        initMail() {
            for (const field in this.mail) {
                if (getType(this.mail[field]) === 'String') {
                    this.mail[field] = '';
                } else if (getType(this.mail[field]) === 'Array') {
                    this.mail[field] = [];
                }
            }
            this.target = [];
            this.copy = [];
            // 编辑器内容与mail.content是双向绑定，上一步中mail.content = ''不知道为什么并没有将编辑器内容清空
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

audio {
    width: 260px;
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

.send-btn {
    margin-top: 10px;
    margin-right: 60px;
}

.cancel-btn {
    margin-top: 10px;
}

.old-audio-name {
    vertical-align: 10px;
}
</style>

