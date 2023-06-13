<template>
  <v-dialog persistent max-width="50%" v-model="modal">
    <v-card class="pa-4">
      <v-form ref="form">
        <v-row>
          <v-col :cols="12">
            <h2> {{ this.modalType }} </h2>
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
      </v-form>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn color="red darken-1" text @click="cancel">
          Cancel
        </v-btn>
        <v-btn color="green darken-1" text @click="saveData"> Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  // name: "ClientStatusModal",
  name: "FlyTypeModal",
  props: ['data', 'saveModal', 'cancelModal'],
  data() {
    return {
      rulesAll: [(v) => !!v || "Name is required"],
      modalData: {},
      modalType: "",
      modal: true,
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
