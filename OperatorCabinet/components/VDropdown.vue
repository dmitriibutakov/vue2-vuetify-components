<template>
  <div
    :class="[
      'dropdown__body',
      {
        dropdown__body_search: isSearchDropdown,
        dropdown__body_column: setList,
      },
    ]"
  >
    <div
      v-click-outside="closeList"
      :class="['dropdown__name', { dropdown__name_border: setList }]"
      @click.stop="toggleShow"
    >
      {{ activeItem || defaultActiveItem }}
      <div class="dropdown__arr">
        <img
          :class="['dropdown__arr_up', { dropdown__arr_down: !isShowList }]"
          src="../assets/img/arrow-up.svg"
          alt="arrow"
        />
      </div>
    </div>
    <transition name="dropdown">
      <v-dropdown-list
        v-if="isShowList && dropdownList.length > 0"
        :without-border="!!setList"
        :click-callback="clickHandler"
        :dropdown-list="dropdownList"
      />
    </transition>
  </div>
</template>

<script>
import VDropdownList from "@/components/OperatorCabinet/components/VDropdownList";

export default {
  name: 'VDropdown',
  components: {VDropdownList},
  props: {
    dropdownList: { type: Array },
    name: String,
    setList: Function,
    defaultActiveItem: String,
    activeItem: {type: String, required: true},
    isSearchDropdown: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isShowList: false,
  }),
  // computed: {
  //   ...mapGetters(['getIsLoading']),
  // },
  // watch: {
  //   '$i18n.locale'() {
  //     this.activeItem = this.defaultActiveItem
  //   },
  // },
  methods: {
    closeList() {
      this.isShowList = false
    },
    async toggleShow() {
      await this.$emit('setListCallback')
      this.isShowList = !this.isShowList
    },
    clickHandler(event, ind, obj) {
      // this.activeItem = event.target.innerText
      return this.$emit('setActiveList', event.target.innerText, ind, obj)
    },
  },
}
</script>

<style scoped lang="scss">
.dropdown__body {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 100%;
  font-weight: 500;
  line-height: 1.21;
  transition: $animation3ms;
  color: $secondaryDarkestColor;
  border: 1px solid $secondaryDarkColor;
  border-radius: 8px;
  background-color: $secondaryLightestColor;

  &_search {
    background-color: transparent;
    .dropdown__name {
      padding-right: 32px;
    }
  }

  &_column {
    flex-direction: column;
  }

  .dropdown__name {
    position: relative;
    display: flex;
    justify-content: flex-start;
    width: calc(100% - 8px);
    min-height: 51px;
    color: $secondaryDarkestColor;
    //padding: 0 32px 0 16px;
    padding-right: 32px;
    align-items: center;
    transition: $animation3ms;

    &_border {
      @include body-14-600;
      width: calc(100% - 16px);
      height: 48px;
      padding-left: 16px;
    }

    .dropdown__arr {
      position: absolute;
      right: 12px;
      padding: 4px;
      width: 20px;
      height: 20px;
      background-color: white;

      .dropdown__arr_up,
      .dropdown__arr_down {
        width: 100%;
        height: 100%;
        transition: $animation3ms;
      }

      .dropdown__arr_down {
        transform: rotate(180deg);
      }
    }
  }

  &_search {
    border-radius: 100px;
    height: 100%;
    flex: 0 1 110px;
  }

  //&:hover {
  //  border: 1px solid $primaryLighterColor;
  //}
}
</style>
