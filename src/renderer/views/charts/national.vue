<template>
  <div class="chart-container">
    <div class="chart-wrapper">
      <key id="test1" height='100%' width='100%'></key>
    </div>
    
    <!-- <div class="chart-wrapper">
      <scatter3D id="scatter3D" height='100%' width='100%'></scatter3D>
    </div> -->
  </div>
</template>

<script>
import key from '@/components/Charts/keyboard'

// import scatter3D from '@/components/Charts/national/scatter3D'

export default {
  name: 'keyboardChart',
  components: { key }
}
</script>

<style lang="scss" scoped>
.chart-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px;
    margin-bottom: 32px;
    width: 100%;
    height: 85vh;
  }
}
</style>
