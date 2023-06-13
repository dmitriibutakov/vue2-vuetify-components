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
              v-model="modalData.Ids"
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
          <v-col cols="6">
            <Autocomplete
              :list="autocompleteOperator.Items"
              :selectionitem.sync="autocompleteOperator.Menu"
              :selection="autocompleteOperator.Value"
              url="operators"
              urlname="Autocomplete"
              label="Operator"
              :timeout="150"
              @updateauto="
                saveAutocomplete(
                  'operatorMenu',
                  autocompleteOperator.Menu.OperatorName,
                  autocompleteOperator.Menu
                )
              "
            >
              <template v-slot:default="{ item }">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.Name }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </Autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <Autocomplete
              :list="autocompleteClass.Items"
              :selectionitem.sync="autocompleteClass.Menu"
              :selection="autocompleteClass.Value"
              url="aircrafts/classes"
              urlname="Autocomplete"
              label="Aircraft Class"
              :timeout="150"
              @updateauto="
                saveAutocomplete(
                  'aircraftClassMenu',
                  autocompleteClass.Menu.Name,
                  autocompleteClass.Menu
                )
              "
            >
              <template v-slot:default="{ item }">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.Name }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </Autocomplete>
          </v-col>
          <v-col cols="4">
            <Autocomplete
              :list="autocompleteType.Items"
              :selectionitem.sync="autocompleteType.Menu"
              :selection="autocompleteType.Value"
              url="aircrafts/types"
              urlname="Name"
              label="Aircraft Type"
              :timeout="150"
              @updateauto="
                saveAutocomplete(
                  'aircraftMenu',
                  autocompleteType.Menu.Name,
                  autocompleteType.Menu
                )
              "
            >
              <template v-slot:default="{ item }">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.Name }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </Autocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="modalData.Reg_num"
              label="RegistrationNumber"
              placeholder="Registration number"
              dense
              outlined
              type="text"
              ref="modalRegNum"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-text-field
              v-model="modalData.PAX"
              label="Pax"
              placeholder="Pax"
              dense
              outlined
              type="number"
              ref="modalPax"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="modalData.Year"
              label="year of aircraft production"
              placeholder="Year"
              dense
              outlined
              type="number"
              ref="modalYear"
            />
          </v-col>
<!--          <v-col cols="5">-->
<!--            <v-file-input-->
<!--              accept="image/png, image/jpeg"-->
<!--              prepend-icon=""-->
<!--              dense-->
<!--              outlined-->
<!--              label="Select image"-->
<!--              v-model="images"-->
<!--            ></v-file-input>-->
<!--          </v-col>-->
<!--          <v-col cols="2">-->
<!--            <v-btn color="green darken-1" outlined text @click="imageHandler">-->
<!--              upload-->
<!--            </v-btn>-->
<!--          </v-col>-->
        </v-row>
        <v-row> </v-row>
        <v-row>
          <aircraft-model-photo-gallery
            @delete="imgHandler({ type: 'delete', data: $event })"
            :images="modalData.Images"
          />
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
import Autocomplete from "@/components/Autocomplete";
import AircraftModelPhotoGallery from "@/components/ModalWindows/AircraftModelPhotoGallery";
import axios from "axios";
export default {
  name: "AircraftModal",
  components: {
    Autocomplete,
    AircraftModelPhotoGallery
  },
  props: ["data", "saveModal", "cancelModal"],
  data() {
    return {
      images: null,
      imageUrl: [],
      autocompleteClass: {
        Menu: {},
        Value: "",
        Items: []
      },
      autocompleteOperator: {
        Menu: {},
        Value: "",
        Items: []
      },

      autocompleteType: {
        Menu: {},
        Value: "",
        Items: []
      },
      modalData: {},
      modalType: "",
      modal: true,
      operatorId: null
    };
  },
  async created() {
    this.modalData = this.data.data;
    this.autocompleteOperator.Value = this.modalData.Operator;
    this.autocompleteClass.Value = this.modalData.Class;
    this.autocompleteType.Value = this.modalData.Type;
    this.modalType = this.data.type;
    this.operatorId = this.data.data.OperatorId;
    await this.$api.request
      .getTable(`/operators?Id=${this.operatorId}`)
      .then(resp => {
        var item = resp.data.Data[0];
        this.modalData.OperatorId = item.Id;
        this.autocompleteOperator.Value = item.Name;
      });
  },
  methods: {
    saveData() {
      this.modalData.PAX = +this.modalData.PAX;
      this.modalData.Year = +this.modalData.Year;
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
          this.$api.request.deleteRow({
            url: `aircrafts/file/${this.modalData.Reg_num}`,
            data: {
              path: data
            }
          });
      }
    },
    saveAutocomplete(model, data, item) {
      switch (model) {
        case "aircraftMenu":
          this.modalData.Type = item.Name;
          this.autocompleteType.Value = item.Name;
          break;
        case "aircraftClassMenu":
          this.modalData.Class = item.Name;
          this.autocompleteClass.Value = item.Name;
          break;
        case "operatorMenu":
          this.modalData.OperatorId = item.Id;
          this.autocompleteOperator.Value = item.Name;
          break;
        default:
          break;
      }
    },
    async imageHandler() {
      let formData = new FormData();
      formData.append("files", this.images);
      const instance = axios.create({
        baseURL: this.$store.state.global.baseURL
      });
      await instance
        .post(`/aircrafts/file/${this.modalData.Reg_num}`, formData, {
          headers: {
            Authorization: `Bearer ${this.$store.state.global.token}`,
            "Content-Type": "multipart/form-data"
          }
        })
        .then(resp => {
          if (resp.status === 200) {
            this.$toast.success("Success!");
          } else {
            this.$toast.error("Error!");
          }
        });
    }
  }
};
</script>
