<template>
  <div class="pdf__header">
    <div class="pdf__header_text text">
      <h3 class="text__title">
        Flight Quotation
      </h3>
      <span class="text__offernum">
            Offer №: {{ orderNum }}
          </span>
    </div>
    <img class="pdf__header_logo" src="../../../assets/logo_opensky_title_small.png" alt="opensky"/>
  </div>
</template>

<script>
export default {
  name: "VPdfHeader",
  props: {
    orderNum: {type: String, default: ''}
  }
}
</script>

<style scoped lang="scss">
.pdf__header {
  @include flexBetweenCenter;
  margin-bottom: 16px;

  .text {
    &__title {
      @include body-20-600;
      margin-bottom: 2px;
    }

    &__offernum {
      @include body-8-400;
    }
  }

  &_logo {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 137px;
    max-height: 79px;
  }
}
</style>
