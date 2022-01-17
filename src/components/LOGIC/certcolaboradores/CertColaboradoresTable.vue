<template>
  <div>
    <b-button-group class="mb-2">
      <router-link
        :to="{
          name: 'certcolaboradoresnew',
          params: {
            father: 'CertColaboradores',
          },
        }"
      >
        <b-button variant="outline-primary">
          <b-icon icon="plus-circle-fill"></b-icon> Nueva
        </b-button>
      </router-link>
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
        <b-button
          pill
          variant="danger"
          size="sm"
          @click="info(row.item, row.index, $event.target)"
        >
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          Delete
        </b-button>
      </template>

      <template #cell(edit)="row">
        <router-link :to="`${$route.fullPath}/${row.item.id_emp}/edit`">
          <b-button pill size="sm" class="mr-2" variant="success">
            <b-icon icon="pen-fill" aria-hidden="true"></b-icon>
          </b-button>
        </router-link>
      </template>
      <template #cell(pdf)="row">
        <b-button
          pill
          size="sm"
          :hidden="row.item.estado_ceco == 0"
          class="mr-2"
          variant="warning"
          :to="{
            name: 'certcolaboradorespdf',
            params: {
              father: 'CertColaboradores',
              id:row.item.id_ceco
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
  name: "CertColaboradoresTable",
  data() {
    return {
      fields: [
        { key: "consecutivo_ceco", label: "#" },
        {
          key: "colaboradore.nombres_col",
          label: "Colaborador",
          sortable: true,
        },
        { key: "certificacione.curso.nombre_cur", label: "Curso" },
        { key: "certificacione.cohorte_cer", label: "Cohorte" },
        { key: "certificacione.fechainicio_cer", label: "Fecha inicio" },
        { key: "certificacione.fechafin_cer", label: "Fecha fin" },
        { key: "empresa.nombre_emp", label: "Empresa" },
        {
          key: "descargado_ceco",
          label: "Descargado",
          thClass: "d-none",
          tdClass: "d-none",
        },
        { key: "estado", label: "Aprobado" },
        { key: "edit", label: "" },
        { key: "pdf", label: "" },
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
      dataTable: (state) => state.certcolaboradores.dataTable,
      loading: (state) => state.certcolaboradores.loading,
    }),
  },
  methods: {
    info(item, index, button) {
      this.infoModal.empresa = item.nombre_emp;
      this.setDeleteId(item.id_emp);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    ...mapActions({
      getData: "certcolaboradores/getData",
      editEstado: "certcolaboradores/editEstado",
      deleteItem: "certcolaboradores/deleteItem",
    }),
    ...mapMutations({
      setDeleteId: "certcolaboradores/setDeleteId",
      hideLoader: "certcolaboradores/hideLoader",
      showLoader: "certcolaboradores/showLoader",
    }),
    del() {
      this.$bvModal.hide("del");
      this.deleteItem();
    },
    getRequestParams(page, pageSize, idcol, idcer, idemp) {
      let params = {};
      if (idcol) {
        params["idcol"] = idcol;
      }
      if (idcol) {
        params["idcer"] = idcer;
      }
      if (idcol) {
        params["idemp"] = idemp;
      }
      if (page) {
        params["page"] = page - 1;
      }
      if (pageSize) {
        params["size"] = pageSize;
      }
      return params;
    },
    retrieveParam() {
      const params = this.getRequestParams(this.page, this.pageSize);
      this.getData(params);
    },
    handlePageChange(value) {
      this.page = value;
      this.retrieveParam();
    },
    changeEstado(row, check) {
      console.log(row.item, "  ---------- ", check);
      const certificado = {
        estado: check,
        id: row.item.id_ceco,
      };
      this.editEstado(certificado);
    },
  },

  beforeMount() {
    const params = this.getRequestParams(1, 10);
    this.getData(params);
    this.page = this.dataTable.currenPage;
    this.count = this.dataTable.totalItems;
  },
};
</script>
