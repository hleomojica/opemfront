<template>
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
          <b-form-group label="Empresa" label-for="empresa">
            <b-form-select
              :options="dataEmp"
              v-model="dataForm.idemp"
              value-field="id_emp"
              text-field="nombre_emp"
              @change="changeEmpresa"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="12">
          <b-form-group label="Colaborador" label-for="colaborador">
            <b-form-select
              :options="dataCol"
              v-model="dataForm.idcol"
              value-field="id_col"
              text-field="nombres_col"
              options-field=""
              @change="addAprendicesCursos"
            >
            </b-form-select>
          </b-form-group>

          <br />

          <b-table striped hover :items="aprendicescursos"></b-table>
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
</template>
<script>
import { mapState, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "certificacionesNew",
  mixins: [validationMixin],
  data() {
    return {
      formName: "Inscripcion",
      dataForm: {
        idcur: "",
        idcer: "",
        idemp: "",
        idcol: "",
        estado: 0,
        descargado: 0,
      },
      aprendicescursos: [],
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
      dataEmp: (state) => state.empresas.dataList,
      dataCol: (state) => state.colaboradores.dataList,
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
      getDataEmpresa: "empresas/getDataList",
      getDataCol: "colaboradores/getDataList",
    }),
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
          await this.newItem(this.dataForm);
        }
        this.$router.push(this.cancelUrl);
      } catch (e) {
        console.log(e);
        /*
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });*/
      }
    },
    changeCurso() {
      this.getDataCert(this.dataForm.idcur);
    },
    changeEmpresa() {
      this.getDataCol({ idemp: this.dataForm.idemp });
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
    addAprendicesCursos() {
      console.log(this.dataForm.idcol);
      this.aprendicescursos.push();
    },
  },
  beforeMount() {
    const modeForm = this.$route.params.mode;
    this.setComponent(modeForm);
    this.getDataCursos();
    this.getDataEmpresa();
  },
};
</script>
