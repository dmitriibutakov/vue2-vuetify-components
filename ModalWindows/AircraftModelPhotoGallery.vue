<template>
  <div class="gallery">
    <!--    <VueGallery :images="images" :index="index" @close="closeHandler"/>-->
    <ul class="gallery__list">
      <li :class="['gallery__item', {gallery__item_active: selectItem.id === idx}]" v-for="(item, idx) in images"
          :key="idx">
 <span v-for="(v, i) in item" :key="v.Id + i">
             <img @click="selectHandler({id: idx, name: v.Id})" v-if="i === 'Path'" :src="v"/>
          <span class="utils" v-show="selectItem.id === idx">
                <a :href="item.Path" target="_blank" class="open">
                  <v-icon color="#8c8c8c" x-medium>
                    mdi-eye
                  </v-icon>
                </a>
<!--                <span @click="deleteHandler" class="delete">-->
<!--                  <v-icon color="#8c8c8c" x-medium>-->
<!--                    mdi-delete-->
<!--                  </v-icon>-->
<!--                </span>-->
              </span>
           </span>

      </li>
      <!--      <li v-for="(item, idx) in images"-->
      <!--          :class="['gallery__item', {gallery__item_active: selectItem.id === idx}]"-->
      <!--          :key="`${item}-${idx}`">-->
      <!--        <span :ref="`gallery__item-${i}`" @click="-->
      <!--          selectHandler({id: i, name: v.Path})" v-for="(v, i) in item" :key="i">-->
      <!--          <img v-if="i === 'Path'" :src="v"/>-->
      <!--        </span>-->
      <!--        <span class="utils" v-show="selectItem.hasOwnProperty('id')">-->
      <!--      <span @click="index = selectItem.id" class="open">-->
      <!--        <v-icon color="#8c8c8c" x-medium>-->
      <!--          mdi-eye-->
      <!--        </v-icon>-->
      <!--      </span>-->
      <!--      <span @click="deleteHandler" class="delete">-->
      <!--        <v-icon color="#8c8c8c" x-medium>-->
      <!--          mdi-delete-->
      <!--        </v-icon>-->
      <!--      </span>-->
      <!--    </span>-->
      <!--      </li>-->
    </ul>
  </div>
</template>

<script>

export default {
  name: "AircraftModelPhotoGallery",
  props: {
    images: Array
  },
  data() {
    return {
      index: null,
      selectItem: {}
    };
  },
  methods: {
    clickhandler(v) {
      console.log(v)
    },
    selectHandler(selectItem) {
      this.selectItem = selectItem;
    },
    deleteHandler() {
      this.$emit("delete", this.selectItem.name);
      this.selectItem = {};
    },
    closeHandler() {
      this.index = null;
      this.selectItem = {};
    }
  },
};
</script>

<style lang="scss" scoped>
.gallery {
  padding: 10px;

  &__list {
    list-style: none;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 15px;
    height: 300px;
    overflow-y: scroll;
  }

  &__item {
    max-width: 100px;
    max-height: 100px;
    cursor: pointer;
    list-style: none;
    transition: 0.4s ease;

    &_active {
      transform: scale(1.15);
      box-shadow: 4px 4px 14px 0px rgba(0, 0, 0, 0.21);
    }

    img {
      object-fit: fill;
      width: 100px;
      height: 100px;
    }
  }

  .utils {
    left: -20%;
    bottom: -40%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 20px;
    border-radius: 12px;
    margin: 15px 20px 0;
    background: #fff;
    box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.21);

    a {
      text-decoration: none;
    }

    i {
      cursor: pointer;
      transition: 0.5s ease;

      &:hover {
        color: #000 !important;
      }
    }
  }
}
</style>
