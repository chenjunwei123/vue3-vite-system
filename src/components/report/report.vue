<template>
<div class="report_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
  <el-breadcrumb-item>数据报表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div id="main" style="width: 600px;height:400px;"></div>
</el-card>
</div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
import {toRefs,reactive, getCurrentInstance,onMounted} from 'vue'
export default {
  setup () {
    const {proxy} = getCurrentInstance()
    const state = reactive({
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    })
    onMounted(async()=>{
      var myChart = echarts.init(document.getElementById('main'))
      const res = await proxy.$http.get('reports/type/1')
     proxy.$msg(res)
      // 使用刚指定的配置项和数据显示图表。
      const result = _.merge(res.data, state.options)
      myChart.setOption(result)
    })
    return {
      ...toRefs(state)
    }
  },
}
</script>

<style scoped lang='less'>
</style>
