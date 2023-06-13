<template>
  <v-dialog persistent max-width="50%" v-model="modal">
    <v-card class="pa-4">
      <v-form ref="form">
        <v-row>
          <v-col :cols="12">
            <h2> {{this.modalType}} </h2>
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
                disabled
                autocomplete="new-password"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
              <Autocomplete
                  :selectionitem.sync="modalData.CountryDesc"
                  :selection="modalData.CountryDesc"
                  url="countries"
                  width="350px"
                  urlname="Name"
                  placeholder="Country"
                  label="Country"
                  :timeout="150"
                  @updateauto="saveClientInfo(modalData.CountryDesc)"
                >
                  <template v-slot:default="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                          item.Name
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                </Autocomplete>
          </v-col>

          <v-col cols="4">
            <v-text-field
                v-model="modalData.City"
                label="City"
                placeholder="City"
                dense
                outlined
                type="text"
                ref="modalCity"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-text-field
                v-model="modalData.Name"
                label="Name"
                placeholder="Name"
                dense
                outlined
                type="text"
                ref="modalName"
            />
          </v-col>
          <v-col cols="3">
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
          <v-col cols="3">
            <v-text-field
                v-model="modalData.Phone"
                label="Phone"
                placeholder="Phone"
                dense
                outlined
                type="text"
                ref="modalPhone"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
                v-model="modalData.Fax"
                label="Fax"
                placeholder="Fax"
                dense
                outlined
                type="text"
                ref="modalFax"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
                v-model="modalData.Website"
                label="Website"
                placeholder="Website"
                dense
                outlined
                type="text"
                ref="modalWebsite"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="modalData.Hq"
                label="Hq"
                placeholder="Hq"
                dense
                outlined
                type="text"
                ref="modalHq"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn color="red darken-1" text @click="cancel">
          Cancel
        </v-btn>
        <v-btn color="green darken-1" text @click="saveData"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Autocomplete from "@/components/Autocomplete";
export default {
  name: "OperatorModal",
  props: ['data', 'saveModal','cancelModal'],
  data () {
    return {
      rulesAll: [(v) => !!v || "Name is required"],
      modalData: {},
      modalType: "",
      modal:true,
      countryItem: ""
    }
  },
  components:{
    Autocomplete
  },

  mounted() {
    this.modalData = this.data.data
    this.modalType = this.data.type
  },

  methods: {
    saveData() {
      let type = this.modalType
      let data = this.modalData
      this.saveModal(type, data)
    },

    cancel() {
      this.cancelModal()
    },

    saveClientInfo(item) {
      this.modalData.CountryDesc = item.Name;
      this.modalData.CountryId = item.Id;
    },
  }
}
</script>
