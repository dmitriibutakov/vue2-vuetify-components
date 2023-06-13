<template>
  <Loader v-if="loading" />
  <v-container v-else-if="operator" fluid>
    <AircraftModal
      v-if="modal"
      :data="custModal"
      :saveModal="saveModal"
      :cancelModal="cancelModal"
      :operatorId="currentTab"
    />
    <OperatorModal
      v-if="operatorModal"
      :data="custOperatorModal"
      :saveModal="saveOperator"
      :cancelModal="cancelModal"
    />
    <v-row class="offer__client">
      <v-col col="8">
        <v-row class="offer__client-info">
          <v-col class="offer__client-item" cols="4">
            <p><strong> Name:</strong> {{ operator.Name }}</p>
          </v-col>
          <v-col class="offer__client-item" cols="4">
            <p><strong> Country:</strong> {{ operator.CountryDesc }}</p>
          </v-col>
          <v-col class="offer__client-item" cols="4">
            <p><strong> City:</strong> {{ operator.City }}</p>
          </v-col>
          <v-col class="offer__client-item" cols="4">
            <p>
              <strong>Website:</strong
              ><a target="_blank" :href="'https://' + operator.Website">
                {{ operator.Website }}</a
              >
            </p>
          </v-col>
          <v-col class="offer__client-item" cols="4">
            <p><strong> Email:</strong> {{ operator.Email }}</p>
          </v-col>
          <v-col class="offer__client-item" cols="4">
            <p><strong> Fax:</strong> {{ operator.Fax }}</p>
          </v-col>
          <v-col class="offer__client-item" cols="12">
            <p><strong> Phone:</strong> {{ operator.Phone }}</p>
          </v-col>
          <div
            class="offer__client-edit"
            @click="modalOperatorHandler({ type: 'edit', data: operator })"
          >
            <v-icon>mdi-pencil</v-icon>
          </div>
        </v-row>
      </v-col>
    </v-row>

    <v-tabs v-model="currentTabOperator" class="mb-0" style="margin-top: 12px">
      <v-tabs-slider />
      <v-tab v-for="(el, i) in tabItems" :key="i">
        {{ el }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTabOperator">
      <v-tab-item v-for="(el, i) in tabItems" :key="i">
        <div class="pa-0">
          <v-data-table
            v-if="aircrafts"
            :items="aircrafts"
            :headers="offerHeaders"
            :page.sync="page"
            :items-per-page="count"
            class="offer-table"
            hide-default-footer
          >
            <template v-slot:item.Images="item">
              <v-img
                contain
                max-width="40px"
                max-height="40px"
                :value="item"
                :src="item.item.Images[0]"
              />
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-space-around">
                <v-icon @click="modalHandler({ type: 'edit', data: item })"
                  >mdi-pencil</v-icon
                >
                <v-icon @click="rowHandler({ data: item })">mdi-delete</v-icon>
              </div>
            </template>
            <template v-slot:body.prepend>
              <tr>
                <td v-for="(val, key) in template" :key="'search' + key">
                  <v-text-field
                    class="subheading"
                    v-model="query[key]"
                    @input="aircraftsHandler"
                    type="text"
                    :placeholder="key"
                  />
                </td>
                <v-btn
                  color="blue-grey lighten-4"
                  class="my-3 mx-4"
                  elevation="0"
                  centered
                  @click="modalHandler({ type: 'create', data: template })"
                  >Add row
                </v-btn>
              </tr>
            </template>
          </v-data-table>
          <div v-else>
            <h2 class="text-center mt-4">No data available</h2>
          </div>
          <v-row align="center" class="px-4 d-flex align-center">
            <v-col cols="auto" md="auto" class="showing d-flex align-center">
              <span>Showing {{ count }} of {{ total }}</span>
              <v-select v-model="limit" :items="[10, 15, 30]" :height="30" />
            </v-col>
            <v-col cols="12" md="8">
              <v-pagination
                v-model="page"
                :length="Math.ceil(total / limit)"
                :total-visible="9"
                @input="paginationHandler"
              />
            </v-col>

            <v-col cols="12" md="1" class="d-flex ml-auto justify-end">
              <v-btn
                color="red darken-1"
                text
                @click="buttonHandler(currentTab)"
                >Close
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import AircraftModal from "@/components/ModalWindows/AircraftModal";
import OperatorModal from "@/components/ModalWindows/OperatorModal";
import Loader from "@/components/Loader";
import { mapActions } from "vuex";
export default {
  components: {
    Loader,
    AircraftModal,
    OperatorModal
  },
  data() {
    return {
      tabItems: ["Aircrafts"],
      modal: false,
      operatorModal: false,
      template: null,
      custModal: {
        data: null,
        template: null
      },
      custOperatorModal: {
        data: null,
        template: null
      },
      loading: false,
      operator: null,
      aircrafts: null,
      page: 1,
      limit: 10,
      count: 0,
      total: 0,
      query: {},
      currentTabOperator: 0
    };
  },
  watch: {
    limit() {
      this.page = 1;
      this.aircraftsHandler();
    }
  },
  computed: {
    allOrder() {
      return this.$store.state.operators.tabs;
    },
    currentTab() {
      return this.allOrder[this.$store.state.operators.currentTab].id;
    },
    offerHeaders() {
      const headers = [];
      for (const el in this.template) {
        headers.push({
          text: el,
          value: el,
          width: `${(el.length + 18) * 7}px`,
          sortable: true,
          class: "blue-grey title lighten-4"
        });
      }
      headers.push({
        text: "Actions",
        width: "1%",
        value: "actions",
        sortable: false,
        class: "blue-grey title lighten-4"
      });
      return headers;
    }
  },
  async mounted() {
    await this.requestHandler();
    await this.aircraftsHandler();
  },
  methods: {
    ...mapActions({ deleteTab: "operators/deleteTab" }),
    cancelModal() {
      this.modal = false;
      this.operatorModal = false;
    },
    async rowHandler({ type, data }) {
      try {
        if (type === "create") {
          await this.$api.request.createRow({ url: "aircrafts", data });
        } else if (type === "edit") {
          await this.$api.request.editRow({ url: "aircrafts", data });
        } else {
          await this.$api.request.deleteRow({
            url: "aircrafts",
            data: { Id: data.Id }
          });
        }
        this.modal = false;
        await this.aircraftsHandler();
        this.$toast.success("Successfully operation");
      } catch (e) {
        this.$toast.error("Error");
      }
    },
    modalHandler({ type, data }) {
      this.modal = true;
      this.custModal = Object.assign(
        {},
        JSON.parse(JSON.stringify({ type, data }))
      );
    },
    async saveModal(type, data) {
      await this.rowHandler({ type, data });
    },
    async operatorHandler({ type, data }) {
      try {
        if (type === "create") {
          await this.$api.request.createRow({ url: "operators", data });
        } else if (type === "edit") {
          await this.$api.request.editRow({ url: "operators", data });
        } else {
          await this.$api.request.deleteRow({
            url: "operators",
            data: { Id: data.Id }
          });
        }
        this.operatorModal = false;
        await this.requestHandler();
        this.$toast.success("Successfully operation");
      } catch (e) {
        this.$toast.error("Error");
      }
    },
    modalOperatorHandler({ type, data }) {
      this.operatorModal = true;
      this.custOperatorModal = Object.assign(
        {},
        JSON.parse(JSON.stringify({ type, data }))
      );
    },
    async saveOperator(type, data) {
      await this.operatorHandler({ type, data });
    },
    async requestHandler() {
      this.loading = true;
      await this.$api.request
        .getTable(`/operators?Id=${this.currentTab}`)
        .then(resp => {
          this.operator = resp.data.Data[0];
        });
      this.loading = false;
    },
    async aircraftsHandler() {
      const query = await this.queryHandler();
      await this.$api.request
        .getTable(
          `/aircrafts?${query}&OperatorId=${this.currentTab}&Page=${this.page}&Limit=${this.limit}`
        )
        .then(resp => {
          this.template = resp.data.Template.BaseFields;
          delete this.template.Operator;
          delete this.template.OperatorId;
          this.aircrafts = resp.data.Data;
          this.page = resp.data.Pagination.Page;
          this.limit = resp.data.Pagination.Limit;
          this.total = resp.data.Pagination.Total;
          this.count = resp.data.Pagination.Count;
        });
    },
    queryHandler() {
      const arr = [];
      for (let i in this.query) {
        if (this.query[i] !== "") {
          arr.push(i + "=" + this.query[i]);
        } else {
          delete arr[i];
        }
      }
      return arr.join("&");
    },
    paginationHandler(val) {
      this.page = val;
      this.aircraftsHandler();
    },
    buttonHandler(tab) {
      this.deleteTab(tab);
    }
  }
};
</script>
