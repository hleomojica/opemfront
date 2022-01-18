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
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Fecha Expedición" label-for="fechai">
            <b-form-input
              type="date"
              label="Fecha Expedición"
              :state="validateState('fechainicio')"
              v-model="dataForm.fechainicio"
            />
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Fecha Vencimiento" label-for="fechafin">
            <b-form-input
              type="date"
              label="Fecha Vencimiento"
              :state="validateState('fechafin')"
              v-model="dataForm.fechafin"
            />
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Horas duracion" label-for="horas">
            <b-form-input
              type="number"
              label="Horas"
              v-model="dataForm.horas"
            />
          </b-form-group>
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
      formName: "Crear",
      dataForm: {
        idcur: "",
        fechainicio: "",
        fechafin: "",
        horas: "",
        estado:0
      },
    };
  },
  validations: {
    dataForm: {
      fechainicio: {
        required,
      },
      fechafin: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      data: (state) => state.certificaciones.dataForm,
      dataCursos: (state) => state.cursos.dataTable,
    }),
    cancelUrl() {
      return (
        "/" + this.$route.fullPath.split("/").slice(1).splice(0, 2).join("/")
      );
    },
  },
  methods: {
    ...mapActions({
      newItem: "certificaciones/newItem",
      editItem: "certificaciones/editItem",
      getDataForm: "certificaciones/getDataForm",
      getDataCursos: "cursos/getData",
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
