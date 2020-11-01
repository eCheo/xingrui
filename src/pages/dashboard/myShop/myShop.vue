<template>
  <div class="analysis" style="margin-bottom:20px;">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col >
        <div class="cas-content" style="background:#fff;padding:12px 107px;">
            <div>
                <span>业主名称：</span>
                <a-input v-model="staffFrom.LIKE_name" style="width:300px;" placeholder="请输入业主名称" />
            </div>
            <div>
                <span>付款方式：</span>
                <a-input v-model="staffFrom.EQ_paymentMethod" style="width:300px;" placeholder="付款方式" />
            </div>
            <div>
                <span>是否已租：</span>
                <a-select v-model="staffFrom.EQ_isRent" style="width:300px;">
                  <a-select-option :value="item.value" v-for="(item, index) in isRentList" :key="index">
                    {{item.label}}
                  </a-select-option>
                </a-select>
            </div>
            <div>
                <span>区域位置：</span>
                <a-input v-model="staffFrom.LIKE_area" style="width:300px;" placeholder="请输入区域位置" />
            </div>
            <div>
               <span>面积：</span>
                <a-input v-model="staffFrom.GTE_areaSize" style="width:150px;" />
                <span>~</span>
                <a-input v-model="staffFrom.LTE_areaSize" style="width:150px;" />
            </div>
            <div>
                <span>租金：</span>
                <a-input v-model="staffFrom.GTE_money" style="width:150px;" />
                <span>~</span>
                <a-input v-model="staffFrom.LTE_money" style="width:150px;" />
                <a-button @click="getStaff(1)" type="primary" style="margin-left: 15px;">
                    查询
                </a-button>
                <a-button @click="$router.push('/addshop')" type="primary" style="margin-left: 15px;">
                    添加店铺
                </a-button>
            </div>
        </div>
      </a-col>
      <a-col>
        <div style="background:#fff;padding:20px 12px;">
          <a-table :pagination='pagination' :loading='tabLoading' :columns="staffList" :data-source="staffData">
              <span slot="age" slot-scope="text, record">{{record.sex.message}}</span>
              <span slot="isRent" slot-scope="isRent">{{isRent ? '是': '否'}}</span>
              <span slot="areaSize" slot-scope="text">{{text+' m²'}}</span>
              <span slot="buildingHeight" slot-scope="text, record">{{record.buildingHeight+'/'+record.floorHeight}}</span>
              <span slot="deepening" slot-scope="text">{{text+ '米'}}</span>
              <span slot="action" slot-scope="text, record">
                  <a @click="goDetails(record)">详情</a>
                  <a-divider type="vertical" />
                  <a @click="setIsRent(record)">设为{{record.isRent ? '未租' : '已租'}}</a>
              </span>
          </a-table>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model="editModal" :title="editType === 'edit' ? '编辑': '添加'" :width='550'>
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
        layout='inline'
        labelAlign='left'
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="业主名称" prop="name">
          <a-input
            style="width:150px;"
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
          style="width:150px;"
            v-model="form.phone"
            @blur="
              () => {
                $refs.phone.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="sex">
            <a-radio-group v-model="form.sex" style="width:150px;">
              <a-radio value="Man">
                男
              </a-radio>
              <a-radio value="WoMan">
                女
              </a-radio>
            </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="areaSize" label="面积" prop="areaSize">
          <a-input
            v-model="form.areaSize"
            style="width:150px;"
            @blur="
              () => {
                $refs.areaSize.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="floorHeight" label="楼层" prop="floorHeight">
          <a-input
            v-model="form.floorHeight"
            style="width:150px;"
            @blur="
              () => {
                $refs.floorHeight.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="buildingHeight" label="层高" prop="buildingHeight">
          <a-input
            v-model="form.buildingHeight"
            style="width:150px;"
            @blur="
              () => {
                $refs.buildingHeight.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="deepening" label="进深" prop="deepening">
          <a-input
            v-model="form.deepening"
            style="width:150px;"
            @blur="
              () => {
                $refs.deepening.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="openRoom" label="开间" prop="openRoom">
          <a-input
            v-model="form.openRoom"
            style="width:150px;"
            @blur="
              () => {
                $refs.openRoom.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="money" label="租金" prop="money">
          <a-input
            v-model="form.money"
            style="width:150px;"
            @blur="
              () => {
                $refs.money.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="paymentMethod" label="付款方式" prop="paymentMethod">
          <a-input
            v-model="form.paymentMethod"
            style="width:150px;"
            @blur="
              () => {
                $refs.paymentMethod.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="area" label="地址" prop="area">
          <a-textarea
            v-model="form.area"
            @blur="
              () => {
                $refs.area.onFieldBlur();
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
        LIKE_name: '',
        pageSize: 10,
        EQ_paymentMethod: '',
        LIKE_area: '',
        GTE_areaSize: '',
        LTE_areaSize: '',
        EQ_isRent: '',
        GTE_money: "",
        LTE_money: ""
      },
      staffList: [
        {
          title: '客户名称',
          dataIndex: 'name',
          key: 'name',
          width: 118
        },
        {
          title: '电话号码',
          dataIndex: 'phone',
          key: 'phone',
          width: 138
        },
        {
          title: '性别',
          dataIndex: 'age',
          key: 'age',
          scopedSlots: { customRender: 'age' },
          width: 80
        },
        {
          title: '面积大小',
          dataIndex: 'areaSize',
          key: 'areaSize',
          scopedSlots: { customRender: 'areaSize' }
        },
        {
          title: '楼层/层高',
          dataIndex: 'buildingHeight',
          key: 'buildingHeight',
          scopedSlots: { customRender: 'buildingHeight' }
        },
        {
          title: '进深',
          dataIndex: 'deepening',
          key: 'deepening',
          scopedSlots: { customRender: 'deepening' }
        },
        {
          title: '开间',
          dataIndex: 'openRoom',
          key: 'openRoom'
        },
        {
          title: '地址',
          dataIndex: 'area',
          key: 'area',
          width: 530
        },
        {
          title: '租金(元)',
          dataIndex: 'money',
          key: 'money',
          width: 100
        },
        {
          title: '付款方式',
          dataIndex: 'paymentMethod',
          key: 'paymentMethod'
        },
        {
          title: '是否已租',
          dataIndex: 'isRent',
          key: 'isRent',
          scopedSlots: { customRender: 'isRent' }
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
          { max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        sex: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        areaSize: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { max: 999, message: '地址不能超过999', trigger: 'blur' }
        ],
        buildingHeight: [
          { required: true, message: '请输入层高', trigger: 'blur' }
        ],
        floorHeight: [
          { required: true, message: '请输入楼高', trigger: 'blur' }
        ],
        deepening: [
          { required: true, message: '请输入进深', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入租金', trigger: 'blur' }
        ],
        openRoom: [
          { required: true, message: '请输入开间', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请输入付款方式', trigger: 'blur' }
        ]
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      form: {
        name: '',
        phone: '',
        sex: 'Man',
        areaSize: '',
        area: '',
        buildingHeight: '',
        floorHeight: '',
        deepening: '',
        money: '',
        openRoom: '',
        paymentMethod: ''
      },
      editType: 'edit',
      isRentList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '已租',
          value: 'true'
        },
        {
          label: '未租',
          value: 'false'
        }
      ]
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
      request('/api/backend/shop/findPageByCondition.json', METHOD.GET, this.staffFrom).then(res => {
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
        sessionStorage.setItem('shopid', data.id);
        this.$router.push('/myshopdetails')
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
      request('/api/backend/shop/create.json', METHOD.POST, this.form).then(res => {
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
      request('/api/backend/shop/update.json', METHOD.POST, this.form).then(res => {
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
    setIsRent(data) {
      const self = this;
      this.$confirm({
        title: '设置',
        content: `是否设置当前店铺为${data.isRent ? '未租': '已租'}`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          request('/api/backend/shop/rented.json', METHOD.POST, {id: data.id, isRent: !data.isRent}).then(res => {
            if(res.status === 200 && res.data.code === '200') {
              self.$message.success('设置成功')
              self.getStaff(self.staffFrom.page)
            } else {
              self.$message.error(res.data.message)
            }
          })
        }
      })
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
