
<template>
  <div class="set-content">
    <a-card-grid style="margin:15px 15px 0 0;background-color:#fff;">
      <a-card :bordered="false" :body-style="{padding: 0}">
        <a-card-meta>
          <div slot="title" class="card-title">
            <span>修改密码</span>
          </div>
        </a-card-meta>
         <a-input v-model="form.oldPassWord" style="margin-top:15px;width:200px" placeholder="旧密码" />
         <a-input v-model="form.newPassWord" style="display:block;margin-top:15px;width:200px" placeholder="新密码" />
         <div style="margin-top:20px">
           <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="confirm">
            <template slot="title">
              <p>确定修改密码？</p>
            </template>
            <a-button :disabled="form.newPassWord === '' || form.oldPassWord === ''" type='primary'>修改</a-button>
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
      form: {
        newPassWord: '',
        oldPassWord: ''
      }
    };
  },
  computed: {},
  created() {
  },
  methods: {
    confirm() {
      request('api/backend/customer/findBizConfig.json', METHOD.POST, this.form).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$message.success('修改成功');
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
