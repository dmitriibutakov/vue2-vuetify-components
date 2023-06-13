<template>
    <v-dialog
        persistent
        max-width="50%"
        v-model="modalAddOrder"
        v-if="addModal"
    >
        <v-card class="pa-4 add-order">
            <v-form ref="form">
                <v-row>
                    <v-col :cols="12">
                        <h2>Add Order</h2>
                    </v-col>
                </v-row>
                <!--  -->
                <v-row>
                    <v-col>
                        <Autocomplete
                            :list="clients"
                            :selectionitem.sync="addModal.ChoiceClient"
                            :selection.sync="addModal.CFirstName"
                            url="clients"
                            width="350px"
                            urlname="Firstname"
                            label="First Name"
                            :rules = "stringRules"
                            :timeout="150"
                            @updateauto="saveClientInfo(addModal.ChoiceClient)"
                        >
                            <template v-slot:default="{ item }">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{
                                            item.Firstname +
                                            " " +
                                            item.Lastname +
                                            " " +
                                            item.Email
                                        }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </Autocomplete>
                    </v-col>
                    <v-col>
                        <Autocomplete
                            :list="clients"
                            :selectionitem.sync="addModal.ChoiceClient"
                            :selection.sync="addModal.CLastName"
                            url="clients"
                            urlname="Lastname"
                            label="Last Name"
                            :timeout="150"
                            :rules = "stringRules"
                            @updateauto="saveClientInfo(addModal.ChoiceClient)"
                        >
                            <template v-slot:default="{ item }">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.Firstname + " " + item.Lastname }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </Autocomplete>
                    </v-col>
                    <v-col>
                        <Autocomplete
                            :list="clients"
                            :selectionitem.sync="addModal.ChoiceClient"
                            :selection.sync="addModal.CPhone"
                            url="clients"
                            urlname="Phone"
                            label="Phone"
                            :rules = "stringRules"
                            :timeout="150"
                            @updateauto="saveClientInfo(addModal.ChoiceClient)"
                        >
                            <template v-slot:default="{ item }">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.Phone }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </Autocomplete>
                    </v-col>
                    <v-col>
                        <Autocomplete
                            :list="clients"
                            :selectionitem.sync="addModal.ChoiceClient"
                            :selection.sync="addModal.CEmail"
                            url="clients"
                            urlname="Email"
                            label="Email"
                            :timeout="150"
                            :rules = "stringRules"
                            @updateauto="saveClientInfo(addModal.ChoiceClient)"
                        >
                            <template v-slot:default="{ item }">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.Email }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </Autocomplete>
                    </v-col>
                </v-row>
                <v-row
                    class="add-order__item"
                    v-for="(item, idx) in addModal.flyInfo"
                    :key="idx"
                >
                    <v-col cols="12" style="text-align: center">
                        <h2>Fly Direction {{ idx + 1 }}</h2>
                    </v-col>
                    <v-col cols="4">
                        <v-menu
                            ref="EndDateMenu"
                            v-model="dateItem[idx]"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="item.DateTime"
                                    label="Date From"
                                    placeholder="Date From"
                                    dense
                                    outlined
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    autocomplete="new-password"
                                />
                            </template>
                            <v-date-picker
                                v-model="item.DateTime"
                                :min="new Date().toISOString().substr(0, 10)"
                                :rules="stringRules"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="item.FlyTypeId"
                            :items="flyTypeItems"
                            item-text="Name"
                            item-value="Id"
                            class="mb-5"
                            dense
                            outlined
                        />
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                            class="subheading"
                            v-model="item.Pax"
                            :rules="paxRules"
                            type="number"
                            outlined
                            dense
                            min="0"
                            label="Pax"
                            placeholder="Pax"
                        />
                    </v-col>
                    <v-col cols="6">
                        <Autocomplete
                            :ref="'fromMenu' + idx"
                            :list="clients"
                            :selectionitem.sync="fromMenu[idx]"
                            :selection.sync="fromMenu[idx].Icao"
                            url="airports"
                            urlname="Autocomplete"
                            label="Icao From"
                            :timeout="200"
                            :rules="stringRules"
                            @updateauto="saveAutocomplete('from', fromMenu[idx], idx)"
                        >
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
                            :ref="'toMenu' + idx"
                            :list="clients"
                            :selectionitem.sync="toMenu[idx]"
                            :selection.sync="toMenu[idx].Icao"
                            url="airports"
                            urlname="Autocomplete"
                            label="Icao To"
                            :timeout="200"
                            :rules="stringRules"
                            @updateauto="saveAutocomplete('to', toMenu[idx], idx)"
                        >
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
                    <div class="close" @click="deleteItemModal(idx)">
                        <span></span>
                        <span></span>
                    </div>
                </v-row>
                <v-row>
                    <v-col style="text-align: center">
                        <v-btn color="green darken-1" text @click="addItemModal">
                            Add
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-card-actions class="d-flex justify-space-around">
                <v-btn color="red darken-1" text @click="closeModal">
                    Cancel
                </v-btn>
                <v-btn color="green darken-1" text @click="saveAddOrder(addModal)">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Autocomplete from "@/components/Autocomplete";
import {mapActions} from "vuex";
export default {
    name: "OrderModal",
    components: {
        Autocomplete
    },
    props: {
        flyTypeItems: Array,
        modalAddOrder: Boolean,
        page: Number,
        limit: Number
    },
    data() {
        return {
            addModal: null,
            stringRules: [
                v => (v && v.length > 0) || 'Arrival airport is required',
            ],
            paxRules: [
                v => (v && v > 0) || 'Pax is required',
            ],
            clients: [],
            toMenu: [{ Icao: "" }],
            fromMenu: [{ Icao: "" }],
            dateItem: [],
        }
    },
    methods: {
        ...mapActions({
            fetchFilterOrders: "orders/fetchFilterOrders",
            fetchOrders: "orders/fetchOrders",
        }),
        closeModal() {
            this.$emit('close')
        },
        debounce(f, t) {
            const vm = this;
            return function (args) {
                let previousCall = vm.lastCall;
                vm.lastCall = Date.now();
                if (previousCall && vm.lastCall - previousCall <= t) {
                    clearTimeout(vm.lastCallTimer);
                }
                vm.lastCallTimer = setTimeout(() => f(args), t);
            };
        },
        saveClientInfo(client) {
            if (client.Id > 0) {
                this.addModal.CFirstName = client.Firstname;
                this.addModal.CLastName = client.Lastname;
                this.addModal.CPhone = client.Phone;
                this.addModal.CEmail = client.Email;
            }
        },
        deleteItemModal(idx) {
            this.addModal.flyInfo = this.addModal.flyInfo.filter((item, id) => {
                if (id === idx) {
                    this.fromMenu.splice(idx, 1);
                    this.toMenu.splice(idx, 1);
                } else {
                    return item;
                }
            });
        },
        async saveAddOrder(arr) {
            this.$refs.form.validate()
            arr.ClientId = arr.ChoiceClient.Id;
            if (arr.flyInfo.length < 3) {
                arr.OrderTypeId = arr.flyInfo.length
            } else {
                arr.OrderTypeId = 3;
            }

            await arr.flyInfo.forEach((item) => {
                item.DateTimeFrom = item.DateTime + "T10:00:00Z";
                item.Pax = +item.Pax;
            });
            await this.$api.request
                .createRow({
                    url: "orders",
                    data: JSON.stringify(arr),
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        this.$emit('request')
                        this.$toast.success("Success!");
                        this.addModal = {
                            CEmail: "",
                            CFirstName: "",
                            CLastName: "",
                            CPhone: "",
                            ChoiceClient: {
                                Email: "",
                                FirstName: "",
                                LastName: "",
                                Phone: "",
                                Id:0,
                            },
                            OrderSource: "created",
                            OrderTypeId: 1,
                            OrderStatus: 1,
                            flyInfo: [
                                {
                                    DateTime: new Date().toISOString().substr(0, 10),
                                    FlyTypeId: 1,
                                    IcaoAirportFrom: "",
                                    IcaoAirportTo: "",
                                    Pax: 0,
                                },
                            ],
                        };
                        this.toMenu = [{ Icao: "" }]
                        this.fromMenu = [{ Icao: "" }]
                        this.$emit('close')
                    }
                })
                .catch((e) => {
                    this.$toast.error("Error" + e);
                });
        },
        addItemModal() {
            this.fromMenu.push({ Icao: "" });
            this.toMenu.push({ Icao: "" });
            this.addModal.flyInfo.push({
                DateTime: new Date().toISOString().substr(0, 10),
                FlyTypeId: 1,
                IcaoAirportFrom: "",
                IcaoAirportTo: "",
                Pax: 0,
            });
        },
        saveAutocomplete(fromOrTo, item, idx) {
            switch (fromOrTo) {
                case "from":
                    this.addModal.flyInfo[idx].IcaoAirportFrom = item.Icao;
                    this.fromMenu[idx].Icao = item.Icao;
                    break;
                case "to":
                    this.addModal.flyInfo[idx].IcaoAirportTo = item.Icao;
                    this.toMenu[idx].Icao = item.Icao;
                    break;
                default:
                    break;
            }
        },
    },
    mounted() {
        this.addModal = {
            CEmail: "",
            CFirstName: "",
            CLastName: "",
            CPhone: "",
            ChoiceClient: {
                Email: "",
                FirstName: "",
                LastName: "",
                Phone: "",
                Id:0,
            },
            OrderSource: "created",
            OrderTypeId: 1,
            OrderStatus: 1,
            flyInfo: [
                {
                    DateTime: new Date().toISOString().substr(0, 10),
                    FlyTypeId: 1,
                    IcaoAirportFrom: "",
                    IcaoAirportTo: "",
                    Pax: 0,
                },
            ],
        };
    },
    computed: {
        queryProps: {
            get: function () {
                var queryEmail = ``;
                var querySurname = ``;
                var queryName = ``;
                var queryDate = ``;
                var queryStatus = this.query.status.filter((item) => item !== 0);
                var queryType = this.query.orderType.filter((item) => item !== 0);
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
                var resultFilter =
                    `OrderNum=${this.query.orderNumber}` +
                    queryEmail +
                    querySurname +
                    queryName +
                    queryDate +
                    `${
                        queryStatus[0] !== undefined ? `&OrderStatusId=${queryStatus}` : ""
                    }` +
                    `${queryType[0] !== undefined ? `&OrderTypeId=${queryType}` : ""}`;
                return resultFilter;
            },
            set: function (newValue) {
                return newValue;
            },
        },
    }
}
</script>

<style scoped>

</style>