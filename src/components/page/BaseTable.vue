<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="filter-item" @click="delAll">批量删除</el-button>
            <el-select v-model="select_cate" placeholder="筛选录取情况" prefix-icon="el-icon-search"class="handle-select mr10">
                <el-option key="1" label="全部" value=""></el-option>
                <el-option key="2" label="已录取" value="true"></el-option>
                <el-option key="3" label="未录取" value="false"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="关键字搜索" class="handle-input mr10" width="100"></el-input>
            <el-button type="primary" icon="edit" class="filter-item" @click="handleCreate" >添加</el-button>
            <el-button type="primary" icon="el-icon-download" class="filter-item" :loading="downloadLoading" @click="handleDownload">导出</el-button>
        </div>
        <el-table :data="data" border style="width: 100% " max-height="600" stripe ref="multipleTable"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" align="center" label="序号"  width="65"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名" sortable  :formatter="formatter"></el-table-column>
            <el-table-column prop="sex" align="center" label="性别" width="65" ></el-table-column>
            <el-table-column prop="phoneNumber" align="center" label="电话" width="130"></el-table-column>
            <el-table-column prop="schoolFrom" align="center" label="本科学校" width="150"></el-table-column>
            <el-table-column prop="subject" align="center" label="本科专业" width="120"></el-table-column>
            <el-table-column prop="studentId" align="center" label="学号" width="140"></el-table-column>
            <el-table-column prop="course" align="center" label="已选课程" width="170"></el-table-column>
            <el-table-column prop="date" align="center" label="报名日期" sortable width="120"></el-table-column>
            <el-table-column prop="schoolTo" align="center" label="报考学校" width="150"></el-table-column>
            <el-table-column
                prop="state"
                align="center"
                label="录取情况"
                width="120"
                :filters="[{text: '已录取', value: 'true'},{text: '未达线', value: 'false'}]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.tag === 'true' ? 'primary' : 'success'" close-transiation>
                        {{scope.row.tag}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center"  width="180">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)" icon="edit">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" icon="delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change ="handleCurrentChange"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"></el-pagination>
        </div>

        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="temp" label-position="left" label-width="80px" style='width: 500px; margin-left:50px;'>
                <el-form-item label="姓名" prop="title">
                    <el-input v-model="temp.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio v-model="temp.sex" label="1" border size="medium">男</el-radio>
                    <el-radio v-model="temp.sex" label="2" border size="medium">女</el-radio>
                </el-form-item>
                <el-form-item label="电话" prop="phoneNumber">
                    <el-input v-model="temp.phone"></el-input>
                </el-form-item>
                <el-form-item label="本科学校" prop="schoolFrom">
                    <el-input v-model="temp.school_from"></el-input>
                </el-form-item>
                <el-form-item label="专业" prop="type">
                    <el-select class="filter-item" v-model="temp.type" filterable placeholder="选择专业">
                        <el-option v-for="item in calendarOptions" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item >
                <el-form-item label="学号" prop="studentId">
                    <el-input v-model="temp.student_id"></el-input>
                </el-form-item>
                <el-form-item label="课程选择" prop="course">
                    <el-checkbox-group v-model="checkedCourse" :min="1" :max="4">
                        <el-checkbox v-for="course in courses" :label="course" :key="course">{{course}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="预考学校" prop="schoolTo">
                    <el-input v-model="temp.school_to"></el-input>
                </el-form-item>
                <el-form-item label="报名日期" prop="date">
                    <el-date-picker v-model="temp.date" type="date" placeholder="Please pick a date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="录取情况">
                    <el-select class="filter-item" v-model="temp.status" placeholder="是否录取">
                        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="filter-item" @click="dialogFormVisible = false" icon="cancel">放弃修改</el-button>
                <el-button class="filter-item" icon="edit" v-if="dialogStatus =='create'" type="primary" @click="createData">新增信息</el-button>
                <el-button class="filter-item" icon="edit" v-else type="primary" @click="handleEdit">更新信息</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>

    import {isvalidPhone} from '../utils/validate';

    export default {
        data() {
            const calendarTypeOptions = [
                { key: '化学', display_name: '化学' },
                { key: '物理', display_name: '物理' },
                { key: '马克思理论', display_name: '马克思理论' },
                { key: '金融', display_name: '金融' }
            ];
            const courseOptions = [
                '数一','数二', '数三', '英一', '英二', '政治',
            ];
            return {
                //url: './static/vuetable.json',
                url: './static/dataTable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                total: null,
                is_search: false,
                calendarOptions: calendarTypeOptions,
                dialogFormVisible: false,
                tempData: '',
                temp: {
                    id: undefined,
                    importance: 1,
                    sex: '1',
                    remark: '',
                    title: '',
                    type: '',
                    status: '',
                    date: new Date(),
                    school_to: '',
                    school_from: '',
                },
                statusOptions: ['未知', 'true', 'false'],
                dialogStatus: '',
                textMap: {
                    update: 'Edit',
                    create: 'Create'
                },
                dialogPvVisible: false,
                downloadLoading: false,
                formTitle: '',
                checkedCourse: [],
                courses: courseOptions,
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if(d.id === self.del_list[i].id && d.name === self.del_list[i].name && d.phoneNumber === self.del_list[i].phoneNumber && d.studentId === self.del_list[i].studentId){
                            is_del = true;
                            /*alert('is_del = true' + self.del_list[i].name + self.del_list[i].phoneNumber);*/
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.name.indexOf(self.select_cate) > -1 &&
                            (d.name.indexOf(self.select_word) > -1 ||
                            d.sex.indexOf(self.select_word) > -1 ||
                            d.schoolFrom.indexOf(self.select_word) > -1 ||
                            d.schoolTo.indexOf(self.select_word) > -1 ||
                            d.course.indexOf(self.select_word) > -1 ||
                            d.studentId.indexOf(self.select_word) > -1 ||
                            d.subject.indexOf(self.select_word) > -1 ||
                            d.studentId.indexOf(self.select_word) > -1 ||
                            d.phoneNumber.indexOf(self.select_word) > -1
                            )
                        ){
                            return d;
                        }
                    }
                })
            }

        },
        methods: {

            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    //self.url = '/ms/table/list';
                    //self.url = 'https://www.easy-mock.com/mock/5a44c32a37b23671f4e28c42/mock/user';
                }
                self.$axios.get(self.url, /*{page:self.cur_page}*/).then((res) => {
                    self.tableData = res.data.list;
                    self.total = res.data.list.length;
                    //console.log('self.total: ' + res.data.list.length);
                })
            },
            search(){
                this.is_search = true;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
                this.dialogFormVisible = true;
                this.formTitle = '更新信息';
                this.dialogStatus = '';
                console.log('tableData: ' + this.tableData);
            },
            handleDelete(index, row) {
                alert('row.name ' + row.name);
                const self = this;
                let str = '';
                self.del_list = row;
                str = self.row.name;
                self.$message.error('删除了'+str);
                self.row = [];
            },
            delAll(){
                const self = this,
                length = self.multipleSelection.length;
                alert('length: ' + length);
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                    console.log('self.multipleSelection[i].name: '+ self.multipleSelection[i].name);
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val){

            },
            handleCreate(){

                var self = this;
                self.dialogStatus = 'create';
                self.dialogFormVisible = true;
                self.formTitle = '新增信息';
                self.tempData = {
                    id: undefined,
                    importance: 1,
                    sex: '1',
                    remark: '',
                    title: '',
                    type: '',
                    status: '',
                    date: new Date(),
                    school_to: '',
                    school_from: '',
                };
                return{

                }
            },
            createData(){

            },
            handleDownload(){
                this.downloadLoading = true;
            },

            //格式化数据
            formatter(row, column) {
                return row.name;
            },


        }
    }
</script>

<style scoped>
/*@import './static/css/easydialog.min.css';*/
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>
