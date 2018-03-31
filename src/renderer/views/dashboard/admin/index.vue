<template>
  <div class="dashboard-editor-container">
    <github-corner></github-corner>

    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <todo-list></todo-list>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <box-card></box-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  GCCCCGContributions: {
    expectedData: [5000, 6000, 8000, 16000, 18000, 20000, 20000],
    actualData: [0, 0, 0, 5342, 6253, 6824, 14181]
  },
  lsq210Contributions: {
    expectedData: [5000, 15000, 23000, 30000, 36000, 39000, 40000],
    actualData: [0, 0, 0, 5235, 12257, 25424, 51304]
  },
  HaoKunTContributions: {
    expectedData: [500, 1000, 1000, 1000, 2000, 2500, 3000],
    actualData: [0, 0, 0, 142, 523, 1103, 2927]
  },
  sleepyeverydayContributions: {
    expectedData: [10500, 22000, 32000, 47000, 56000, 61500, 63000],
    actualData: [0, 0, 0, 10719, 19033, 33351, 68412]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data () {
    return {
      lineChartData: lineChartData.GCCCCGContributions
    }
  },
  methods: {
    handleSetLineChartData (type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
