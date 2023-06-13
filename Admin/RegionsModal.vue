<template>
  <v-dialog v-model="isOpen" persistent max-width="50%">
    <v-card class="pa-4">
      <v-card-title>
        <h2>Regions</h2>
      </v-card-title>
      <v-form v-if="modalData">
        <v-row>
          <v-col>
            <v-text-field
              class="subheading"
              label="Region Name"
              v-model="modalData.name"
              type="text"
              placeholder="Region name"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn color="red darken-1" text @click="$emit('close')">
          Cancel
        </v-btn>
        <v-btn color="green darken-1" text @click="saveUserModal">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isOpen: Boolean
  },
  name: "RegionsModal",
  data() {
    return {
      modalData: {
        name: ""
      }
    };
  },
  methods: {
    async saveUserModal() {
      try {
        const region = await this.$api.request.createRow({
          url: "regions",
          data: {
            name: this.modalData.name
          }
        });
        this.$emit("createRegion", region.data);
        this.$emit("close");
      } catch (e) {
        this.$toast.error("Error");
        this.$emit("close");
      }
    }
  }
};
</script>

<style scoped></style>
