<template>
  <div class="pagination">
    <div class="pagination-buttons">
      <button
        :disabled="page === 1"
        class="pagination-prev"
        @click="navigationHandler({ type: 'prev' })"
      >
        <i
          aria-hidden="true"
          class="v-icon notranslate mdi mdi-chevron-left theme--light"
        ></i>
      </button>
      <button
        :disabled="item === page"
        :class="{ active: item === page }"
        @click="pageHandler(item)"
        class="pagination-item"
        v-for="item in this.pages"
        :key="item"
      >
        {{ item }}
      </button>
      <button
        :disabled="page === pageCount"
        class="pagination-next"
        @click="navigationHandler({ type: 'next' })"
      >
        <i
          aria-hidden="true"
          class="v-icon notranslate mdi mdi-chevron-right theme--light"
        ></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["total", "limit", "page"],
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.limit);
    },
    pages() {
      const pages = [];
      if (this.pageCount > 10) {
        if (this.page > 5) {
          for (let i = this.page - 4; i <= this.page + 5; i++) {
            pages.push(i);
            if (i === this.pageCount) break;
          }
        } else {
          for (let i = 1; i <= 10; i++) {
            pages.push(i);
            if (i === this.pageCount) break;
          }
        }
      } else {
        for (let i = 1; i <= this.pageCount; i++) {
          pages.push(i);
        }
      }
      return pages;
    },
  },
  methods: {
    pageHandler(payload) {
      this.$emit("update:page", payload);
      this.$emit("handler");
    },
    navigationHandler({ type, val }) {
      switch (type) {
        case "prev":
          return this.pageHandler(this.page - 1);
        case "next":
          return this.pageHandler(this.page + 1);
        case "limit":
          return this.pageHandler({ type: "limit", val });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  &-prev,
  &-next,
  &-item {
    background: #fff;
    box-shadow: 0 0 5px #000;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    transition: all 300ms;
  }
  &-prev {
    margin-right: 10px;
  }
  &-item {
    margin-right: 10px;
  }

  &-prev:disabled,
  &-next:disabled {
    opacity: 0.5;
  }

  &-item {
    transition: all 300ms;
    &.active,
    &:hover {
      background: #1976d2;
      color: #fff;
      box-shadow: unset;
    }
  }
}
</style>
