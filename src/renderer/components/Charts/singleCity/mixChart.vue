<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts";
import resize from "../mixins/resize";
import { getMonthLevelAndData } from "@/api/data/main";

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
      if (!this.cityId || !this.year) return;
      this.chart = echarts.init(document.getElementById(this.id));
      getMonthLevelAndData({
        format: "json",
        city: this.cityId,
        year: this.year
      })
        .then(repspose => {
          let goodDays = repspose.data[0];
          let badDays = repspose.data[1];
          let avgAqiValue = repspose.data[2];
          const xData = (function() {
            const data = [];
            for (let i = 1; i < 13; i++) {
              data.push(i + " month");
            }
            return data;
          })();
          this.chart.setOption({
            backgroundColor: "#344b58",
            title: {
              text:
                this.cityName && this.year
                  ? this.year +
                    "年" +
                    this.cityName +
                    "12个月天气质量合格天数与不合格天数及月平均AQI指数统计图"
                  : "12个月天气质量合格天数与不合格天数及月平均AQI指数统计图",
              x: "20",
              top: 20,
              left: "center",
              textStyle: {
                color: "#fff"
              },
              subtextStyle: {
                color: "#90979c",
                fontSize: "16"
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                textStyle: {
                  color: "#fff"
                }
              }
            },
            grid: {
              borderWidth: 0,
              top: 110,
              bottom: 95,
              textStyle: {
                color: "#fff"
              }
            },
            legend: {
              top: 60,
              x: "8%",
              textStyle: {
                color: "#90979c"
              },
              data: [
                "轻度污染/中度污染/重度污染天数",
                "优/良天数",
                "月AQI平均值"
              ]
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                axisLine: {
                  lineStyle: {
                    color: "#90979c"
                  }
                },
                splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                splitArea: {
                  show: false
                },
                axisLabel: {
                  interval: 0
                },
                data: xData
              }
            ],
            yAxis: [
              {
                type: "value",
                splitLine: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: "#90979c"
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0
                },
                splitArea: {
                  show: false
                }
              },
              {
                type: "value",
                splitLine: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: "#90979c"
                  }
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  interval: 0
                },
                splitArea: {
                  show: false
                }
              }
            ],
            dataZoom: [
              {
                show: true,
                height: 30,
                xAxisIndex: [0],
                bottom: 30,
                start: 10,
                end: 80,
                handleIcon:
                  "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                handleSize: "110%",
                handleStyle: {
                  color: "#d3dee5"
                },
                textStyle: {
                  color: "#fff"
                },
                borderColor: "#90979c"
              },
              {
                type: "inside",
                show: true,
                height: 15,
                start: 1,
                end: 35
              }
            ],
            series: [
              {
                name: "轻度污染/中度污染/重度污染天数",
                type: "bar",
                stack: "total",
                barMaxWidth: 35,
                barGap: "10%",
                itemStyle: {
                  normal: {
                    color: "rgba(255,144,128,1)",
                    label: {
                      show: true,
                      textStyle: {
                        color: "#fff"
                      },
                      position: "insideTop",
                      formatter(p) {
                        return p.value > 0 ? p.value : "";
                      }
                    }
                  }
                },
                // data: [13, 14, 15, 20, 13, 20, 21, 15, 14, 11, 20, 21]
                data: badDays
              },

              {
                name: "优/良天数",
                type: "bar",
                stack: "total",
                itemStyle: {
                  normal: {
                    color: "rgba(0,191,183,1)",
                    barBorderRadius: 0,
                    label: {
                      show: true,
                      position: "top",
                      formatter(p) {
                        return p.value > 0 ? p.value : "";
                      }
                    }
                  }
                },
                // data: [18, 14, 16, 10, 17, 10, 10, 16, 16, 20, 10, 10]
                data: goodDays
              },
              {
                name: "月AQI平均值",
                type: "line",
                stack: "total",
                symbolSize: 10,
                symbol: "circle",
                yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: "rgba(252,230,48,1)",
                    barBorderRadius: 0,
                    label: {
                      show: true,
                      position: "top",
                      formatter(p) {
                        return Math.round(p.value) > 0
                          ? Math.round(p.value)
                          : "";
                      }
                    }
                  }
                },
                // data: [56, 100, 78, 255, 68, 300, 310, 126, 133, 48, 268, 305]
                data: avgAqiValue
              }
            ]
          });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
