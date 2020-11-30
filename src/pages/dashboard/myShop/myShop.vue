<template>
  <div class="analysis" style="margin-bottom:20px;">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col >
        <div class="cas-content">
          <div class="cas-box">
            <div>
              <span>业主名称：</span>
              <a-input v-model="staffFrom.LIKE_name" style="width:75%;" placeholder="请输入业主名称" />
            </div>
            <div>
              <span>电话号码：</span>
              <a-input v-model="staffFrom.EQ_phone" style="width:75%;" placeholder="电话号码" />
            </div>
            <div>
              <span>是否已租：</span>
              <a-select v-model="staffFrom.EQ_isRent" style="width:75%;">
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in isRentList"
                  :key="index"
                >{{item.label}}</a-select-option>
              </a-select>
            </div>
            <div>
              <span>区域位置：</span>
                <a-cascader
                  style="width:75%;"
                  change-on-select
                  :options="options"
                  :show-search="{ filter }"
                  placeholder="请选择区域街道"
                  @change="onChange"
                />
            </div>
            <div>
              <span style="margin:0 1px 0 27px;">面积：</span>
              <a-input suffix="m²" v-model="staffFrom.GTE_areaSize" style="width:36%;" />
              <span>~</span>
              <a-input suffix="m²" v-model="staffFrom.LTE_areaSize" style="width:36%;" />
            </div>
            <div>
              <span style="margin:0 1px 0 27px;">租金：</span>
              <a-input suffix="元" v-model="staffFrom.GTE_money" style="width:36%;" />
              <span>~</span>
              <a-input suffix="元" v-model="staffFrom.LTE_money" style="width:36%;" />
            </div>
            <div style="width:97%;text-align:right;">
              <a-button @click="getStaff(1)" type="primary" style="margin-left: 15px;">查询</a-button>
              <a-button
                @click="$router.push('/addshop')"
                type="primary"
                style="margin-left: 15px;"
              >添加铺源</a-button>
            </div>
          </div>
        </div>
      </a-col>
      <a-col>
        <div style="background:#fff;padding:20px 12px;">
          <a-table  :pagination='pagination' :loading='tabLoading' :columns="staffList" :data-source="staffData">
              <span slot="age" slot-scope="text, record">{{record.sex.message}}</span>
              <span slot="isRent" slot-scope="isRent">{{isRent ? '是': '否'}}</span>
              <span slot="areaSize" slot-scope="text">{{text+' m²'}}</span>
              <span slot="buildingHeight" slot-scope="text, record">{{record.buildingHeight+'/'+record.floorHeight}}</span>
              <span slot="deepening" slot-scope="text">{{text+ '米'}}</span>
              <span slot="openRoom" slot-scope="text">{{text+ '米'}}</span>
              <span slot="areaName" slot-scope="text, record">{{record.areaName+ ' ' + record.streetName}}</span>
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
        <a-form-model-item ref="areaId" label="铺源区域" prop="areaId">
          <a-cascader
            :options="options"
            :show-search="{ filter }"
            placeholder="请选择区域街道"
            @change="onChange"
            @blur="
              () => {
                $refs.areaId.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="area" label="详细地址" prop="area">
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
const phoneValid = (rule, value, callback) => {
  let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
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
        LIKE_name: '',
        pageSize: 10,
        EQ_phone: '',
        LIKE_area: '',
        GTE_areaSize: '',
        LTE_areaSize: '',
        EQ_isRent: '',
        GTE_money: "",
        LTE_money: "",
        EQ_areaId: '',
        EQ_streetId: '',
        sort: 'addDate,desc'
      },
      staffList: [
        {
          title: '业主名称',
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
          width: 70
        },
        {
          title: '面积大小',
          dataIndex: 'areaSize',
          key: 'areaSize',
          width: 100,
          scopedSlots: { customRender: 'areaSize' }
        },
        {
          title: '区域街道',
          dataIndex: 'areaName',
          key: 'areaName',
          width: 160,
          scopedSlots: { customRender: 'areaName' }
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
          key: 'paymentMethod',
          width: 100
        },
        {
          title: '是否已租',
          dataIndex: 'isRent',
          key: 'isRent',
          width: 100,
          scopedSlots: { customRender: 'isRent' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      staffData: [],
      pagination: {
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        total: 0,
        showTotal: total => `共${total}条数据`,
        pageSizeOption: ['10', '20', '30', '40'],
        onShowSizeChange: (current, pageSize) => this.getStaff(current, pageSize),
        onChange: (current, pageSize) => this.getStaff(current, pageSize)
      },
      rules: {
        name: [
          { required: true, message: '请输入业主名称', trigger: 'blur' },
          { max: 5, message: '业主名称不能超过5个字', trigger: 'blur' }
        ],
        phone: [
         { required: true, validator:phoneValid, trigger: 'blur' }
        ],
        sex: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        areaSize: [
          { required: true, message: '请输入面积', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        area: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { max: 50, message: '地址不能超过50个字', trigger: 'blur' }
        ],
        buildingHeight: [
          { required: true, message: '请输入层高', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        floorHeight: [
          { required: true, message: '请输入楼高', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        deepening: [
          { required: true, message: '请输入进深', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        money: [
          { required: true, message: '请输入租金', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        openRoom: [
          { required: true, message: '请输入开间', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        paymentMethod: [
          { required: true, message: '请输入付款方式', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择区域街道', trigger: 'blur' }
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
        paymentMethod: '',
        areaId: '',
        streetId: ''
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
      ],
      options: []
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
      request('/api/backend/shop/findPageByCondition.json', METHOD.GET, this.staffFrom).then(res => {
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
        sessionStorage.setItem('shopid', data.id)
        this.$router.push('/myshopdetails')
    },
    changeStaff() {
      if (this.editType === 'edit') {
        this.updataStaff()
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
        content: `是否设置当前铺源为${data.isRent ? '未租': '已租'}`,
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
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    onChange(value) {
      this.staffFrom.EQ_areaId = value[0];
      this.staffFrom.EQ_streetId = value[1];
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
