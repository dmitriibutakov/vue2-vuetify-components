<template>
  <div class="filter-block__items">
    <div class="filter-block__items-top">
      <div class="filter-block__items-inputs">
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="3" sm="4" lg="5"
              ><span class="title-filter"
              >Start Date Order:</span
              ></v-col
              >
              <v-row>
                <v-col cols="12">
                  <v-col cols="12">
                    <v-menu
                        ref="StartDateMenu"
                        v-model="StartDateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        :value="11"
                        min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="StartDateFormatted"
                            label="Date From"
                            placeholder="Date From"
                            dense
                            outlined
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        />
                      </template>
                      <v-date-picker
                          v-model="StartDate"
                          :max="
                                      new Date().toISOString().substr(0, 10)
                                    "
                          min="1950-01-01"
                          @change="
                                      $refs.StartDateMenu.save(StartDate)
                                    "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="3" sm="4" lg="5"
              ><span class="title-filter">OrderNum:</span></v-col
              >
              <v-col cols="9" sm="8" lg="7">
                <v-text-field
                    class="subheading"
                    v-model="query.orderNumber"
                    type="text"
                    placeholder="OrderNum"
                />
              </v-col>
            </v-col>
          </v-row>
        </div>
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="3" sm="4" lg="5"
              ><span class="title-filter"
              >OrderStatus:</span
              ></v-col
              >
              <v-col cols="9" sm="8" lg="7">
                <v-select
                    v-model="query.status"
                    :items="orderStatusItems"
                    item-text="Name"
                    item-value="Id"
                    multiple
                    class="mt-0"
                    dense
                    outlined
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.Name }}</span>
                    </v-chip>
                    <span
                        v-if="index === 1"
                        class="grey--text text-caption"
                    >
                                  (+{{ query.status.length - 1 }} others)
                                </span>
                  </template>
                </v-select>
              </v-col>
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="filter-block__items-inputs">
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="3" sm="4" lg="5"
              ><span class="title-filter"
              >End Date Order:</span
              ></v-col
              >
              <v-row>
                <v-col cols="12">
                  <v-col cols="12">
                    <v-menu
                        ref="EndDateMenu"
                        v-model="EndDateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="EndDateFormatted"
                            label="Date From"
                            placeholder="Date From"
                            dense
                            outlined
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        />
                      </template>
                      <v-date-picker
                          v-model="EndDate"
                          :max="
                                      new Date().toISOString().substr(0, 10)
                                    "
                          min="1950-01-01"
                          @change="$refs.EndDateMenu.save(EndDate)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="8" sm="6" lg="5">
                <div class="title-filter">Order Type</div>
                <v-select
                    v-model="query.orderType"
                    :items="orderTypeItems"
                    item-text="Name"
                    item-value="Id"
                    multiple
                    class="mt-0"
                    dense
                    outlined
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.Name }}</span>
                    </v-chip>
                    <span
                        v-if="index === 1"
                        class="grey--text text-caption"
                    >
                                  (+{{ query.orderType.length - 1 }} others)
                                </span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="8" sm="6" lg="5">
                <div class="title-filter">Flight Type</div>
                <v-select
                    v-model="query.flyType"
                    :items="flyTypeItems"
                    item-text="Name"
                    item-value="Id"
                    multiple
                    class="mt-0"
                    dense
                    outlined
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.Name }}</span>
                    </v-chip>
                    <span
                        v-if="index === 1"
                        class="grey--text text-caption">
                                  (+{{ query.flyType.length - 1 }} others)
                                </span>
                  </template>
                </v-select>
              </v-col>
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="filter-block__items-inputs">
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="3" sm="4" lg="5"
              ><span class="title-filter"
              >Client Name:</span
              ></v-col
              >
              <v-col cols="9" sm="8" lg="7">
                <v-text-field
                    class="subheading"
                    v-model="query.orderName"
                    type="text"
                    placeholder="Name Client"
                />
              </v-col>
            </v-col>
          </v-row>
        </div>
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="3" sm="4" lg="5"
              ><span class="title-filter"
              >Client Email:</span
              ></v-col
              >
              <v-col cols="9" sm="8" lg="7">
                <v-text-field
                    class="subheading"
                    v-model="query.orderEmail"
                    type="text"
                    placeholder="Email"
                />
              </v-col>
            </v-col>
          </v-row>
        </div>
        <div class="filter-block__items-inputs__item">
          <v-row class="d-flex justify-center mt-2">
            <v-col cols="12" class="filter-input">
              <v-col cols="3" sm="4" lg="5"
              ><span class="title-filter"
              >Client Surname</span
              ></v-col
              >
              <v-col cols="9" sm="8" lg="7">
                <v-text-field
                    class="subheading"
                    v-model="query.orderSurname"
                    type="text"
                    placeholder="Surname"
                />
              </v-col>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <div class="filter-block__btn mt-5">
      <button class="btn-filter mr-16" @click="searchFilter(query)">
        Apply filter
      </button>
      <button class="btn-filter" @click="resetFilter">
        Reset filter
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderFilter",
  props: {
    orderStatusItems: Array,
    orderTypeItems: Array,
    flyTypeItems: Array
  },
  data() {
    return {
      StartDate: null,
      query: {
        orderNumber: "",
        status: [0],
        orderType: [0],
        flyType: [0],
        orderEmail: "",
        orderSurname: "",
        orderName: "",
      },
      StartTime: {
        type: String,
        default: "T00:00:00Z",
      },
      StartDateFormatted: null,
      EndDateFormatted: null,
      EndTime: {
        type: String,
        default: "T23:59:59Z",
      },
      StartDateMenu: null,
      EndDateMenu: null,
      EndDate: null,
    }
  },
  methods: {
    searchFilter() {
      localStorage.setItem("filter", this.queryProps);
      this.$emit('setPage', 1)
      this.$emit('request')
      this.$emit('close')
    },
    resetFilter() {
      localStorage.setItem("filter", "none");
      this.query.orderNumber = "";
      this.query.status = [0];
      this.query.orderType = [0];
      this.query.flyType = [0];
      this.query.orderEmail = "";
      this.query.orderSurname = "";
      this.query.orderName = "";
      this.StartDateFormatted = null;
      this.EndDateFormatted = null;
      this.$emit('request')
      this.$emit('close')
    },
    formatDate(StartDate) {
      if (!StartDate) return null;
      const [year, month, day] = StartDate.split("-");
      return `${day}-${month}-${year}`;
    },
  },
  computed: {
    queryProps: {
      get: function () {
        let queryEmail = ``;
        let querySurname = ``;
        let queryName = ``;
        let queryDate = ``;
        let queryStatus = this.query.status.filter((item) => item !== 0);
        let queryType = this.query.orderType.filter((item) => item !== 0);
        let queryFlyType = this.query.flyType.filter((item) => item !== 0);
        if (
            this.StartDateFormatted &&
            this.EndDateFormatted &&
            this.StartTime.default &&
            this.EndTime.default != null
        ) {
          queryDate = `&StartDateTimeOrder=${this.parseDate(
              this.StartDateFormatted
          )}${this.StartTime.default}&EndDateTimeOrder=${this.parseDate(
              this.EndDateFormatted
          )}${this.EndTime.default}`;
        }
        if (this.query.orderEmail) {
          queryEmail = `&CEmail=${this.query.orderEmail}`;
        }
        if (this.query.orderSurname) {
          querySurname = `&CLastName=${this.query.orderSurname}`;
        }
        if (this.query.orderName) {
          queryName = `&CFirstName=${this.query.orderName}`;
        }
        return `OrderNum=${this.query.orderNumber}` +
            queryEmail +
            querySurname +
            queryName +
            queryDate +
            `${
                queryStatus[0] !== undefined ? `&OrderStatusId=${queryStatus}` : ""
            }` +
            `${queryType[0] !== undefined ? `&OrderTypeId=${queryType}` : ""}` +
            `${queryFlyType[0] !== undefined ? `&FlyTypeId=${queryFlyType}` : ""}`;
      },
      set: function (newValue) {
        return newValue;
      },
    },
  },
  watch: {
    StartDate(val) {
      this.StartDateFormatted = this.formatDate(val);
    },
    EndDate(val) {
      this.EndDateFormatted = this.formatDate(val);
    },
  },
}
</script>

<style scoped>

</style>
