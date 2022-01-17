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
      <template #cell(delete)="row">
        <b-button
          pill
          variant="danger"
          size="sm"
          @click="del(row.item, row.index, $event.target)"
        >
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
        </b-button>
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

    <b-modal :id="infoModal.id" title="Cuidado !" hide-footer>
      <div class="d-block text-center">
        Esta seguro de eliminar el certificado
        <strong>{{ infoModal.fechainicio }}</strong>
      </div>
      <b-button
        class="mt-3"
        variant="outline-danger"
        block
        @click="confirmDelte($event.target)"
        >Eliminar</b-button
      >
    </b-modal>
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
        { key: "fechainicio_cer", label: "Fechainicio" },
        { key: "fechafin_cer", label: "Fechafin" },
        { key: "horas_cer", label: "Horas" },
        { key: "edit", label: "" },
        { key: "delete", label: "" },
      ],
      page: 1,
      count: 0,
      perPage: 10,
      infoModal: {
        id: "info-modal",
        curso: "",
      },
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.certificaciones.loading,
      dataTable: (state) => state.certificaciones.dataTable,
      modalOpen: (state) => state.certificaciones.modalOpen,
      deleteId: (state) => state.certificaciones.deleteId,
    }),
    dataFormatter() {
      return dataFormatter;
    },
  },
  methods: {
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
    }),
    ...mapMutations({
      setDeleteId: "certificaciones/setDeleteId",
    }),
    del(item, index, button) {
      this.infoModal.fechainicio = item.fechainicio_cer;
      this.setDeleteId(item.id_cer);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    confirmDelte(btn) {
      this.$root.$emit("bv::hide::modal", this.infoModal.id, btn);
      this.deleteItem();
      //TODO:para revisar
      this.getData({ page: 0, size: 10 });
      this.page = this.dataTable.currenPage;
      this.count = this.dataTable.totalItems;
    },
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
    retrieveTutorials() {
      const params = this.getRequestParams(this.page, this.perPage);
      this.getData(params);
    },
    handlePageChange(value) {
      this.page = value;
      this.size = 10;
      this.retrieveTutorials();
    },
  },
  beforeMount() {
    this.getData({ page: 0, size: 10 });
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

