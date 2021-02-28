
<template>
  <div class="cus-top" style="margin-bottom:20px;">
      <a-form-model
        style="width:466px"
        ref="ruleForm"
        :model="form"
        :rules="rules"
        labelAlign='right'
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
      <p>项目信息</p>
        <a-form-model-item ref="name" label="项目名称" prop="name">
          <a-input
            style="width:150px"
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="faceToFaceName" label="对接人" prop="faceToFaceName">
          <a-input
            style="width:150px"
            v-model="form.faceToFaceName"
            @blur="
              () => {
                $refs.faceToFaceName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="commission" label="佣金" prop="commission">
          <a-input
            style="width:150px"
            suffix="元"
            v-model="form.commission"
            @blur="
              () => {
                $refs.commission.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="cooperationTime" label="合作时间" prop="cooperationTime">
          <a-date-picker :locale="locale"  v-model="form.cooperationTime" placeholder="选择合作时间" @blur="
              () => {
                $refs.cooperationTime.onFieldBlur();
              }
            " @change="cooperationChange" />
        </a-form-model-item>
        <a-form-model-item class="de-left" style="display:inline-block;" ref="rentFreePeriodStart" label="免租期" prop="rentFreePeriodStart">
           <!-- <a-month-picker v-model="form.rentFreePeriodStart"
           :locale="locale"
            @blur="
              () => {
                $refs.rentFreePeriodStart.onFieldBlur();
              }
            " @change="rentStartChange"/> -->
            <a-input
              v-model="form.rentFreePeriodStart"
              @blur="
                () => {
                  $refs.rentFreePeriodStart.onFieldBlur();
                }
              "
            />
        </a-form-model-item>
        <span class="de-center">~</span>
        <a-form-model-item class="de-right" ref="rentFreePeriodEnd" style="display:inline-block;" prop="rentFreePeriodEnd">
          <!-- <a-month-picker v-model="form.rentFreePeriodEnd"
           :locale="locale"
            @blur="
              () => {
                $refs.rentFreePeriodEnd.onFieldBlur();
              }
            " @change="rentEndChange"/> -->
            <a-input
              style="width:79%"
              v-model="form.rentFreePeriodEnd"
              @blur="
                () => {
                  $refs.rentFreePeriodEnd.onFieldBlur();
                }
              "
            />
            月
        </a-form-model-item>
        <a-form-model-item ref="phone" label="电话" prop="phone">
          <a-input
            style="width:150px"
            v-model="form.phone"
            @blur="
              () => {
                $refs.phone.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <!-- <a-form-model-item label="性别" prop="sex">
            <a-radio-group v-model="form.sex">
              <a-radio value="Man">
                男
              </a-radio>
              <a-radio value="WoMan">
                女
              </a-radio>
            </a-radio-group>
        </a-form-model-item> -->
        <p>铺源信息</p>
        <a-form-model-item ref="areaSize" label="面积" prop="areaSize">
          <a-input
            style="width:150px"
            suffix="m²"
            v-model="form.areaSize"
            @blur="
              () => {
                $refs.areaSize.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="floorHeight" label="楼层" prop="floorHeight">
          <a-input
            style="width:150px"
            prefix="第"
            suffix="层"
            v-model="form.floorHeight"
            @blur="
              () => {
                $refs.floorHeight.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="buildingHeight" label="层高" prop="buildingHeight">
          <a-input
            style="width:150px"
            suffix="米"
            v-model="form.buildingHeight"
            @blur="
              () => {
                $refs.buildingHeight.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="deepening" label="进深" prop="deepening">
          <a-input-number
            style="width:150px"
            :formatter="value => `${value}米`"
            :parser="value => value.replace('米', '')"
            v-model="form.deepening"
            :min='1'
            @blur="
              () => {
                $refs.deepening.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="openRoom" label="开间" prop="openRoom">
          <a-input-number
            :formatter="value => `${value}米`"
            :parser="value => value.replace('米', '')"
            style="width:150px"
            v-model="form.openRoom"
            :min='1'
            @blur="
              () => {
                $refs.openRoom.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="areaId" label="铺源区域" prop="areaId">
          <a-cascader
            :options="options"
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
        <p>租金信息</p>
        <a-form-model-item ref="money" label="租金" prop="money">
          <a-input
            suffix="元"
            style="width:150px"
            v-model="form.money"
            @blur="
              () => {
                $refs.money.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="paymentMethod" label="付款方式" prop="paymentMethod">
          <a-input
          style="width:150px"
            v-model="form.paymentMethod"
            @blur="
              () => {
                $refs.paymentMethod.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="remarks" label="备注" prop="remarks">
          <a-textarea
            v-model="form.remarks"
            @blur="
              () => {
                $refs.remarks.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
      <p>铺源照片</p>
      <a-upload
        action="http://47.108.133.94:8080/api/obs/upload.json"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
        :headers='headers'
        >
        <div v-if="fileList.length < 9">
            <a-icon type="plus" />
            <div class="ant-upload-text">
            上传照片
            </div>
        </div>
        </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
      <footer-tool-bar>
        <a-button style="margin-right:10px" type="text" @click="$router.push('/shop')">取消</a-button>
        <a-button type="primary" :loading="butLoading" @click="createShop">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import FooterToolBar from '@/components/tool/FooterToolBar'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
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
  components: {FooterToolBar},
  data () {
    return {
      loading: true,
      locale,
      moment,
      butLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { max: 15, message: '项目名称不能超过15个字', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator:phoneValid, trigger: 'blur' }
        ],
        // sex: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        areaSize: [
          { required: true, message: '请输入面积', trigger: 'blur' }
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
        ],
        remarks: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { max: 100, message: '备注不能超过100个字', trigger: 'blur' }
        ],
        faceToFaceName: [
          { required: true, message: '请输入对接人姓名', trigger: 'blur' }
        ],
        commission: [
          { required: true, message: '请输入佣金', trigger: 'blur' },
          {type: 'number', message: '只能输入数字',transform: (value) => {return Number(value)}, trigger: 'blur'}
        ],
        cooperationTime: [
          { required: true, message: '请选择合作时间', trigger: 'change' }
        ],
        rentFreePeriodStart: [
          { required: true, message: '请输入免租期开始月份', trigger: 'blur' }
        ],
        rentFreePeriodEnd: [
          { required: true, message: '请输入免租期结束月份', trigger: 'blur' }
        ]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        phone: '',
        // sex: 'Man',
        areaSize: '',
        area: '',
        buildingHeight: '',
        floorHeight: '',
        deepening: '',
        money: '',
        openRoom: '',
        paymentMethod: '',
        imagePaths: [],
        areaId: '',
        streetId: '',
        remarks: '',
        faceToFaceName: '',
        commission: '',
        cooperationTime: '',
        rentFreePeriodStart: null,
        rentFreePeriodEnd: null
      },
      previewVisible: false,
      previewImage: '',
      fileList: [            
      ],
      headers: {},
      options: [],
      areaDefaultList: []
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
    this.getAddress()
    this.headers = {
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("token")
    };
  },
  methods: {
    createShop() {
        this.$refs.ruleForm.validate(valid => {
        if (valid && this.form.imagePaths.length > 0) {
            this.butLoading = true;
            request('/api/backend/shop/create.json', METHOD.POST,
                this.form).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.butLoading = false
                    this.$message.success('添加成功');
                    if (this.memberType === 'front') {
                      this.$router.push('/myshop');
                    } else {
                      this.$router.push('/shop');
                    }
                } else {
                    this.$message.error(res.data.message)
                    this.butLoading = false
                }
            })
            }
        })
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
      this.form.imagePaths = [];
      if (fileList.length > 0) {
        let data = fileList[fileList.length -1].response || null
        if (data) {
            if (data.code === '200') {
                this.form.imagePaths.push(data.data.viewUrl)
            } else {
                this.$message.error(data.message)
            }
          }
      } else {
        this.form.imagePaths = []
      }
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    onChange(value) {
      this.form.areaId = value[0];
      this.form.streetId = value[1];
    },
    rentEndChange(date, dateString) {
      this.form.rentFreePeriodEnd = dateString;
    },
    rentStartChange(date, dateString) {
      this.form.rentFreePeriodStart = dateString;
    },
    cooperationChange(date, dateString) {
      this.form.cooperationTime = dateString;
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
    memberType() {
      return this.$store.state.account.userInfo.memberType
    }
  }
}
</script>

<style lang="less" scoped>
.cus-top {
    background:#fff;
    padding:20px;
    .cus-box {
        display: flex;
        flex-wrap: wrap;
        div {
            width: 25%;
            margin-bottom: 15px;
        }
    }
}
.bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: #fff;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
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
