<template>
  <div>
    <div id="viewDiv"></div>
    <div class="datepicker-wraper">
    <div class="datepicker-wraper">
      <el-date-picker
      class="datepicker"
      v-model="dateSelected"
      v-loading.fullscreen.lock="fullscreenLoading"
      type="date"
      size="small"
      :clearable="datepickerClearable"
      :editable="datepickerEditable"
      placeholder="选择日期">
      </el-date-picker>
    </div>
    </div>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import { getDailyNationalData } from '@/api/data/main'

const options = {
        url: 'https://js.arcgis.com/4.6/'
      }

export default {
  data () {
    return {
      sceneView: null,
      map: null,
      datepickerClearable: false,
      datepickerEditable: false,
      dateSelected: new Date(2017, 2, 1),
      dateString: '2017-03-01',
      fullscreenLoading: false
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
      this.reAddPoints()
    }
  },
  methods: {
    initMap () {
      esriLoader
        .loadModules([
          "esri/views/SceneView",
          "esri/Map",
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Search",
          "esri/widgets/Locate",
          "esri/widgets/Expand",
          "esri/widgets/BasemapGallery",
          "esri/widgets/Fullscreen",
          "dojo/domReady!"
        ], options)
        .then(
          ([
            SceneView,
            Map,
            Graphic,
            GraphicsLayer,
            Search,
            Locate,
            Expand,
            BasemapGallery,
            Fullscreen
          ]) => {
            this.fullscreenLoading = true
            this.map = new Map({
              basemap: 'streets'
            })

            this.sceneView = new SceneView({
              container: 'viewDiv',
              map: this.map,
              camera: {
                position: {
                  x: 104.3,
                  y: 28.7,
                  z: 20000000
                },
                heading: 0,
                tilt: 0
              },
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
              view: this.sceneView
            })
            var locateBtn = new Locate({
              view: this.sceneView
            })
            var basemapGallery = new BasemapGallery({
              view: this.sceneView,
              container: document.createElement('div')
            })
            var bgExpand = new Expand({
              view: this.sceneView,
              content: basemapGallery.container,
              expandIconClass: 'esri-icon-basemap'
            })
            var fullscreen = new Fullscreen({
              view: this.sceneView
            })

            // Add the search widget to the top right corner of the view
            this.sceneView.ui.add(searchWidget, {
              position: 'top-right'
            })
            this.sceneView.ui.add(fullscreen, 'top-right')
            this.sceneView.ui.add(bgExpand, 'top-right')
            this.sceneView.ui.add(locateBtn, {
              position: 'top-left'
            })

            getDailyNationalData({
              format: 'json',
              date: this.dateString
            })
              .then(respose => {
                var graphicsLayer = new GraphicsLayer()
                this.map.add(graphicsLayer)
                let data = respose.data
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
                  var point = {
                    type: 'point',
                    x: lng,
                    y: lat,
                    z: 0
                  }

                  var markerSymbol = {
                    type: 'simple-marker',
                    color: color,
                    size: size,
                    outline: {
                      color: outlineColor,
                      width: outlineWidth
                    }
                  }

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
                  graphicsLayer.add(pointGraphic)
                }
                this.fullscreenLoading = false
              })
              .catch(err => {
                console.error(err)
                this.fullscreenLoading = false
              })
          }
        )
        .catch(err => {
          // handle any errors
          console.error(err)
          this.fullscreenLoading = false
        })
    },
    reAddPoints () {
      esriLoader
        .loadModules([
          'esri/Graphic',
          'esri/layers/GraphicsLayer',
          'dojo/domReady!'
        ])
        .then(
          ([
            Graphic,
            GraphicsLayer
          ]) => {
            this.fullscreenLoading = true
            getDailyNationalData({
              format: 'json',
              date: this.dateString
            })
              .then(respose => {
                var graphicsLayer = new GraphicsLayer()
                this.map.removeAll()
                this.map.add(graphicsLayer)
                let data = respose.data
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
                  var point = {
                    type: 'point',
                    x: lng,
                    y: lat,
                    z: 0
                  }

                  var markerSymbol = {
                    type: 'simple-marker',
                    color: color,
                    size: size,
                    outline: {
                      color: outlineColor,
                      width: outlineWidth
                    }
                  }

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
                  graphicsLayer.add(pointGraphic)
                }
                this.fullscreenLoading = false
              })
              .catch(err => {
                console.error(err)
                this.fullscreenLoading = false
              })
          }
        )
        .catch(err => {
          // handle any errors
          console.error(err)
          this.fullscreenLoading = false
        })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss"  scoped>
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
  .datepicker {
    margin-right: 0px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    width: 8rem;
    opacity: 0.6;
    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
