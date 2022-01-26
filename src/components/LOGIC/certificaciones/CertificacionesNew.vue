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
                :state="validateState('idcur')"
              >
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col sm="3">
            <b-form-group label="Fecha Expedición" label-for="fechai">
              <b-form-input
                type="date"
                label="Fecha Expedición"
                :state="validateState('fechainicio')"
                v-model="dataForm.fechainicio"
              />
            </b-form-group>
          </b-col>
          <b-col sm="2">
            <b-form-group label="Vigencia" label-for="tiempovigencia">
              <b-form-input
                type="number"
                label="Tiempo Vigencia"
                :state="validateState('tiempovigencia')"
                v-model="dataForm.tiempovigencia"
                @keyup="changeVigencia()"
              />
            </b-form-group>
          </b-col>
          <b-col sm="2">
            <b-form-group label="Periodo" label-for="periodo">
              <b-form-select
                v-model="dataForm.periodo"
                :options="optPeriodo"
                :state="validateState('periodo')"
                @change="changeVigencia()"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col sm="3">
            <b-form-group label="Fecha Vencimiento" label-for="fechafin">
              <b-form-input
                type="date"
                readonly
                label="Fecha Vencimiento"
                :state="validateState('fechafin')"
                v-model="dataForm.fechafin"
              />
            </b-form-group>
          </b-col>
          <b-col sm="2">
            <b-form-group label="Horas duracion" label-for="horas">
              <b-form-input
                type="number"
                label="Horas"
                :state="validateState('horas')"
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
  </b-card>
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
        estado: 0,
        periodo: "",
        tiempovigencia: "",
      },
      optPeriodo: [
        { value: 3, text: "Año" },
        { value: 2, text: "Mes" },
        { value: 1, text: "Dia" },
      ],
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
      periodo: {
        required,
      },
      tiempovigencia: {
        required,
      },
      horas: {
        required,
      },
      idcur: {
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
          tiempovigencia: "",
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
    changeVigencia() {
      if (this.dataForm.fechainicio !== "") {
        if (
          this.dataForm.tiempovigencia !== "" &&
          this.dataForm.periodo !== ""
        ) {
          let arrdate = this.dataForm.fechainicio.split("-");

          let year = arrdate[0];
          let month = parseInt(arrdate[1]) - 1;
          let day = arrdate[2];
          let fechaexpi = new Date(year, month, day);

          let periodo = parseInt(this.dataForm.periodo);
          let vigencia = parseInt(this.dataForm.tiempovigencia);

          if (periodo == 3) {
            fechaexpi.setFullYear(fechaexpi.getFullYear() + vigencia);
          } else if (periodo == 2) {
            fechaexpi.setMonth(fechaexpi.getMonth() + vigencia);
          } else {
            fechaexpi.setDate(fechaexpi.getDate() + vigencia);
          }
          this.dataForm.fechafin = `${fechaexpi.getFullYear()}-${(
            fechaexpi.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${fechaexpi
            .getDate()
            .toString()
            .padStart(2, "0")}`;
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
