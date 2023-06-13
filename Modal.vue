<template>
  <h3>blank</h3>
</template>

<script>
export default {
  name: "Dialog",
  data: () => {
    return {
      model: {},
      id: null,
    };
  },
  props: {
    modalData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const data = Object.assign({}, this.modalData.data);
    this.id = data.Id;
    delete data.Id;
    if (this.modalData.type === "create") {
      for (const key in data) {
        data[key] = "";
      }
    }
    this.model = data;
  },
  methods: {
    close() {
      this.$emit("close", { type: "close" });
    },
    request() {
      if (this.modalData.type === "edit") {
        this.model.Id = this.id;
      }
      this.$emit("request", { type: this.modalData.type, data: this.model });
    },
  },
};
</script>
