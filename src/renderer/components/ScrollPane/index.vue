<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
    <div class="datepicker-wraper" :style="{display: datepickerWraperDispaly}">
      <el-date-picker style="margin-right: 0px;"
      v-model="dateSelected"
      type="date"
      size="small"
      :clearable="datepickerClearable"
      placeholder="选择日期">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
const padding = 15 // tag's padding

export default {
  name: 'scrollPane',
  data () {
    return {
      left: 0,
      datepickerClearable: false,
      dateSelected: new Date(2017, 2, 1)
    }
  },
  props: {
    datepickerWraperDispaly: {
      type: String,
      default: 'none'
    }
  },
  methods: {
    handleScroll (e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth

      if (eventDelta > 0) {
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            this.left = Math.max(
              this.left + eventDelta,
              $containerWidth - $wrapperWidth - padding
            )
          }
        } else {
          this.left = 0
        }
      }
    },
    moveToTarget ($target) {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $targetLeft = $target.offsetLeft
      const $targetWidth = $target.offsetWidth

      if ($targetLeft < -this.left) {
        // tag in the left
        this.left = -$targetLeft + padding
      } else if (
        $targetLeft + padding > -this.left &&
        $targetLeft + $targetWidth < -this.left + $containerWidth - padding
      ) {
        // tag in the current view
        // eslint-disable-line
      } else {
        // tag in the right
        this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .scroll-wrapper {
    position: absolute;
  }
  .datepicker-wraper {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: flex-end;
    margin: 1px 15px;
  }
}
</style>
