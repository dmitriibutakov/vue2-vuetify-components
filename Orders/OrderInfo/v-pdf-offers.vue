<template>
  <div class="offers">
    <div class="offers__header">
      Aircraft offers
    </div>
    <div class="offers__item item" v-for="(v, i) in tableData" :key="i">
      <div v-if="i !== 'Images' && v.Images.length > 0" class="item__images images">
        <div class="images__aircraft" v-for="(val, ind) in v.Images" :style="{ backgroundImage: `url(${val})`}"
             :key="ind"/>
      </div>
      <table class="item__sheet sheet">
        <thead class="sheet__header">
        <tr class="sheet__row row">
          <th class="row__item row__item_header"
              v-for="(val, ind) in [`Offer ${arr.indexOf(v) + 1}`, 'Aircraft class', 'YOM/Updates', 'Seats', 'Price ($)']"
              :key="ind">{{ val }}
          </th>
        </tr>
        </thead>
        <tbody class="sheet__body">
        <tr class="sheet__row row">
          <td v-for="(val, ind) in v" class="row__item"
              :key="ind">
            <span v-if="ind !== 'Images'">
                {{ val }}
            </span>
          </td>

        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "VPdfOffers",
  props: {
    tableData: {type: Array, required: true},
    arr: Array
  }
}
</script>

<style scoped lang="scss">
table,
thead,
tbody,
tfoot,
tr,
th,
td {
  display: block;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
  border-collapse: inherit;
  border-spacing: 0;
  border: none inherit;
  vertical-align: inherit;
  text-align: left;
  font-weight: inherit;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;
}

th, td {
  display: inline;
}

.offers {
  &__header {
    @include tabHeaders;
  }

  .item {
    .images {
      display: flex;
      margin-top: 8px;
      &>*:not(:last-child) {
        margin-right: 8px;
      }

      &__aircraft {
        flex: 0 0 32.5%;
        height: 150px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    }

    .sheet {
      width: 100%;

      .row {
        padding: 6px;
        @include flexBetweenCenter;
        border-bottom: 1px solid $secondaryDarkColor;
        width: calc(100% - 12px);
        text-align: left;

        &__item {
          text-align: left;
          flex: 0 0 19%;
          @include body-12-500;
          span {
            word-wrap: break-word;
            overflow: hidden;
            width: 100%;
          }
          &_header {
            @include body-12-600;
          }
        }
      }
    }
  }
}
</style>
