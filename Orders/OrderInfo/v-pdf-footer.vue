<template>
  <div class="ftr">
    <div class="ftr__header">
      Contacts
    </div>
    <div class="ftr__text">
      <a href="https://opensky.biz">OpenSky Limited</a>
      <a href="tel:+971562450844">+971 56 245 0844</a>
      <a href="mailto:ops@opensky.biz">ops@opensky.biz</a>
    </div>
    <div class="ftr__address">
      Office No. 250, Block C 4.1, 55/18 Mangilik El ave. <br>
      Astana International Financial Centre AIFC, Astana, Republic of Kazakhstan.
    </div>
  </div>
</template>

<script>
export default {
  name: "VPdfFooter"
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: $secondaryDarkestColor;
}
.ftr {
  bottom: 35px;
  line-height: 1.21;
  &__header {
    @include tabHeaders;
  }

  &__text {
    margin: 8px 0;
    @include body-12-500;
&>* {
  color: $secondaryDarkestColor;
}
    a:not(:last-of-type) {
      margin-right: 12px;
    }
  }

  &__address {
    @include body-12-400;
  }
}
</style>
