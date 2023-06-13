<template>
  <header class="header">
    <img src="@/assets/logo_opensky_title_small.png" alt="">
    <span>{{ operatorName }}</span>
  </header>
</template>

<script>
export default {
  name: "VHeader",
  props: {
    operatorName: {type: String, default: 'undefined'}
  }
}
</script>

<style scoped lang="scss">
.header {
  @include flexBetweenCenter;
  height: 60px;

  img {
    height: 28px;
  }

  span {
    @include body-16-500;
  }
}
</style>
