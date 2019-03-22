<template>
  <div class="map-container">
    <ArcGISSence></ArcGISSence>
  </div>
</template>
<script>
import ArcGISSence from '@/components/ArcGIS/scene'

export default {
  name: 'arcgismap',
  components: { ArcGISSence }
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

