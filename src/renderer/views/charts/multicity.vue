<template>
  <div class="chart-container">
    <div class="select-wrapper">
      <el-row type="flex" justify="end">
        <el-col :span="10" :offset="0" class="tag-wraper">
          <el-tag
          v-for="tag in cityList"
          :key="tag.key"
          closable
          :type="tag.type"
          @close="handleTagClose(tag)">
          {{tag.label}}
          </el-tag>
        </el-col>
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
    <div class='chart-container'>
      <!-- <div class="chart-wrapper">
        <linec id="line" height='100%' width='100%'></linec>
      </div> -->
      <div class="chart-wrapper">
        <scatterColor id="scatterColor" height='100%' width='100%'></scatterColor>
      </div>
       <!-- <div class="chart-wrapper">
        <scatterTime id="scatterTime" height='100%' width='100%'></scatterTime>
      </div> -->
       <div class="chart-wrapper">
        <parallel id="parallel" height='100%' width='100%'></parallel>
      </div>
       <div class="chart-wrapper">
        <radarMulti id="radarMulti" height='100%' width='100%'></radarMulti>
      </div>
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
import radarMulti from "@/components/Charts/multiCity/radarMulti";
import { getCitiesInfo } from "@/api/data/main";

export default {
  name: "lineChart",
  components: { scatterColor, parallel, radarMulti },
  data() {
    return {
      cityList: [],
      selectedCities: [],
      cityOptions: [],
      citySelectedValue: 299,
      dateSelectedValue: new Date(2017, 3, 2),
      citySelectedName: "武汉"
    };
  },
  mounted() {
    this.initCityData();
    var testData = JSON.parse(
      `[{"id":1,"cityname":"阿坝州","lat":31.9018292959348,"lon":102.22049029261,"gdp":null,"pop":null,"area":null},{"id":2,"cityname":"安康","lat":32.7006971252182,"lon":109.026587022559,"gdp":null,"pop":null,"area":null},{"id":3,"cityname":"阿克苏地区","lat":41.1645926685117,"lon":80.2612506216766,"gdp":null,"pop":null,"area":null},{"id":4,"cityname":"阿里地区","lat":30.4012077303628,"lon":81.0986384229038,"gdp":null,"pop":null,"area":null}]`
    );
    for (var i = 0; i < testData.length; i++) {
      this.cityList.push({
        key: testData[i].id,
        label: testData[i].cityname
      });
    }
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
    citySelectedValue: function() {
      for (var i = 0; i < this.cityOptions.length; i++) {
        if (this.cityOptions[i].id == this.citySelectedValue)
          this.citySelectedName = this.cityOptions[i].cityname;
      }
    }
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
      this.cityList.splice(this.cityList.indexOf(tag), 1);
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

