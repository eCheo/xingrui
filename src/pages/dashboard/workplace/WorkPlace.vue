<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <p>你好~ {{staffName}}</p>
    </div>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding:0 12px 12px 12px;margin-bottom:20px;background:#fff;" >
          <a-tabs>
            <a-tab-pane key="1" tab="销售排行榜">
              <a-card-grid style="width:25%;margin-right: 60px;margin-bottom: 10px;" v-for="(item,index) in projects" :key="index">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <p class="ran-title">{{item.title}}</p>
                    </div>
                  </a-card-meta>
                  <div class="project-item" v-for="(it,index) in item.list" :key="index">
                    <div class="ran-caid" :class="index < 2 ? '' : 'ran-caid-last'">{{index+1}}</div>
                    <div class="ran-name">{{it.memberName}} <span style="color:#f5222d;" v-if="it.isDelete">已删除</span></div>
                    <div>{{it.count}}</div>
                  </div>
                  <div v-if="item.list.length === 0">
                    暂无数据
                  </div>
                </a-card>
              </a-card-grid>
            </a-tab-pane>
            <div slot="tabBarExtraContent">
              <a-radio-group default-value="1" v-model="day" button-style="solid" style="margin-right:15px;">
                <a-radio-button value="1">
                  今日
                </a-radio-button>
                <a-radio-button value="2">
                  本周
                </a-radio-button>
                <a-radio-button value="3">
                  本月
                </a-radio-button>
                <a-radio-button value="4">
                  全年
                </a-radio-button>
              </a-radio-group>
             <a-range-picker @change='timeChange' />
            </div>
          </a-tabs>
        </a-col>
        <a-col style="padding: 0 12px" >
          <a-card class="project-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" title="总览" :body-style="{padding: 15}">
            <div>
              <a-card-grid :key="i" v-for="(item, i) in mbarList" style="margin:15px 15px 0 0;">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta :description="item.desc">
                    <div slot="title" class="card-title">
                      <span>{{item.title}}</span>
                    </div>
                  </a-card-meta>
                  <chart-card :loading="loading" :total="item.num">
                    <a-tooltip :title="$t('introduce')" slot="action">
                      <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div>
                      <mini-area />
                    </div>
                    <!-- <div slot="footer">{{$ta('daily|visits', 'p')}}<span> 123,4</span></div> -->
                  </chart-card>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import ChartCard from '../../../components/card/ChartCard'
import MiniArea from '../../../components/chart/MiniArea'
// import MiniBar from '../../../components/chart/MiniBar'
import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import routers from '../../../router/config'
import store from '@/store'
export default {
  name: 'WorkPlace',
  components: {PageLayout, ChartCard, MiniArea},
  // i18n: require('./i18n'),
  data () {
    return {
      projects: [
        {
          title: '客户录入排行榜',
          list: [
            {
              name: '员工1',
              num: 200
            },
            {
              name: '员工1',
              num: 200
            },
            {
              name: '员工1',
              num: 200
            },
            {
              name: '员工1',
              num: 200
            }
          ]
        },
        {
          title: '店铺录入排行榜',
          list: [
            {
              name: '员工1',
              num: 200
            },
            {
              name: '员工1',
              num: 200
            },
            {
              name: '员工1',
              num: 200
            },
            {
              name: '员工1',
              num: 200
            }
          ]
        }
      ],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      },
      day: '1',
      startTime: '',
      endTime: '',
      mbarList: [
        {
          title: '录入店铺数',
          num: 0
        },
        {
          title: '录入客户数',
          num: 0
        },
        {
          title: '员工数',
          num: 0
        },
        {
          title: '总录入店铺数',
          num: 0
        },
        {
          title: '总录入客户数',
          num: 0
        },
        {
          title: '总员工数',
          num: 0
        }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch('account/getUserInfo').then(user => {
    routers.routes.forEach(item => {
      if (item.children) {
        item.children.forEach(it => {
          if (it.name !== '首页' || it.name !== '编辑店铺' || it.name !== '新增店铺' || it.name !== '客户详情' || it.name !== '修改密码' || it.name !== '店铺详情') {
            if (user.data.memberType === 'front' && (it.name === '共享池' || it.name === '店铺' || it.name === '我的客户')) {
              it.meta.invisible = false
            } else if(user.data.memberType === 'admin' && (it.name === '员工管理' || it.name === '客户管理' || it.name === '店铺管理' || it.name === '设置')) {
              it.meta.invisible = false
            } else if(user.data.memberType === 'backend' && (it.name === '员工管理' || it.name === '客户管理' || it.name === '店铺管理' || it.name === '设置')) {
              it.meta.invisible = false
            }  else {
              it.meta.invisible = true
            }
          }
        })
      }
    });
    next()
  })
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang']),
    staffName() {
      return this.$store.state.account.userInfo.name
    }
  },
  created() {
     setTimeout(() => this.loading = !this.loading, 1000)
     this.getRankTotal();
  },
  methods: {
    getRanking() {
      request('/api/backend/customer/indexStatistics.json', METHOD.GET, {
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.projects[0].list = res.data.data.customer
            this.projects[1].list = res.data.data.shop
            this.mbarList[0].num = res.data.data.shopCountStatistics
            this.mbarList[1].num = res.data.data.customerCountStatistics
            this.mbarList[2].num = res.data.data.memberCountStatistics
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    getRankTotal() {
      request('/api/backend/customer/indexTotal.json', METHOD.GET, {
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.mbarList[3].num = res.data.data.shopCount
            this.mbarList[4].num = res.data.data.customerCount
            this.mbarList[5].num = res.data.data.memberCount
          } else {
            this.$message.error(res.data.message)
          }
        })
    },
    timeChange(date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      if (dateString[0] !== '') {
        this.getRanking();
      }
    }
  },
  watch: {
    day:{
      handler() {
        request('/api/backend/customer/indexStatistics.json', METHOD.GET, {
          dateType: this.day
        }).then(res => {
            if (res.status === 200 && res.data.code === '200') {
              this.projects[0].list = res.data.data.customer
              this.projects[1].list = res.data.data.shop
              this.mbarList[0].num = res.data.data.shopCountStatistics
              this.mbarList[1].num = res.data.data.customerCountStatistics
              this.mbarList[2].num = res.data.data.memberCountStatistics
            } else {
              this.$message.error(res.data.message)
            }
          })
      }, immediate: true
    },
    watch: {
      $route: {
        handler() {
          this.getRankTotal()
        }
      }
  }
  }
}
</script>

<style lang="less">
@import "index";
.ranking {
  display: flex;
  justify-content: space-between;
  width: 100%;
  // .ran
}
.project-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .ran-caid {
    width: 17px;
    height: 17px;
    background-color: rgb(49, 70, 89);
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 15px;
    margin-top: 3px;
  }
  .ran-name {
    width: 79%;
  }
  .project-item:last-child {
    margin-bottom: 0;
  }
  .ran-caid-last {
    background-color: rgb(240, 242, 245);
    color: #666;
  }
}
.ant-card-grid {
  width: 25%;
}
</style>
