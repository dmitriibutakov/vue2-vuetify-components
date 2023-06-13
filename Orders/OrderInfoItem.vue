<template>
  <p v-if="item === null">No offer yet</p>
  <tr class="offer__item" v-else @click="editHandler">
    <td
        :class="{
        ' red lighten-3': item.OfferStatusDesc == 'Prepare',
        ' amber lighten-3': item.OfferStatusDesc == 'Sent to operator',
        ' light-blue lighten-4': item.OfferStatusDesc == 'Operator confirmed',
        ' green lighten-4': item.OfferStatusDesc == 'Sent to client',
        ' grey lighten-1': item.OfferStatusDesc == 'Completed',
      }"
    >
      {{ item.OperatorName }}
    </td>

    <td>
      {{ item.FlyDesc }}
    </td>
    <td v-if="item.DateTimeFrom && item.DateTimeFrom.length > 10">
     from {{
        item.DateTimeFrom
            | getFormattedDate({
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </td>
    <td v-else-if="item.DateTimeArrival && item.DateTimeArrival.length > 10">
      arrival {{
        item.DateTimeArrival
            | getFormattedDate({
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      }}
    </td>
    <td v-else>
      no date
    </td>
    <td>
      {{ `${item.CountryFrom} | ${item.CityFrom} | ${item.IcaoAirportFrom}` }}
    </td>
    <td>
      {{ `${item.CountryTo} | ${item.CityTo} | ${item.IcaoAirportTo}` }}
    </td>
    <td>{{ item.AircraftType }}</td>
    <td>{{ item.AircraftClassDesc }}</td>
    <td>{{ item.Pax }}</td>
    <td>{{ item.AmountFromOperator }}$</td>
    <td>{{ item.Amount }}$</td>
  </tr>
</template>


<script>
import {getFormattedDate} from "../../filters";

export default {
  name: "OrderInfoItem",
  props: {
    item: {
      type: Object,
    },
  },
  filters: {
    getFormattedDate,
  },
  methods: {
    editHandler() {
      const obj = Object.assign({}, JSON.parse(JSON.stringify(this.item)));
      this.$emit("editHandler", obj);
    },
  },
};
</script>

<style scoped>
.col {
  padding: 5px 0;
}

.v-card__title + .v-card__subtitle,
.v-card__title + .v-card__text {
  padding-bottom: 2px;
}
</style>

<!--AircraftClassDesc: (...)-->
<!--AircraftClassId: (...)-->
<!--AircraftId: (...)-->
<!--AircraftType: (...)-->
<!--AircraftRegNum: (...)-->
<!--CityFrom: (...)-->
<!--CityTo: (...)-->
<!--CountryFrom: (...)-->
<!--CountryTo: (...)-->
<!--DateTimeFrom: (...)-->
<!--FlyDesc: (...)-->
<!--FlyNum: (...)-->
<!--FlyTime: (...)-->
<!--FlyTypeId: (...)-->
<!--IataAirportFrom: (...)-->
<!--IataAirportTo: (...)-->
<!--Id: (...)-->
<!--OrderId: (...)-->
<!--OrderNum: (...)-->
<!--Pax: (...)-->

<!--"BaseFields": {-->
<!--"Id": 0,-->
<!--"OfferStatus": "",-->
<!--"OrderId": 0,-->
<!--"OrderNum": "",-->
<!--"AircraftId": 0,-->
<!--"FlyTime": "0001-01-01T00:00:00Z",-->
<!--"OperatorId": "",-->
<!--"OperatorName": "",-->
<!--"OperatorEmail": "",-->
<!--"DateTimeFrom": "0001-01-01T00:00:00Z",-->
<!--"CountryFrom": "",-->
<!--"CityFrom": "",-->
<!--"IataAirportFrom": "",-->
<!--"CountryTo": "",-->
<!--"CityTo": "",-->
<!--"IataAirportTo": "",-->
<!--"Pax": 0,-->
<!--"FlyNum": "",-->
<!--"FlyTypeId": 0,-->
<!--"FlyDesc": "",-->
<!--"AircraftClassId": 0,-->
<!--"AircraftClassDesc": "",-->
<!--"AircraftType": "",-->
<!--"AircraftRegNum": ""-->
