<template>
  <div class="claro">
    <div id="viewDiv"></div>
    <div class="datepicker-wraper">
      <el-date-picker style="margin-right: 0px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); border-radius: 4px;width: 8rem;"
      v-model="dateSelected"
      type="date"
      size="small"
      :clearable="datepickerClearable"
      :editable="datepickerEditable"
      placeholder="选择日期">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
// import testData from "./testdata";
import { getDailyNationalData } from '@/api/data/main'

export default {
  data () {
    return {
      mapView: null,
      datepickerClearable: false,
      datepickerEditable: false,
      dateSelected: new Date(2017, 2, 1),
      dateString: '2017-03-01'
    }
  },
  mounted () {
    this.initMap()
  },
  watch: {
    dateSelected: function () {
      var yearStr = this.dateSelected.getFullYear()
      var monthStr = this.dateSelected.getMonth() + 1
      var dayStr = this.dateSelected.getDate()
      var dateStr = yearStr
      if (monthStr < 10) dateStr += '-0' + monthStr
      else dateStr += '-' + monthStr
      if (dayStr < 10) dateStr += '-0' + dayStr
      else dateStr += '-' + dayStr
      this.dateString = dateStr
      // console.log(dateStr)
      this.reAddPoints()
    }
  },
  methods: {
    initMap () {
      esriLoader
        .loadModules([
          'esri/views/MapView',
          'esri/WebMap',
          'esri/widgets/Search',
          'esri/widgets/Locate',
          'esri/widgets/Expand',
          'esri/widgets/BasemapGallery',
          'esri/widgets/Fullscreen',
          'esri/Graphic',
          'dojo/domReady!'
        ])
        .then(
          ([
            MapView,
            WebMap,
            Search,
            Locate,
            Expand,
            BasemapGallery,
            Fullscreen,
            Graphic
          ]) => {
            // then we load a web map from an id
            let webmap = new WebMap({
              portalItem: { id: 'cd2c08450eb24ffc912bf7d097c4db8d' }
            })
            this.mapView = new MapView({
              map: webmap,
              container: 'viewDiv',
              popup: {
                dockEnabled: true,
                dockOptions: {
                  buttonEnabled: true,
                  position: 'bottom-right',
                  breakpoint: false
                }
              }
            })

            var searchWidget = new Search({
              view: this.mapView
            })
            var locateBtn = new Locate({
              view: this.mapView
            })
            var basemapGallery = new BasemapGallery({
              view: this.mapView,
              container: document.createElement('div')
            })
            var bgExpand = new Expand({
              view: this.mapView,
              content: basemapGallery.container,
              expandIconClass: 'esri-icon-basemap'
            })
            var fullscreen = new Fullscreen({
              view: this.mapView
            })

            // Add the search widget to the top right corner of the view
            this.mapView.ui.add(searchWidget, {
              position: 'top-right'
            })
            this.mapView.ui.add(fullscreen, 'top-right')
            this.mapView.ui.add(bgExpand, 'top-right')
            this.mapView.ui.add(locateBtn, {
              position: 'top-left'
            })
            getDailyNationalData({
              format: 'json',
              date: this.dateString
            })
              .then(respose => {
                this.addPoints(respose.data)
              })
              .catch(err => {
                console.error(err)
              })
          }
        )
        .catch(err => {
          console.error(err)
        })
    },
    addPoints (data) {
      esriLoader
        .loadModules(['esri/Graphic', 'dojo/domReady!'])
        .then(([Graphic]) => {
          var pointGraphics = []
          for (var i = 0; i < data.length; i++) {
            let color = [128, 0, 255, 0.3]
            let outlineWidth = 1
            let outlineColor = [128, 0, 255, 0.75]
            let size = data[i].value[0] / 5
            let lng = data[i].position[0]
            let lat = data[i].position[1]
            let cityId = data[i].id
            let cityName = data[i].name
            let year = data[i].date.year
            let month = data[i].date.month
            let day = data[i].date.day
            let aqiValue = data[i].value[0]
            let pm25Value = data[i].value[1]
            let pm10Value = data[i].value[2]
            let coValue = data[i].value[3]
            let no2Value = data[i].value[4]
            let so2Value = data[i].value[5]

            let point = {
              type: 'point', // autocasts as new Point()
              longitude: lng,
              latitude: lat
            }

            // Create a symbol for drawing the point
            let markerSymbol = {
              type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
              color: color,
              size: size,
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: outlineColor,
                width: outlineWidth
              }
            }

            // Create a graphic and add the geometry and symbol to it
            let pointGraphic = new Graphic({
              geometry: point,
              symbol: markerSymbol,
              attributes: {
                cityId: cityId,
                cityName: cityName,
                year: year,
                month: month,
                day: day,
                aqiValue: aqiValue,
                pm25Value: pm25Value,
                pm10Value: pm10Value,
                coValue: coValue,
                no2Value: no2Value,
                so2Value: so2Value
              },
              popupTemplate: {
                // title: "{year}-{month}-{day}  {cityName}",
                // content: "<ul><li>AQI: {value.aqiValue}</li>" +
                //   "<li>PM2.5: {value.pm25Value}</li>" +
                //   "<li>SO2: {value.so2Value}</li><ul>"
                title:
                  "<font color='#008000'>&nbsp;&nbsp;{year}年{month}月{day}日&nbsp;&nbsp;&nbsp;{cityName}&nbsp;-&nbsp;空气污染情况",
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      {
                        fieldName: 'aqiValue',
                        visible: true,
                        label: 'AQI'
                      },
                      {
                        fieldName: 'pm25Value',
                        visible: true,
                        label: 'PM2.5'
                      },
                      {
                        fieldName: 'pm10Value',
                        visible: true,
                        label: 'PM10'
                      },
                      {
                        fieldName: 'coValue',
                        visible: true,
                        label: 'CO'
                      },
                      {
                        fieldName: 'no2Value',
                        visible: true,
                        label: 'NO2'
                      },
                      {
                        fieldName: 'so2Value',
                        visible: true,
                        label: 'SO2'
                      }
                    ]
                  }
                ]
              },
              outFields: ['*']
            })

            pointGraphics.push(pointGraphic)
          }

          // Add the graphics to the view's graphics layer
          this.mapView.graphics = []
          this.mapView.graphics.addMany(pointGraphics)
        })
        .catch(err => {
          // handle any errors
          console.error(err)
        })
    },
    reAddPoints (data) {
      getDailyNationalData({
        format: 'json',
        date: this.dateString
      })
        .then(respose => {
          this.addPoints(respose.data)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import url("https://js.arcgis.com/4.6/esri/css/main.css");
@import url("https://js.arcgis.com/4.6/dijit/themes/claro/claro.css");
#viewDiv {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.datepicker-wraper {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  // margin-right: 250px;
  margin-top: 0px;
  opacity: 0.6;
  border-radius: 4px;
  &:hover {
    opacity: 0.85;
  }
}
</style>
