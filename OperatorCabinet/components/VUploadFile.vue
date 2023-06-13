<template>
  <div class="input__container">
    <div>
      <input
          :id="'my-file' + name"
          v-if="preview.length < 1"
          class="input"
          :accept="accept"
          autocomplete="off"
          multiple
          type="file"
          @change="handleFileChange($event)"
      />
      <label v-if="preview.length < 1" :for="'my-file' + name" class="butn">
        <img src="../../../shares/assets/img/plus.svg" alt="plus"/>
      </label>
      <button v-else class="butn" @click="() => $emit('deleteFile', name)">
        <img src="../assets/img/trash.svg" alt="trash"/>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VUploadFile',
  props: {
    name: {type: String, required: true},
    preview: {type: String, default: ''},
    arrFiles: {type: Array, required: true},
  },
  data() {
    return {
      errors: [],
      maxSize: 10,
      accept: 'image/*',
      isLoading: false,
      uploadReady: true,
      file: {
        name: '',
        size: 0,
        type: '',
        fileExtention: '',
        url: '',
        isImage: false,
        isUploaded: false,
      },
    }
  },
  methods: {
    handleFileChange(e) {
      this.errors = []
      const filesArr = [...this.arrFiles]
      if (e.target.files && filesArr.length <= 10) {
        const newArr = {...e.target.files}
        for (const i in newArr) {
          const el = newArr[i]
          if (this.isFileValid(el)) {
            const reader = new FileReader()
            reader.addEventListener(
                'load',
                () => {
                  this.v = {
                    name: el.name.split('.').shift(),
                    size: Math.round((el.size / 1024 / 1024) * 100) / 100,
                    type: el.type,
                    fileExtention: el.name.split('.').pop(),
                    url: reader.result,
                    isUploaded: true,
                  }
                },
                false
            )
            reader.readAsDataURL(el)
            if (
                filesArr.length < 1 ||
                !filesArr.find((val) => val.name === el.name)
            ) {
              filesArr.push(el)
            }
          }
          this.$emit('loadingFiles', filesArr, this.name)
        }
      }
    },
    isFileSizeValid(fileSize) {
      fileSize >= this.maxSize &&
      this.errors.push(`File size should be less than ${this.maxSize} MB`)
    },
    isFileTypeValid(fileExtention) {
      this.accept.split(',').includes(fileExtention) &&
      this.errors.push(`File type should be ${this.accept}`)
    },
    isFileValid(file) {
      this.isFileSizeValid(Math.round((file.size / 1024 / 1024) * 100) / 100)
      this.isFileTypeValid(file.name.split('.').pop())
      return this.errors.length === 0
    },
  },
}
</script>

<style scoped lang="scss">
.input__container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .butn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $secondaryLightestColor;
    border-radius: 4px;
    height: 30px;
    width: 30px;
    @include body-14-500;

    img {
      height: 18px;
      width: 18px;
    }
  }

  .input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
