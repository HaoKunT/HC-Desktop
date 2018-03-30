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
      chart: null,
      dataList: []
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
      var vm = this

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
                type: "scatter",
                itemStyle: itemStyle,
                data: vm.dataList[0]
              });
            }
            if (response2) {
              vm.dataList.push(response2.data);
              legendData.push(vm.cityList[1].cityname);
              seriesData.push({
                name: vm.cityList[1].cityname,
                type: "scatter",
                itemStyle: itemStyle,
                data: vm.dataList[1]
              });
            }
            if (response3) {
              vm.dataList.push(response3.data);
              legendData.push(vm.cityList[2].cityname);
              seriesData.push({
                name: vm.cityList[2].cityname,
                type: "scatter",
                itemStyle: itemStyle,
                data: vm.dataList[2]
              });
            }

            var schema = [
              { name: "date", index: 0, text: "日" },
              { name: "AQIindex", index: 1, text: "AQI指数" },
              { name: "PM25", index: 2, text: "PM2.5" },
              { name: "PM10", index: 3, text: "PM10" },
              { name: "CO", index: 4, text: "一氧化碳（CO）" },
              { name: "NO2", index: 5, text: "二氧化氮（NO2）" },
              { name: "SO2", index: 6, text: "二氧化硫（SO2）" }
            ];

            var itemStyle = {
              normal: {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            };

            var option = {
              title: {
                top: 20,
                text: "多个城市一个月每天的AQI及各污染物指数图",
                left: "center",
                textStyle: {
                  color: "#fff"
                }
              },
              backgroundColor: "#404a59",
              color: ["#dd4444", "#fec42c", "#80F1BE"],
              legend: {
                top: 50,
                data: legendData,
                textStyle: {
                  color: "#fff",
                  fontSize: 16
                }
              },
              grid: {
                x: "10%",
                x2: 150,
                y: "18%",
                y2: "10%"
              },
              tooltip: {
                padding: 10,
                backgroundColor: "#222",
                borderColor: "#777",
                borderWidth: 1,
                formatter: function(obj) {
                  var value = obj.value;
                  return (
                    '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                    obj.seriesName +
                    " " +
                    value[0] +
                    "日：" +
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
              xAxis: {
                type: "value",
                name: "日期",
                nameGap: 16,
                nameTextStyle: {
                  color: "#fff",
                  fontSize: 14
                },
                max: 31,
                splitLine: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: "#eee"
                  }
                }
              },
              yAxis: {
                type: "value",
                name: "AQI 指数",
                nameLocation: "end",
                nameGap: 20,
                nameTextStyle: {
                  color: "#fff",
                  fontSize: 16
                },
                axisLine: {
                  lineStyle: {
                    color: "#eee"
                  }
                },
                splitLine: {
                  show: false
                }
              },
              visualMap: [
                {
                  left: "right",
                  top: "10%",
                  dimension: 2,
                  min: 0,
                  max: 100,
                  itemWidth: 30,
                  itemHeight: 120,
                  calculable: true,
                  precision: 0.1,
                  text: ["圆形大小：PM2.5"],
                  textGap: 30,
                  textStyle: {
                    color: "#fff"
                  },
                  inRange: {
                    symbolSize: [10, 70]
                  },
                  outOfRange: {
                    symbolSize: [10, 70],
                    color: ["rgba(255,255,255,.2)"]
                  },
                  controller: {
                    inRange: {
                      color: ["#c23531"]
                    },
                    outOfRange: {
                      color: ["#444"]
                    }
                  }
                },
                {
                  left: "right",
                  bottom: "5%",
                  dimension: 6,
                  min: 0,
                  max: 30,
                  itemHeight: 120,
                  calculable: true,
                  precision: 0.1,
                  text: ["明暗：二氧化硫"],
                  textGap: 30,
                  textStyle: {
                    color: "#fff"
                  },
                  inRange: {
                    colorLightness: [1, 0.5]
                  },
                  outOfRange: {
                    color: ["rgba(255,255,255,.2)"]
                  },
                  controller: {
                    inRange: {
                      color: ["#c23531"]
                    },
                    outOfRange: {
                      color: ["#444"]
                    }
                  }
                }
              ],
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
