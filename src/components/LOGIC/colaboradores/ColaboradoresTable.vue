
<template>
  <div>
    <b-button-group class="mb-2">
      <b-button
        v-if="this.origen == 'colaboradores'"
        :to="{
          name: 'colaboradoresnew',
          params: {
            father: 'Colaboradores',
          },
        }"
        variant="outline-primary"
      >
        <b-icon icon="plus-circle-fill"></b-icon> Nueva
      </b-button>
      <b-button
        v-if="this.origen == 'colaboradores'"
        variant="outline-primary"
        @click="exportXls"
      >
        <b-icon icon="download"></b-icon> Exportar
      </b-button>

      <b-button
        v-if="this.origen == 'colaboradores'"
        variant="outline-primary"
        v-b-modal.mdlImport
      >
        <b-icon icon="upload"></b-icon> Importar
      </b-button>

      <b-button v-b-toggle.collapse-1 variant="outline-primary">
        <b-icon icon="search"></b-icon> Filtro
      </b-button>
    </b-button-group>
    <!-- filtros -->
    <b-collapse id="collapse-1">
      <b-card border-variant="primary">
        <b-card-text>
          <b-container fluid>
            <b-row class="my-1">
              <b-col sm="3">
                <b-form-input
                  id="numerodocumento"
                  placeholder="Numero cedula"
                  v-model="cedula"
                ></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-form-input
                  id="nombre"
                  placeholder="Nombres"
                  v-model="nombre"
                ></b-form-input>
              </b-col>
              <b-col sm="3">
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
              <b-col sm="2">
                <b-button
                  variant="primary"
                  class="d-inline-block"
                  @click="filter"
                >
                  <b-icon icon="search"></b-icon> Buscar
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card-text>
      </b-card>
    </b-collapse>
    <br />

    <div v-if="loading"><Loader /></div>
    <!-- tabla -->
    <b-table
      v-else
      ref="tablecol"
      striped
      responsive
      hover
      light
      :items="dataTable.items"
      :fields="fields"
      @row-clicked="rowClicked"
    >
      <template #cell(edit)="row">
        <router-link
          :to="{
            name: 'colaboradoresnew',
            params: {
              id: row.item.id_col,
              mode: 'edit',
              father: 'Colaboradores',
            },
          }"
        >
          <b-button pill size="sm" class="mr-2" variant="success">
            <b-icon icon="pen-fill" aria-hidden="true"></b-icon>
          </b-button>
        </router-link>
      </template>
      <template #cell(delete)="row">
        <b-button
          pill
          variant="danger"
          size="sm"
          @click="info(row.item, row.index, $event.target)"
        >
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
        </b-button>
      </template>
      <template #cell(singup)="row">
        <router-link
          :to="{
            name: 'cuentaacceso',
            params: {
              id: row.item.id_col,
              cedula: row.item.numerodocumento_col,
              father: 'Colaboradores',
            },
          }"
        >
          <b-button pill :variant="existCuentAcceso(row)" size="sm">
            <b-icon icon="person-fill" aria-hidden="true"></b-icon>
          </b-button>
        </router-link>
      </template>
    </b-table>
    <!-- paginacion  -->
    <b-container>
      <b-row>
        <b-col lg="10">
          <b-pagination
            v-model="page"
            :total-rows="count"
            :per-page="pageSize"
            align="fill"
            size="sm"
            class="mt-4"
            @change="handlePageChange"
          ></b-pagination>
        </b-col>
        <!-- page num per pages -->
        <b-col lg="2">
          <b-form-select
            size="lg"
            v-model="pageSize"
            :options="pageOptions"
            @change="handlePageChange(1)"
          ></b-form-select>
        </b-col>
      </b-row>
    </b-container>
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
    <!-- modal importacion -->
    <b-modal size="xl" id="mdlImport" hide-footer title="Importar Aprendiz">
      <ColaboradoresImport />
    </b-modal>
  </div>
</template>
<script>
/*eslint-disable no-unused-vars */
import { mapActions, mapState, mapMutations } from "vuex";
import Loader from "@/components/Loader/Loader";
import ColaboradoresImport from "./ColaboradoresImport.vue";
import { validationMixin } from "vuelidate";
import XLSX from "xlsx";

export default {
  mixins: [validationMixin],
  components: { Loader, ColaboradoresImport },
  props: {
    origen: {
      type: String,
    },
  },
  data() {
    return {
      fields: [
        { key: "pai.inicianles_pais", label: "Pais" },
        { key: "tipodocumento.iniciales_tipo", label: "Tipo Documento" },
        { key: "numerodocumento_col", label: "Numero Documento" },
        { key: "nombres_col", label: "Nombres", sortable: true },
        { key: "apellidos_col", label: "Apellidos" },
        { key: "empresa.nombre_emp", label: "Empresa" },
        { key: "correopersonal_col", label: "Correo" },
        { key: "telefono_col", label: "Telefono" },
        { key: "edit", label: "" },
        { key: "delete", label: "" },
        { key: "singup", label: "" },
      ],
      infoModal: {
        id: "info-modal",
        colaborador: "",
      },
      pageOptions: [
        5,
        10,
        20,
        50,
        {
          value: Number.MAX_SAFE_INTEGER,
          text: "Todos",
        },
      ],
      page: 1,
      count: 0,
      pageSize: 10,
      nombre: "",
      cedula: "",
      idemp: "",
    };
  },
  computed: {
    ...mapState({
      dataTable: (state) => state.colaboradores.dataTable,
      loading: (state) => state.colaboradores.loading,
      dataEmpresa: (state) => state.empresas.dataList,
      dataColaborador: (state) => state.colaboradores.dataColaborador,
    }),
  },
  methods: {
    info(item, index, button) {
      this.infoModal.empresa = item.nombre_emp;
      this.setDeleteId(item.id_emp);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    ...mapActions({
      getData: "colaboradores/getData",
      deleteItem: "colaboradores/deleteItem",
      getDataEmpresa: "empresas/getDataList",
    }),
    ...mapMutations({
      setDeleteId: "colaboradores/setDeleteId",
      hideLoader: "colaboradores/hideLoader",
      showLoader: "colaboradores/showLoader",
    }),
    del() {
      this.$bvModal.hide("del");
      this.deleteItem();
    },
    getRequestParams(page, pageSize, nombre, empresa, cedula) {
      let params = {};
      if (nombre) {
        params["nombre"] = nombre;
      }
      if (empresa) {
        params["idemp"] = empresa;
      }
      if (cedula) {
        params["cedula"] = cedula;
      }
      if (page) {
        params["page"] = page - 1;
      }
      if (pageSize) {
        params["size"] = pageSize;
      }
      return params;
    },
    retrieveTutorials() {
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.nombre,
        this.idemp,
        this.cedula
      );
      this.getData(params);
    },
    handlePageChange(value) {
      this.page = value;
      this.retrieveTutorials();
    },
    async filter() {
      const params = this.getRequestParams(
        1,
        10,
        this.nombre,
        this.idemp,
        this.cedula
      );
      await this.getData(params);
      this.page = this.dataTable.currenPage;
      this.count = this.dataTable.totalItems;
    },
    existCuentAcceso(row) {
      if (row.item.cuentaacceso) {
        return "primary";
      } else {
        return "light";
      }
    },
    rowClicked(val, row) {
      if (this.origen !== "colaboradores") {
        this.dataTable.items[row]["_rowVariant"] = "success";
        this.$refs.tablecol.refresh();
        this.$emit("load", val);
      }
    },
    exportXls() {
      let dataExport = [...new Set(this.dataTable.items)];

      const newdatexp = dataExport.map(
        ({
          id_col,
          paisdocumento_col,
          tipodocumento_col,
          idemp_col,
          estado_col,
          pai,
          tipodocumento,
          empresa,
          cuentaacceso,
          ...keepAttrs
        }) => keepAttrs
      );

      let data = XLSX.utils.json_to_sheet(newdatexp);
      const workbook = XLSX.utils.book_new();
      const filename = "Aprendices";
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    },
  },
  async beforeMount() {
    await this.getData({ page: 0, size: 10 });
    await this.getDataEmpresa();
    this.page = this.dataTable.currenPage;
    this.count = this.dataTable.totalItems;
    if (this.origen !== "colaboradores") {
      this.fields = this.fields.filter(
        (fil) =>
          fil.key !== "edit" && fil.key !== "delete" && fil.key !== "singup"
      );
    }
  },
};
</script>
