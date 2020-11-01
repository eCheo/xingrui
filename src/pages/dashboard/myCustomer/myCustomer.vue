<template>
  <div class="analysis" style="margin-bottom:20px;">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col >
        <div class="cas-content" style="background:#fff;padding:12px 107px;">
            <div>
                <span>客户名称：</span>
                <a-input v-model="staffFrom.name" style="width:300px;" placeholder="请输入客户名称" />
            </div>
            <div>
                <span>需求面积：</span>
                <a-input v-model="staffFrom.areaSmall" style="width:300px;" placeholder="请输入需求面积" />
                <span>~</span>
                <a-input v-model="staffFrom.areaLarge" style="width:300px;" placeholder="请输入需求面积" />
            </div>
            <div>
                <span style="margin-right:28px;">业态：</span>
                <a-input v-model="staffFrom.format" style="width:300px;" placeholder="请输入业态" />
                <a-button @click="getStaff(1)" type="primary" style="margin-left: 15px;">
                    查询
                </a-button>
                <a-button @click="claerStaffInfo" type="primary" style="margin-left: 15px;">
                    添加客户
                </a-button>
            </div>
        </div>
      </a-col>
      <a-col>
        <div style="background:#fff;padding:20px 12px;">
          <a-table :pagination='pagination' :loading='tabLoading' :columns="staffList" :data-source="staffData">
              <span slot="age" slot-scope="text, record">{{record.sex.message}}</span>
              <span slot="demandArea" slot-scope="text">{{text+' m²'}}</span>
              <span slot="action" slot-scope="text, record">
                  <a @click="goDetails(record)">详情</a>
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
        <a-form-model-item ref="demandArea" label="需求面积" prop="demandArea">
          <a-input
            v-model="form.demandArea"
            @blur="
              () => {
                $refs.demandArea.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="demandAddress" label="需求地址" prop="demandAddress">
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
        format: ''
      },
      staffList: [
        {
          title: '客户名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '性别',
          dataIndex: 'age',
          key: 'age',
          scopedSlots: { customRender: 'age' }
        },
        {
          title: '业态',
          dataIndex: 'format',
          key: 'format'
        },
        {
          title: '品牌名称',
          dataIndex: 'brandName',
          key: 'brandName'
        },
        {
          title: '需求面积',
          dataIndex: 'demandArea',
          key: 'demandArea',
          scopedSlots: { customRender: 'demandArea' }
        },
        {
          title: '需求区域',
          dataIndex: 'demandAddress',
          key: 'demandAddress'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      staffData: [],
      pagination: {
        defaultPageSize: 10,
        showSizeChanger: true,
        showTotal: total => `共${total}条数据`,
        pageSizeOption: ['5', '10', '15', '20'],
        onShowSizeChange: (current, pageSize) => this.getStaff(current, pageSize)
      },
      rules: {
        name: [
          { required: true, message: '请输入员工名称', trigger: 'blur' },
          { max: 5, message: '员工名称不能超过5个字', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { max: 11, message: '请输入正确的手机号', trigger: 'blur' },
          {type: 'number', message: '只能输入数字', trigger: 'blur'}
        ],
        sex: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        format: [
          { required: true, message: '请输入业态', trigger: 'blur' },
          { max: 10, message: '业态不能超过10个字', trigger: 'blur' }
        ],
        demandArea: [
          { required: true, message: '请输入需求面积', trigger: 'blur' },
          { max: 999, message: '面积不能超过999', trigger: 'blur' },
          {type: 'number', message: '只能输入数字', trigger: 'blur'}
        ],
        demandAddress: [
          { required: true, message: '请输入需求地址', trigger: 'blur' },
          { max: 50, message: '地址不能超过50个字', trigger: 'blur' }
        ],
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { max: 10, message: '品牌名称不能超过10个字', trigger: 'blur' }
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
        brandName: ''
      },
      editType: 'edit'
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
    this.getStaff(1)
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
          GTE_demandArea: this.staffFrom.areaLarge,
          LTE_demandArea: this.staffFrom.areaSmall,
          LIKE_format: this.staffFrom.format,
          LIKE_name: this.staffFrom.name
        }).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.staffData = res.data.data.content
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
        this.updataStaff();
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
    },
    exportExcel() {
        const elink = document.createElement('a')
        elink.download = '客户列表'
        elink.style.display = 'none'
        elink.href = 'http://47.108.133.94:8080/api/backend/customer/exportCustomer.json';
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
    }
  }
}
</script>

<style lang="less" scoped>
.cas-content {
    display: flex;
    flex-wrap: wrap;
    div {
        margin:0 40px 15px 0;
    }
}
</style>
