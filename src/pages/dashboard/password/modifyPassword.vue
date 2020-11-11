
<template>
  <div class="set-content">
    <a-card-grid style="margin:15px 15px 0 0;background-color:#fff;">
      <a-card :bordered="false" :body-style="{padding: 0}">
        <a-card-meta>
          <div slot="title" class="card-title">
            <span>修改密码</span>
          </div>
        </a-card-meta>
         <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
        >
            <a-form-model-item ref="oldPassWord" prop="oldPassWord" style="margin-bottom:0;">
              <a-input type='password' @blur="
                  () => {
                    $refs.oldPassWord.onFieldBlur();
                  }
                " v-model="form.oldPassWord" style="margin-top:15px;width:200px" placeholder="旧密码" />
            </a-form-model-item>
            <a-form-model-item ref="newPassWord" prop="newPassWord" style="margin-bottom:0;">
              <a-input type='password' @blur="
                  () => {
                    $refs.newPassWord.onFieldBlur();
                  }
                " v-model="form.newPassWord" style="display:block;margin-top:15px;width:200px" placeholder="新密码" />
            </a-form-model-item>
            <a-form-model-item ref="cifPassWord" prop="cifPassWord" style="margin-bottom:0;">
              <a-input type='password' @blur="
                  () => {
                    $refs.cifPassWord.onFieldBlur();
                  }
                " v-model="form.cifPassWord" style="display:block;margin-top:15px;width:200px" placeholder="确认密码" />
            </a-form-model-item>
          </a-form-model>
         <div style="margin-top:20px">
           <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="confirmPassword">
            <template slot="title">
              <p>确定修改密码？</p>
            </template>
            <a-button :disabled="form.newPassWord === '' || form.oldPassWord === '' || form.cifPassWord === ''" type='primary'>修改</a-button>
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
    const passwordValid = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入确认密码'))
      } else if (this.form.newPassWord !== value) {
        return callback(new Error('两次密码不一样'))
      } else {
        callback()
      }
    }
    return {
      form: {
        newPassWord: '',
        oldPassWord: '',
        cifPassWord: ''
      },
      rules: {
        oldPassWord: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassWord: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        cifPassWord: [
          { required: true, validator:passwordValid, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  created() {
  },
  methods: {
    confirmPassword() {
      request('api/backend/member/changePassword.json', METHOD.POST, this.form).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          this.$message.success('修改成功');
          this.$router.push('/login')
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
