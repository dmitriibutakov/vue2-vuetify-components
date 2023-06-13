<template>
  <v-card @click="clickOrder(order.OrderNum)" :data-num="order.OrderNum">
    <div
        :class="
        `v-card__top flex justify-space-between ${order.background} white--text`
      "
    >
      <div class="block-card__top">
        <div class="block-card__top-item" style="width: 10.5%;">
          <div class="block-card__top-item-style">
            <span class="title-card line-vertical">
              {{
                order.DateTimeOrder
                    | getFormattedDate({
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              }}
            </span>
          </div>
        </div>
        <div class="block-card__top-item" style="width: 35%;">
          <div class="block-card__top-item-style">
            <div class="title-card">
              <div class="d-flex justify-space-between">
                <span class="title-card">{{ order.OrderSource }}</span>
                <span class="title-card pr-5 line-vertical">{{ order.StatusDesc }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="block-card__top-item" style="width: 13%;">
          <div class="block-card__top-item-style">
            <span class="title-card line-vertical" style="padding-right: 25px; display: block; text-align: center;">
              {{ order.OrderNum }}
            </span>
          </div>
        </div>
        <div class="block-card__top-item" style="width: 40%;">
          <div class="block-card__top-item-style pe-4">
            <div class="d-flex justify-space-between align-center">
              <span class="title-card">{{ order.TypeDesc }}</span>
              <v-btn height="20" @click="tabHandler(order.OrderNum)"
              >details
              </v-btn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        :class=" `flex block-card__middle justify-space-between ${order.alphaBackground} white--text` ">
      <table class="table-order__item">
        <thead>
        <tr class="block-tr">
          <th cols="4"><span class="title-th">Date</span></th>
          <th cols="4">
                <span class="title-th"
                >Departure airport: Icao/Country/Municipality</span
                >
          </th>
          <th cols="4">
                <span class="title-th"
                >Arrival airport: Icao/Country/Municipality</span
                >
          </th>
          <th cols="4"><span class="title-th">Flight type</span></th>
<!--          <th cols="4">-->
<!--                <span class="title-th border-right__none"-->
<!--                >Aircraft type / Registration number</span-->
<!--                >-->
<!--          </th>-->
        </tr>
        </thead>
        <tbody v-for="(jump, i) in order.FlightLegs" :key="i">
        <tr>
          <td v-if="jump.DateTimeFrom && jump.DateTimeFrom.length > 10" cols="4">
                <span class="title-td">
                  departure
                  {{
                    jump.DateTimeFrom
                        | getFormattedDate({
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  }}
                </span>
          </td>
          <td v-else-if="jump.DateTimeArrival && jump.DateTimeArrival.length > 10" cols="4">
                <span class="title-td">
                  arrival
                  {{
                    jump.DateTimeArrival
                        | getFormattedDate({
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  }}
                </span>
          </td>
          <td v-else cols="4">
                <span class="title-td">
                  No date
                </span>
          </td>
          <td cols="4">
                <span class="title-td">
                  {{ jump.IcaoAirportFrom }} | {{ jump.CityFrom }} |
                  {{ jump.CountryFrom }}
                </span>
          </td>
          <td cols="4">
                <span class="title-td"
                >{{ jump.IcaoAirportTo }} | {{ jump.CityTo }} |
                  {{ jump.CountryTo }}</span
                >
          </td>
          <td cols="4">
            <span class="title-td"> {{
                jump.FlyDesc || 'undefined'
              }}</span>
          </td>
<!--          <td cols="4">-->
<!--                <span class="title-td border-right__none">-->
<!--                  {{ jump.AircraftType }} / {{ jump.AircraftRegNum }}-->
<!--                </span>-->
<!--          </td>-->
        </tr>
        </tbody>
      </table>
    </div>
    <div
        :class="
        `v-card__bottom d-flex justify-space-between darken-3 ${order.background} py-1 white--text`
      "
    >
      <div class="v-card__bottom-item" style="width: 25%;">
        <span class="title-card"
        >Client Name: {{ order.CFirstName }} {{ order.CLastName }}</span
        >
      </div>
      <div class="v-card__bottom-item" style="width: 25%;">
        <span class="title-card">Client Email: {{ order.CEmail }}</span>
      </div>
      <div class="v-card__bottom-item" style="width: 25%; display: block;  text-align: center;">
        <span class="title-card">Client Phone: {{ order.CPhone }}</span>
      </div>
      <div class="v-card__bottom-item" style="width: 25%; display: block;  text-align: end;">
        <span class="title-card" style="display:block; margin-left: auto;">Client status: DEFAULT</span>
      </div>
    </div>
  </v-card>
</template>

<script>
import {mapActions} from "vuex";
import {getFormattedDate} from "../../filters";

export default {
  name: "OrderItem",
  props: {
    order: {
      type: Object,
      required: true,
    },
    orderEvent: {
      type: Boolean,
    },
  },
  data: () => {
    return {
      selected: null,
    };
  },
  filters: {
    getFormattedDate,
  },
  methods: {
    ...mapActions({
      setTab: "orders/tabHandler",
      setCurrentTab: "orders/currentTabHandler",
    }),
    tabHandler(tab) {
      if (this.$store.state.orders.tabs.includes(tab)) {
        return this.setCurrentTab(this.$store.state.orders.tabs.indexOf(tab));
      }
      this.setTab(tab);
      this.setCurrentTab(this.$store.state.orders.tabs.indexOf(tab));

      // const num = this.$store.state.orders.tabs.indexOf(tab)
      // this.$store.state.orders.tabs.forEach((el, i) => {
      //   if (this.$store.state.orders.tabs.includes(tab)) {
      //     if (el === tab) {
      //       return this.setCurrentTab(i)
      //     }
      //   } else {
      //     this.setTab(tab)
      //     if (el === tab) {
      //       this.setCurrentTab(i)
      //     }
      //   }
      // })
    },
    clickOrder(OrderNum) {
      let currentOrder = document.querySelector(`[data-num=${OrderNum}]`)
      currentOrder.classList.toggle('active__order')
    },
  },
  computed: {},
};
</script>
