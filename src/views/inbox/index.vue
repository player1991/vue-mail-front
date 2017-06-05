<template>
  <div class="app-container calendar-list-container">
  
    <div class="filter-container">
      <el-button v-waves type="primary" class="tool-item filter-item btn-reply">
        <i class="fa fa-reply"></i>
      </el-button>
      <el-button v-waves type="primary" class="tool-item filter-item btn-reply-all">
        <i class="fa fa-reply-all"></i>
      </el-button>
      <el-button v-waves type="primary" icon="share" class="tool-item filter-item btn-forward"></el-button>
      <el-button v-waves type="danger" icon="delete" class="tool-item filter-item btn-del"></el-button>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>
  
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="status in statusOptions" :key="status.value" :label="status.showValue" :value="status.value">
        </el-option>
      </el-select>
  
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
  
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
  
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="text" icon="document" @click="handleDownload">导出</el-button>
    </div>
  
    <div class="tool-bar">
      <el-button-group>
  
      </el-button-group>
    </div>
  
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border highlight-current-row style="width: 100%">
  
      <el-table-column type="selection" min-width="30px">
      </el-table-column>
  
      <el-table-column align="left" width="80px" label="信息">
        <template scope="scope">
          <i class="star fa" v-bind:class="[scope.row.isStar? 'fa-star':'fa-star-o']"></i>
          <i v-if="scope.row.isHaveFile" class="fa fa-paperclip"></i>
          <i v-if="scope.row.isHaveAudio" class="fa fa-microphone"></i>
        </template>
      </el-table-column>
  
      <el-table-column class-name="status-col" label="状态" width="80px">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{scope.row.status | statusShowFilter}}</el-tag>
        </template>
      </el-table-column>
  
      <el-table-column align="center" sortable label="发件人">
        <template scope="scope">
          <el-tooltip class="item" effect="dark" v-bind:content="scope.row.sender.mail" placement="top">
            <span>{{scope.row.sender.name}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
  
      <el-table-column label="主题" sortable show-overflow-tooltip="true" min-width="400px">
        <template scope="scope">
          <span class="link-type" @click="goToDetail(scope.row.id)">{{scope.row.title}}</span>
          <el-tag v-for="label in scope.row.labelList" :key="label.guid">{{label.name}}</el-tag>
        </template>
      </el-table-column>
  
      <el-table-column align="center" sortable label="接收时间" width="150px">
        <template scope="scope">
          <span>{{scope.row.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
  
      <el-table-column align="center" sortable label="阅读时间" width="150px">
        <template scope="scope">
          <span>{{scope.row.readDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    </el-table>
  
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="类型">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="状态">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="时间">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
  
        <el-form-item label="标题">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
  
        <el-form-item label="重要性">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </el-form-item>
  
        <el-form-item label="点评">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  
    <el-dialog title="阅读数统计" :visible.sync="dialogPvVisible" size="small">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="渠道"> </el-table-column>
        <el-table-column prop="pv" label="pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
import { fetchList } from 'api/receive_mail';
import { parseTime } from 'utils';

const calendarTypeOptions = [
  { key: 'FD', display_name: '经济数据' },
  { key: 'FE', display_name: '财经大事' },
  { key: 'BI', display_name: '国债发行' },
  { key: 'VN', display_name: '假期报告' }
];

// arr to obj
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc
}, {});

export default {
  name: 'table_demo',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        importance: 0,
        remark: '',
        timestamp: 0,
        title: '',
        type: '',
        status: 'published'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: '按主题升序', key: '+id' },
        { label: '按主题降序', key: '-id' },
        { label: '按发件人升序', key: '+sender' },
        { label: '按发件人降序', key: '-sender' }
      ],
      statusOptions: [
        {
          value: 0,
          showValue: '未读'
        },
        {
          value: 1,
          showValue: '已读'
        },
        {
          value: 2,
          showValue: '已回复'
        },
        {
          value: 3,
          showValue: '已转发'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      showAuditor: false,
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'primary',
        2: 'success',
        3: 'gray'
      };
      return statusMap[status]
    },
    statusShowFilter(status) {
      const statusMap = {
        0: '未读',
        1: '已读',
        2: '已回复',
        3: '已转发'
      };
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    timeFilter(time) {
      if (!time[0]) {
        this.listQuery.start = undefined;
        this.listQuery.end = undefined;
        return;
      }
      this.listQuery.start = parseInt(+time[0] / 1000);
      this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      row.status = status;
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    goToDetail(id) {
      alert(id);
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    create() {
      this.temp.id = parseInt(Math.random() * 100) + 1024;
      this.temp.timestamp = +new Date();
      this.temp.author = '原创作者';
      this.list.unshift(this.temp);
      this.dialogFormVisible = false;
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      });
    },
    update() {
      this.temp.timestamp = +this.temp.timestamp;
      for (const v of this.list) {
        if (v.id === this.temp.id) {
          const index = this.list.indexOf(v);
          this.list.splice(index, 1, this.temp);
          break;
        }
      }
      this.dialogFormVisible = false;
      this.$notify({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 0,
        remark: '',
        timestamp: 0,
        title: '',
        status: 'published',
        type: ''
      };
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
        const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
        const data = this.formatJson(filterVal, this.list);
        export_json_to_excel(tHeader, data, 'table数据');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>
.star {
  color: #F08A5D
}
.btn-reply {
    background-color: #36c6d3;
    border-color: #36c6d3;
}
.btn-reply:hover, .btn-reply:focus{
    background-color: #36c6d3;
    border-color: #36c6d3;
}
.btn-reply-all {
    background-color: #118DF0;
    border-color: #118DF0;
}
.btn-reply-all:hover, .btn-reply-all:focus{
    background-color: #118DF0;
    border-color: #118DF0;
} 
.btn-forward {
   background-color: #F1C40F; 
   border-color: #F1C40F;
}
.btn-forward:hover, .btn-forward:focus{
   background-color: #F1C40F;
   border-color: #F1C40F;
}
.btn-del {
   background-color: #ed6b75;
   border-color: #ed6b75;
}
.btn-del:hover, .btn-del:focus{
   background-color: #ed6b75;
   border-color: #ed6b75;
}
</style>
