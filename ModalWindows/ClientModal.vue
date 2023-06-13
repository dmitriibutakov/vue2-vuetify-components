<template>
  <v-dialog persistent max-width="50%" v-model="modal">
    <v-card class="pa-4">
      <v-form ref="form">
        <v-row>
          <v-col :cols="12">
            <h2>{{ this.modalType }}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="2">
            <v-text-field
              v-model="modalData.Id"
              label="Id"
              placeholder="Id"
              dense
              outlined
              type="text"
              ref="modalId"
              autocomplete="new-password"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Firstname"
              label="First name"
              placeholder="First name"
              dense
              outlined
              type="text"
              ref="modalFirstName"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Lastname"
              label="Last name"
              placeholder="Last name"
              dense
              outlined
              type="text"
              ref="modalLastName"
            />
          </v-col>
          <v-col cols="4">
            <v-menu
              ref="dateMenu"
              v-model="datePicker.Menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="datePicker.Value"
                  label="Birthdate"
                  placeholder="Birthdate"
                  dense
                  :rules="rulesAll"
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="datePicker.Value"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="datePicker.Menu = false"
              ></v-date-picker>
              <!--  -->
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-menu
              ref="clientStatusMenu"
              v-model="autocompleteStatus.Menu"
              :close-on-content-click="false"
              :return-value.sync="autocompleteStatus.Value"
              transition="scale-transition"
              offset-y
              class="bg-white"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="autocompleteStatus.Value"
                  label="Client status"
                  placeholder="Client status"
                  autocomplete="new-password"
                  dense
                  :rules="rulesAll"
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @input="
                    autocompleteInputs(autocompleteStatus.Value, 'clientStatus')
                  "
                ></v-text-field>
              </template>
              <v-list
                v-if="autocompleteStatus.Menu"
                height="100%"
                min-height="100%"
                max-height="250"
                item-height="50"
                width="295"
                bench="5"
              >
                <v-list-item
                  v-for="item in autocompleteStatus.Items"
                  :key="item.id"
                  v-text="item.Name"
                  @click="saveAutocomplete('clientStatusMenu', item.Name, item)"
                >
                </v-list-item>
                <infinite-loading
                  ref="Infinity"
                  spinner="spiral"
                  data-input="autocompleteClass.Value"
                  @infinite="infiniteHandler"
                ></infinite-loading>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Phone"
              label="Phone"
              placeholder="Email"
              dense
              outlined
              type="text"
              ref="modalCountry"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Email"
              label="Email"
              placeholder="Email"
              dense
              outlined
              type="text"
              ref="modalEmail"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Company"
              label="Company"
              placeholder="Company"
              dense
              outlined
              type="text"
              ref="modalRegNum"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Description"
              label="Description"
              placeholder="Description"
              dense
              outlined
              type="text"
              ref="modalPax"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
        <v-btn color="green darken-1" text @click="saveData"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import InfiniteLoading from "vue-infinite-loading";
export default {
  name: "ClientModal",
  components: {
    // InfiniteLoading,
  },
  props: ["data", "saveModal", "cancelModal"],
  data() {
    return {
      rulesAll: [v => !!v || "Name is required"],
      autocompleteStatus: {
        Items: [],
        Menu: false,
        Value: null
      },
      datePicker: {
        Menu: null,
        Value: null
      },
      autocompleteLimit: 10,
      counter: 0,
      modalData: {},
      modalType: "",
      modal: true
    };
  },

  mounted() {
    this.modalData = this.data.data;
    this.autocompleteStatus.Value = this.modalData.ClientStatus;
    this.modalType = this.data.type;
  },
  methods: {
    saveData() {
      this.modalData.Birthdate = this.datePicker.Value + "T00:00:00Z";
      let type = this.modalType;
      let data = this.modalData;
      this.saveModal(type, data);
    },

    cancel() {
      this.cancelModal();
    },

    imgHandler({ type, data }) {
      switch (type) {
        case "delete":
          this.modalData.Images = this.modalData.Images.filter(
            img => img !== data
          );
      }
    },
    async infiniteHandler($state) {
      this.autocompleteLimit = this.autocompleteLimit + 5;
      var where = this.$refs.Infinity.$el.getAttribute("data-input");
      try {
        switch (where) {
          case "clientStatus":
            await this.$api.request
              .getTable(
                `/clients/status?Autocomplete=${this.autocompleteStatus.Value}&limit=${this.limit}`
              )
              .then(data => {
                if (this.counter === data.data.Data.length) {
                  $state.complete();
                  this.counter = 0;
                } else {
                  this.autocompleteStatus.Items = data.data.Data;
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
      this.autocompleteLimit = 10;
      if (inputText.length >= 3) {
        try {
          var result = null;
          switch (inputModel) {
            case "clientStatus":
              result = await this.$api.request.getTable(
                `clients/status?Autocomplete=${inputText}`
              );
              this.autocompleteStatus.Items = result.data.Data;

              break;
            default:
              break;
          }
        } catch (e) {
          this.$toast.error("Error");
        }
      } else if (inputText.length <= 0 && inputModel === "clientStatus") {
        this.autocompleteStatus.Items = [];
      }
    },
    saveAutocomplete(model, data, item) {
      this.$refs[model].save(data);
      switch (model) {
        case "clientStatusMenu":
          this.modalData.ClientStatus = item.Name;
          this.modalData.ClientStatusId = item.Id;
          break;
        default:
          break;
      }
    }
  }
};
</script>
