<template>
  <ul
    :class="[
      'dropdown__list',
    ]"
  >
    <li
      v-for="(v, i) in dropdownList"
      :key="i"
      class="dropdown__item"
      @click="(e) => clickCallback(e, v.Id || v.Ids, v)"
    >
      <span v-if="typeof v === 'object'">{{
        v.Name || v.Type
      }}</span>
      <span v-else>{{ v }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'VDropdownList',
  props: {
    withoutBorder: { type: Boolean },
    clickCallback: { type: Function, required: true },
    dropdownList: { type: Array, required: true },
  },
}
</script>

<style scoped lang="scss">
.dropdown__list {
  position: absolute;
  top: 110%;
  left: 0;
  padding-left: 0;
  border-radius: 8px;
  border: 1px solid $secondaryDarkColor;
  width: 100%;
  max-height: 150px;
  overflow-y: scroll;
  z-index: 999;
  transition: $animation3ms;
  background-color: $secondaryLightestColor;
  @include body-14-400;

  & > :first-child {
    border-radius: 8px 8px 0 0;
  }

  & > :last-child {
    border-radius: 0 0 8px 8px;
  }

  .dropdown__item {
    display: flex;
    color: $secondaryDarkestColor;
    transition: $animation3ms;
    padding: 16px 12px;
    cursor: pointer;

    &:hover {
      background-color: $secondaryLightColor;
    }
  }
}
</style>
