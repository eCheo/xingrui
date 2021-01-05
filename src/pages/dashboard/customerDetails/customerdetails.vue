<template>
  <div class="analysis" style="margin-bottom:20px;">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col>
        <div class="cus-top">
            <div class="cus-box">
                <div>
                    <span>客户名称：{{cusInfo.name}}</span>
                </div>
                <div>
                    <span>性别：{{cusInfo.sex.message || '--'}}</span>
                </div>
                <div>
                    <span>录入人：{{cusInfo.memberName || '--'}}</span>
                </div>
                <div>
                    <span>录入时间：{{cusInfo.addDate || '--'}}</span>
                </div>
                <div>
                    <span>品牌名称：{{cusInfo.brandName || '--'}}</span>
                </div>
                <div>
                    <span>业态：{{cusInfo.format || '--'}}</span>
                </div>
                <div>
                    <span>需求面积：{{(cusInfo.demandArea ? cusInfo.demandArea + 'm²' : '--') +'~'+ (cusInfo.deadAreaEnd ? cusInfo.deadAreaEnd +'m²' : '--')}}</span>
                </div>
                <div>
                    <span>需求区域：{{(cusInfo.areaName || '--') +''+ (cusInfo.streetName || '--')}}</span>
                </div>
                <div style="width: 48%;">
                    <span>备注：{{cusInfo.demandAddress || '--'}}</span>
                </div>
            </div>
            <div>
                <span >电话号码：{{cusInfo.isViewPhone ? cusInfo.hidPhone : cusInfo.phone}}</span>
                <a-button style="margin-left:15px;" v-if="cusInfo.isViewPhone" type='primary' @click="viewPhone">查看电话号码</a-button>
            </div>
            <div style="margin-top: 10px;" v-if="auth">
              <span>备注：</span>
              <a-input v-model="remarks" style="width:80%;margin-right:10px;"></a-input>
              <a-button type='primary' @click='addRecord'>添加</a-button>
            </div>
        </div>
      </a-col>
      <a-col>
        <div style="background:#fff;padding:20px 12px;">
          <a-table :pagination='pagination' :loading='tabLoading' :columns="staffList" :data-source="track">
          </a-table>
        </div>
      </a-col>
    </a-row>
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
      staffFrom: {
        page: '1',
        name: '',
        pageSize: 10
      },
      cusInfo: {
         sex:{}
      },
      staffList: [
        {
          title: '跟进人',
          dataIndex: 'name',
          key: 'name',
          width: 150
        },
        {
          title: '跟进时间',
          dataIndex: 'followUpDate',
          key: 'followUpDate',
          width: 200
        },
        {
          title: '跟进记录',
          dataIndex: 'remarks',
          key: 'remarks'
        }
      ],
      staffData: [],
      pagination: {
        defaultPageSize: 10,
        showSizeChanger: true,
        total: 0,
        showQuickJumper: true,
        showTotal: total => `共${total}条数据`,
        pageSizeOptions: ['10', '20', '30', '40'],
        onShowSizeChange: (current, pageSize) => this.getTrackInfo(current, pageSize),
        onChange: (current, pageSize) => this.getTrackInfo(current, pageSize)
      },
      track: [],
      remarks: ''
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
    this.getStaff()
    this.getTrackInfo(1)
  },
  methods: {
    getStaff() {
      request('/api/backend/customer/findById.json', METHOD.GET,
        {
          id: sessionStorage.getItem('cusId')
        }).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            let reg = /^(\d{3})\d{4}(\d{4})$/
            this.cusInfo = res.data.data
            this.cusInfo.hidPhone = this.cusInfo.phone.replace(reg, '$1****$2')
            this.tabLoading = false
          } else {
            this.$message.error(res.data.message)
            this.tabLoading = false
          }
        })
    },
    getTrackInfo(page, pageSize) {
      this.tabLoading = true
      this.staffFrom.page = page
      this.staffFrom.pageSize = pageSize || 10
      request('/api/backend/customer/findFollowUpRecord.json', METHOD.GET,
        {
          EQ_customerId: sessionStorage.getItem('cusId'),
          page: this.staffFrom.page,
          size: this.staffFrom.pageSize,
          sort:"followUpDate,desc"
        }).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.track = res.data.data.content
            this.pagination.total = res.data.data.totalElements
            this.tabLoading = false
          } else {
            this.$message.error(res.data.message)
            this.tabLoading = false
          }
        })
    },
    addRecord() {
      request('/api/backend/customer/createRecord.json', METHOD.POST, {
        customerId: sessionStorage.getItem('cusId'),
        remarks: this.remarks
      }).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$message.success('添加跟踪信息成功');
          this.remarks = ''
          this.getTrackInfo(1)
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    viewPhone() {
      request('/api/backend/customer/viewPhone.json', METHOD.POST, {
        id: sessionStorage.getItem('cusId')
      }).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.getStaff();
        }
      })
    }
  },
  computed: {
    auth() {
      return this.$store.state.account.userInfo.memberType === 'front'
    }
  },
  watch: {
      $route: {
        handler() {
          this.getStaff()
          this.getTrackInfo(1)
        }
      }
  }
}
</script>

<style lang="less" scoped>
.cus-top {
    background:#fff;
    padding:12px;
    .cus-box {
        display: flex;
        flex-wrap: wrap;
        div {
            width: 25%;
            margin-bottom: 15px;
        }
    }
}
</style>
