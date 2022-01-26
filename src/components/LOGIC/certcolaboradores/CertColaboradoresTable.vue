<template>
  <div>
    <!-- opciones -->
    <b-button-group class="mb-2">
      <b-button
        :to="{
          name: 'certcolaboradoresnew',
          params: {
            father: 'CertColaboradores',
          },
        }"
        variant="outline-primary"
        v-if="permisos.crear_prol == 1"
      >
        <b-icon icon="plus-circle-fill"></b-icon> Nueva
      </b-button>
      <b-button
        v-if="permisos.filtrar_prol == 1"
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
              <b-col md="3" sm="12" class="mt-2">
                <b-form-select
                  :options="dataEmpresa"
                  value-field="id_emp"
                  text-field="nombre_emp"
                  v-model="idemp"
                >
                  <b-form-select-option value=""
                    >-Todas las Empresas-</b-form-select-option
                  >
                </b-form-select>
              </b-col>
              <b-col md="3" sm="12" class="mt-2">
                <b-form-select
                  :options="dataCursos"
                  value-field="id_cur"
                  text-field="nombre_cur"
                  v-model="idcur"
                  @change="retrieveParam()"
                >
                  <b-form-select-option value=""
                    >-Todos los Cursos-</b-form-select-option
                  >
                </b-form-select>
              </b-col>
              <b-col md="2" sm="12" class="mt-2">
                <b-form-input
                  id="cohorte"
                  v-model="cohorte"
                  placeholder="Cohorte"
                  @keyup="retrieveParam"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-container>
        </b-card-text>
      </b-card>
    </b-collapse>

    <div v-if="loading"><Loader /></div>
    <!-- tabla -->
    <b-table
      v-else
      striped
      hover
      light
      :items="dataTable.items"
      :fields="fields"
    >
      <template #cell(actions)="row">
        <router-link
          :to="{
            name: 'certcolaboradoresnew',
            params: {
              father: 'CertColaboradores',
              id: row.item.id_ceco,
              mode: 'edit',
            },
          }"
        >
          <b-button pill size="sm" class="mr-2" variant="success">
            <b-icon icon="pen-fill" aria-hidden="true"></b-icon>
            Editar
          </b-button>
        </router-link>
      </template>

      <template #cell(pdf)="row">
        <b-button
          pill
          size="sm"
          :hidden="new Date(row.item.certificacione.fechafin_cer) < new Date() || row.item.estado_ceco == 0"
          class="mr-2"
          variant="warning"
          :to="{
            name: 'certcolaboradorespdf',
            params: {
              father: 'CertColaboradores',
              id: row.item.id_ceco,
            },
          }"
        >
          <b-icon icon="download" aria-hidden="true"></b-icon>
        </b-button>
      </template>
      <template #cell(estado)="row">
        <b-form-checkbox
          unchecked-value="0"
          value="1"
          :checked="row.item.estado_ceco"
          switch
          @change="changeEstado(row, $event)"
        >
        </b-form-checkbox>
      </template>
    </b-table>
    <!-- paginacion  -->
    <b-pagination
      v-model="page"
      :total-rows="count"
      :per-page="pageSize"
      align="fill"
      size="sm"
      class="mt-4"
      @change="handlePageChange"
    ></b-pagination>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Loader from "@/components/Loader/Loader";
import { validationMixin } from "vuelidate";

export default {
  mixins: [validationMixin],
  components: { Loader },
  name: "CertColaboradoresTable",
  data() {
    return {
      permisos: null,
      fields: [
        { key: "consecutivo_ceco", label: "#" },
        {
          key: "colaboradore.nombres_col",
          label: "Colaborador",
          sortable: true,
        },
        { key: "certificacione.curso.nombre_cur", label: "Curso" },
        { key: "certificacione.cohorte_cer", label: "Cohorte" },
        { key: "certificacione.fechainicio_cer", label: "Fecha Expedicion" },
        { key: "certificacione.fechafin_cer", label: "Fecha Vencimiento" },
        { key: "empresa.nombre_emp", label: "Empresa" },
        {
          key: "descargado_ceco",
          label: "Descargado",
          thClass: "d-none",
          tdClass: "d-none",
        },
        { key: "estado", label: "Aprobado" },
        { key: "pdf", label: "" },
      ],
      idemp: "",
      idcol: "",
      idcur: "",
      cohorte: "",
      visiblecol: false,
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
      dataTable: (state) => state.certcolaboradores.dataTable,
      dataEmpresa: (state) => state.empresas.dataList,
      dataCursos: (state) => state.cursos.dataTable,
      loading: (state) => state.certcolaboradores.loading,
      currentuser: (state) => state.auth.currentUser,
    }),
  },
  methods: {
    ...mapActions({
      getData: "certcolaboradores/getData",
      editEstado: "certcolaboradores/editEstado",
      getDataEmpresa: "empresas/getDataList",
      getDataCursos: "cursos/getData",
      getcurrent: "auth/getcurrent",
    }),
    ...mapMutations({
      hideLoader: "certcolaboradores/hideLoader",
      showLoader: "certcolaboradores/showLoader",
    }),
    getRequestParams(page, pageSize, idcol, idemp, idcur, cohorte) {
      let params = {};
      if (idcol) {
        params["idcol"] = idcol;
      }
      if (idcur) {
        params["idcur"] = idcur;
      }
      if (idemp) {
        params["idemp"] = idemp;
      }
      if (page) {
        params["page"] = page - 1;
      }
      if (pageSize) {
        params["size"] = pageSize;
      }
      if (cohorte) {
        params["cohorte"] = cohorte;
      }
      return params;
    },
    async retrieveParam() {
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.idcol,
        this.idemp,
        this.idcur,
        this.cohorte
      );
      await this.getData(params);

      this.page = this.dataTable.currentPage + 1;
      this.count = this.dataTable.totalItems;
    },
    handlePageChange(value) {
      this.page = value;
      this.retrieveParam();
    },
    changeEstado(row, check) {
      const certificado = {
        estado: check,
        id: row.item.id_ceco,
      };
      this.editEstado(certificado);
    },
    filter() {
      this.retrieveParam();
    },
  },

  async beforeMount() {
    this.permisos = this.$route.params.actions;
    await this.getcurrent();

    if (this.permisos.filtrar_prol == 0) {
      this.idcol = this.currentuser.id_col;
    }
    if (this.permisos.editar_prol == 0) {
      this.fields = this.fields.filter((a) => a.key != "estado");
    }
    await this.retrieveParam();
    await this.getDataEmpresa();
    await this.getDataCursos();
  },
};
</script>
