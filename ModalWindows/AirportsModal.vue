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
                autocomplete="new-password"
            />
          </v-col>
          <v-col :cols="4">
            <v-text-field
                v-model="modalData.Type"
                label="Type"
                placeholder="Type"
                dense
                outlined
                type="text"
                ref="modalType"
                autocomplete="new-password"
            />
          </v-col>

        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
                v-model="modalData.Continent"
                label="Continent"
                placeholder="Continent"
                dense
                outlined
                type="text"
                  ref="modalContinent"
              />
            </v-col>

          <v-col cols="4">
            <v-text-field
                v-model="modalData.Country"
                label="Country"
                placeholder="Country"
                dense
                outlined
                type="text"
                ref="modalCountry"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
                v-model="modalData.Municipality"
                label="Municipality"
                placeholder="Municipality"
                dense
                outlined
                type="text"
                ref="modalMunicipality"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-text-field
                v-model="modalData.Icao"
                label="Icao"
                placeholder="Icao"
                dense
                outlined
                type="text"
                ref="modalIcao"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
                v-model="modalData.IataCode"
                label="Iata"
                placeholder="Iata"
                dense
                outlined
                type="text"
                ref="modalIata"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
                v-model="modalData.GspCode"
                label="GpsCode"
                placeholder="GpsCode"
                dense
                outlined
                type="text"
                ref="modalGpsCode"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
                v-model="modalData.LocalCode"
                label="LocalCode"
                placeholder="LocalCode"
                dense
                outlined
                type="text"
                ref="modalLocalCode"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
                v-model="modalData.LatitudeDeg"
                label="LatitudeDeg"
                placeholder="LatitudeDeg"
                dense
                outlined
                type="text"
                ref="modalLatitudeDeg"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="modalData.LongitudeDeg"
                label="LongitudeDeg"
                placeholder="LongitudeDeg"
                dense
                outlined
                type="text"
                ref="modalLongitudeDeg"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="modalData.ElevationFt"
                label="ElevationFt"
                placeholder="ElevationFt"
                dense
                outlined
                type="number"
                ref="modalElevationFt"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
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

          <v-col cols="6">
            <v-text-field
                v-model="modalData.Region"
                label="Region"
                placeholder="Region"
                dense
                outlined
                type="text"
                ref="modalRegion"
            />
          </v-col>

        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
                v-model="modalData.MunicipalityRus"
                label="MunicipalityRus"
                placeholder="MunicipalityRus"
                dense
                outlined
                type="text"
                ref="modalMunicipalityRus"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
                v-model="modalData.NameRus"
                label="NameRus"
                placeholder="NameRus"
                dense
                outlined
                type="text"
                ref="modalNameRus"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
                v-model="modalData.ScheduledService"
                label="ScheduledService"
                placeholder="ScheduledService"
                dense
                outlined
                type="text"
                ref="modalScheduledService"
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
export default {
  name: "AirportsModal",
  props: ['data', 'saveModal','cancelModal'],
  data () {
    return {
      rulesAll: [(v) => !!v || "Name is required"],
      modalData: {},
      modalType: "",
      modal:true,
    }
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

  }
}
</script>
