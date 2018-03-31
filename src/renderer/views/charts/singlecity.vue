<template>
  <div class="chart-container">
    <div class="select-wrapper">
      <el-row type="flex" justify="end">
        <el-col :span="4" :offset="1">
          <el-select
          v-model="citySelectedValue"
          filterable
          :disabled="isCitySelectDisable"
           placeholder="选择城市">
            <el-option
            v-for="item in cityOptions"
            :key="item.id"
            :label="item.cityname"
            :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-date-picker
          v-model="dateSelectedValue"
          align="right"
          type="month"
          editable: false
          placeholder="选择时间"
          :disabled="isDatePickerDisable"/>
        </el-col>
      </el-row>
    </div>
     <div class="chart-wrapper">
      <calendar 
      id="calendar" 
      height='100%' 
      width='100%' 
      :cityId="citySelectedValue" 
      :year="yearSelected"
      :cityName="citySelectedName">
      </calendar>
    </div>
    <div class="chart-wrapper">
      <rose 
      id="rose" 
      height='100%' 
      width='100%'
      :cityId="citySelectedValue" 
      :year="yearSelected"
      :cityName="citySelectedName">
      </rose>
    </div>
    <div class="chart-wrapper" style="height: 100vh;">
      <radar 
      id="radar" 
      height='100%' 
      width='100%'
      :cityId="citySelectedValue" 
      :year="yearSelected"
      :cityName="citySelectedName"></radar>
    </div>
    <div class="chart-wrapper">
      <mixChart 
      id="mixChart" 
      height='100%' 
      width='100%'
      :cityId="citySelectedValue" 
      :year="yearSelected"
      :cityName="citySelectedName"></mixChart>
    </div>
    <div class="chart-wrapper">
      <scatterColor2 
      id="scatterColor2"
      height='100%'
      width='100%'
      :cityId="citySelectedValue" 
      :year="yearSelected"
      :cityName="citySelectedName"
      :month="monthSelected">
      </scatterColor2>
    </div>
  </div>
</template>

<script>
import mixChart from '@/components/Charts/singleCity/mixChart'
import radar from '@/components/Charts/singleCity/radar'
import calendar from '@/components/Charts/singleCity/calendar'
import scatterColor2 from '@/components/Charts/singleCity/scatterColor2'
import rose from '@/components/Charts/singleCity/rose'
import { getCitiesInfo } from '@/api/data/main'

export default {
  name: 'singleCity',
  data () {
    return {
      cityOptions: [],
      citySelectedValue: 299,
      dateSelectedValue: new Date(2017, 3, 2),
      citySelectedName: '武汉'
    }
  },
  mounted () {
    this.initCityData()
  },
  computed: {
    isCitySelectDisable: function () {
      return !(this.cityOptions.length > 0)
    },
    isDatePickerDisable: function () {
      return !(this.cityOptions.length > 0)
    },
    yearSelected: function () {
      return this.dateSelectedValue ? this.dateSelectedValue.getFullYear() : 2017
    },
    monthSelected: function () {
      return this.dateSelectedValue ? this.dateSelectedValue.getMonth() + 1 : 1
    }
  },
  watch: {
    citySelectedValue: function () {
      for (var i = 0; i < this.cityOptions.length; i++) {
        if (this.cityOptions[i].id == this.citySelectedValue) { // eslint-disable-line
          this.citySelectedName = this.cityOptions[i].cityname
          break
        }
      }
    }
  },
  methods: {
    initCityData () {
      getCitiesInfo({
        format: 'json'
      }).then(response => {
        this.cityOptions = response.data
      })
    }
  },
  components: { mixChart, radar, calendar, scatterColor2, rose }
}
</script>
 
<style lang="scss" scoped>
.chart-container {
  padding: 20px 32px 25px 32px;
  background-color: rgb(240, 242, 245);
  .select-wrapper {
    margin-bottom: 20px;
    margin-right: 32px;
    width: 100%;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px;
    margin-bottom: 32px;
    width: 100%;
    height: 85vh;
  }
}
</style>
