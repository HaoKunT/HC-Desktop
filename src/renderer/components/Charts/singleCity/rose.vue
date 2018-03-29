<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import resize from "../mixins/resize";
import { getCityDaysLeavelByYear } from "../../../api/data/main";

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
      getCityDaysLeavelByYear({
        format: "json",
        city: this.cityId,
        year: this.year
      })
        .then(response => {
          var option = {
            backgroundColor: "#404a59",
            title: {
              top: 20,
              text:
                this.cityName && this.year
                  ? this.year + "年" + this.cityName + "空气质量等级比例图"
                  : "空气质量等级比例图",
              x: "center",
              textStyle: {
                color: "#fff"
              }
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              x: "center",
              bottom: 35,
              textStyle: {
                color: "#fff",
                fontSize: 14
              },
              data: ["优", "良", "轻度污染", "中度污染", "重度污染"]
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                  show: true,
                  type: ["pie", "funnel"]
                },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            calculable: true,
            series: [
              {
                name: "半径模式",
                type: "pie",
                radius: [20, 110],
                center: ["25%", "50%"],
                roseType: "radius",
                // data: [
                //   { value: 75, name: "优的天数" },
                //   { value: 180, name: "良的天数" },
                //   { value: 30, name: "轻度污染的天数" },
                //   { value: 45, name: "中度污染的天数" },
                //   { value: 35, name: "重度污染的天数" }
                // ]
                data: response.data
              },
              {
                name: "面积模式",
                type: "pie",
                radius: [30, 110],
                center: ["75%", "50%"],
                roseType: "area",
                // data: [
                //   { value: 75, name: "优的天数" },
                //   { value: 180, name: "良的天数" },
                //   { value: 30, name: "轻度污染的天数" },
                //   { value: 45, name: "中度污染的天数" },
                //   { value: 35, name: "重度污染的天数" }
                // ]
                data: response.data
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
