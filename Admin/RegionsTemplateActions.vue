<template>
  <v-row class="pl-3 align-end">
    <v-col cols="3">
      <h4 class="mb-1">Filter</h4>
      <v-select
        :items="regions"
        item-value="Id"
        item-text="Name"
        outlined
        dense
        placeholder="Choose regions"
        v-model="selectedRegion"
        hide-details
        @change="$emit('filter', selectedRegion)"
      />
    </v-col>
    <v-col cols="2">
      <v-btn @click="resetFilter" class="ml-2" depressed rounded text>
        Reset
      </v-btn>
      <v-btn @click="$emit('addRegion')" class="ml-2" depressed rounded text>
        Add
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    regions: Array
  },
  name: "RegionsTemplateActions",
  data() {
    return {
      selectedRegion: null
    };
  },
  methods: {
    resetFilter() {
      this.$emit("reset");
      this.selectedRegion = null;
    }
  }
};
</script>

<style scoped></style>
