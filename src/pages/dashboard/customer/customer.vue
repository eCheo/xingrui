<template>
  <div class="analysis" style="margin-bottom:20px;">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col >
        <div class="cas-content">
          <div class='cas-box'>
            <div>
                <span>客户名称：</span>
                <a-input v-model="staffFrom.name" style="width:75%;" placeholder="请输入客户名称" />
            </div>
            <div>
                <span>需求面积：</span>
                <a-input suffix="m²" v-model="staffFrom.areaSmall" style="width:36%;" placeholder="请输入需求面积" />
                <span>~</span>
                <a-input suffix="m²" v-model="staffFrom.areaLarge" style="width:36%;" placeholder="请输入需求面积" />
            </div>
            <div>
              <span style="margin-right:10px;">需求区域:</span>
              <a-cascader
                style="width:75%;"
                change-on-select
                :options="options"
                :show-search="{ filter }"
                placeholder="请选择区域街道"
                @change="onSelectChange"
              />
            </div>
            <div>
                <span>电话号码：</span>
                <a-input v-model="staffFrom.phone" style="width:75%;" placeholder="请输入电话号码" />
            </div>
            <div style="width: 64%;">
                <span style="margin:0 0px 0 28px;">业态：</span>
                <a-input v-model="staffFrom.format" style="width:38.7%;" placeholder="请输入业态" />
                <a-button @click="getStaff(1)" type="primary" style="margin-left: 16px;">
                    查询
                </a-button>
                <a-button @click="claerStaffInfo" type="primary" style="margin-left: 15px;">
                    添加客户
                </a-button>
                <a-button v-if='auth' @click="exportExcel" type="primary" style="margin-left: 15px;">
                    导出excel
                </a-button>
            </div>
          </div>
        </div>
      </a-col>
      <a-col>
        <div style="background:#fff;padding:20px 12px;">
          <a-table :pagination='pagination' :loading='tabLoading' :columns="staffList" :data-source="staffData">
              <span slot="age" slot-scope="text, record">{{record.sex.message}}</span>
              <span slot="memberName" slot-scope="text, record">{{record.memberName === '' ? '--' : record.memberName }}</span>
              <span slot="demandArea" slot-scope="text, record">{{record.demandArea + ' m²' + '~' + record.deadAreaEnd + ' m²'}}</span>
              <span slot="areaName" slot-scope="text, record">{{(record.areaName || '--')+ ' ' + (record.streetName || '--')}}</span>
              <span slot="action" slot-scope="text, record">
                  <a @click="goDetails(record)">详情</a>
                  <a-divider type="vertical" />
                  <a @click="setStaffInfo(record)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm v-if="auth" placement="top" ok-text="确定" cancel-text="取消" @confirm="deleteStaff(record)">
                    <template slot="title">
                      <p>是否要删除该客户？</p>
                    </template>
                    <a>删除</a>
                  </a-popconfirm>
              </span>
          </a-table>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model="editModal" :title="editType === 'edit' ? '编辑': '添加'">
      <template slot="footer">
        <a-button key="back" @click="editModal = false">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading='editLoading' @click="changeStaff">
          确定
        </a-button>
      </template>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="客户名称" prop="name">
          <a-input
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="phone" label="电话" prop="phone">
          <a-input
            v-model="form.phone"
            @blur="
              () => {
                $refs.phone.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="sex">
            <a-radio-group v-model="form.sex">
              <a-radio value="Man">
                男
              </a-radio>
              <a-radio value="WoMan">
                女
              </a-radio>
            </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="format" label="业态" prop="format">
          <a-input
            v-model="form.format"
            @blur="
              () => {
                $refs.format.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="brandName" label="品牌" prop="brandName">
          <a-input
            v-model="form.brandName"
            @blur="
              () => {
                $refs.brandName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item class="de-left" style="display:inline-block;" ref="demandArea" label="需求面积" prop="demandArea">
          <a-input
            v-model="form.demandArea"
            suffix="m²"
            @blur="
              () => {
                $refs.demandArea.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <span class="de-center">~</span>
        <a-form-model-item class="de-right" ref="deadAreaEnd" prop="deadAreaEnd" style="display:inline-block;">
          <a-input
            v-model="form.deadAreaEnd"
            suffix="m²"
            @blur="
              () => {
                $refs.deadAreaEnd.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="areaId" label="需求区域" prop="areaId">
          <a-cascader
            :options="options"
            change-on-select
            :show-search="{ filter }"
            :default-value='areaDefaultList'
            placeholder="请选择区域街道"
            @change="onChange"
            @blur="
              () => {
                $refs.areaId.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="demandAddress" label="备注" prop="demandAddress">
          <a-textarea
            v-model="form.demandAddress"
            @blur="
              () => {
                $refs.demandAddress.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
// import axios from 'axios'
const phoneValid = (rule, value, callback) => {
  let reg = /^[0-9]{11}$/
  if (value === '') {
    return callback(new Error('请输入手机号'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
export default {
  name: 'customer',
  data () {
    return {
      loading: true,
      tabLoading: false,
      editLoading: false,
      editModal: false,
      staffFrom: {
        page: '1',
        name: '',
        pageSize: 10,
        areaLarge: '',
        areaSmall: '',
        format: '',
        areaId: '',
        streetId: ''
      },
      staffList: [
        {
          title: '客户名称',
          dataIndex: 'name',
          key: 'name',
          width: 138
        },
        {
          title: '性别',
          dataIndex: 'age',
          key: 'age',
          width: 70,
          scopedSlots: { customRender: 'age' }
        },
        {
          title: '业态',
          dataIndex: 'format',
          key: 'format',
          width: 138
        },
        {
          title: '录入人',
          dataIndex: 'memberName',
          key: 'memberName',
          width: 138,
          scopedSlots: { customRender: 'memberName' }
        },
        {
          title: '需求面积',
          dataIndex: 'demandArea',
          key: 'demandArea',
          width: 180,
          scopedSlots: { customRender: 'demandArea' }
        },
        {
          title: '区域街道',
          dataIndex: 'areaName',
          key: 'areaName',
          width: 150,
          scopedSlots: { customRender: 'areaName' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      staffData: [],
      pagination: {
        defaultPageSize: 10,
        defaultCurrent: 1,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共${total}条数据`,
        pageSizeOptions: ['10', '20', '30', '40'],
        onShowSizeChange: (current, pageSize) => this.getStaff(current, pageSize),
        onChange: (current, pageSize) => this.getStaff(current, pageSize)
      },
      rules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { max: 5, message: '客户名称不能超过5个字', trigger: 'blur' }
        ],
        phone: [
           { required: true, validator:phoneValid, trigger: 'blur' }
        ],
        sex: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        format: [
          { required: true, message: '请输入业态', trigger: 'blur' },
          { max: 10, message: '业态不能超过10个字', trigger: 'blur' }
        ],
        demandArea: [
          { required: true, message: '请输入需求面积', trigger: 'blur' },
          // { max: 999, message: '面积不能超过999', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        deadAreaEnd: [
          { required: true, message: '请输入需求面积', trigger: 'blur' },
          // { max: 999, message: '面积不能超过999', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        demandAddress: [
          { max: 50, message: '备注不能超过50个字', trigger: 'blur' }
        ]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        phone: '',
        sex: 'Man',
        format: '',
        demandArea: '',
        demandAddress: '',
        brandName: '',
        deadAreaEnd: '',
        areaId: '',
        streetId: ''
      },
      editType: 'edit',
      options: [],
      areaDefaultList: []
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
    this.getStaff(1)
    this.getAddress()
  },
  methods: {
    getStaff(page, pageSize) {
      this.tabLoading = true
      this.staffFrom.page = page
      this.staffFrom.pageSize = pageSize || 10
      request('/api/backend/customer/findByCondition.json', METHOD.GET,
        {
          size: this.staffFrom.pageSize,
          page: this.staffFrom.page,
          GTE_demandArea: this.staffFrom.areaSmall,
          LTE_demandArea: this.staffFrom.areaLarge,
          LIKE_format: this.staffFrom.format,
          LIKE_name: this.staffFrom.name,
          EQ_areaId: this.staffFrom.areaId,
          EQ_streetId: this.staffFrom.streetId,
          EQ_phone: this.staffFrom.phone,
          sort: 'addDate,desc'
        }).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.staffData = res.data.data.content
            this.pagination.total = res.data.data.totalElements
            this.tabLoading = false
          } else {
            this.$message.error(res.data.message)
            this.tabLoading = false
          }
        })
    },
    goDetails(data) {
        sessionStorage.setItem('cusId', data.id);
        this.$router.push('/customerdetails')
    },
    changeStaff() {
      if (this.editType === 'edit') {
        this.updataStaff()
      } else {
        this.createStaff()
      }
    },
    createStaff() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
      this.editLoading = true
      request('/api/backend/customer/create.json', METHOD.POST, this.form).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.editLoading = false
            this.$message.success('添加成功')
            this.getStaff(this.staffFrom.page)
            this.editModal = false
          } else {
            this.$message.error(res.data.message)
            this.editLoading = false
          }
        })
        }
      })
    },
    updataStaff() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
      this.editLoading = true
      request('/api/backend/customer/update.json', METHOD.POST, this.form).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.editLoading = false
            this.$message.success('修改成功')
            this.editModal = false
            this.getStaff(1)
          } else {
            this.$message.error(res.data.message)
            this.editLoading = false
          }
        })
        }
      })
    },
    claerStaffInfo(){
      this.editType = 'add'
      this.editModal = true
      this.areaDefaultList = [];
      for(let key in this.form) {
        if (key !== 'sex')
        this.form[key] = ''
        if (key === 'id')
        delete this.form[key]
      }
    },
    setStaffInfo(data) {
      this.editType = 'edit'
      this.editModal = true
      this.form.name = data.name
      this.form.phone = data.phone
      this.form.sex = data.sex.name
      this.form.format = data.format
      this.form.demandArea = data.demandArea
      this.form.demandAddress = data.demandAddress
      this.form.brandName = data.brandName
      this.form.id = data.id
      this.form.areaId = data.areaId
      this.form.streetId = data.streetId
      this.form.deadAreaEnd = data.deadAreaEnd
      this.areaDefaultList[0] = data.areaId
      this.areaDefaultList[1] = data.streetId
    },
    exportExcel() {
      request('api/backend/customer/exportCustomer.json', METHOD.GET, {
          GTE_demandArea: this.staffFrom.areaSmall,
          LTE_demandArea: this.staffFrom.areaLarge,
          LIKE_format: this.staffFrom.format,
          LIKE_name: this.staffFrom.name,
          EQ_areaId: this.staffFrom.areaId,
          EQ_streetId: this.staffFrom.streetId,
          sort: 'addDate,desc'
      }).then(res => {
        if (res.data.data) {
          this.$message.error(res.data.message)
        } else {
          const elink = document.createElement('a')
          elink.download = '客户列表'
          elink.style.display = 'none'
          elink.href = `http://47.108.133.94:8080/api/backend/customer/exportCustomer.json`
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      })
    },
    deleteStaff(data) {
      request('/api/backend/customer/delete.json', METHOD.POST, {
        id: data.id
      }).then(res => {
        if(res.status === 200 && res.data.code === '200') {
          this.$message.success('删除成功')
          this.getStaff(this.staffFrom.page)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    onChange(value) {
      this.form.areaId = value[0];
      this.form.streetId = value[1] || null;
    },
    onSelectChange(value) {
      this.staffFrom.areaId = value[0];
      this.staffFrom.streetId = value[1];
    },
    getAddress() {
      request('/api/backend/customer/findCityAll.json', METHOD.GET).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          res.data.data.forEach(item => {
            item.children = item.children.map(it => {return {value:it.id, label: it.name}})
          })
         this.options = res.data.data.map(item => {return {value:item.id, label: item.name,children: item.children}})
        } else {
          this.$message.error(res.data.message);
        }
      })
    }
  },
  computed: {
    auth() {
      return this.$store.state.account.userInfo.memberType === 'admin'
    }
  },
  watch: {
      $route: {
        handler() {
          this.getStaff(this.staffFrom.page)
        }
      }
  }
}
</script>

<style lang="less" scoped>
.cas-content {
  background: #fff;
  padding:12px;
  .cas-box {
    display: flex;
    flex-wrap: wrap;
    max-width: 1366px;
    margin: 0 auto;
    div {
      margin: 0 0 15px 0;
      width: 33%;
    }
  }
}
</style>
<style lang="less">
.de-left {
  width:200px;
  .ant-col-4 {
    width: 39%;
  }
  .ant-col-14 {
    width: 59%;
  }
}
.de-center {
    display: inline-block;
    margin: 8px 12px 8px 8px;
}
.de-right {
  .ant-col-14 {
    width: 64%;
  }
}
</style>