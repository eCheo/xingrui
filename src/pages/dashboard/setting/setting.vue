
<template>
  <div class="set-content">
    <a-card-grid style="margin:15px 15px 0 0;background-color:#fff;">
      <a-card :bordered="false" :body-style="{padding: 0}">
        <a-card-meta>
          <div slot="title" class="card-title">
            <span>共享池天数</span>
          </div>
        </a-card-meta>
         <a-input suffix='天' v-model="day" style="margin-top:15px;width:200px" placeholder="天数" />
         <div style="margin-top:20px">
           <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="confirm">
            <template slot="title">
              <p>确定修改进入共享池天数？</p>
            </template>
            <a-button :disabled="day === ''" type='primary'>修改</a-button>
          </a-popconfirm>
         </div>
      </a-card>
    </a-card-grid>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
export default {
  name: "setting",
  data() {
    return {
      day: ''
    };
  },
  computed: {},
  created() {
    this.getDay()
  },
  methods: {
    getDay() {
      request('api/backend/customer/findBizConfig.json', METHOD.GET).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.day = res.data.data.day;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    confirm() {
      request('api/backend/customer/findBizConfig.json', METHOD.POST, {
        day: this.day
      }).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$message.success('修改进入共享池天数成功');
          this.getDay();
        } else {
          this.$message.error(res.data.message);
        }
      })
    }
  }
};
</script>

<style lang="less">
.set-content {
  padding: 20px;
  margin-top: 20px;
}
</style>
