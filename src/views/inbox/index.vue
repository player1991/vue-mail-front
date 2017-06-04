<template>
    <div class="mail-list-container app-container calendar-list-container">
        <data-tables 
        :data='tableData', 
        :actions-def='getExportActionsDef()', 
        :col-not-row-click='["special_selection_col"]', 
        @row-click='rowClick', 
        @select='handleSelect',
        @select-all='handleAllSelect', 
        @current-change='handleCurrentRowChange', 
        @filtered-data='handleFilterDataChange'
        ref="inbox-list">
            <el-table-column type='selection', width='55', prop='special_selection_col'></el-table-column>
            <el-table-column prop="title"
                label="主题"
                sortable="custom">
            </el-table-column>
            <el-table-column prop="sender"
                label="发件人"
                sortable="custom">
            </el-table-column>
            <el-table-column prop="receiveDate"
                label="接收时间"
                sortable="custom">
            </el-table-column>
            <el-table-column prop="readDate"
                label="阅读时间"
                sortable="custom">
            </el-table-column>
        </data-tables>
    </div>
</template>

<script>
import { fetchList } from 'api/article_table';
import DataTables from 'vue-data-tables'
Vue.use(DataTables);

export default {
    name: 'inbox',
    data(){
        return{

        }
    }
}
</script>



<style>

</style>
