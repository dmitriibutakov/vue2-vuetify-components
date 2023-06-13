<template>
  <p v-if="item === null">No offer yet</p>
  <tr class="offer__item" v-else >
    <td>
      {{ item.Country }}
    </td>

    <td>
      {{ item.Class }}
    </td>
    <td>
      {{ item.Type }}
    </td>
    <td>{{ item.Reg_num }}</td>
    <td>{{ item.PAX }}</td>
    <td>{{ item.Year }}</td>
    <td>
        <v-icon @click="modalHandler({ type: 'edit', data: item})">
             mdi-pencil
        </v-icon>
        <v-icon @click="rowHandler({ data: item})">mdi-delete</v-icon>
    </td>
  </tr>
</template>


<script>
import { getFormattedDate } from "../filters";
export default {
  name: "OrderInfoItem",
  props: {
    item: {
      type: Object,
    },
  },
  filters: {
    getFormattedDate,
  },
  methods: {
    modalHandler(obj) {
      this.$emit("modalHandler", obj);
    },
    rowHandler(obj){
      this.$emit("rowHandler", obj)
    }
  },
};
</script>

<style scoped>
.col {
  padding: 5px 0;
}
.v-card__title + .v-card__subtitle,
.v-card__title + .v-card__text {
  padding-bottom: 2px;
}
</style>
