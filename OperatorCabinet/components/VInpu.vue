<template>
  <div class="input__block">
    <input
      v-if="name === 'phone' || name === 'budget'"
      :id="placeholder"
      v-model="val"
      autocomplete="off"
      :maxlength="maxmobile"
      :class="{ input__body_error: error, input__body_active: val }"
      @input="acceptNumber"
    />
    <textarea
      v-else-if="isComment"
      :id="placeholder"
      :value="value"
      :class="{ input__body_error: error, input__body_active: value }"
      @input="handlerChange"
    />
    <input
      v-else
      :id="placeholder"
      :autocomplete="false"
      :value="value"
      :type="(name === 'Password' && 'password') || type"
      :class="{ input__body_error: error, input__body_active: value }"
      @input="handlerChange"
    />

    <label :for="placeholder">
      {{ placeholder }}
    </label>
<!--    <p v-if="error" class="input__error">-->
<!--      <img src="@/assets/icons/danger.webp" alt="error" />{{ error }}-->
<!--    </p>-->
  </div>
</template>

<script>
export default {
  name: 'VInpu',
  props: {
    type: String,
    placeholder: String,
    error: String,
    value: [String, Number],
    name: { type: String, required: true },
    isComment: { type: Boolean, default: false },
  },
  data() {
    return {
      val: +this.value,
      maxmobile: 20,
    }
  },
  watch: {
    value() {
      if (this.name ==='budget') {
        this.val = this.value
      }
    }
  },
  methods: {
    handlerChange(event) {
      this.$emit('customChange', this.name, event.target.value)
    },
    acceptNumber() {
      if (this.name === 'phone') {
        this.val = `+${this.val.replace(/\D/g, '')}`
      } else if (this.name === 'budget') {
        this.val = this.val.replace(/\D/g, '')
      }
      this.$emit('customChange', this.name, +this.val)
    },
  },
}
</script>

<style scoped lang="scss">
.input__block {
  width: 100%;
  display: flex;
  height: 100%;
  z-index: 0;
  position: relative;

  label {
    position: absolute;
    font-weight: 500;
    padding-right: 16px;
    color: $secondaryDarkestColor;
    bottom: 12px;
    left: 12px;
    top: 31%;
    transition: top 0.3s linear;
  }

  input,
  textarea {
    color: $secondaryDarkestColor;
    width: 100%;
    border: 1px solid $secondaryDarkColor;
    padding: 4px 12px;
    height: 53px;
    background-color: transparent;
    border-radius: 8px;
    z-index: 2;
  }

  textarea {
    height: 100%;
    min-height: 124px;
    padding: 24px 12px 12px 12px;
    resize: none;
    overflow-x: hidden;
    overflow-y: auto;
    overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 90%;
      width: 6px;
      border-radius: 2px;
      background-color: $secondaryLightestColor;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $secondaryLighterColor;
      border-radius: 2px;
    }
  }

  input:focus + label,
  textarea:focus + label,
  .input__body_active + label {
    font-size: 12px;
    z-index: 3;
    height: 14px;
    background-color: white;
    border-radius: 6px;
    color: $secondaryDarkerColor;
    top: 8px;
  }

  input:focus,
  .input__body_active {
    padding-top: 21px;
  }

  ::-webkit-input-placeholder {
    opacity: 0;
  }

  input:focus::-webkit-input-placeholder,
  textarea:focus::-webkit-input-placeholder {
    opacity: 1;
  }

  input,
  textarea {

    &:hover,
    &:focus {
      //border: 1px solid $primaryLighterColor;
    }

    //&_error {
    //  border: 1px solid $dangerDarkColor;
    //}
  }

  //.input__error {
  //  @include flexCenterAll;
  //  font-size: 14px;
  //  font-weight: 500;
  //  position: absolute;
  //  left: 0;
  //  bottom: -1.7em;
  //  color: $dangerLightColor;
  //}
}
</style>
