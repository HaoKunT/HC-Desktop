<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import resize from "../mixins/resize";
import axios from "axios";
import { getDailyDataByMouth } from "@/api/data/main";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    },
    cityList: {
      type: Array,
      default: []
    },
    year: {
      type: Number,
      default: 2017
    },
    month: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  computed: {
    cityCount: function() {
      return this.cityList.length;
    }
  },
  watch: {
    cityList: function(newValue, oldValue) {
      this.initChart();
    },
    year: function(newValue, oldValue) {
      this.initChart();
    },
    month: function(newValue, oldValue) {
      this.initChart();
    }
  },
  methods: {
    initChart() {
      if (!this.cityList || !this.year || !this.month) return;
      this.chart = echarts.init(document.getElementById(this.id));

      var taskList = [];
      for (var i = 0; i < this.cityList.length; i++) {
        taskList.push(
          getDailyDataByMouth({
            format: "json",
            city: this.cityList[i].id,
            year: this.year,
            month: this.month
          })
        );
      }
      var vm = this;
      if (taskList.length > 0)
        axios.all(taskList).then(
          axios.spread(function(response1, response2, response3) {
            vm.dataList = [];
            var legendData = [];
            var seriesData = [];

            if (response1) {
              vm.dataList.push(response1.data);
              legendData.push(vm.cityList[0].cityname);
              seriesData.push({
                name: vm.cityList[0].cityname,
                type: "parallel",
                lineStyle: lineStyle,
                data: vm.dataList[0]
              });
            }
            if (response2) {
              vm.dataList.push(response2.data);
              legendData.push(vm.cityList[1].cityname);
              seriesData.push({
                name: vm.cityList[1].cityname,
                type: "parallel",
                lineStyle: lineStyle,
                data: vm.dataList[1]
              });
            }
            if (response3) {
              vm.dataList.push(response3.data);
              legendData.push(vm.cityList[2].cityname);
              seriesData.push({
                name: vm.cityList[2].cityname,
                type: "parallel",
                lineStyle: lineStyle,
                data: vm.dataList[2]
              });
            }

            var schema = [
              { name: "date", index: 0, text: "日期" },
              { name: "AQIindex", index: 1, text: "AQI" },
              { name: "PM25", index: 2, text: "PM2.5" },
              { name: "PM10", index: 3, text: "PM10" },
              { name: "CO", index: 4, text: " CO" },
              { name: "NO2", index: 5, text: "NO2" },
              { name: "SO2", index: 6, text: "SO2" },
              { name: "等级", index: 7, text: "等级" }
            ];

            var lineStyle = {
              normal: {
                width: 1,
                opacity: 0.5
              }
            };

            var option = {
              title: {
                top: 20,
                text: "多城市不同污染物数值和污染等级平行坐标图",
                left: "center",
                textStyle: {
                  color: "#fff"
                }
              },
              backgroundColor: "#333",
              legend: {
                bottom: 20,
                data: legendData,
                itemGap: 20,
                textStyle: {
                  color: "#fff",
                  fontSize: 14
                }
              },
              tooltip: {
                padding: 10,
                backgroundColor: "#222",
                borderColor: "#777",
                borderWidth: 1,
                formatter: function(obj) {
                  var value = obj[0].value;
                  return (
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                    obj[0].seriesName +
                    " " +
                    value[0] +
                    "日期：" +
                    value[7] +
                    "</div>" +
                    schema[1].text +
                    "：" +
                    value[1] +
                    "<br>" +
                    schema[2].text +
                    "：" +
                    value[2] +
                    "<br>" +
                    schema[3].text +
                    "：" +
                    value[3] +
                    "<br>" +
                    schema[4].text +
                    "：" +
                    value[4] +
                    "<br>" +
                    schema[5].text +
                    "：" +
                    value[5] +
                    "<br>" +
                    schema[6].text +
                    "：" +
                    value[6] +
                    "<br>"
                  );
                }
              },
              parallelAxis: [
                {
                  dim: 0,
                  name: schema[0].text,
                  inverse: true,
                  max: 31,
                  nameLocation: "start"
                },
                { dim: 1, name: schema[1].text },
                { dim: 2, name: schema[2].text },
                { dim: 3, name: schema[3].text },
                { dim: 4, name: schema[4].text },
                { dim: 5, name: schema[5].text },
                { dim: 6, name: schema[6].text },
                {
                  dim: 7,
                  name: schema[7].text,
                  type: "category",
                  data: [
                    "优",
                    "良",
                    "轻度污染",
                    "中度污染",
                    "重度污染",
                    "严重污染"
                  ]
                }
              ],
              visualMap: {
                left: "2%",
                show: true,
                min: 0,
                max: 150,
                dimension: 2,
                inRange: {
                  color: ["#d94e5d", "#eac736", "#50a3ba"].reverse()
                  // colorAlpha: [0, 1]
                }
              },
              parallel: {
                left: "7%",
                right: "10%",
                top: 100,
                bottom: 80,
                parallelAxisDefault: {
                  type: "value",
                  name: "AQI指数",
                  nameLocation: "end",
                  nameGap: 20,
                  nameTextStyle: {
                    color: "#fff",
                    fontSize: 12
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#aaa"
                    }
                  },
                  axisTick: {
                    lineStyle: {
                      color: "#777"
                    }
                  },
                  splitLine: {
                    show: false
                  },
                  axisLabel: {
                    textStyle: {
                      color: "#fff"
                    }
                  }
                }
              },
              series: seriesData
            };

            vm.chart.setOption(option, true);
          })
        );
      else
        vm.chart.clear()
    }
  }
};
</script>
