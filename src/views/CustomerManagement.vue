<template>
  <div class="md-layout">
    <div
      class="md-layout-item md-large-size-25 md-medium-size-25 md-small-size-50 md-xsmall-size-100"
    >
      <form novalidate class="" @submit.prevent="handleSubmit">
        <md-card>
          <md-progress-bar md-mode="indeterminate" v-show="form.loading" />
          <md-card-header>
            <div class="md-title" v-if="formAdd">ADD NEW CUSTOMER</div>
            <div class="md-title" v-if="formEdit">EDIT CUSTOMER</div>
          </md-card-header>

          <md-card-content>
            <md-field :class="getFieldClass('fullname')">
              <label for="fullname">Full name</label>
              <md-input
                v-model="form.fullname.value"
                name="fullname"
                id="fullname"
                :disabled="form.loading"
                @focus.keydown="resetFieldMsg('fullname')"
              />
              <span class="md-error">{{ form.fullname.message }}</span>
            </md-field>

            <md-field :class="getFieldClass('phone')">
              <label for="phone">Phone</label>
              <md-input
                v-model="form.phone.value"
                name="phone"
                id="phone"
                :disabled="form.loading"
                @focus.keydown="resetFieldMsg('phone')"
              />
              <span class="md-error">{{ form.phone.message }}</span>
            </md-field>

            <md-content>
              <span class="md-body-1">Point: </span>
              <md-chip md-static>{{ form.point }}</md-chip>
            </md-content>
          </md-card-content>

          <md-card-actions>
            <md-button type="button" class="md-accent" @click="resetForm"
              >Reset</md-button
            >
            <md-button type="submit" class="md-primary" v-if="formAdd"
              >Create</md-button
            >
            <md-button type="submit" class="md-primary" v-else>Edit</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
    <div
      class="md-layout-item md-large-size-70 md-medium-size-70 md-small-size-50 md-xsmall-size-100"
    >
      <!-- <md-card-header data-background-color="purple">
					<h4 class="title">User Management</h4>
					<p class="category">Add - Edit - Search</p>
				</md-card-header> -->
      <md-table
        v-model="searched"
        md-sort="updatedAt"
        md-sort-order="desc"
        md-card
        md-fixed-header
        :md-sort.sync="currentSort"
        :md-sort-order.sync="currentSortOrder"
        :md-sort-fn="customSort"
        primary
      >
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title"></h1>
          </div>
          <md-field md-clearable class="md-toolbar-section-end">
            <md-input
              placeholder="Search by name..."
              v-model="search"
              @input="searchOnTable"
            />
          </md-field>
        </md-table-toolbar>

        <md-table-row
          slot="md-table-row"
          slot-scope="{ item }"
          table-header-color="purple"
          md-selectable="single"
          @click="fillForm(item)"
        >
          <md-table-cell md-label="Role" md-sort-by="fullname">{{
            item.fullname
          }}</md-table-cell>
          <md-table-cell md-label="Phone" md-sort-by="phone">{{
            item.phone
          }}</md-table-cell>
          <md-table-cell md-label="Point" md-sort-by="point">{{
            item.point
          }}</md-table-cell>
          <md-table-cell md-label="Join Date" md-sort-by="createdAt">{{
            item.createdAt
          }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>

    <md-snackbar
      md-position="left"
      :md-duration="Infinity"
      :md-active.sync="showMsg"
      md-persistent
      @click="showMsg = false"
    >
      <span v-text="message"></span>
      <md-button class="md-primary" @click="showMsg = false">&times;</md-button>
    </md-snackbar>
  </div>
</template>
<style>
.md-layout-item {
  margin: 15px;
}
</style>
<script>
export default {
  name: "App",
  data() {
    return {
      api: {
        query: "/customer/query",
        add: "/customer/add",
        edit: "/customer/edit"
      },
      message: "",
      showMsg: false,
      customers: [],
      currentSort: "updatedAt",
      currentSortOrder: "asc",
      search: "",
      searched: [],
      formAdd: true,
      form: {
        loading: false,
        _id: "",
        fullname: {
          value: "",
          message: ""
        },
        phone: {
          value: "",
          message: ""
        },
        point: 0
      }
    };
  },
  created() {
    this.query();
  },
  computed: {
    formEdit() {
      return !this.formAdd;
    }
  },
  methods: {
    resetTable() {
      this.search = "";
      this.searchOnTable();
      this.currentSort = "updatedAt";
      this.currentSortOrder = "desc";
      this.customSort(this.searched);
    },
    resetForm() {
      function clear(...inp) {
        for (let i of inp) {
          i.value = "";
          i.message = "";
        }
      }
      clear(this.form.fullname, this.form.phone);
      this.form._id = "";
      this.form.point = 0;
      this.formAdd = true;
    },
    fillForm(customer) {
      this.form.fullname.value = customer.fullname;
      this.form.phone.value = customer.phone;
      this.form._id = customer._id;
      this.form.point = customer.point;
      this.formAdd = false;
    },
    resetFieldMsg(field) {
      let key = this.form[field];
      if (key) {
        key.message = "";
      }
    },
    handleObjectMsg(objectMsg) {
      if (objectMsg) {
        let message = "";
        for (let key in objectMsg) {
          if (this.form.hasOwnProperty(key)) {
            this.form[key].message = objectMsg[key];
          } else {
            message += objectMsg[key] + ". ";
          }
        }
        if (message.trim()) {
          this.$root.$emit("showMsg", message);
        } else {
          this.$root.$emit("hideMsg");
        }
      }
    },
    getFieldClass(field) {
      let key = this.form[field];
      let hasMsg = false;
      if (key) {
        hasMsg = Boolean(key.message);
      }
      return hasMsg ? "md-invalid" : "";
    },
    searchOnTable() {
      this.searched = this.customers.filter(item => {
        let search = this.search.toLowerCase();
        let stringify = JSON.stringify(item).toLowerCase();
        return stringify.includes(search);
      });
    },
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
        if (this.currentSortOrder === "asc") {
          return (a[sortBy] + "").localeCompare(b[sortBy] + "");
        }
        return (b[sortBy] + "").localeCompare(a[sortBy] + "");
      });
    },
    query() {
      this.$axios
        .post(this.api.query, {
          length: 0,
          index: 0,
          sortField: "updatedAt",
          asc: false,
          text: ""
        })
        .then(res => {
          let { customers } = res.data;
          if (customers) {
            this.customers = customers;
            this.searched = this.customers;
          }
        })
        .catch(err => {
          this.handleObjectMsg(err.message);
        })
        .then(() => {
          // this.form.loading = false;
        });
    },
    getFormData() {
      let formData = {
        fullname: this.form.fullname.value,
        phone: this.form.phone.value
      };
      if (this.formEdit) {
        formData._id = this.form._id;
      }
      return formData;
    },
    handleSubmit() {
      this.$root.$emit("hideMsg");
      this.form.loading = true;
      if (this.formAdd) {
        this.add();
      } else {
        this.edit();
      }
    },
    add() {
      this.$axios
        .post(this.api.add, this.getFormData())
        .then(res => {
          let { message, customer } = res.data;
          this.handleObjectMsg(message);
          if (customer) {
            this.customers.unshift(customer);
            this.resetTable();
            this.resetForm();
          }
        })
        .catch(err => {
          this.handleObjectMsg(err.message);
        })
        .then(() => {
          this.form.loading = false;
        });
    },
    edit() {
      this.$axios
        .post(this.api.edit, this.getFormData())
        .then(res => {
          let { message, customer } = res.data;
          this.handleObjectMsg(message);
          if (customer) {
            this.customers = this.customers.filter(e => e._id != customer._id);
            this.customers.unshift(customer);
            this.resetTable();
            this.resetForm();
          }
        })
        .catch(err => {
          this.handleObjectMsg(err.message);
        })
        .then(() => {
          this.form.loading = false;
        });
    }
  }
};
</script>
