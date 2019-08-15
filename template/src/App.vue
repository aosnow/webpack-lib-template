<template>
  <div id="app">
    <el-page-header title="返回" content="测试"></el-page-header>

    <el-form>
      <switch-group>
        <el-input v-model="value"></el-input>
        <el-alert title="取值：" type="info" :description="repeatValue"></el-alert>
      </switch-group>
    </el-form>

  </div>
</template>

<script>
import { repeat, trim, SwitchGroup } from '{{#if namespace}}{{namespace}}/{{/if}}{{ name }}';

export default {
  name: 'app',
  mixins: [],
  components: { SwitchGroup },
  data() {
    return {
      value: ''
    };
  },
  computed: {
    repeatValue() {
      return repeat(trim(this.value), 3);
    }
  }
};
</script>

<style>
#app{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 50px;
}

.el-form{
  width: 50%;
  min-width: 200px;
  max-width: 500px;
}
</style>
