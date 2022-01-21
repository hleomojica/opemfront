<template>
  <div>
    <b-button-group class="mb-2">
      <b-button
        :to="{
          name: 'empresasnew',
          params: {
            father: 'Empresas',
          },
        }"
        variant="outline-primary"
      >
        <b-icon icon="plus-circle-fill"></b-icon> Nueva
      </b-button>

      <b-button variant="outline-primary">
        <b-icon icon="search"></b-icon> Filtro
      </b-button>
    </b-button-group>

    <div v-if="loading"><Loader /></div>
    <b-table
      v-else
      striped
      hover
      light
      :items="dataTable.items"
      :fields="fields"
    >
      <template #cell(actions)="row">
        <b-button
          :to="{
            name: 'empresasnew',
            params: {
              id: row.item.id_emp,
              mode: 'edit',
              father: 'Empresas',
            },
          }"
          pill
          size="sm"
          class="mr-2"
          variant="success"
        >
          <b-icon icon="pen-fill" aria-hidden="true"></b-icon>
          Editar
        </b-button>

        <b-button
          pill
          variant="danger"
          size="sm"
          @click="info(row.item, row.index, $event.target)"
        >
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          Eliminar
        </b-button>
      </template>
    </b-table>

    <b-pagination
      v-model="page"
      :total-rows="count"
      :per-page="pageSize"
      align="fill"
      size="sm"
      class="mt-4"
      @change="handlePageChange"
    ></b-pagination>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" title="Cuidado !" hide-footer>
      <div class="d-block text-center">
        Esta seguro de eliminar la empresa
        <strong>{{ infoModal.empresa }}</strong>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="del"
        >Eliminar</b-button
      >
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Loader from "@/components/Loader/Loader";
import { validationMixin } from "vuelidate";
export default {
  mixins: [validationMixin],
  components: { Loader },
  data() {
    return {
      fields: [
        { key: "nombre_emp", label: "Razon social", sortable: true },
        { key: "nit_emp", label: "Nit" },
        { key: "telefono_emp", label: "Telefono" },
        { key: "correo_emp", label: "Correo" },
        { key: "actions", label: "Opciones" },
      ],
      infoModal: {
        id: "info-modal",
        empresa: "",
      },
      page: 1,
      count: 0,
      pageSize: 10,
    };
  },
  computed: {
    ...mapState({
      dataTable: (state) => state.empresas.dataTable,
      loading: (state) => state.empresas.loading,
    }),
  },
  methods: {
    info(item, index, button) {
      this.infoModal.empresa = item.nombre_emp;
      this.setDeleteId(item.id_emp);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    ...mapActions({
      getData: "empresas/getData",
      deleteItem: "empresas/deleteItem",
    }),
    ...mapMutations({
      setDeleteId: "empresas/setDeleteId",
      hideLoader: "empresas/hideLoader",
      showLoader: "empresas/showLoader",
    }),
    del() {
      this.$bvModal.hide("del");
      this.deleteItem();
    },
    getRequestParams(page, pageSize) {
      let params = {};
      if (page) {
        params["page"] = page - 1;
      }
      if (pageSize) {
        params["size"] = pageSize;
      }
      return params;
    },
    async getEmpresas() {
      const params = this.getRequestParams(this.page, this.pageSize);
      await this.getData(params);
      this.page = this.dataTable.currentPage + 1;
      this.count = this.dataTable.totalItems;
    },
    handlePageChange(value) {
      this.page = value;
      this.getEmpresas();
    },
  },

  beforeMount() {
    this.getEmpresas();
  },
};
</script>
