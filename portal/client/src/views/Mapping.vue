<template>
<el-container>
  <el-header>MicroService</el-header>
  <el-main>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="Mapping">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-main>
  <el-footer>IBM@2018</el-footer>
</el-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<script>
export default {
  name: 'Mapping',
  data () {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
    onSubmit() {
      let _v = this
      _v.$alert(_v.form.name)
    }
  }
}
</script>
