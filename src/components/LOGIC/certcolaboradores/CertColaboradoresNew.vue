<template>
  <b-card>
    <form @submit.prevent="submitHandler">
      <h4 class="h4">{{ formName }} Certificaciones</h4>
      <b-container fluid>
        <b-row class="my-1">
          <b-col sm="12">
            <b-form-group label="Cursos" label-for="curso">
              <b-form-select
                v-model="dataForm.idcur"
                :options="dataCursos"
                value-field="id_cur"
                text-field="nombre_cur"
                @change="changeCurso"
              >
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col sm="12">
            <b-form-group label="Certificaciones" label-for="certificaciones">
              <b-form-select v-model="dataForm.idcer">
                <b-form-select-option
                  v-for="cert in dataCert"
                  :key="cert.id_cer"
                  :value="cert.id_cer"
                >
                  Inicio:
                  {{ cert.fechainicio_cer + " hasta " + cert.fechafin_cer }}
                  cohorte {{ cert.cohorte_cer }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col sm="12">
            <b-button
              pill
              type="button"
              class="btn btn-success ml-2"
              @click="info($event.target)"
              >Colaboradores
              <b-icon icon="search" aria-hidden="true"></b-icon>
            </b-button>
            <b-table
              striped
              responsive
              :fields="fields"
              hover
              :items="dataColaborador"
            >
              <template #cell(delete)="row">
                <b-button
                  pill
                  variant="danger"
                  size="sm"
                  @click="removeColaborador(row.item)"
                >
                  <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                </b-button>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button
              @click="resetData"
              type="button"
              class="btn btn-light ml-2"
              v-if="!this.$route.params.id"
            >
              Limpiar
            </button>
            <router-link :to="cancelUrl">
              <button type="button" class="btn btn-light ml-2">Volver</button>
            </router-link>
          </b-col>
        </b-row>
      </b-container>
    </form>
    <b-modal
      :id="infoModal.id"
      size="xl"
      title="Seleccione Aprendices"
      hide-footer
    >
      <div class="d-block text-center">
        <ColaboradoresTable @load="loadColaborador($event)" :origen="origen" />
      </div>
    </b-modal>
  </b-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import ColaboradoresTable from "@/components/LOGIC/colaboradores/ColaboradoresTable";
export default {
  name: "certificacionesNew",
  mixins: [validationMixin],
  components: {
    ColaboradoresTable,
  },
  data() {
    return {
      formName: "Inscripcion",
      origen: "certificaciones",
      dataForm: {
        idcur: "",
        idcer: "",
        estado: 0,
        descargado: 0,
      },
      infoModal: {
        id: "info-modal",
      },
      fields: [
        { key: "pai.inicianles_pais", label: "Pais" },
        { key: "tipodocumento.iniciales_tipo", label: "Tipo Documento" },
        { key: "numerodocumento_col", label: "Numero Documento" },
        { key: "nombres_col", label: "Nombres", sortable: true },
        { key: "apellidos_col", label: "Apellidos" },
        { key: "empresa.nombre_emp", label: "Empresa" },
        { key: "correopersonal_col", label: "Correo" },
        { key: "telefono_col", label: "Telefono" },
        { key: "delete", label: "" },
      ],
    };
  },
  validations: {
    dataForm: {
      idcur: {
        required,
      },
      idcer: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      data: (state) => state.certificaciones.dataForm,
      dataCursos: (state) => state.cursos.dataTable,
      dataCert: (state) => state.certificaciones.dataTable,
      dataColaborador: (state) => state.colaboradores.dataColaborador,
    }),
    cancelUrl() {
      return (
        "/" + this.$route.fullPath.split("/").slice(1).splice(0, 2).join("/")
      );
    },
  },
  methods: {
    ...mapActions({
      newItem: "certcolaboradores/newItem",
      editItem: "certcolaboradores/editItem",
      getDataCert: "certificaciones/getDataByCurso",
      getDataCursos: "cursos/getData",
    }),
    ...mapMutations({
      removeDataColaborador: "colaboradores/removeDataColaborador",
      setDataColaborador: "colaboradores/setDataColaborador",
    }),
    info(button) {
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    loadColaborador(val) {
      const exist = this.dataColaborador.find(
        (apre) => apre.id_col === val.id_col
      );

      if (exist) {
        this.$toasted.show(
          `Ya se asocio a: <b> ${val.nombres_col}  </b> al curso`,
          {
            type: "info",
          }
        );
        return;
      } else {
        this.setDataColaborador(val);
      }
    },
    removeColaborador(row) {
      this.removeDataColaborador(row.id_col);
    },
    async submitHandler() {
      this.$v.dataForm.$touch();
      if (this.$v.dataForm.$anyError) {
        return;
      }
      try {
        if (this.$route.params.id) {
          this.dataForm = {
            ...this.dataForm,
            id: this.$route.params.id,
          };

          await this.editItem(this.dataForm);
        } else {
          const dataCreate = [];
          this.dataColaborador.map((cola) => {
            dataCreate.push({
              idcer_ceco: this.dataForm.idcer,
              idcol_ceco: cola.id_col,
              idemp_ceco: cola.idemp_col,
              estado_ceco: 0,
              descargado_ceco: 0,
            });
          });

          await this.newItem(dataCreate);
        }
        this.$router.push(this.cancelUrl);
      } catch (e) {
        this.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    changeCurso() {
      this.getDataCert(this.dataForm.idcur);
    },
    resetData() {
      if (this.dataForm) {
        this.dataForm = this.data;
      } else {
        this.dataForm = {
          fechainicio: "",
          fechafin: "",
          horas: "",
        };
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.dataForm[name];
      return $dirty ? !$error : null;
    },
    async setComponent(mode) {
      if (mode === "edit") {
        this.formName = "Editar";
        try {
          await this.getDataForm(this.$route.params.id);
          this.resetData();
        } catch (e) {
          this._vm.$toasted.show("Error " + e, {
            type: "error",
          });
        }
      }
    },
  },
  beforeMount() {
    const modeForm = this.$route.params.mode;
    this.setComponent(modeForm);
    this.getDataCursos();
  },
};
</script>
