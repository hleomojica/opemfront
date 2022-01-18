 <template>
  <div>
    <b-button-group class="mb-2">
      <router-link
        :to="{
          name: 'certificacionesnew',
          params: {
            father: 'Certificaciones',
          },
        }"
      >
        <b-button variant="outline-primary">
          <b-icon icon="plus-circle-fill"></b-icon> Nuevo
        </b-button>
      </router-link>
      <b-button variant="outline-primary">
        <b-icon icon="search"></b-icon> Filtro
      </b-button>
      <b-button variant="outline-primary">
        <b-icon icon="printer"></b-icon> Imprimir
      </b-button>
    </b-button-group>

    <div v-if="loading"><Loader /></div>

    <b-table
      striped
      hover
      light
      :items="dataTable.items"
      :fields="fields"
      :per-page="perPage"
    >
      <template #cell(edit)="row">
        <router-link
          :to="{
            name: 'certificacionesnew',
            params: {
              id: row.item.id_cer,
              mode: 'edit',
              father: 'Certificaciones',
            },
          }"
        >
          <b-button pill size="sm" class="mr-2" variant="success">
            <b-icon icon="pen-fill" aria-hidden="true"></b-icon>
          </b-button>
        </router-link>
      </template>
      <template #cell(estado)="row">
        <b-button-group pill>
          <b-dropdown :variant="estadoBtn(row)" :text="estadoText(row)">
            <b-dropdown-item @click="changeEstado(row, 0)" variant="warning"
              >En Curso</b-dropdown-item
            >
            <b-dropdown-item @click="changeEstado(row, 1)" variant="success"
              >Finalizado</b-dropdown-item
            >
            <b-dropdown-item @click="changeEstado(row, 2)" variant="secundary"
              >Cancelado</b-dropdown-item
            >
          </b-dropdown>
        </b-button-group>
      </template>
    </b-table>

    <b-pagination
      v-model="page"
      :total-rows="count"
      :per-page="perPage"
      align="fill"
      size="sm"
      class="mt-4"
      @change="handlePageChange"
    ></b-pagination>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Loader from "@/components/Loader/Loader";
import dataFormatter from "@/use/dataFormatter.js";

export default {
  components: { Loader },
  data() {
    return {
      config: [],
      fields: [
        { key: "curso.nombre_cur", label: "Curso" },
        { key: "cohorte_cer", label: "Cohorte" },
        { key: "fechainicio_cer", label: "Fecha Expedición" },
        { key: "fechafin_cer", label: "Fecha Vencimiento" },
        { key: "horas_cer", label: "Horas" },
        { key: "estado", label: "Estado" },
        { key: "edit", label: "" },
      ],
      page: 1,
      count: 0,
      perPage: 10,
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.certificaciones.loading,
      dataTable: (state) => state.certificaciones.dataTable,
      modalOpen: (state) => state.certificaciones.modalOpen,
    }),
    dataFormatter() {
      return dataFormatter;
    },
  },
  methods: {
    estadoBtn(row) {
      if (row.item.estado_cer == 1) {
        return "success";
      } else if (row.item.estado_cer == 0) {
        return "warning";
      } else {
        return "danger";
      }
    },
    estadoText(row) {
      if (row.item.estado_cer == 1) {
        return "Finalizado";
      } else if (row.item.estado_cer == 0) {
        return "En Curso";
      } else {
        return "Cancelado";
      }
    },
    info(item, mode) {
      this.$router.push(`${this.$route.fullPath}/${item.id_cer}/${mode}`);
    },
    submitHandler() {
      let request = "?";
      this.config.forEach((item) => {
        item.number
          ? (request += `${item.filter}Range=${item.valueFrom}&${item.filter}Range=${item.valueTo}&`)
          : (request += `${item.filter}=${item.value}&`);
      });
      this.getFilteredData(request);
    },
    clearFilters() {
      this.getData();
    },
    delFilter(index) {
      this.config.splice(index, 1);
      this.config.length === 0 ? (this.showFilters = false) : null;
    },
    addFilter() {
      !this.showFilters ? (this.showFilters = true) : null;
      this.config.push({});
    },
    apply(data) {
      let id = data.id;
      this.config.splice(id, 1, data);
    },
    onRowClick({ row }) {
      this.$router.push(`/admin/certificaciones/${row.id}/edit`);
    },
    ...mapActions({
      getData: "certificaciones/getData",
      getFilteredData: "certificaciones/getFilteredData",
      deleteItem: "certificaciones/deleteItem",
      updateEstado: "certificaciones/editEstado",
    }),
    ...mapMutations({
      setDeleteId: "certificaciones/setDeleteId",
    }),
    getRequestParams(page, perPage) {
      let params = {};
      if (page) {     
        params["page"] = page - 1;
      }
      if (perPage) {
        params["size"] = perPage;
      }
      return params;
    },
    async retrieveTutorials() {
      const params = this.getRequestParams(1, this.perPage);
      await this.getData(params);
    },
    handlePageChange(value) {
      this.page = value;
      this.size = 10;
      this.retrieveTutorials();
    },
    async changeEstado(row, estado) {
      const certifica = {
        estado: estado,
        id: row.item.id_cer,
      };
      await this.updateEstado(certifica);
      this.retrieveTutorials();
    },
  },
  async beforeMount() {
    await this.getData({ page: 0, size: 10 });
    this.page = this.dataTable.currenPage;
    this.count = this.dataTable.totalItems;
  },
};
</script>

<style scoped>
.image-preview {
  width: 191px;
  height: 141px;
  background-size: cover;
  background-position: 50% center;
}
.table-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.file {
  display: block;
  white-space: nowrap;
}
</style>

