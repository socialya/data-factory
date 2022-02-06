<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>榜单数据</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <!-- <el-select v-model="select_cate" placeholder="筛选项目" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select> -->
                <el-input v-model="select_word" placeholder="输入筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr11" @click="addOne">添加榜单</el-button>

                <!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <!-- <el-table-column prop="date" label="日期" sortable width="150">
                </el-table-column> -->

                <el-table-column prop="name" label="项目名称" width="250">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>项目名: {{ scope.row.name }}</p>
                            <p>接口数: {{ scope.row.interfaces }}</p>
                            <p>套件数: {{ scope.row.testsuits }}</p>
                            <p>用例数: {{ scope.row.testcases }}</p>
                            <p>配置数: {{ scope.row.configures }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                            </div>
                        </el-popover>
                </template>
                </el-table-column>

                <el-table-column prop="leader" label="项目负责人" width="100" align="center">
                </el-table-column>

                <el-table-column prop="publish_app" label="应用名称" width="250">
                </el-table-column>

                <el-table-column prop="tester" label="测试人员" width="100" align="center">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <!-- <el-table-column prop="address" label="地址" :formatter="formatter">
                </el-table-column> -->
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleRun(scope.$index, scope.row)">运行</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                @size-change="handleSizeChange" :page-sizes="[4, 5, 8, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper" :total="total_nums" :page-size="page_size">
                </el-pagination>
            </div>

        </div>
        <el-dialog title="添加榜单" :visible.sync="editVisible" width="50%" center  @close="col" :before-close="beforeClose" >
            <el-steps :active="active" finish-status="success" align-center>
              <el-step title="新建榜单项目"></el-step>
              <el-step title="添加配置"></el-step>
              <el-step title="运行方式"></el-step>
            </el-steps>
            <el-form ref="form"  :rules="rules" :model="form" label-width="120px" class="topTable" v-show="active===0" >
                <!-- <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item> -->
                <el-form-item label="活动名称" >
                    <el-input  clearable  class="topInput"  v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="测试人员"  prop="tester" >
                    <el-input  clearable class="topInput" v-model="form.tester" @focus="clearValidate('tester')" ></el-input>
                </el-form-item>
                <el-form-item label="开发人员" prop="programmer" >
                    <el-input  clearable class="topInput" v-model="form.programmer" @focus="clearValidate('programmer')" ></el-input>
                </el-form-item>
                <el-form-item label="活动code" prop="code" >
                    <el-input  clearable class="topInput" v-model.number="form.code"  @focus="clearValidate('code')" ></el-input>
                </el-form-item>
<!--                <el-form-item label="简要描述">-->
<!--                    <el-input type="textarea" clearable class="topInput"></el-input>-->
<!--                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false" v-show="active===0">取 消</el-button>
                <el-button @click="sublitform('form')" v-show="active===3">确定</el-button>

                <el-button @click="lastpage" v-show="active!==0">上一页</el-button>
                <el-button @click="nextpage('form')">下一页</el-button>

<!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Projects",
         methods: {
              tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                  return 'warning-row';
                } else if (rowIndex === 3) {
                  return 'success-row';
                }
                return '';
              },
              addOne(){
                  this.editVisible=true
              },
             beforeClose(done){
                  this.$confirm("确认关闭吗?")
                  .then(()=>{
                      done()
                  }).catch(()=>{

                  })
             },
             saveEdit(){
                  if(this.active===3) {
                      console.log("执行了")
                  }else {
                      this.active++
                  }

             },
             col(){
                  console.log("form",this.$refs['form'])
                  this.$refs['form'].resetFields();
                  console.log("关闭了")
                  this.active=0
             },
             nextpage(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       this.$message.error('无误');
                       this.active++

                    } else {
                        console.log(66666666666666)
                        // this.ishow_err=true
                        this.$message.error('参数有误');
                        return false;
                    }
                });
             },
             clearValidate(prop_value) {
                this.$refs['form'].clearValidate(prop_value);
            },
        },
        data() {
          return {
                ishow_err:false,
                editVisible:false,
                form:{
                    name:"",
                    tester:"",
                    code:"",
                    programmer:""

                },
                rules: {
                        tester: [
                            { required: true, message: '请输入测试人员', trigger: 'blur' }
                        ],
                        programmer: [
                            { required: true, message: '请输入开发人员', trigger: 'blur' }
                        ],
                        code: [
                            { required: true, message: '请入活动code', trigger: 'blur' }
                        ],
                },
                active: 0,
             }
        },
        watch:{
            // active:{
            //     handler(n,o){
            //         if(n===0){
            //             this.editVisibleOne=true
            //             this.editVisibleTwo=false
            //             this.editVisibleThree=true
            //
            //         }else if (n===1){
            //              this.editVisibleOne=false
            //              this.editVisibleTwo=true
            //              this.editVisibleThree=false
            //         }else{
            //                this.editVisibleOne=false
            //              this.editVisibleTwo=false
            //              this.editVisibleThree=true
            //         }
            //     }
            // }
        }

    }
</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
     .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .mr11{
        float: right;
        margin-right: 50px;
    }
    .topInput{
        width: 50%;
    }
    .topTable{
        margin-top: 20px;
        margin-left: 20%;
    }
</style>