<template>
  <v-container fluid v-if="order">
    <v-dialog persistent max-width="50%" v-model="modal">
      <v-card class="pa-4">
        <div ref="form">
          <v-row>
            <v-col :cols="12">
              <h2>{{ modalTitle }}</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col :class="{ hidden: hiddenInfo == 'add' }" :cols="2">
              <v-text-field
                  v-model="modalData.Id"
                  label="Id"
                  placeholder="Id"
                  dense
                  outlined
                  :disabled="hiddenInfo === 'add' || hiddenInfo === 'fly'"
                  type="text"
                  ref="modalId"
                  autocomplete="new-password"
                  hide-details
              />
            </v-col>
            <v-col v-if="modalTitle !== 'Fly info'" :cols="4">
              <v-select
                  ref="modalStatus"
                  v-model="offerStatusModal"
                  :items="offerStatusItems"
                  item-text="Name"
                  item-value="Id"
                  :label="modalData.OfferStatusDesc"
                  placeholder="Offer status"
                  dense
                  outlined
                  hide-details
              />
            </v-col>
            <v-col cols="4">
              <v-select
                  ref="modalFlyType"
                  v-model="modalData.FlyTypeId"
                  :items="flyTypeItems"
                  item-text="Name"
                  item-value="Id"
                  label="Fly type"
                  placeholder="Fly type"
                  dense
                  outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <!--              <v-menu-->
              <!--                  ref="dateMenu"-->
              <!--                  v-model="dateMenu"-->
              <!--                  :close-on-content-click="false"-->
              <!--                  transition="scale-transition"-->
              <!--                  offset-y-->
              <!--                  min-width="auto"-->
              <!--              >-->
              <!--                <template v-slot:activator="{ on, attrs }">-->
              <!--                  <v-text-field-->
              <!--                      v-model="dateFormatted"-->
              <!--                      label="Date From"-->
              <!--                      placeholder="Date From"-->
              <!--                      dense-->
              <!--                      :rules="rulesAll"-->
              <!--                      outlined-->
              <!--                      readonly-->
              <!--                      v-bind="attrs"-->
              <!--                      v-on="on"-->
              <!--                  />-->
              <!--                </template>-->
              <!--                <v-date-picker-->
              <!--                    v-model="date"-->
              <!--                    :max="new Date().toISOString().substr(0, 10)"-->
              <!--                    min="1950-01-01"-->
              <!--                    @change="save('dateMenu', date)"-->
              <!--                ></v-date-picker>-->
              <!--              </v-menu>-->
              <span>Change {{ ArrivalOrDepartureText }}</span>
              <v-text-field @click="isShowCalendar = !isShowCalendar"
                            :value="(modalData.DateTimeFrom || modalData.DateTimeArrival) ?
                             (modalData.DateTimeFrom.length > 10 ? new Date(modalData.DateTimeFrom)
                              : new Date(modalData.DateTimeArrival)): 'no date'"/>
              <span v-if="modalData.DateTimeFrom && modalData.DateTimeFrom.length > 10">
                <vc-date-picker v-model="DateTimeFrom" v-if="isShowCalendar"
                                :min-date="new Date()"
                                color="blue"
                                mode="dateTime"
                                is24hr/>
                </span>
              <span v-else-if="modalData.DateTimeArrival && modalData.DateTimeArrival.length > 10">
                <vc-date-picker v-model="DateTimeArrival" v-if="isShowCalendar"
                                :min-date="new Date()"
                                color="blue"
                                mode="dateTime"
                                is24hr/>
                </span>
              <span v-else>
                no date
                </span>
            </v-col>
            <!--            <v-col cols="4">-->
            <!--              <vue-timepicker-->
            <!--                  hide-clear-button-->
            <!--                  v-model="time"-->
            <!--                  input-width="200px"-->
            <!--                  label="time"-->
            <!--                  @click:minute="save('timeMenu', time)"-->
            <!--              ></vue-timepicker>-->
            <!--            </v-col>-->
          </v-row>
          <v-row>
            <v-col cols="6">
              <Autocomplete
                  :list="fromItems"
                  :selectionitem.sync="fromMenu"
                  :selection="`${modalData.CityFrom}, ${modalData.AirportNameFrom}, ${modalData.IcaoAirportFrom}`"
                  url="airports"
                  urlname="Autocomplete"
                  label="From"
                  :timeout="150"
                  @updateauto="
                  save('fromMenu','', fromMenu)">
                <template v-slot:default="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{
                        item.Municipality +
                        (item.Name ? `, ${item.Name}` : "") +
                        (item.Icao ? `, ${item.Icao}` : " ")
                      }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </Autocomplete>
            </v-col>
            <v-col cols="6">
              <Autocomplete
                  :list="toItems"
                  :selectionitem.sync="toMenu"
                  :selection="`${modalData.CityTo}, ${modalData.AirportNameTo}, ${modalData.IcaoAirportTo}`"
                  url="airports"
                  urlname="Autocomplete"
                  label="To"
                  :timeout="150"
                  @updateauto="save('toMenu','', toMenu)">
                <template v-slot:default="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{
                        item.Municipality +
                        (item.Name ? `, ${item.Name}` : "") +
                        (item.Icao ? `, ${item.Icao}` : " ")
                      }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </Autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" :class="{ hidden: hiddenInfo == 'fly' }">
              <Autocomplete
                  :list="operatorItems"
                  :selectionitem.sync="operatorMenu"
                  :selection="
                  operators
                    ? operators
                    : `${operatorMenu.Name}, ${operatorMenu.City}, ${operatorMenu.CountryDesc}`
                "
                  url="operators"
                  urlname="Autocomplete"
                  label="Operator"
                  :timeout="150"
                  @updateauto="
                  save(
                    'operatorMenu',
                    operatorMenu.Name +
                      (operatorMenu.City ? `, ${operatorMenu.City}` : '') +
                      (operatorMenu.CountryDesc
                        ? `, ${operatorMenu.CountryDesc}`
                        : ' '),
                    operatorMenu
                  )
                "
              >
                <template v-slot:default="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{
                        item.Name +
                        (item.City ? `, ${item.City}` : "") +
                        (item.CountryDesc ? `, ${item.CountryDesc}` : " ")
                      }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </Autocomplete>
            </v-col>
            <v-col cols="3">
              <v-text-field
                  ref="modalPax"
                  v-model="modalData.Pax"
                  label="Pax"
                  placeholder="Pax"
                  dense
                  outlined
                  :rules="rulesAll"
                  type="number"
              />
            </v-col>
            <v-col v-if="modalTitle !== 'Fly info'" cols="3">
              <vue-timepicker
                  hide-clear-button
                  v-model="flyTimeModal"
                  input-width="150px"
                  label="Fly time"
              ></vue-timepicker>
              <!--              <v-text-field-->
              <!--                ref="modalFlyTime"-->
              <!--                v-model="flyTimeModal"-->
              <!--                label="Flight Time"-->
              <!--                placeholder="Flight Time"-->
              <!--                autocomplete="new-password"-->
              <!--                dense-->
              <!--                :rules="rulesAll"-->
              <!--                outlined-->
              <!--                type="text"-->
              <!--              />-->
            </v-col>
          </v-row>
          <v-row v-if="modalTitle !== 'Fly info'">
            <!--            <v-col cols="4">-->
            <!--              <Autocomplete-->
            <!--                  :list="aircraftClassItems"-->
            <!--                  :selectionitem.sync="aircraftClassMenu"-->
            <!--                  :selection="-->
            <!--                            aircraftClass ? aircraftClass : modalData.AircraftClassDesc-->
            <!--                          "-->
            <!--                  url="aircrafts/classes"-->
            <!--                  urlname="Autocomplete"-->
            <!--                  label="Aircraft class"-->
            <!--                  :timeout="150"-->
            <!--                  @updateauto="-->
            <!--                            save(-->
            <!--                              'aircraftClassMenu',-->
            <!--                              aircraftClassMenu.Name,-->
            <!--                              aircraftClassMenu-->
            <!--                            )-->
            <!--                          "-->
            <!--              >-->
            <!--                <template v-slot:default="{ item }">-->
            <!--                  <v-list-item-content>-->
            <!--                    <v-list-item-title>-->
            <!--                      {{ item.Name }}-->
            <!--                    </v-list-item-title>-->
            <!--                  </v-list-item-content>-->
            <!--                </template>-->
            <!--              </Autocomplete>-->
            <!--            </v-col>-->
            <v-col cols="4">
              <Autocomplete
                  :list="aircraftItems"
                  :selectionitem.sync="aircraftMenu"
                  :selection="
                            aircraft
                              ? aircraft
                              : modalData.AircraftType
                          "
                  url="aircrafts"
                  urlname="Type"
                  :urlquery="`${modalData.OperatorId ? `OperatorId=${modalData.OperatorId}` : `` }`"
                  label="Aircraft"
                  :timeout="150"
                  @updateauto="
                            save(
                              'aircraftMenu',
                              `${aircraftMenu.Type} `,
                              aircraftMenu
                            )
                          "
              >
                <template v-slot:default="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ `${item.Type}` }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </Autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" :class="{ hidden: hiddenInfo === 'fly' }">
              <v-text-field
                  v-model="modalData.AmountFromOperator"
                  label="Operator Price"
                  placeholder="Operator Price"
                  dense
                  autocomplete="new-password"
                  outlined
                  @input="
                  modalData.Amount =
                    +modalData.AmountFromOperator +
                    +(modalData.AmountFromOperator * (amountPercent / 100))
                "
              ></v-text-field>
            </v-col>
            <v-col cols="1" :class="{ hidden: hiddenInfo === 'fly' }">
              <v-text-field
                  v-model="amountPercent"
                  label="%"
                  placeholder="%"
                  autocomplete="new-password"
                  dense
                  outlined
                  @input="
                  modalData.Amount =
                    +modalData.AmountFromOperator +
                    +(modalData.AmountFromOperator * (amountPercent / 100))
                "
              ></v-text-field>
            </v-col>
            <v-col cols="3" :class="{ hidden: hiddenInfo === 'fly' }">
              <v-text-field
                  v-model="modalData.Amount"
                  label="Price with comission"
                  placeholder="Price with comission"
                  autocomplete="new-password"
                  dense
                  outlined
                  disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                  v-model="modalData.Description"
                  placeholder="Description"
                  type="text"
                  rows="4"
                  outlined
                  row-height="10px"
                  autocomplete="new-password"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="images"
                   v-if="modalTitle !== 'Fly info' && modalData.AircraftRegNum && modalData.FlyDesc.toLowerCase() !== 'cargo'">
              <v-block-actions-images :arr-file="filesExterior"
                                      :name="'exterior'"
                                      :watch-prop="regNum"
                                      :title="'Aircraft exterior'"
                                      :default-item="getPhotosExterior[0] && getPhotosExterior[0].Path"
                                      @deleteFile="deleteFile"
                                      @addFile="addFile"/>
              <v-block-actions-images :arr-file="filesInterior"
                                      :name="'interior'"
                                      :watch-prop="regNum"
                                      :title="'Aircraft interior'"
                                      :default-item="getPhotosInterior[0] && getPhotosInterior[0].Path"
                                      @deleteFile="deleteFile"
                                      @addFile="addFile"/>
              <v-block-actions-images :arr-file="filesDiagram"
                                      :name="'diagram'"
                                      :watch-prop="regNum"
                                      :title="'Airplane diagram'"
                                      :default-item="getPhotosDiagram[0] && getPhotosDiagram[0].Path"
                                      @deleteFile="deleteFile"
                                      @addFile="addFile"/>
            </v-col>
          </v-row>
        </div>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn color="red darken-1" text @click="modal = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="saveModal"> Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent max-width="50%" v-model="modalRequest">
      <v-card class="pa-4">
        <v-form ref="form">
          <v-row>
            <v-col :cols="12">
              <h2>Request Offer from Operators</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="3">
              <v-autocomplete
                  v-model="requestOp.region"
                  :items="requestRegionItems"
                  :search-input.sync="requestRegionSearch"
                  multiple
                  label="Region"
                  item-text="Name"
                  outlined
                  hide-no-data
                  offset-y
                  dense
                  @focus="currentAutoItem = 'region'"
                  @change="requestFromOperator"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.ShortName }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ requestOp.region.length - 1 }} others)
                  </span>
                </template>
                <template v-slot:append-item>
                  <div v-intersect="onIntersect"/>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col :cols="3">
              <v-autocomplete
                  v-model="requestOp.country"
                  :items="requestOpItems"
                  :search-input.sync="requestCountrySearch"
                  multiple
                  label="Country"
                  item-text="Name"
                  outlined
                  hide-no-data
                  offset-y
                  dense
                  @focus="currentAutoItem = 'country'"
                  @change="requestFromOperator"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.Name }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ requestOp.country.length - 1 }} others)
                  </span>
                </template>
                <template v-slot:append-item>
                  <div v-intersect="onIntersect"/>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col :cols="6">
              <v-autocomplete
                  v-model="requestOp.operator"
                  :items="reqOperatorItems"
                  :search-input.sync="requestOpSearch"
                  label="Operator"
                  item-value="Name"
                  item-text="Name"
                  outlined
                  hide-no-data
                  no-filter
                  offset-y
                  dense
                  @focus="currentAutoItem = 'operator'"
                  @change="requestFromOperator"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-title
                      :key="item.Id"
                      v-text="
                      `${
                        item.Name +
                        (item.City ? `, ${item.City}` : '') +
                        (item.Country ? `, ${item.Country}` : ' ')
                      }`
                    "
                  ></v-list-item-title>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="3">
              <v-text-field
                  label="Pax from"
                  placeholder="Pax from"
                  v-model="requestOp.PAXFrom"
                  autocomplete="new-password"
                  dense
                  outlined
                  type="number"
                  @input="requestFromOperator(requestOp.PAXFrom, 'paxFrom')"
              />
            </v-col>
            <v-col :cols="3">
              <v-text-field
                  label="Pax to"
                  placeholder="Pax to"
                  v-model="requestOp.PAXTo"
                  autocomplete="new-password"
                  dense
                  type="nuimber"
                  @input="requestFromOperator(requestOp.PAXTo, 'paxFrom')"
              />
            </v-col>
            <v-col :cols="6">
              <v-select
                  label="Aircraft class"
                  placeholder="Aircraft class"
                  v-model="requestOp.AircraftClass"
                  autocomplete="new-password"
                  :items="aircraftClassList"
                  item-text="Name"
                  multiple
                  dense
                  outlined
                  type="text"
                  @input="
                  requestFromOperator(requestOp.AircraftClass, 'aircraftClass')
                "
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.Name }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ requestOp.AircraftClass.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-progress-circular
                  v-if="requestLoading"
                  indeterminate
                  color="primary"
              ></v-progress-circular>
              <p v-else>Founded {{ reqCounter }} operators</p>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn color="red darken-1" text @click="modalRequest = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="requestGenerateOffers">
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent max-width="50%" v-model="emailModal">
      <v-card class="pa-4">
        <v-form ref="form">
          <v-row>
            <v-col :cols="12">
              <h2>SEND OFFERS TO CLIENT BY EMAIL</h2>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>
                Founded {{ confirmedLength }} operators of status "Operator
                confirmed"
              </p>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions class="d-flex justify-space-around">
          <v-btn color="red darken-1" text @click="emailModal = false">
            Cancel
          </v-btn>
          <v-btn
              color="green darken-1"
              :disabled="confirmedLength === 0"
              text
              @click="requestToClient"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent max-width="50%" v-model="orderModal">
      <v-card class="pa-4">
        <v-form ref="form">
          <v-row>
            <v-col :cols="12">
              <h2>Description</h2>
              {{modalData}}
            </v-col>
                        <v-col :cols="12">
                          <v-textarea
                              v-model="modalData.Description"
                              placeholder="Description"
                              type="text"
                              rows="4"
                              outlined
                              row-height="10px"
                          />
                        </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn color="red darken-1" text @click="orderModal = false">
            Cancel
          </v-btn>
                    <v-btn color="green darken-1" text @click="saveModal"> Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="order">
      <v-row class="offer__client">
        <v-col col="8">
          <v-row class="offer__client-info">
            <v-col class="offer__client-item" cols="4">
              <p>
                DateTime:
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
              </p>
            </v-col>
            <v-col class="offer__client-item" cols="4">
              <p>Num: {{ order.OrderNum }}</p>
            </v-col>
            <v-col class="offer__client-item" cols="4">
              <p>Client : {{ order.CFirstName }} {{ order.CLastName }}</p>
            </v-col>
            <v-col class="offer__client-item" cols="4">
              <p>Source: {{ order.OrderSource }}</p>
            </v-col>
            <v-col class="offer__client-item" cols="4">
              <p>Type: {{ order.TypeDesc }}</p>
            </v-col>
            <v-col class="offer__client-item" cols="4">
              <p>Phone: {{ order.CPhone }}</p>
            </v-col>
            <v-col class="offer__client-item status" cols="4">
              <p>Status:</p>
              <v-select
                  ref="orderStatus"
                  v-model="order.OrderStatusId"
                  :items="orderStatusItems"
                  item-text="Name"
                  item-value="Id"
                  placeholder="Select status"
                  @change="changeOrderStatus"
              />
            </v-col>
            <v-col class="offer__client-item" cols="4"></v-col>
            <v-col class="offer__client-item" cols="4">
              <p>Email: {{ order.CEmail }}</p>
            </v-col>
                        <div class="offer__client-edit" @click="orderHandler(order)">
                          <v-icon>mdi-pencil</v-icon>
                        </div>
          </v-row>
        </v-col>
        <v-divider vertical/>
        <v-col col="4" md="4" class="offer__client-buttons mx-0 pt-0">
          <v-btn text @click="generatePdfOffers">Generate PDF Offers</v-btn>
          <v-btn @click="modalRequestOffers" text>
            Request offer from operators
          </v-btn>
          <v-btn @click="emailModalOffers" text
          >Send offers to client by email
          </v-btn
          >
        </v-col>
      </v-row>

      <v-row
          class="offer__client-description"
          v-if="order.FlightLegs[0].Description !== ''"
      >
      </v-row>
      <v-divider/>
      <v-tabs v-model="currentTab" class="mb-0">
        <v-tabs-slider/>
        <v-tab v-for="(el, i) in order.FlightLegs" :key="i">
          <span v-if="el.DateTimeFrom && el.DateTimeFrom.length > 10">
              {{
              el.DateTimeFrom
                  | getFormattedDate({month: "long", day: "2-digit"})
            }}
          | {{ el.CityFrom }} - {{ el.CityTo }}
          </span>
          <span v-else-if="el.DateTimeArrival && el.DateTimeArrival.length > 10">
            {{
              el.DateTimeArrival
                  | getFormattedDate({month: "long", day: "2-digit"})
            }}
          | {{ el.CityFrom }} - {{ el.CityTo }}
        </span>
          <span v-else>
           no date  | {{ el.CityFrom }} - {{ el.CityTo }}
        </span>
        </v-tab>
        <v-tab class="handling">Handling</v-tab>
      </v-tabs>
      <v-divider/>
      <v-tabs-items v-model="currentTab">
        <v-tab-item v-for="(el, i) in order.FlightLegs" :key="i">
          <v-col class="pa-0">
            <p v-if="el === null">No offer yet</p>
            <table class="fly-table" v-else :key="el.OrderNum">
              <thead>
              <tr>
                <th><strong>Fly Type</strong></th>
                <th><strong>Date
                  {{ el.DateTimeFrom.length > 10 ? 'of departure' : 'of destination' }}</strong></th>
                <th><strong>From</strong></th>
                <th><strong>To</strong></th>
                <!--                <th><strong>Aircraft</strong></th>-->
                <!--                <th><strong>AircraftClass</strong></th>-->
                <th><strong>Pax</strong></th>
                <th><strong>Edit</strong></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td cols="4">{{ el.FlyDesc }}</td>
                <td v-if="el.DateTimeFrom && el.DateTimeFrom.length > 10">
                  {{
                    el.DateTimeFrom
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
                <td v-else-if="el.DateTimeArrival && el.DateTimeArrival.length > 10">
                  {{
                    el.DateTimeArrival
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
                  {{
                    `${el.CountryFrom} | ${el.CityFrom} | ${el.IcaoAirportFrom}`
                  }}
                </td>
                <td>
                  {{ `${el.CountryTo} | ${el.CityTo} | ${el.IcaoAirportTo}` }}
                </td>
                <!--                <td cols="4">-->
                <!--                  {{ el.AircraftType }}-->
                <!--                </td>-->
                <!--                <td cols="4">{{ el.AircraftClassDesc }}</td>-->
                <td cols="4">{{ el.Pax }}</td>
                <td>
                  <v-icon @click="flyInfoHandler(el)">mdi-pencil</v-icon>
                </td>
              </tr>
              </tbody>
            </table>
            <!-- <OrderInfoItem @editHandler="offerHandler" :item="el" /> -->
          </v-col>
          <div class="pa-0">
            <v-app-bar elevation="1" height="70px">
              <v-row class="mt-3">
                <v-col>
                  <h3><strong>OFFERS</strong></h3>
                </v-col>
                <v-spacer/>
                <v-col cols="8">
                  <v-text-field
                      v-model="query.company"
                      label="Company"
                      placeholder="Company"
                      autocomplete="new-password"
                      dense
                  />
                </v-col>
                <v-spacer/>
                <v-col cols="1">
                  <v-select
                      v-model="query.status"
                      :items="offerStatusItems"
                      item-text="Name"
                      item-value="Id"
                      label="Status"
                      placeholder="Status"
                      class="mt-0 status-search"
                      dense
                      outlined
                  >
                    <template v-slot:item="{ item, attrs, on }">
                      <v-list-item
                          :class="{
                          'red lighten-3': item.Name == 'Prepare',
                          'amber lighten-3': item.Name == 'Sent to operator',
                          ' light-blue lighten-4':
                            item.Name == 'Operator confirmed',
                          'green lighten-4': item.Name == 'Sent to client',
                          'grey lighten-1': item.Name == 'Completed',
                        }"
                          v-bind="attrs"
                          v-on="on"
                      >
                        <v-list-item-title
                            :id="attrs['aria-labelledby']"
                            v-text="item.Name"
                        ></v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col>
                  <v-btn primary @click="openAddModal(el)"> Add</v-btn>
                </v-col>
              </v-row>
            </v-app-bar>
            <v-data-table
                v-if="ourOffer"
                :items="filterOffer(el.Id)"
                :headers="offerHeaders"
                :page.sync="pageOffer"
                :items-per-page="countOffer"
                class="offer-table"
                hide-default-footer
            >
              <template v-slot:item="{ item }">
                <OrderInfoItem
                    :key="item.Id"
                    @editHandler="offerHandler"
                    :item="item"
                />
              </template>
            </v-data-table>
            <div v-else>
              <h2 class="text-center mt-4">No data available</h2>
            </div>
            <v-row align="center" class="px-4 d-flex align-center">
              <v-col cols="auto" md="auto" class="showing d-flex align-center">
                <span>Showing {{ countOffer }} of {{ totalOffer }}</span>
                <v-select
                    class="pt-6"
                    v-model="limitOffer"
                    :items="[8, 10, 15, 30]"
                    @input="requestHandler"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-pagination
                    v-model="pageOffer"
                    :length="Math.ceil(totalOffer / limitOffer)"
                    :total-visible="9"
                    @input="paginationHandler"
                />
              </v-col>

              <v-col cols="12" md="1" class="d-flex ml-auto justify-end">
                <v-btn
                    color="red darken-1"
                    text
                    @click="buttonHandler(order.OrderNum)"
                >Close
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-data-table
              dense
              :headers="headers"
              :items="desserts"
              item-key="name"
              hide-default-footer
          ></v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </div>
<div class="wrap" style="visibility: hidden">
    <section class="pdf" ref="pdfContent">
      <div v-if="allFlyToPdf" class="pdf__wrapper">
        <div class="pdf__content">
          <v-pdf-header :order-num="order.OrderNum"/>
          <v-pdf-fly-info :table-headers="['№', 'Date', 'From', 'To', 'Departure LT', 'Arrival LT']"
                          :table-data="allFlyToPdf.Schedule"/>
          <v-pdf-offers :arr="allFlyToPdf.AircraftOffer" :table-data="allFlyToPdf.AircraftOffer.slice(0, 3)"/>
        </div>
        <v-pdf-footer/>
      </div>
<!--      <div v-if="allFlyToPdf && allFlyToPdf.AircraftOffer.length > 3" class="html2pdf__page-break"/>-->
      <div v-if="allFlyToPdf && allFlyToPdf.AircraftOffer.length > 3" class="pdf__wrapper">
        <div v-if="allFlyToPdf" class="pdf__content">
          <v-pdf-header :order-num="order.OrderNum"/>
          <v-pdf-offers :arr="allFlyToPdf.AircraftOffer" :table-data="allFlyToPdf.AircraftOffer.slice(3, 7)"/>
        </div>
        <v-pdf-footer/>
      </div>
<!--      <div v-if="allFlyToPdf && allFlyToPdf.AircraftOffer.length > 8" class="html2pdf__page-break"/>-->
      <div v-if="allFlyToPdf && allFlyToPdf.AircraftOffer.length > 8" class="pdf__wrapper">
        <div v-if="allFlyToPdf" class="pdf__content">
          <v-pdf-header :order-num="order.OrderNum"/>
          <v-pdf-offers :arr="allFlyToPdf.AircraftOffer" :table-data="allFlyToPdf.AircraftOffer.slice(7, 11)"/>
        </div>
        <v-pdf-footer/>
      </div>
<!--      <div v-if="allFlyToPdf && allFlyToPdf.AircraftOffer.length > 13" class="html2pdf__page-break"/>-->
      <div v-if="allFlyToPdf && allFlyToPdf.AircraftOffer.length > 13" class="pdf__wrapper">
        <div v-if="allFlyToPdf" class="pdf__content">
          <v-pdf-header :order-num="order.OrderNum"/>
          <v-pdf-offers :arr="allFlyToPdf.AircraftOffer" :table-data="allFlyToPdf.AircraftOffer.slice(11, 15)"/>
        </div>
        <v-pdf-footer/>
      </div>
      <div class="html2pdf__page-break"/>
      <div class="pdf__wrapper">
        <div class="pdf__content">
          <v-pdf-header :order-num="order.OrderNum"/>
          <v-pdf-notes/>
        </div>
        <v-pdf-footer/>
      </div>
    </section>
</div>
    <!--    </tml2pdf>-->
  </v-container>
  <div v-else>
    <v-divider class="mb-3"/>
    <Loader/>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js';
import OrderInfoItem from "../OrderInfoItem";
import {getFormattedDate} from "../../../filters";
import {mapActions, mapGetters} from "vuex";
import Loader from "../../Loader";
import Autocomplete from "@/components/Autocomplete";
import VueTimepicker from "@/components/Timepicker"
import VPdfHeader from "@/components/Orders/OrderInfo/v-pdf-header";
import VPdfFlyInfo from "@/components/Orders/OrderInfo/v-pdf-fly-info";
import VPdfNotes from "@/components/Orders/OrderInfo/v-pdf-notes";
import VPdfFooter from "@/components/Orders/OrderInfo/v-pdf-footer";
import VPdfOffers from "@/components/Orders/OrderInfo/v-pdf-offers";
import VBlockActionsImages from "@/shares/components/VBlockActionsImages";
import filesMixin from "@/mixins/filesMixin";

export default {
  name: "OrderInfo",
  data() {
    return {
      pdffile: '',
      regNum: '',
      headers: [
        {
          text: "Type",
          value: "name",
        },
        {text: "Provider", value: "calories"},
        {text: "Service", value: "fat"},
        {text: "Description", value: "fat"},
        {text: "Count", value: "fat"},
        {text: "Cost", value: "fat"},
        {text: "Discount", value: "fat"},
        {text: "Price", value: "fat"},
        {text: "Actions", value: "fat"},
      ],
      order: undefined,
      confirmedLength: 0,
      orderFly: null,
      rulesAll: [(v) => !!v || "Name is required"],
      fromItems: [],
      toItems: [],
      operatorItems: [],
      aircraftClassItems: [],
      aircraftItems: [],
      flyTypeItems: [],
      offerStatusItems: [],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%",
        },
      ],
      offerHeaders: [
        {
          text: "Operator",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "Fly Type",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "Date",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "From",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "To",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "Aircraft",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "Aircraft Class",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "Pax",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "Operator price",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
        {
          text: "Total price",
          width: "1%",
          value: "actions",
          sortable: false,
          class: "blue-grey title lighten-4",
        },
      ],
      isShowCalendar: false,
      flyTimeModal: "00:00",
      dateFormatted: null,
      currentTab: 0,
      ourOffer: [],
      modal: false,
      orderModal: false,
      modalRequest: false,
      emailModal: false,
      modalData: {},
      fromMenu: {},
      date: null,
      dateMenu: null,
      time: null,
      timeMenu: null,
      fromCountry: null,
      toMenu: {},
      toCountry: null,
      operatorMenu: {},
      operators: "",
      aircraftClassMenu: {},
      aircraftClass: "",
      aircraftMenu: {},
      aircraft: "",
      modalTitle: null,
      hiddenInfo: null,
      flyTypeModal: {
        name: null,
        id: null,
      },
      offerStatusModal: 0,
      query: {
        company: "",
        FlyInfoId: "",
        status: {
          Id: 0,
          Name: "All",
        },
      },
      requestLoading: false,
      limit: 10,
      counter: 0,
      pageOffer: 1,
      limitOffer: 8,
      countOffer: 0,
      totalOffer: 0,
      // Request oppers
      requestOp: {
        country: null,
        region: null,
        operator: null,
        PAXFrom: null,
        PAXTo: null,
        AircraftClass: null,
      },
      requestOpItems: [],
      requestOpSearch: "",
      requestCountrySearch: "",
      requestRegionItems: [],
      requestRegionSearch: "",
      reqCountryMenu: null,
      reqCityMenu: null,
      reqOperatorMenu: null,
      reqOperatorItems: [],
      reqCounter: 0,
      // Order Modal Start
      orderFlyNum: null,
      orderDate: null,
      orderDateMenu: null,
      orderTime: null,
      orderTimeMenu: null,
      orderStatus: {
        Name: null,
        Id: null,
      },
      orderStatusItems: [],
      orderSource: null,
      orderType: {
        Name: null,
        Id: null,
      },
      orderTypeItems: [],
      orderClientInfo: {
        Name: null,
        Phone: null,
        Email: null,
      },
      allFlyToPdf: null,
      amountPercent: 10,
      allTabs: null,
      getCurrentOrderTab: null,
      loader: true,
      flyInfoDesc: "",
      aircraftClassList: null,
      currentAutoItem: null,
      autoLimit: 10,
      DateTimeFrom: "",
      DateTimeArrival: ""
    };
  },
  filters: {
    getFormattedDate,
  },
  mixins: [filesMixin],
  components: {
    // eslint-disable-next-line vue/no-unused-components
    VPdfOffers,
    VPdfFlyInfo,
    VBlockActionsImages,
    VPdfFooter,
    VPdfNotes,
    VPdfHeader,
    OrderInfoItem,
    Loader,
    Autocomplete,
    VueTimepicker
  },
  props: {
    item: {
      type: Object,
      require: true,
    },
  },
  async created() {
    await this.getCurrentTab();
    await this.getAllTabs();
    const id = this.allTabs.filter((el, idx) => {
      return idx === this.getCurrentOrderTab;
    })[0];
    await this.fetchOrderTab(id);
    await this.requestHandler();
    this.order = this.currentOrder();
    if (this.order) {
      this.loader = false;
    }
    this.flyInfoDesc = this.order.FlightLegs[0].Description;
    this.query.FlyInfoId = this.order.FlightLegs[this.currentTab].Id;
    await this.$api.request.getTable(`orders/flyType`).then((resp) => {
      this.flyTypeItems = resp.data.Data;
    });
    await this.$api.request.getTable(`orders/offerStatus`).then((resp) => {
      this.offerStatusItems = resp.data.Data;
    });

    await this.$api.request.getTable(`orders/status`).then((resp) => {
      this.orderStatusItems = resp.data.Data;
    });
    await this.$api.request.getTable(`orders/type`).then((resp) => {
      this.orderTypeItems = resp.data.Data;
    });
  },
  computed: {
    ...mapGetters('orders', ['currentTabGetter',
      'getAllOrders',
      'getCurrentOrder', 'getPhotosExterior', 'getPhotosInterior', 'getPhotosDiagram']),
    queryProps() {
      let queryflyInfoId = ``;
      if (this.query.FlyInfoId) {
        queryflyInfoId = `FlyInfoId=${this.query.FlyInfoId}`;
      }
      let queryStatus =
          typeof this.query.status == "number"
              ? this.query.status
              : this.query.status.Id;

      return (
          queryflyInfoId +
          `${
              this.query.company
                  ? `&OperatorName=${this.query.company}&state=true`
                  : ""
          }` +
          `${queryStatus !== 0 ? `&OfferStatusId=${queryStatus}` : ""}`
      );
    },
    ArrivalOrDepartureText() {
      if (this.modalData.DateTimeFrom) {
        return this.modalData.DateTimeFrom.length > 10 ? 'Date From' : 'Date is not defined'
      } else if (this.modalData.DateTimeArrival) {
        return this.modalData.DateTimeArrival.length > 10 ? "Date Arrival" : 'Date is not defined'
      } else return 'Date is not defined'
    },
  },
  watch: {
    DateTimeFrom(el) {
      this.modalData.DateTimeArrival = ""
      this.modalData.DateTimeFrom = el.toISOString()
    },
    DateTimeArrival(el) {
      this.modalData.DateTimeFrom = ""
      this.modalData.DateTimeArrival = el.toISOString()
    },
    currentTab() {
      this.query.FlyInfoId = this.order.FlightLegs[this.currentTab].Id;
    },
    queryProps() {
      if (this.order !== undefined) {
        this.requestHandler();
      }
    },
    query: {
      handler: function () {
        this.paginationHandler(1);
      },
      deep: true,
    },

    limitOffer() {
      this.paginationHandler(1);
      this.requestHandler();
    },
    requestCountrySearch(value) {
      if (value === null || value === undefined) {
        return;
      }
      this.loadAutocomplete(value);
    },
    requestOpSearch(value) {
      if (value === null || value === undefined) {
        return;
      }
      this.loadAutocomplete(value);
    },
    requestRegionSearch(value) {
      if (value === null || value === undefined) {
        return;
      }
      this.loadAutocomplete(value);
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
    // date(val) {
    //   this.dateFormatted = this.formatDate(val);
    // },
    orderDate(val) {
      this.dateFormatted = this.formatDate(val);
    }
  },
  methods: {
    ...mapActions("orders", ["fetchOrderTab", "deleteTab", 'getAircraftImages', 'deleteAircraftImages', 'saveAircraftImages']),
    async loadAutocomplete(value) {
      switch (this.currentAutoItem) {
        case "country":
          var regionArray = this.requestOp.region;
          await this.$api.request
              .getTable(
                  `countries?Name=${value}${
                      this.requestRegionItems[0] ? `&RegionDesc=${regionArray}` : ""
                  }&limit=${this.autoLimit}`
              )
              .then((data) => {
                this.requestOpItems = [...data.data.Data];
              });
          break;
        case "region":
          await this.$api.request
              .getTable(`regions?Name=${value}&limit=${this.autoLimit}`)
              .then((data) => {
                this.requestRegionItems = [...data.data.Data];
              });
          break;
        case "operator":
          await this.$api.request
              .getTable(
                  `operators?Name=${value}&Country=${
                      this.requestOp.country ? this.requestOp.country : ""
                  }&Region=${
                      this.requestOp.region ? this.requestOp.region : ""
                  }&PAXFrom=${
                      this.requestOp.PAXFrom ? this.requestOp.PAXFrom : "0"
                  }&PAXTo=${
                      this.requestOp.PAXTo ? this.requestOp.PAXTo : ""
                  }&Class=${
                      this.requestOp.AircraftClass ? this.requestOp.AircraftClass : ""
                  }&limit=20`
              )
              .then((data) => {
                this.reqOperatorItems = [...data.data.Data];
              });
          break;
      }
    },
    async onIntersect(isIntersecting) {
      if (isIntersecting) {
        if (this.search === null || this.search === undefined) {
          return;
        }
        this.autoLimit += 20;
        switch (this.currentAutoItem) {
          case "country":
            await this.loadAutocomplete(this.requestCountrySearch);
            break;
          case "operator":
            await this.loadAutocomplete(this.requestOpSearch);
            break;
        }
      }
    },
    async emailModalOffers() {
      await this.$api.request
          .getTable(`orders/clientOfferData?OrderNum=${this.order.OrderNum}`)
          .then((resp) => {
            this.emailModal = true;
            this.confirmedLength = resp.data.AircraftOffer.length
          });
    },
    currentOrder() {
      return this.$store.state.orders.currentOrder;
    },
    getCurrentTab() {
      this.getCurrentOrderTab = this.$store.state.orders.currentTab;
    },
    getAllTabs() {
      this.allTabs = this.$store.state.orders.tabs;
    },
    async generatePdf(enableDownload, enableSend) {
      const pdfOptions = {
        filename: 'offer.pdf',
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'},
      };
      const html2pdfSetup = html2pdf().set(pdfOptions).from(this.$refs.pdfContent)

      if (enableDownload) {
        await html2pdfSetup.save()
      }

      if (enableSend) {
        const pdfData = await html2pdfSetup.outputPdf()
        console.log(pdfData)
        const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })
        const formData = new FormData()
        formData.append('pdf', pdfBlob, 'offer.pdf')
        return formData
      }
    },
    async generatePdfOffers() {
      const res = await this.$api.request.getTable(
          `orders/clientOfferData?OrderNum=${this.order.OrderNum}`
      );
      this.allFlyToPdf = res.data;
      await this.generatePdf(true, false)
    },
    async changeOrderStatus() {
      await this.$api.request
          .editRow({
            url: `orders`,
            data: JSON.stringify(this.order),
          })
          .then((resp) => {
            if (resp.status == 200) {
              this.$emit("updateOrders");
              this.$toast.success("Успешно!");
            }
          });
    },
    orderHandler(item) {
      this.orderModal = true;
      this.modalData = item;
      this.orderData = this.modalData.DataTimeOrder;
      this.orderFlyNum = this.modalData.OrderNum;
      this.orderSource = this.modalData.OrderSource;
      this.orderStatus = {
        Name: this.modalData.StatusDesc,
        Id: this.modalData.OrderStatusId,
      };
      this.orderType = {
        Name: this.modalData.TypeDesc,
        Id: this.modalData.OrderTypeId,
      };
      this.orderClientInfo = {
        Name: `${this.modalData.CFirstName} ${this.modalData.CLastName}`,
        Phone: this.modalData.CPhone,
        Email: this.modalData.CEmail,
      };

      const someDate = getFormattedDate(this.modalData.DateTimeOrder, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      this.dateFormatted = someDate.substr(0, 10).split("/").join("-");
      this.orderTime = someDate.substr(12, 5);
    },
    async saveOrder() {
      // const orderModal = this.modalData.FlightLegs;
      // const desc = this.flyInfoDesc;
      // orderModal.forEach(function setDesc(flyInfo) {
      //   flyInfo.Description = desc;
      // });
      await this.$api.request
          .editRow({
            url: `orders/flyInfo`,
            data: JSON.stringify(this.modalData),
          })
          .then((resp) => {
            if (resp.status === 200) {
              this.orderModal = false;
              this.order = this.modalData;
            }
          });
    },
    filterReqOp(arr, nameReqs) {
      var prevItemCountry = null;
      var newAarr = arr.filter((item) => {
        var some = item[nameReqs] == prevItemCountry ? false : true;
        if (some) {
          prevItemCountry = item[nameReqs];
          return true;
        } else {
          return false;
        }
      });
      return newAarr;
    },
    async requestToClient() {
      const res = await this.$api.request.getTable(
          `orders/clientOfferData?OrderNum=${this.order.OrderNum}`
      );
      this.allFlyToPdf = res.data;
      const formData = await this.generatePdf(false, true)
      await this.$api.request.sendOfferToClient(this.order.Id, formData)
      this.emailModal = false;
    },

    async requestFromOperator() {
      if (
          !!this.requestOp.operator ||
          !!this.requestOp.country ||
          !!this.requestOp.region ||
          !!this.requestOp.PAXFrom ||
          !!this.requestOp.PAXTo ||
          !!this.requestOp.AircraftClass
      ) {
        this.requestLoading = true;
        const result = await this.$api.request.getTable(
            `operators?Name=${
                this.requestOp.operator ? this.requestOp.operator : ""
            }&Country=${
                this.requestOp.country ? this.requestOp.country : ""
            }&Region=${
                this.requestOp.region ? this.requestOp.region : ""
            }&PAXFrom=${
                this.requestOp.PAXFrom ? this.requestOp.PAXFrom : "0"
            }&PAXTo=${this.requestOp.PAXTo ? this.requestOp.PAXTo : ""}&Class=${
                this.requestOp.AircraftClass ? this.requestOp.AircraftClass : ""
            }&limit=20`
        );
        this.requestLoading = false;
        this.reqCounter = result.data.Pagination.Total;
        this.reqOperatorItems = result.data.Data;
      } else {
        this.reqCounter = 0;
      }
    },
    paginationHandler(val) {
      this.pageOffer = val;
      this.requestHandler();
    },
    async modalRequestOffers() {
      await this.$api.request.getTable(`/aircrafts/classes`).then((resp) => {
        this.aircraftClassList = resp.data.Data;
      });
      this.requestOp.country = null;
      this.requestOp.city = null;
      this.requestOp.operator = null;
      this.reqCounter = 0;
      this.modalRequest = true;
    },
    async saveModal() {
      this.modalData.FlyTime = this.flyTimeModal
      if (this.hiddenInfo !== 'fly') {
        const Id = this.offerStatusModal === 0 ? (this.modalData.OfferStatusId || this.offerStatusModal) : this.offerStatusModal
        const Name = this.offerStatusItems[Id === 0 ? 0 : Id - 1]['Name']
        this.modalData.OfferStatusId = Id
        this.modalData.OfferStatusDesc = Name
      }
      // ^ Take Correct OfferStatusId
      // this.modalData.FlyTypeId = this.flyTypeModal.Id
      //     ? this.flyTypeModal.Id
      //     : this.flyTypeModal;
      // ^ Take Correct FlyTypeId
      this.modalData.Pax = +this.modalData.Pax;
      // Parse pax to Integer
      this.modalData.AmountFromOperator = +this.modalData.AmountFromOperator;
      this.modalData.Amount = +this.modalData.Amount;
      switch (this.hiddenInfo) {
        case "fly":
          // arrModal = [this.modalData];
          await this.$api.request
              .editRow({
                url: `orders/flyInfo`,
                data: [this.modalData]
              })
              .then((resp) => {
                if (resp.status == 200) {
                  this.modal = false;
                  const currentFlyItem = this.flyTypeItems.filter(item => item.Id === this.modalData.FlyTypeId)[0];
                  this.order.FlightLegs[this.currentTab] = this.modalData;
                  this.order.FlightLegs[this.currentTab].FlyDesc = currentFlyItem.Name;
                  this.$toast.success("Success!");
                } else {
                  this.$toast.error("Error!");
                }
              })
              .catch(() => {
                this.$toast.error("Error!");
              });
          break;
          // Save at modal Add new offer
        case "add":
          if (this.operatorMenu.Name === undefined) {
            this.$toast.error("Error!");
            break;
          }
          this.modalData["FlyInfoId"] = this.query.FlyInfoId;
          // arrModal = [this.modalData];

          await this.$api.request
              .createRow({
                url: `orders/offerFlyInfo`,
                data: [this.modalData]
              })
              .then((resp) => {
                this.modal = false;
                if (resp.status == 200) {
                  this.requestHandler();
                  this.$toast.success("Success!");
                } else {
                  this.$toast.error("Error!");
                }
              })
              .catch(() => {
                this.$toast.error("Error!");
              });
          break;
          // Save at modal Offer
        case "offer":
          await this.$api.request
              .editRow({
                url: `orders/offerFlyInfo`,
                data: [this.modalData],
              })
              .then(async (resp) => {
                this.modalData.AircraftRegNum && await this.saveAircraftImages({
                  regNum: this.modalData.AircraftRegNum,
                  files: {
                    interior: [...this.filesInterior],
                    exterior: [...this.filesExterior],
                    diagram: [...this.filesDiagram]
                  }
                })
                this.modal = false;
                if (resp.status == 200) {
                  this.requestHandler();
                  this.$toast.success("Success!");
                } else {
                  this.$toast.error("Error!");
                }
              })
              .catch(() => {
                this.$toast.error("Error!");
              });
          break;
        default:
          await this.$api.request
              .editRow({
                url: `orders/offerFlyInfo`,
                data: [this.modalData],
              })
          this.orderModal = false
          break;
      }
    },
    parseUtc(date, time) {
      const [DaysForm, MonthForm, YearsForm] = this.parseDate(date).split("-");
      const [HoursForm, MinutesForm] = time.split(":");
      return new Date(
          +YearsForm,
          MonthForm - 1,
          +DaysForm,
          HoursForm,
          MinutesForm
      ).toISOString()
    },
    async infiniteHandler($state) {
      this.limit = this.limit + 5;
      var where = this.$refs.Ininity.$el.getAttribute("data-input");
      try {
        switch (where) {
          case "from":
            await this.$api.request
                .getTable(
                    `airports?Autocomplete=${this.fromCountry}&limit=${this.limit}`
                )
                .then((data) => {
                  if (this.counter == data.data.Data.length) {
                    $state.complete();
                    this.counter = 0;
                  } else {
                    this.fromItems = data.data.Data;
                    $state.loaded();
                  }
                  this.counter = data.data.Data.length;
                });
            break;
          case "to":
            await this.$api.request
                .getTable(
                    `airports?Autocomplete=${this.toCountry}&limit=${this.limit}`
                )
                .then((data) => {
                  if (this.counter == data.data.Data.length) {
                    $state.complete();
                    this.counter = 0;
                  } else {
                    this.toItems = data.data.Data;
                    $state.loaded();
                  }
                  this.counter = data.data.Data.length;
                });
            break;
          case "operators":
            await this.$api.request
                .getTable(
                    `operators?autocomplete=${this.operators}&limit=${this.limit}`
                )
                .then((data) => {
                  if (this.counter == data.data.Data.length) {
                    $state.complete();
                    this.counter = 0;
                  } else {
                    this.operatorItems = data.data.Data;
                    $state.loaded();
                  }
                  this.counter = data.data.Data.length;
                });
            break;
          case "aircraftClass":
            await this.$api.request
                .getTable(
                    `aircrafts/classes?Autocomplete=${this.aircraftClass}&limit=${this.limit}`
                )
                .then((data) => {
                  if (this.counter == data.data.Data.length) {
                    $state.complete();
                    this.counter = 0;
                  } else {
                    this.aircraftClassItems = data.data.Data;
                    $state.loaded();
                  }
                  this.counter = data.data.Data.length;
                });
            break;
          case "aircraft":
            await this.$api.request
                .getTable(
                    `aircrafts?Autocomplete=${this.aircraft}&limit=${this.limit}`
                )
                .then((data) => {
                  if (this.counter == data.data.Data.length) {
                    $state.complete();
                    this.counter = 0;
                  } else {
                    this.aircraftItems = data.data.Data;
                    $state.loaded();
                  }
                  this.counter = data.data.Data.length;
                });
            break;
          default:
            break;
        }
      } catch (error) {
        $state.complete();
      }
    },
    async autocompleteInputs(inputText, inputModel) {
      this.limit = 10;
      if (inputText.length >= 3) {
        try {
          var result = null;
          switch (inputModel) {
            case "from":
              result = await this.$api.request.getTable(
                  `airports?Autocomplete=${inputText}`
              );
              this.fromItems = result.data.Data;

              break;
            case "to":
              result = await this.$api.request.getTable(
                  `airports?Autocomplete=${inputText}`
              );
              this.toItems = result.data.Data;

              break;
            case "operators":
              result = await this.$api.request.getTable(
                  `operators?Autocomplete=${inputText}`
              );
              this.operatorItems = result.data.Data;

              break;
            case "aircraftsClasses":
              result = await this.$api.request.getTable(
                  `aircrafts/classes?Autocomplete=${inputText}`
              );
              this.aircraftClassItems = result.data.Data;

              break;
            case "aircrafts":
              result = await this.$api.request.getTable(
                  `aircrafts?Autocomplete=${inputText}`
              );
              this.aircraftItems = result.data.Data;

              break;

            default:
              break;
          }
        } catch (e) {
          this.$toast.error("Ошибка");
        }
      } else if (inputText.length <= 3 && inputModel == "from") {
        this.fromItems = [];
      } else if (inputText.length <= 3 && inputModel == "to") {
        this.toItems = [];
      } else if (inputText.length <= 3 && inputModel == "operators") {
        this.operatorItems = [];
      } else if (inputText.length <= 3 && inputModel == "aircraftsClasses") {
        this.aircraftClassItems = [];
      } else if (inputText.length <= 3 && inputModel == "aircrafts") {
        this.aircraftItems = [];
      }
    },
    async save(model, data, item) {
      switch (model) {
        case "aircraftMenu":
          this.modalData.AircraftId = item.Ids;
          this.modalData.AircraftType = item.Type;
          this.aircraft = `${item.Type}`;
          this.regNum = item.Reg_num
          await this.getAircraftImages(item.Reg_num)
          break;
        case "aircraftClassMenu":
          this.modalData.AircraftClassId = item.Id;
          this.modalData.AircraftClassDesc = item.Name;
          this.aircraftClass = item.Name;
          break;
        case "operatorMenu":
          this.modalData.OperatorId = item.Id;
          this.modalData.OperatorName = item.Name;
          this.modalData.OperatorEmail = item.Email;
          this.operators = `${item.Name}, ${item.City}, ${item.CountryDesc}`;
          break;
        case "fromMenu":
          this.modalData.CityFrom = item.Municipality;
          this.modalData.AirportNameFrom = item.Name;
          this.modalData.CountryFrom = item.Country;
          this.modalData.IcaoAirportFrom = item.Icao;
          this.modalData.DepartureAirportId = item.Id
          break;
        case "toMenu":
          this.modalData.CityTo = item.Municipality;
          this.modalData.AirportNameTo = item.Name;
          this.modalData.CountryTo = item.Country;
          this.modalData.IcaoAirportTo = item.Icao;
          this.modalData.ArrivalAirportId = item.Id
          break;
        default:
          break;
      }
    },

    async requestHandler() {
      try {
        const result = await this.$api.request.getTable(
            `orders/offerFlyInfo?${this.queryProps}` +
            `&Page=${this.pageOffer}&Limit=${this.limitOffer}`
        );

        this.ourOffer = result.data.Data === null ? [] : result.data.Data;
        if (result.data.Pagination) {
          const pagination = result.data.Pagination;
          this.pageOffer = pagination.Page;
          this.limitOffer = pagination.Limit;
          this.countOffer = pagination.Count;
          this.totalOffer = pagination.Total;
        }
      } catch (e) {
        this.$toast.error("Ошибка");
      }
    },
    async requestGenerateOffers() {
      const operName =
          this.requestOp.operator === null
              ? ""
              : this.requestOp.operator.split(",")[0];
      await this.$api.request
          .createRow({
            url: `orders/createOfferFlyInfo?OrderNum=${
                this.order.OrderNum
            }&Country=${
                this.requestOp.country ? this.requestOp.country : ""
            }&City=${
                this.requestOp.city ? this.requestOp.city : ""
            }&Name=${operName}&PAXFrom=${
                this.requestOp.PAXFrom ? this.requestOp.PAXFrom : "0"
            }&PAXTo=${this.requestOp.PAXTo ? this.requestOp.PAXTo : ""}`,
            data: this.order.FlightLegs[this.currentTab],

          })
          .then((resp) => {
            if (resp.status == 200) {
              this.modalRequest = false;
              this.$toast.success("Success!");
              this.requestHandler();
            } else {
              this.$toast.error("Error!");
            }
          });
    },
    buttonHandler(tab) {
      this.deleteTab(tab);
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    // formatDate(date) {
    //   if (!date) return null;
    //   const [year, month, day] = date.split("-");
    //   return `${day}-${month}-${year}`;
    // },
    flyInfoHandler(item) {
      const obj = Object.assign({}, JSON.parse(JSON.stringify(item)));
      this.offerHandler(obj);
    },
    async openAddModal(item) {
      const obj = Object.assign({}, JSON.parse(JSON.stringify(item)));
      await this.offerHandler(obj);
      this.modalTitle = "Add new offer";
      this.hiddenInfo = "add";
    },
    async offerHandler(item) {
      this.filesDiagram = []
      this.filesInterior = []
      this.filesExterior = []
      this.operators = "";
      let operatorInfo;
      if (item.OperatorId) {
        const result = await this.$api.request.getTable(
            `operators?Id=${item.OperatorId}`
        );
        operatorInfo = result.data.Data[0];
      }
      this.modal = true;
      this.modalData = {...item};
      this.modalData.AircraftRegNum && await this.getAircraftImages(this.modalData.AircraftRegNum)
      this.flyTimeModal = this.modalData.FlyTime.length > 1 ? this.modalData.FlyTime.slice(11, 16) : '00:00';
      if (this.modalData.OrderId) {
        this.modalTitle = "Fly info";
        this.hiddenInfo = "fly";
        this.modalData.OperatorId = null;
        this.modalData.OperatorName = null;
        this.modalData.OperatorEmail = null;
      } else {
        this.modalTitle = "Offer";
        this.hiddenInfo = "offer";
        this.operators = `${this.modalData.OperatorName}, ${operatorInfo.City}, ${operatorInfo.CountryDesc} `;
      }
      // const someDate = getFormattedDate(this.modalData.DateTimeFrom, {
      //   year: "numeric",
      //   month: "2-digit",
      //   day: "2-digit",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      // });
      this.offerStatusModal = this.modalData.OfferStatusId || 0
      this.flyTypeModal = {
        Name: this.modalData.FlyDesc,
        Id: this.modalData.FlyTypeId,
      };

      this.amountFrom = this.modalData.AmountFromOperator;
      this.amountCoinf = this.modalData.AmountFromOperator;
      // this.dateFormatted = someDate.substr(0, 10).split("/").join("-");
      // this.time = someDate.substr(12, 5);
      this.fromCountry = `${this.modalData.CityFrom}, ${this.modalData.AirportNameFrom}, ${this.modalData.IcaoAirportFrom}`;
      this.toCountry = `${this.modalData.CityTo}, ${this.modalData.AirportNameTo}, ${this.modalData.IcaoAirportTo}`;
      this.aircraftClass = this.modalData.AircraftClassDesc;
      this.aircraft =
          this.modalData.AircraftType + ", ";
    },
    filterOffer(field) {
      return this.ourOffer.filter((el) => {
        return el.FlyInfoId === field;
      });
    },
  },
};
</script>

<style lang="scss">
.images {
  display: flex;
  width: 100%;

  & > * {
    flex: 1;
    margin-right: 8px;
  }
}

@media screen and (max-width: 1270px) {
  .status-search .v-text-field fieldset,
  .v-text-field .v-input__control {
    height: 40px;
  }

  .status-search .v-select__slot {
    height: 70px;
  }
}
.wrap {
  visibility: hidden;
  position: fixed;
  z-index: -1;
}
.pdf {
  width: 800px;
  font-family: "Montserrat", sans-serif;
  &__wrapper {
    margin: 24px;
    width: calc(100% - 48px);
    display: flex;
    min-height: 1000px;
    flex-direction: column;
  }

  &__content {
    flex: 1;
  }
}

</style>
