<template>
  <div class="autocomplete">
    <v-text-field
      :label="label"
      hide-details="auto"
      class="form-control"
      type="text"
      dense
      outlined
      :disabled="disabled"
      autocomplete="new-password"
      v-model="search"
      :rules="rules"
      @input="loadList(search)"
      @keydown.enter="enter"
      @keydown.up="up"
      @keydown.down="down"
      @keydown.tab="open = false"
      @change="change"
      @blur="checkFocus"
    ></v-text-field>
    <v-list
      class="autocomplete-list"
      :style="{ width: width ? width : '100%' }"
      v-if="items && open"
    >
      <v-list-item
        v-for="(item, idx) in items"
        :key="idx"
        @click="suggestionClick(item)"
        :class="{ focus: idx === current }"
      >
        <slot :item="item"> </slot>
      </v-list-item>
      <div v-intersect="onIntersect" />
    </v-list>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      open: false,
      items: [],
      search: "",
      lastCall: null,
      current: 0,
      firstInter: false,
      limitInter: 20
    };
  },
  props: {
    token: {
      type: String
    },
    width: {
      type: String
    },
    list: {
      type: Array
    },
    urlquery: {
      type: String
    },
    selectionitem: {
      type: Object,
      required: true
    },
    selection: {
      type: String,
      required: true,
      twoWay: true
    },
    label: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    urlname: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 300
    },
    disabled: {
      type: Boolean
    },
    rules: {
      type: [],
      required: false
    }
  },
  mounted() {
    this.search = this.selection;
  },
  watch: {
    selection() {
      this.search = this.selection;
    }
  },
  methods: {
    debounce(f, t) {
      const vm = this;
      return function(args) {
        let previousCall = vm.lastCall;
        vm.lastCall = Date.now();
        if (previousCall && vm.lastCall - previousCall <= t) {
          clearTimeout(vm.lastCallTimer);
        }
        vm.lastCallTimer = setTimeout(() => f(args), t);
      };
    },
    async loadList(val) {
      this.$emit("update:selection", val);

      this.open = true;
      try {
        let autocompleteTimeout = async () => {
          await this.$api.request
            .getTable(
              `${this.url}?${this.urlname}=${val}${
                this.urlquery ? `&${this.urlquery}` : ""
              }&limit=20`
            )
            .then(result => {
              this.items = result.data.Data;
            });
        };
        this.debounce(autocompleteTimeout, this.timeout)();
      } catch (e) {
        this.$toast.error("Error");
      }
    },
    suggestionClick(item) {
      this.$emit("update:selectionitem", item);
      this.$emit("updateauto");
      this.open = false;
    },
    checkFocus() {
      var lastSearch = this.search;
      setTimeout(() => {
        if (this.search === lastSearch) {
          this.open = false;
        }
      }, 300);
    },
    enter() {
      this.suggestionClick(this.items[this.current]);
    },
    up() {
      if (this.current > 0) {
        var list = $(".autocomplete-list");
        var listItems = $(".autocomplete-list > div");
        list.scrollTop(listItems[this.current].offsetTop - 50);
        this.current--;
      }
    },
    down() {
      if (this.current < this.items.length - 1) {
        var list = $(".autocomplete-list");
        var listItems = $(".autocomplete-list > div");
        list.scrollTop(listItems[this.current].offsetTop + 50);
        this.current++;
      }
    },
    change() {
      if (!this.open) {
        this.open = true;
        this.current = 0;
      }
    },
    async onIntersect(isIntersecting) {
      if (isIntersecting[0].isIntersecting) {
        if (this.firstInter) {
          this.limitInter += 20;
          await this.$api.request
            .getTable(
              `${this.url}?${this.urlname}=${this.search}${
                this.urlquery ? `&${this.urlquery}` : ""
              }&limit=${this.limitInter}`
            )
            .then(result => {
              this.items = result.data.Data;
            });
        }
        this.firstInter = true;
      }
    }
  }
};
</script>

<style scoped lang="css">
.autocomplete {
  position: relative;
}

.autocomplete-list {
  position: absolute;
  background: #fff;
  width: inherit;
  max-width: inherit;
  height: inherit;
  z-index: 999;
  max-height: 250px;
  overflow-y: auto;
  border-radius: 5px !important;
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 20%), 0px 0px 0px 0px rgb(0 0 0 / 14%),
    0px 0px 0px 0px rgb(0 0 0 / 12%);
}

.autocomplete-list::-webkit-scrollbar {
  display: none;
}

.focus {
  background: rgba(0, 0, 0, 0.2);
  color: #1976d2 !important;
}
</style>
