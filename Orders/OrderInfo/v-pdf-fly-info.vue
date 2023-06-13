<template>
  <div class="tab">
    <div class="tab__header">
      Schedule
    </div>
    <table class="tab__wrapper_sheet sheet">
      <thead class="sheet__header">
      <tr class="sheet__header_row">
        <th class="sheet__header_row_item"
            v-for="(v, i) in tableHeaders"
            :key="i">{{ v }}
        </th>
      </tr>
      </thead>
      <tbody class="sheet__body">
      <tr v-for="(item, idx) in tableData" class="sheet__body_row" :key="idx">
        <td class="sheet__body_row_item sheet__body_row_item_light">
          {{ idx + 1 }}
        </td>
        <td class="sheet__body_row_item sheet__body_row_item_light"
            v-if="item.DateTime && item.DateTime.length > 10">
          {{
            item.DateTime
                | getFormattedDate({
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          }}
        </td>
        <td class="sheet__body_row_item sheet__body_row_item_light" v-else>-</td>
        <td class="sheet__body_row_item sheet__body_row_item_light">{{ item.From }}
        </td>
        <td class="sheet__body_row_item sheet__body_row_item_light">{{ item.To }}
        </td>
        <td class="sheet__body_row_item sheet__body_row_item_light"
            v-if="item.DepartureLT.length > 1"> {{ item.DepartureLT }}
        </td>
        <td class="sheet__body_row_item sheet__body_row_item_light" v-else>-</td>
        <td class="sheet__body_row_item sheet__body_row_item_light"
            v-if="item.ArrivalLT.length > 1"> {{ item.ArrivalLT }}
        </td>
        <td class="sheet__body_row_item sheet__body_row_item_light" v-else>-</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {getFormattedDate} from "@/filters";

export default {
  name: "VPdfFlyInfo",
  filters: {getFormattedDate},
  props: {
    tableHeaders: {type: Array, required: true},
    tableData: {type: Array, required: true},
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

.tab {
  &__header {
    @include tabHeaders;
  }

  .sheet {
    width: 100%;
    margin-bottom: 16px;

    &__header, &__body {
      &_row {
        padding: 4px 0;
        @include flexBetweenCenter;
        border-bottom: 1px solid $secondaryDarkColor;
        width: 100%;
        text-align: left;

        &_item {
          text-align: left;
          flex: 0 0 16%;
          @include body-12-600;

          &_light {
            @include body-12-500;
          }

          &:nth-of-type(1) {
            flex: 0 0 5%;

          }
          &:nth-of-type(2) {
            flex: 0 0 10%;
          }
          &:nth-of-type(3) {
            flex: 0 0 25%;
          }
          &:nth-of-type(4) {
            flex: 0 0 25%;
          }
          &:nth-of-type(6) {
            flex: 0 0 9%;
          }
          &:nth-of-type(5) {
            flex: 0 0 12%;
          }
        }
      }
    }
  }
}

</style>
