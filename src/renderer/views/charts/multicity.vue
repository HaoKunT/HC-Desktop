<template>
  <div class="chart-container">
    <div class="select-wrapper">
      <el-row type="flex" justify="end">
        <el-col :span="10" class="tag-wraper">
          <el-tag style="margin-left: 4px;"
          v-for="tag in selectedCities"
          :key="tag.id"
          closable
          :type="tag.type"
          @close="handleTagClose(tag)">
          {{tag.cityname}}
          </el-tag>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-select
          v-model="citySelectedValue"
          filterable
          :disabled="isCitySelectDisable"
          placeholder="选择城市"
          @change="addCity">
            <el-option
            v-for="item in cityOptions"
            :key="item.id"
            :label="item.cityname"
            :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="1">
          <el-button
           icon="el-icon-plus"
            plain style="margin: 0px 0px 0px 5px;"
            @click="addCity"></el-button>
        </el-col> -->
        <el-col :span="6" :offset="1">
          <el-date-picker
          v-model="dateSelectedValue"
          align="right"
          type="month"
          :editable="dateEditable"
          :clearable="dateClearable"
          placeholder="选择时间"
          :disabled="isDatePickerDisable"/>
        </el-col>
      </el-row>
    </div>
    <div class='chart-container'>
      <div class="chart-wrapper">
        <scatterColor id="scatterColor" 
        height='100%' 
        width='100%' 
        :cityList="selectedCities" 
        :year="yearSelected" 
        :month="monthSelected">
        </scatterColor>
      </div>
       <div class="chart-wrapper">
        <parallel 
        id="parallel"
        height='100%' 
        width='100%'
        :cityList="selectedCities" 
        :year="yearSelected" 
        :month="monthSelected">
        </parallel>
      </div>
       <!-- <div class="chart-wrapper">
        <radarMulti id="radarMulti" height='100%' width='100%'></radarMulti>
      </div> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import Linec from "@/components/Charts/lineMarker";
//import Key from "@/components/Charts/keyboard";
import scatterColor from "@/components/Charts/multiCity/scatterColor";
// import scatterTime from "@/components/Charts/multiCity/scatterTime";
import parallel from "@/components/Charts/multiCity/parallel";
// import radarMulti from "@/components/Charts/multiCity/radarMulti";
import { Message } from "element-ui";
import { getCitiesInfo } from "@/api/data/main";

export default {
  name: "lineChart",
  components: { scatterColor, parallel },
  data() {
    return {
      selectedCities: [],
      cityOptions: [],
      citySelectedValue: "",
      dateSelectedValue: new Date(2017, 3, 2),
      citySelectedName: "",
      dateEditable: false,
      dateClearable: false
    };
  },
  mounted() {
    this.initCityData();
  },
  computed: {
    isCitySelectDisable: function() {
      return this.cityOptions.length > 0 ? false : true;
    },
    isDatePickerDisable: function() {
      return this.cityOptions.length > 0 ? false : true;
    },
    yearSelected: function() {
      return this.dateSelectedValue
        ? this.dateSelectedValue.getFullYear()
        : 2017;
    },
    monthSelected: function() {
      return this.dateSelectedValue ? this.dateSelectedValue.getMonth() + 1 : 1;
    }
  },
  watch: {
    citySelectedValue: function() {}
  },
  methods: {
    initCityData() {
      getCitiesInfo({
        format: "json"
      }).then(response => {
        this.cityOptions = response.data;
        // for (var i = 0; i < response.data.length; i++) {
        //   temp.push({
        //     key: response.data[i].id,
        //     label: response.data[i].cityname
        //   });
        // }
      });
    },
    handleTagClose(tag) {
      this.selectedCities.splice(this.selectedCities.indexOf(tag), 1);
    },
    addCity(newValue) {
      if (this.selectedCities.length >= 3) {
        Message({
          message: "已达选择上限",
          type: "warning",
          duration: 2 * 1000
        });
        return;
      }

      for (var i = 0; i < this.cityOptions.length; i++) {
        if (this.cityOptions[i].id == newValue) {
          var flag = false;
          for (var j = 0; j < this.selectedCities.length; j++) {
            if (this.selectedCities[j].id == newValue) {
              Message({
                message: "该城市已在标签中",
                type: "warning",
                duration: 2 * 1000
              });
              flag = true;
              return;
            }
          }
          if (!flag) this.selectedCities.push(this.cityOptions[i]);
          break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .select-wrapper {
    margin-bottom: 20px;
    margin-right: 32px;
    width: 100%;
    .tag-wraper {
      display: flex;
      display: -webkit-flex;
      align-items: center;
    }
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

