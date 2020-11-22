<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{systemName}}</span>
      </div>
    </div>
    <div class="login">
      <a-form-model ref="ruleForm"
        :model="form"
        :rules="rules">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
            <a-form-model-item ref="account" prop="account">
              <a-input
                autocomplete="autocomplete"
                size="large"
                v-model="form.account"
                @blur="
                  () => {
                    $refs.account.onFieldBlur();
                  }
                "
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item ref="password" prop="password">
              <a-input
                size="large"
                autocomplete="autocomplete"
                type="password"
                v-model="form.password"
                @blur="
                  () => {
                    $refs.password.onFieldBlur();
                  }
                "
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-button @click="onSubmit" :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form-model>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import {login} from '@/services/user'
import {setAuthorization} from '@/utils/request'
// import {loadRoutes} from '@/utils/routerUtil'
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      logging: false,
      error: '',
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账户名', trigger: 'blur', whitespace: true}
        ],
        password: [
          { required: true,  message: '请输入密码', trigger: 'blur', whitespace: true}
        ]
      }
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.logging = true
          const name = this.form.account
          const password = this.form.password
          login(name, password).then(res => {
            if (res.status === 200 && res.data.code === '200') {
              this.afterLogin(res);
              sessionStorage.setItem('token', res.data.data.accessToken)
              sessionStorage.setItem('tokenType', 'bearer')
            } else {
              this.$message.error(res.data.message, 3);
              this.logging = false;
            }
          })
        }
      })
    },
    afterLogin(res) {
      this.logging = false
      const loginRes = res.data
        this.setUser(loginRes)
        this.setPermissions([{id: 'queryForm', operation: ['add', 'edit']}])
        this.setRoles([{id: 'admin', operation: ['add', 'edit', 'delete']}])
        setAuthorization({token: loginRes.data.accessToken})
        // 获取路由配置
        this.$store.dispatch('account/getUserInfo').then(user => {
          if (user.data.memberType === 'front') {
            this.$router.push('/mycustomer')
          } else {
            this.$router.push('/workplace')
          }
        })
        this.$message.success('登录成功', 3)
    }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
