<template>
  <div class="analysis" style="margin-bottom:20px;">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col >
        <div style="background:#fff;padding:12px;">
          <span>员工名称：</span>
          <a-input v-model="staffFrom.name" style="width:300px;" placeholder="请输入员工名称/电话" />
          <a-button @click="getStaff(1)" type="primary" style="margin: 15px;">
            查询
          </a-button>
          <a-button type="primary" @click="claerStaffInfo">
            新建员工
          </a-button>
        </div>
      </a-col>
      <a-col>
        <div style="background:#fff;padding:20px 12px;">
          <a-table :pagination='pagination' :loading='tabLoading' :columns="staffList" :data-source="staffData">
            <span slot="type" slot-scope="type">{{type ==='front' ? '员工' : '管理员'}}</span>
            <span slot="age" slot-scope="text, record">{{record.sex.message}}</span>
            <span slot="action" slot-scope="text, record">
              <a @click="setStaffInfo(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否删除该员工?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteStaff(record)"
              >
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
        <a-form-model-item ref="name" label="员工名称" prop="name">
          <a-input
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="phone" label="手机号" prop="phone">
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
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
export default {
  name: 'Analysis',
  i18n: require('./i18n'),
  data () {
    return {
      loading: true,
      tabLoading: false,
      editLoading: false,
      editModal: false,
      staffFrom: {
        page: '1',
        name: '',
        pageSize: 10
      },
      staffList: [
        {
          title: '员工名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '电话',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '录入店铺数',
          dataIndex: 'inputShopNumber',
          key: 'inputShopNumber'
        },
        {
          title: '录入客户数',
          dataIndex: 'inputCustomerNumber',
          key: 'inputCustomerNumber'
        },
        {
          title: '性别',
          dataIndex: 'age',
          key: 'age',
          scopedSlots: { customRender: 'age' }
        },
        {
          title: '角色',
          dataIndex: 'memberType',
          key: 'memberType',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
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
          { max: 11, message: '请输入正确的手机号', trigger: 'blur' }
          ],
        sex: [{ required: true, message: 'Please pick a date', trigger: 'change' }]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        phone: '',
        sex: 'Man'
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
      let reg = /^[0-9]$/
      request('/api/backend/member/findByCondition.json', METHOD.GET,
        {
          size: this.staffFrom.pageSize,
          page: this.staffFrom.page,
          LIKE_name: reg.test(this.staffFrom.name) ? '': this.staffFrom.name,
          LIKE_phone: reg.test(this.staffFrom.name) ? this.staffFrom.name : '',
          NEQ_memberType: 'admin'
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
    changeStaff() {
      if (this.editType === 'edit') {
        this.updataStaff();
      } else {
        this.createStaff()
      }
    },
    createStaff() {
      this.editLoading = true
      request('/api/backend/member/create.json', METHOD.POST, this.form).then(res => {
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
    },
    updataStaff() {
      this.editLoading = true
      request('/api/backend/member/update.json', METHOD.POST, this.form).then(res => {
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
    },
    deleteStaff(data) {
      request('/api/backend/member/delete.json', METHOD.POST, {id: data.id}).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.$message.success('删除成功')
            this.getStaff(1)
          } else {
            this.$message.error(res.data.message)
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
      this.form.id = data.id
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrap{
    .extra-item{
      display: inline-block;
      margin-right: 24px;
      a:not(:first-child){
        margin-left: 24px;
      }
    }
  }
  @media screen and (max-width: 992px){
    .extra-wrap .extra-item{
      display: none;
    }
  }
  @media screen and (max-width: 576px){
    .extra-wrap{
      display: none;
    }
  }

</style>
