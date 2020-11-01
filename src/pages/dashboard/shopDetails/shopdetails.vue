
<template>
  <div class="cus-top" style="margin-bottom:20px;">
      <a-form-model
        style="width:700px"
        ref="ruleForm"
        :model="form"
        :rules="rules"
        labelAlign='right'
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
      <p>业主信息</p>
        <a-form-model-item ref="name" label="业主名称" prop="name">
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
        <p>店铺信息</p>
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
            prefix="共"
            suffix="层"
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
            @blur="
              () => {
                $refs.openRoom.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="isRent" label="是否已租" prop="isRent">
          <a-radio-group v-model="form.isRent">
            <a-radio :value="true">
              已租
            </a-radio>
            <a-radio :value="false">
              未租
            </a-radio>
          </a-radio-group>
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
      </a-form-model>
      <p>店铺照片</p>
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
        <a-button type="primary" :loading="butLoading" @click="updateShop">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
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
  components: {FooterToolBar},
  data () {
    return {
      loading: true,
      butLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入员工名称', trigger: 'blur' },
          { max: 5, message: '员工名称不能超过5个字', trigger: 'blur' },
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
        ]
      },
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
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
        imagePaths: [],
        isRent: false
      },
      previewVisible: false,
      previewImage: '',
      fileList: [            
      ],
      headers: {},
      shopid: sessionStorage.getItem('shopid')
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
    this.headers = {
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("token")
    };
    this.getShopDetails()
  },
  methods: {
    updateShop() {
      this.form.id = sessionStorage.getItem('shopid');
        this.$refs.ruleForm.validate(valid => {
        if (valid || this.form.imagePaths.length > 0) {
            this.butLoading = true;
            request('/api/backend/shop/update.json', METHOD.POST,
                this.form).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.butLoading = false
                    this.$message.success('修改成功');
                    this.$router.push('/shop');
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
          } else {
            this.fileList.forEach(item => {
              this.form.imagePaths.push(item.url)
            })
          }
      } else {
        this.form.imagePaths = []
      }
    },
    getShopDetails() {
      request('/api/backend/shop/findById.json', METHOD.GET, {
        id: sessionStorage.getItem('shopid')
      }).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.form = res.data.data;
          this.form.sex = res.data.data.sex.name;
          let obj = {}
          this.form.imagePaths.forEach((item, index) => {
            obj.status = 'done'
            obj.name = '22.png'
            obj.url = item
            obj.uid = '-'+index
            this.fileList.push(obj)
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  watch: {
    $route: {
      handler() {
        this.getShopDetails()
      }
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
