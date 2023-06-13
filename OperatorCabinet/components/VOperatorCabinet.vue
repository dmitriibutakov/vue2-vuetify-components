<template>
  <main class="cabinet">
    <h3 class="cabinet__title">
      Order: {{ getSub.OrderNum }}
    </h3>
    <table class="table">
      <thead class="table__head">
      <tr class="table__row">
        <th class="table__row_item table__row_item_header"
            v-for="(v, i) in ['Fly Type', 'Date', 'From', 'To', 'Departure LT', 'Arrival LT', 'Pax', 'Flight time']"
            :key="i">{{ v }}
        </th>
      </tr>
      </thead>
      <tbody class="table__body">
      <tr class="table__row" v-for="(item, idx) in getOperatorItems" :key="idx">
        <td class="table__row_item">
          {{ item.FlyDesc }}
        </td>
        <td class="table__row_item" v-if="item.DateTimeFrom && item.DateTimeFrom.length > 10">
          {{
            item.DateTimeFrom
                | getFormattedDate({
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })
          }}
        </td>
        <td class="table__row_item" v-else-if="item.DateTimeArrival && item.DateTimeArrival.length > 10">
          {{
            item.DateTimeArrival
                | getFormattedDate({
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          }}
        </td>
        <td class="table__row_item" v-else>
          -
        </td>
        <td class="table__row_item">{{ item.IcaoAirportFrom }} ({{ item.CountryFrom }}) {{ item.CityFrom }}</td>
        <td class="table__row_item">{{ item.IcaoAirportTo }} ({{ item.CountryTo }}) {{ item.CityTo }}</td>
        <td class="table__row_item" v-if="item.DateTimeFrom && item.DateTimeFrom.length > 10">
          {{
            item.DateTimeFrom
                | getFormattedDate({
              hour: "2-digit",
              minute: "2-digit"
            })
          }}
        </td>
        <td class="table__row_item" v-else>
          -
        </td>
        <td class="table__row_item" v-if="item.DateTimeArrival && item.DateTimeArrival.length > 10">
          {{
            item.DateTimeArrival
                | getFormattedDate({
              hour: "2-digit",
              minute: "2-digit"
            })
          }}
        </td>
        <td class="table__row_item" v-else>
          -
        </td>
        <td class="table__row_item">{{ item.Pax }}</td>
        <td class="table__row_item">
          <vue-timepicker
              style="padding-top: 15px "
              hide-clear-button
              v-model="item.FlyTime"
              input-width="100px"
          ></vue-timepicker>
        </td>
      </tr>
      </tbody>

    </table>
    <div class="cabinet__actions actions">
      <div class="actions__left left">
        <div class="left__wrapper">
          <h3 class="left__title">Comment</h3>
          <div v-for="(v, i) in getOperatorItems" class="left__description" :key="i">
            for flight from <strong>{{ v.AirportNameFrom }}</strong> to
            <strong>{{ v.AirportNameTo }}</strong> <br>
            <p>{{ v.FlyInfoDescription }}</p>
          </div>
        </div>
        <div class="left__info">On this page you can see the data of flights one order. You can make adjustments and
          indicate the cost for the provision of air travel services. In the future, this information will be given as
          an offer to the client.
          For all questions and detailed please contact with us.
          <div class="info__contacts contacts">
            <div class="contacts__item">
              <img src="../assets/img/phone.svg" alt="phone">
              <a target="_blank" href="tel:+77008368187">+7 700 836 81 87</a>
            </div>
            <div class="contacts__item">
              <img src="../assets/img/mail.svg" alt="mail">
              <a target="_blank" href="mailto:sales@opensky.biz">sales@opensky.biz</a>
            </div>
          </div>
        </div>
      </div>
      <div class="actions__right right">
        <div v-if="getOperatorItems.length > 0 && getRegNum.length > 0
        && getOperatorItems[0].FlyDesc.toLowerCase() !== 'cargo'"
             class="right__images images">
          <v-block-actions-images :arr-file="filesExterior"
                                  :title="'Aircraft exterior'"
                                  :name="'exterior'"
                                  :watch-prop="getRegNum"
                                  :default-item="getPhotosExterior[0] && getPhotosExterior[0].Path"
                                  @deleteFile="deleteFile"
                                  @addFile="addFile"/>
          <v-block-actions-images :arr-file="filesInterior"
                                  :title="'Aircraft interior'"
                                  :watch-prop="getRegNum"
                                  :name="'interior'"
                                  :default-item="getPhotosInterior[0] && getPhotosInterior[0].Path"
                                  @deleteFile="deleteFile"
                                  @addFile="addFile"/>
          <v-block-actions-images :arr-file="filesDiagram"
                                  :title="'Airplane diagram'"
                                  :watch-prop="getRegNum"
                                  :name="'diagram'"
                                  :default-item="getPhotosDiagram[0] && getPhotosDiagram[0].Path"
                                  @deleteFile="deleteFile"
                                  @addFile="addFile"/>
        </div>
        <div class="right__dropdowns dropdowns"
             v-if="getOperatorItems.length > 0">
          <v-dropdown @setListCallback="setListAircraftsHandler"
                      @setActiveList="setActiveAircraftHandler"
                      :dropdown-list="getAircraftItems"
                      :active-item="getActiveAircraft"
                      :default-active-item="'Aircraft*'"/>
          <v-inpu @customChange="(n, v) => budget = v"
                  :name="'budget'"
                  :value="budget"
                  :placeholder="'Price* ($)'"/>
        </div>
        <div v-if="getOperatorItems.length > 0" class="right__comment">
          <v-inpu @customChange="(n, v) => comment = v"
                  :name="'comment'"
                  :is-comment="true"
                  :value="comment"
                  :placeholder="'Comment'"/>
        </div>
        <div class="right__btn">
          <v-button :is-loading="getLoading" @clickCallback="saveFormHandler" :disabled="disabledBtn()"
                    :title="'Confirm and send'"/>
        </div>
      </div>
    </div>
  </main>
</template>

<script>

import {getFormattedDate} from "@/filters";
import VueTimepicker from "@/components/Timepicker"
import VDropdown from "@/components/OperatorCabinet/components/VDropdown";
import {mapActions, mapGetters, mapMutations} from "vuex";
import VButton from "@/shares/components/VButton";
import VInpu from "@/components/OperatorCabinet/components/VInpu";
import VBlockActionsImages from "@/shares/components/VBlockActionsImages";
import filesMixin from "../../../mixins/filesMixin";

export default {
  name: "VOperatorCabinet",
  components: {VBlockActionsImages, VInpu, VButton, VDropdown, VueTimepicker},
  props: {
    title: {type: String, default: ''}
  },
  data() {
    return {
      aircraftId: 0,
      aircraftRegNum: '',
      aircraftType: '',
      aircraftClassId: 0,
      budget: 0,
      comment: '',
      flyTimeObj: {}
    }
  },
  filters: {
    getFormattedDate,
  },
  mixins: [filesMixin],
  computed: {
    ...mapGetters("operatorCabinet", ["getAircraftClasses",
      "getSub",
      "getActiveAircraft",
      "getRegNum",
      "getStatusSuccess",
      "getPhotosInterior",
      "getPhotosExterior",
      "getPhotosDiagram",
      "getAircraftItems",
      "getPriceFlight",
      "getActiveAircraftClass",
      "getOperatorItems"]),
    ...mapGetters({getLoading: 'global/getLoading'})
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    async getRegNum() {
      if (this.getRegNum !== '') {
        await this.getAircraftImages()
      }
    },
    getPriceFlight() {
      this.budget = this.getPriceFlight
    },
    getOperatorItems() {
      if (this.getOperatorItems.length > 0) {
        this.comment = this.getOperatorItems[0].Description
        this.aircraftId = this.getOperatorItems[0].AircraftId || 0
        this.aircraftClassId = this.getOperatorItems[0].AircraftClassId || 0
      }
    },
    getStatusSuccess() {
      if (this.getStatusSuccess === 1) {
        this.$toast.success('operation successfully')
      } else if (this.getStatusSuccess === -1) {
        this.$toast.error('operation error')
      }
    }
  },
  methods: {
    ...mapActions("operatorCabinet", ["getAutocompleteInputs", "getAircraftImages",
      "deleteAircraftImages", "saveForm", "saveAircraftImages", "saveOrder"]),
    ...mapMutations("operatorCabinet", ["SET_ACTIVE_AIRCRAFT_CLASS", "SET_ACTIVE_AIRCRAFT", "SET_REG_NUM"]),
    async saveFormHandler() {
      const data = {
        info: {
          aircraftType: this.aircraftType,
          aircraftRegNum: this.aircraftRegNum,
          budget: this.budget,
          aircraftId: this.aircraftId,
          aircraftClassId: this.aircraftClassId,
          comment: this.comment
        }, files: {exterior: this.filesExterior, interior: this.filesInterior, diagram: this.filesDiagram}
      }
      await this.saveForm(data)
    },
    async setListAircraftsHandler() {
      await this.getAutocompleteInputs('aircrafts')
    },
    setActiveAircraftHandler(val, idx, obj) {
      this.SET_REG_NUM(obj.Reg_num)
      this.aircraftRegNum = obj.Reg_num
      this.aircraftType = obj.Type
      this.aircraftId = idx
      this.SET_ACTIVE_AIRCRAFT(val)
    },
    disabledBtn() {
      return this.getActiveAircraft === 0 ||
          this.getOperatorItems.length < 1 ||
          this.getRegNum.length < 1 || this.budget < 0
    }
  }
}
</script>

<style scoped lang="scss">
.cabinet {
  padding: 24px 0;

  &__title {
    @include h3;
    margin-bottom: 36px;
  }

  .table {
    width: 100%;
    margin-bottom: 32px;

    &__row {
      @include flexBetweenCenter;
      text-align: center;
      border-bottom: 1px solid $secondaryDarkColor;

      &_item {
        padding: 12px;
        @include body-14-400;
        flex: 0 0 12.5%;
        min-width: 100px;
        text-align: center;

        &:first-of-type {
          text-align: left;
        }

        &_header {
          @include body-14-600;
          text-align: center;
        }
      }
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;

    & > :first-child {
      flex: 0 0 45%;
    }

    & > :last-child {
      flex: 0 0 49%;
    }

    .left {
      margin-right: 8px;
      border: 1px solid $secondaryDarkColor;
      border-radius: 8px;

      &__wrapper {
        max-width: 600px;
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid $secondaryDarkColor;
      }

      &__title {
        @include h3;
      }

      &__description {
        margin-top: 16px;
        word-wrap: break-word;

        p {
          margin-top: 16px;
        }
      }

      &__info {
        text-align: left;
        padding: 16px;
        @include body-12-500;

        .contacts {
          padding-top: 16px;
          display: flex;
          flex-wrap: wrap;

          & > *:first-child {
            margin-right: 16px;
          }

          &__item {
            padding: 8px;

            img {
              margin-right: 8px;
            }

            a {
              color: $secondaryDarkestColor;
            }

          }
        }
      }
    }

    .right {
      .images, .dropdowns {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        margin-bottom: 24px;

        & > * {
          flex: 0 0 32%;
          min-width: 150px;
        }

        & > *:not(:last-child) {
          margin-right: 16px;
        }
      }

      &__btn {
        width: 170px;
        margin: 24px auto 0;
      }
    }
  }
}
</style>
