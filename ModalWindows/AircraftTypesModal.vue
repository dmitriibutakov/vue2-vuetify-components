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
          <v-col :cols="4">
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
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Name"
              label="Name"
              placeholder="Name"
              dense
              outlined
              type="text"
              ref="modalCountry"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.ICAO"
              label="ICAO"
              placeholder="ICAO"
              dense
              outlined
              type="text"
              ref="modalCountry"
            />
          </v-col>
          <v-col cols="4">
            <v-menu
              ref="aircraftClassMenu"
              v-model="autocompleteClass.Menu"
              :close-on-content-click="false"
              :return-value.sync="autocompleteClass.Value"
              transition="scale-transition"
              offset-y
              class="bg-white"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="autocompleteClass.Value"
                  label="Aircraft class"
                  placeholder="Aircraft class"
                  autocomplete="new-password"
                  dense
                  :rules="rulesAll"
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @input="
                    autocompleteInputs(
                      autocompleteClass.Value,
                      'aircraftsClasses'
                    )
                  "
                ></v-text-field>
              </template>
              <v-list
                v-if="autocompleteClass.Menu"
                height="100%"
                min-height="100%"
                max-height="250"
                item-height="50"
                width="295"
                bench="5"
              >
                <v-list-item
                  v-for="item in autocompleteClass.Items"
                  :key="item.id"
                  v-text="item.Name"
                  @click="
                    saveAutocomplete('aircraftClassMenu', item.Name, item)
                  "
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
              v-model="modalData.Alt_Names"
              label="Alternative names"
              placeholder="Alternative names"
              dense
              outlined
              type="text"
              ref="modalRegNum"
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
import InfiniteLoading from "vue-infinite-loading";
export default {
  name: "AircraftTypesModal",
  props: ["data", "saveModal", "cancelModal"],
  components: {
    InfiniteLoading
  },
  data() {
    return {
      rulesAll: [v => !!v || "Name is required"],
      modalData: {},
      modalType: "",
      modal: true,
      autocompleteLimit: 10,
      counter: 0,
      autocompleteClass: {
        Items: [],
        Menu: null,
        Value: null
      }
    };
  },

  mounted() {
    this.modalData = this.data.data;
    this.modalType = this.data.type;
    this.autocompleteClass.Value = this.modalData.Air_Class;
  },

  methods: {
    saveData() {
      let type = this.modalType;
      let data = this.modalData;
      this.saveModal(type, data);
    },

    cancel() {
      this.cancelModal();
    },
    async infiniteHandler($state) {
      this.autocompleteLimit = this.autocompleteLimit + 5;
      var where = this.$refs.Infinity.$el.getAttribute("data-input");
      try {
        switch (where) {
          case "aircraftClass":
            await this.$api.request
              .getTable(
                `aircrafts/classes?Autocomplete=${this.autocompleteClass.Value}&limit=${this.limit}`
              )
              .then(data => {
                if (this.counter == data.data.Data.length) {
                  $state.complete();
                  this.counter = 0;
                } else {
                  this.autocompleteClass.Items = data.data.Data;
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
            case "aircraftsClasses":
              result = await this.$api.request.getTable(
                `aircrafts/classes?Autocomplete=${inputText}`
              );
              this.autocompleteClass.Items = result.data.Data;
              break;
            default:
              break;
          }
        } catch (e) {
          this.$toast.error("Error");
        }
      } else if (inputText.length <= 0 && inputModel === "aircraftsClasses") {
        this.autocompleteClass.Items = [];
      }
    },
    saveAutocomplete(model, data, item) {
      this.$refs[model].save(data);
      switch (model) {
        case "aircraftClassMenu":
          this.modalData.Air_Class = item.Name;
          break;
        default:
          break;
      }
    }
  }
};
</script>
