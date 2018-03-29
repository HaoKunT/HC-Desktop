<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import resize from "../mixins/resize";
import { getYearAqiData } from "@/api/data/main";
import axios from "axios";

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
    cityId: {
      type: [Date, String, Number],
      default: 299
    },
    cityName: {
      type: String,
      default: "武汉"
    },
    year: {
      type: Number,
      default: 2017
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
  watch: {
    cityId: function(newValue, oldValue) {
      this.initChart()
    },
    year: function(newValue, oldValue) {
      this.initChart()
    }
  },
  methods: {
    initChart() {
      function getVirtulData(year) {
        year = year || "2017";
        var date = +echarts.number.parseDate(year + "-01-01");
        var end = +echarts.number.parseDate(+year + 1 + "-01-01");
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime) {
          data.push([
            echarts.format.formatTime("yyyy-MM-dd", time),
            Math.floor(Math.random() * 10000)
          ]);
        }
        return data;
      }

      var data = [];

      if (!this.cityId || !this.year) return;
      getYearAqiData({
        format: "json",
        city: this.cityId,
        year: this.year
      })
        .then(response => {
          this.chart = echarts.init(document.getElementById(this.id));
          data = response.data;
          // console.log(JSON.stringify(data));

          var scale = 10;
          var option = {
            backgroundColor: "#404a59",

            title: {
              top: 20,
              text: (this.cityName && this.year) 
                ? this.year + "年" + this.cityName + "每天的AQI指数"
                : "AQI指数",
              left: "center",
              textStyle: {
                color: "#fff"
              }
            },
            tooltip: {
              trigger: "item"
            },
            legend: {
              top: "50",
              left: "100",
              data: ["AQI指数", "Top 12"],
              textStyle: {
                color: "#fff"
              }
            },
            calendar: [
              {
                top: 100,
                left: "center",
                range: [this.year + "-01-01", this.year + "-06-30"],
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#000",
                    width: 4,
                    type: "solid"
                  }
                },
                yearLabel: {
                  formatter: "{start}  1st",
                  textStyle: {
                    color: "#fff"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#323c48",
                    borderWidth: 1,
                    borderColor: "#111"
                  }
                }
              },
              {
                top: 340,
                left: "center",
                range: [this.year + "-07-01", this.year + "-12-31"],
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#000",
                    width: 4,
                    type: "solid"
                  }
                },
                yearLabel: {
                  formatter: "{start}  2nd",
                  textStyle: {
                    color: "#fff"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#323c48",
                    borderWidth: 1,
                    borderColor: "#111"
                  }
                }
              }
            ],
            series: [
              {
                name: "AQI指数",
                type: "scatter",
                coordinateSystem: "calendar",
                data: data,
                symbolSize: function(val) {
                  return val[1] / scale;
                },
                itemStyle: {
                  normal: {
                    color: "#ddb926"
                  }
                }
              },
              {
                name: "AQI指数",
                type: "scatter",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: data,
                symbolSize: function(val) {
                  return val[1] / scale;
                },
                itemStyle: {
                  normal: {
                    color: "#ddb926"
                  }
                }
              },
              {
                name: "Top 12",
                type: "effectScatter",
                coordinateSystem: "calendar",
                calendarIndex: 1,
                data: data
                  .sort(function(a, b) {
                    return b[1] - a[1];
                  })
                  .slice(0, 12),
                symbolSize: function(val) {
                  return val[1] / scale;
                },
                showEffectOn: "render",
                rippleEffect: {
                  brushType: "stroke"
                },
                hoverAnimation: true,
                itemStyle: {
                  normal: {
                    color: "#f4e925",
                    shadowBlur: 10,
                    shadowColor: "#333"
                  }
                },
                zlevel: 1
              },
              {
                name: "Top 12",
                type: "effectScatter",
                coordinateSystem: "calendar",
                data: data
                  .sort(function(a, b) {
                    return b[1] - a[1];
                  })
                  .slice(0, 12),
                symbolSize: function(val) {
                  return val[1] / scale;
                },
                showEffectOn: "render",
                rippleEffect: {
                  brushType: "stroke"
                },
                hoverAnimation: true,
                itemStyle: {
                  normal: {
                    color: "#f4e925",
                    shadowBlur: 10,
                    shadowColor: "#333"
                  }
                },
                zlevel: 1
              }
            ]
          };
          this.chart.setOption(option, true);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
