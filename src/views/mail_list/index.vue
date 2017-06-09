<template>
    <div class="app-container calendar-list-container">
    
        <div class="filter-container">
    
            <el-button v-waves @click="forward" type="primary" icon="share" class="tool-item filter-item btn-forward"></el-button>
            <el-button v-waves type="danger" icon="delete" class="tool-item filter-item btn-del" v-on:click="handleDelete()"></el-button>
    
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
            </el-input>
    
            <!--<el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.status" placeholder="状态">
                    <el-option v-for="status in statusOptions" :key="status.value" :label="status.showValue" :value="status.value">
                    </el-option>
                  </el-select>-->
    
            <el-date-picker v-model="dateRange" type="datetimerange" :picker-options="dataOptions" placeholder="选择时间范围" align="right" class="tool-item filter-item">
            </el-date-picker>
    
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="text" icon="document" @click="handleDownload">导出</el-button>
        </div>
    
        <el-table :key='tableKey' :data="list" ref="multipleTable" @selection-change="handleSelectionChange" v-loading.body="listLoading" border highlight-current-row style="width: 100%">
    
            <el-table-column type="selection" min-width="30px">
            </el-table-column>
    
            <el-table-column align="left" width="80px" label="信息">
                <template scope="scope">
                    <i class="star fa" v-bind:class="[scope.row.isStar? 'fa-star':'fa-star-o']"></i>
                    <i v-if="scope.row.isHaveFile" class="fa fa-paperclip"></i>
                    <i v-if="scope.row.isHaveAudio" class="fa fa-microphone"></i>
                </template>
            </el-table-column>
    
            <el-table-column class-name="status-col" label="类型" width="80px">
                <template scope="scope">
                    <el-tag :type="scope.row.type | statusTypeFilter">{{scope.row.status | statusShowFilter}}</el-tag>
                </template>
            </el-table-column>
    
            <el-table-column align="center" label="发件人">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.sendMail" placement="top">
                        <span>{{scope.row.sendName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
    
            <el-table-column label="主题" :show-overflow-tooltip="true" min-width="400px">
                <template scope="scope">
                    <span class="link-type" @click="goToDetail(scope.row.id)">{{scope.row.title}}</span>
                    <el-tag v-for="label in scope.row.labelList" :key="label.guid">{{label.name}}</el-tag>
                </template>
            </el-table-column>
    
            <el-table-column align="center" label="时间" width="150px">
                <template scope="scope">
                    <span>{{scope.row.readDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>
        </el-table>
    
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    
    </div>
</template>

<script>
export default {
    name: 'mail_list',
    data() {
        return {
            list: [],
            total: [],
            listLoading: false,
            listQuery: {
                page: 1,
                limit: 20,
                title: '',
                status: '',
                sort: ''
            },
            dataOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            dateRange: ''
        }
    },
    created() {
        this.initPage();
    },
    methods: {
        initPage() {

        }
    }
}
</script>
<style>

</style>
