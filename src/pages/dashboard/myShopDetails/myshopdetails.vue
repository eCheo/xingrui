
<template>
  <div class="cus-top" style="margin-bottom:20px;">
    <p>区域位置：{{form.area || '--'}}</p>
    <div class="cus-box">
      <div>
        <span>项目名称: {{form.name}}</span>
      </div>
      <div>
        <span>对接人: {{form.faceToFaceName}}</span>
      </div>
      <div>
        <span>佣金: {{form.commission}}</span>
      </div>
      <div>
        <span>合作时间: {{form.cooperationTime}}</span>
      </div>
      <div>
        <span>免租期: {{form.rentFreePeriodStart}} ~ {{form.rentFreePeriodEnd}}</span>
      </div>
      <!-- <div>
        <span>性别: {{form.sex}}</span>
      </div> -->
      <div>
        <span>电话号码: {{form.phone}}</span>
      </div>
      <div>
        <span>区域街道: {{(form.areaName || '--')+''+(form.streetName || '--')}}</span>
      </div>
      <div>
        <span>楼层: 第{{form.floorHeight}}层</span>
      </div>
      <div>
        <span>层高: {{form.buildingHeight}}米</span>
      </div>
      <div>
        <span>开间: {{form.openRoom}}米</span>
      </div>
      <div>
        <span>进深: {{form.deepening}}米</span>
      </div>
      <div>
        <span>面积大小: {{form.areaSize}}m²</span>
      </div>
      <div>
        <span>租金: {{form.money}}元</span>
      </div>
      <div>
        <span>付款方式: {{form.paymentMethod}}</span>
      </div>
      <div>
        <span>是否已租: {{!form.isRent ? '未租' : '已租'}}</span>
      </div>
      <div>
        <span>备注：{{form.remarks}}</span>
      </div>
    </div>
    <div class="cus-img">
      <p style="font-size:16px;color:#333;">铺源照片</p>
      <img v-for="(item, index) in form.imagePaths" :src="item" :key="index">
    </div>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  name: 'customer',
  data () {
    return {
      loading: true,
      butLoading: false,
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
        imagePaths: []
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
      this.form.id = this.shopid;
        this.$refs.ruleForm.validate(valid => {
        if (valid || this.form.imagePaths.length > 0) {
            this.butLoading = true;
            request('/api/backend/shop/update.json', METHOD.POST,
                this.form).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.butLoading = false
                    this.$message.success('修改成功')
                    this.$router.push('/shop')
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
          // this.form.sex = res.data.data.sex.message;
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
.cus-img {
  margin-top: 30px;
  img {
    width: 300px;
    height: 250px;
    margin:0 15px 10px 0;
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
