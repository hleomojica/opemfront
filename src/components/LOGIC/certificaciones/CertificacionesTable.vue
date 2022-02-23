<template>
  <div>
    <b-button-group class="mb-2">
      <b-button
        :to="{
          name: 'certificacionesnew',
          params: {
            father: 'Certificaciones',
          },
        }"
        variant="outline-primary"
      >
        <b-icon icon="plus-circle-fill"></b-icon> Nuevo
      </b-button>
      <b-button
        :class="visiblecol ? null : 'collapsed'"
        :aria-expanded="visiblecol ? 'true' : 'false'"
        aria-controls="colfilter"
        @click="visiblecol = !visiblecol"
        :variant="visiblecol ? 'primary' : 'outline-primary'"
      >
        <b-icon icon="search"></b-icon> Filtro
      </b-button>
    </b-button-group>

    <!-- filtros -->
    <b-collapse id="colfilter" v-model="visiblecol">
      <b-card border-variant="secundary">
        <b-card-text>
          <b-container fluid>
            <b-row class="my-1">
              <b-col md="6" sm="12" class="mt-2">
                <b-form-select
                  :options="dataCursos"
                  value-field="id_cur"
                  text-field="nombre_cur"
                  v-model="idcur"
                  @change="retrieveParams()"
                >
                  <b-form-select-option value=""
                    >-Todos los Cursos-</b-form-select-option
                  >
                </b-form-select>
              </b-col>
              <b-col md="6" sm="12" class="mt-2">
                <b-form-input
                  id="cohorte"
                  v-model="cohorte"
                  placeholder="Cohorte"
                  @keyup="retrieveParams()"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-container>
        </b-card-text>
      </b-card>
    </b-collapse>

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
      visiblecol: false,
      idcur: "",
      cohorte: "",
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.certificaciones.loading,
      dataTable: (state) => state.certificaciones.dataTable,
      modalOpen: (state) => state.certificaciones.modalOpen,
      dataCursos: (state) => state.cursos.dataTable,
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
      getDataCursos: "cursos/getData",
    }),
    ...mapMutations({
      setDeleteId: "certificaciones/setDeleteId",
    }),
    getRequestParams(page, perPage, cohorte, idcur) {
      let params = {};
      if (page) {
        params["page"] = page - 1;
      }
      if (perPage) {
        params["size"] = perPage;
      }
      if (cohorte) {
        params["cohorte"] = cohorte;
      }
      if (idcur) {
        params["idcur"] = idcur;
      }
      return params;
    },
    async retrieveParams() {
      const params = this.getRequestParams(
        this.page,
        this.perPage,
        this.cohorte,
        this.idcur
      );
      await this.getData(params);
      this.page = this.dataTable.currentPage + 1;
      this.count = this.dataTable.totalItems;
    },
    async handlePageChange(value) {
      this.page = value;
      this.size = 10;
      await this.retrieveParams();
    },
    async changeEstado(row, estado) {
      const certifica = {
        estado: estado,
        id: row.item.id_cer,
      };
      await this.updateEstado(certifica);
      this.retrieveParams();
    },
  },
  async beforeMount() {
    await this.getData({ page: 0, size: 10 });
    await this.getDataCursos();
    this.page = this.dataTable.currentPage + 1;
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
