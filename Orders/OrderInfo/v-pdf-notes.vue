<template>
  <div class="notes">
    <div class="notes__header">
      Notes
    </div>
    <div class="notes__body">
      The fixed price does not include the following charges: <br>
      <ul>
        <li>Additional charges for any charges due to weather conditions, flight delays or altered landings.</li>
        <li>De-icing in case of snowfall or frost.</li>
        <li>Shuttle services (limousine, taxi etc.)</li>
      </ul>
      <div>This offer is subject to availability at the time of booking and all necessary landing and overflight permits
        are in place.
        We will be pleased to perform this flight for you. For further questions, please feel free to contact us at any
        time.
      </div>
      <div>
        Unless specified above, the offers are fully inclusive of the aircraft, standard operational fees and charges,
        passenger taxes and standard VIP catering. Excluded from the above offers are any out of hours handling charges
        and extension fees, usage of satellite telephone (if applicable), aircraft de-icing and / or hangerage if needed
        and exceptional catering costs. Flights are operated according to the terms and conditions of our standard
        subcharter contract.
      </div>
      <div>
        Photos shown are for indication purposes only, actual aircraft may diﬀer. All oﬀers are subject to fuel
        surcharges due to market variation.
      </div>
      <div>When you make a booking, you agree to the offer - more details here - https://opensky.biz/offer</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VPdfNotes"
}
</script>

<style scoped lang="scss">
.notes {
  @include body-14-400;
  line-height: 1.35;

  &__header {
    @include tabHeaders;
  }

  &__body {
    ul {
      margin-bottom: 8px;
      padding-left: 8px;

      li {
        list-style: inside;

      }
    }

    div {
      margin-bottom: 8px;
    }
  }
}
</style>
