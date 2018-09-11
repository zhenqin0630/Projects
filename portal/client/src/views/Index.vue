<template>
<el-container>
  <el-header>MicroService</el-header>
  <el-main>
    <el-row> <router-link :to="{name: 'Permission'}">permission</router-link> </el-row>
    <el-row> <router-link :to="{name: 'Resource'}">Resource</router-link> </el-row>
    <el-row> <router-link :to="{name: 'Demand'}">Demand</router-link> </el-row>
    <el-row> <router-link :to="{name: 'Mapping'}">Mapping</router-link> </el-row>
  </el-main>
  <el-footer>IBM@2018</el-footer>
</el-container>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-row {
    line-height: 30px;
  }
</style>
