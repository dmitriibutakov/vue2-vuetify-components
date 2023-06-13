<template>
  <v-dialog persistent max-width="50%" v-model="isOpen">
    <v-card class="pa-4">
      <v-card-title>
        <h2>{{ currentTitle }}</h2>
      </v-card-title>
      <v-form v-if="modalData">
        <v-row>
          <v-col>
            <v-text-field
                class="subheading"
                label="FirstName"
                v-model="modalData['FirstName']"
                type="text"
                placeholder="FirstName"
            />
          </v-col>
          <v-col>
            <v-text-field
                class="subheading"
                label="SecondName"
                v-model="modalData['SecondName']"
                type="text"
                placeholder="LastName"
            />
          </v-col>
          <v-col>
            <v-text-field
                class="subheading"
                label="Email"
                v-model="modalData['Email']"
                type="text"
                placeholder="Email"
            />
          </v-col>
          <v-col>
            <v-text-field
                class="subheading"
                label="Password"
                v-model="modalData['Password']"
                type="text"
                placeholder="Password"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
                class="subheading"
                label="GroupID"
                v-model="modalData['GroupID']"
                type="text"
                placeholder="GroupID"
            />
          </v-col>
          <v-col>
            <v-text-field
                class="subheading"
                label="GroupID"
                v-model="modalData['CompanyID']"
                type="text"
                placeholder="GroupID"
            />
          </v-col>
          <v-col>
            <v-select
                class="subheading"
                label="Active"
                :items="[true, false]"
                v-model="modalData['Active']"
                type="text"
                placeholder="Active"
            />
          </v-col>
          <v-col>
            <v-menu
                ref="dateCreate"
                v-model="dateCreate"
                class="ma-2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    class="ma-2"
                    label="Birthdate"
                    placeholder="Birthdate"
                    dense
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    v-model="modalData['DateCreate']"
                />
              </template>
              <v-date-picker
                  v-model="modalData['DateCreate']"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn color="red darken-1" text @click="$emit('close')">
          Disagree
        </v-btn>
        <v-btn color="green darken-1" text @click="saveUserModal">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UserModal",
  props: {
    isOpen: Boolean,
    currentTitle: String,
    fields: Object,
    type: String
  },
  data() {
    return {
      modalData: this.fields,
      dateCreate: false
    };
  },
  methods: {
    async saveUserModal() {
      const payload = { ...this.modalData };
      payload.DateCreate = this.modalData.DateCreate + "T10:00:00Z";
      switch (this.type) {
        case "add":
          await this.$api.request
              .createRow({ url: "signup", data: JSON.stringify(payload) })
              .then(() => {
                this.$emit("request");
                this.$emit("close");
              })
              .catch(() => this.$toast.error("Error!"));

          break;
        case "edit":
          await this.$api.request
              .editRow({ url: "user", data: JSON.stringify(payload) })
              .then(() => {
                this.$emit("request");
                this.$emit("close");
              })
              .catch(() => this.$toast.error("Error!"));
          break;
        case "delete":
          break;

        default:
          break;
      }
    }
  },
  watch: {
    fields: {
      deep: true,
      handler(current) {
        if (current) {
          this.modalData = current;
          if (this.modalData.DateCreate === "0001-01-01") {
            this.modalData.DateCreate = new Date().toISOString().substr(0, 10);
          }
        }
      }
    }
  }
};
</script>

<style scoped></style>
