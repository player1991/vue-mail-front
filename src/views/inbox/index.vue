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
      <el-button v-waves type="danger" icon="delete" class="tool-item filter-item btn-del" v-on:click="handleDelete()"></el-button>
  
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>
  
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="status in statusOptions" :key="status.value" :label="status.showValue" :value="status.value">
        </el-option>
      </el-select>
  
      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
  
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
  
      <el-table-column class-name="status-col" label="状态" width="80px">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{scope.row.status | statusShowFilter}}</el-tag>
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
  
      <el-table-column align="center" label="接收时间" width="150px">
        <template scope="scope">
          <span>{{scope.row.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
  
      <el-table-column align="center" label="阅读时间" width="150px">
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
import * as inboxAPI from 'api/inbox';
import { parseTime } from 'utils';

export default {
  name: 'inbox',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        status: undefined,
        sort: ''
      },
      sortOptions: [
        { label: '按主题升序', key: '+title' },
        { label: '按主题降序', key: '-title' },
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
      multipleSelection: [],
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
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      inboxAPI.fetchList(this.listQuery).then(response => {
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
    goToDetail(id) {
      alert(id);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete() {
      const selectedLen = this.multipleSelection.length || 0;
      if (selectedLen < 1) {
        this.$message({
          showClose: true,
          message: '请选择邮件进行删除'
        });
        return;
      }
      this.$confirm('是否删除这' + selectedLen + '封邮件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idArr = [];
        this.multipleSelection.forEach(item => idArr.push(item.id));
        inboxAPI.delReceiveMail(idArr).subscribe({
          next: () => {
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
          },
          error: () => this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        });
      });
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['发件人', '发件邮箱', '主题', '接收时间', '阅读时间'];
        const filterVal = ['sendName', 'sendMail', 'title', 'receiveDate', 'readDate'];
        const data = this.formatJson(filterVal, this.list);
        export_json_to_excel(tHeader, data, parseTime(Date.now()) + '收件箱数据');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (~j.indexOf('Date')) {
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

.btn-reply:hover,
.btn-reply:focus {
  background-color: #36c6d3;
  border-color: #36c6d3;
}

.btn-reply-all {
  background-color: #118DF0;
  border-color: #118DF0;
}

.btn-reply-all:hover,
.btn-reply-all:focus {
  background-color: #118DF0;
  border-color: #118DF0;
}

.btn-forward {
  background-color: #F1C40F;
  border-color: #F1C40F;
}

.btn-forward:hover,
.btn-forward:focus {
  background-color: #F1C40F;
  border-color: #F1C40F;
}

.btn-del {
  background-color: #ed6b75;
  border-color: #ed6b75;
}

.btn-del:hover,
.btn-del:focus {
  background-color: #ed6b75;
  border-color: #ed6b75;
}
</style>
