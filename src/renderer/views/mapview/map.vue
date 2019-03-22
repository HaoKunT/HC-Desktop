<template>
  <div class="map-container">
    <ArcGISMap></ArcGISMap>
  </div>
</template>
<script>
import ArcGISMap from '@/components/ArcGIS/map'

export default {
  name: 'arcgismap',
  components: { ArcGISMap }
}
</script>

<style scoped>
.map-container{
  position: relative;
  padding: 20px;
  width: 100%;
  height: 87.9vh;
  background-color: #eee;
  z-index:0;
}
</style>

