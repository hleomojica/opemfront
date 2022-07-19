<template>
  <form @submit.prevent="submitHandler">
    <h4 class="h4">{{ titleForm }} Aprendiz</h4>
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="2">
          <b-form-group label="Pais" label-for="paisdocumento">
            <b-form-select
              v-model="dataForm.paisdocumento"
              :options="dataPaises"
              value-field="id_pais"
              text-field="inicianles_pais"
              :state="validateState('paisdocumento')"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="5">
          <b-form-group label="Tipo Documento" label-for="tipodocumento">
            <b-form-select
              id="tipodocumento"
              v-model="dataForm.tipodocumento"
              :options="dataTipoDocs"
              value-field="id_tipo"
              text-field="nombre_tipo"
              :state="validateState('tipodocumento')"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="5">
          <b-form-group label="Numero Documento" label-for="numerodocumento">
            <b-form-input
              id="numerodocumento"
              v-model="dataForm.numerodocumento"
              placeholder="Numero"
              :state="validateState('numerodocumento')"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Nombres" label-for="nombres">
            <b-form-input
              v-model="dataForm.nombres"
              placeholder="Nombres"
              :state="validateState('nombres')"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Apellidos" label-for="apellidos">
            <b-form-input
              v-model="dataForm.apellidos"
              placeholder="Apellidos"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Fecha Nacimiento" label-for="fechanacimiento">
            <b-form-datepicker
              id="fechanacimiento"
              v-model="dataForm.fechanacimiento"
              class="mb-2"
              :state="validateState('fechanacimiento')"
            ></b-form-datepicker>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Correo Personal" label-for="correopersonal">
            <b-form-input
              v-model="dataForm.correopersonal"
              placeholder="Correo Personal"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Telefono" label-for="telefono">
            <b-form-input
              v-model="dataForm.telefono"
              placeholder="Telefono Contacto"
              :state="validateState('telefono')"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Direccion Residencia" label-for="direccion">
            <b-form-input
              id="direccion"
              v-model="dataForm.direccion"
              class="mb-2"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="5">
          <b-form-group label="Empresa" label-for="idemp">
            <b-form-select
              v-model="dataForm.idemp"
              :options="dataEmpresa"
              value-field="id_emp"
              text-field="nombre_emp"
              :state="validateState('idemp')"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="7">
          <b-form-group label="Cargo" label-for="cargo">
            <b-form-input
              v-model="dataForm.cargo"
              placeholder="Cargo"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="12" v-if="!this.$route.params.id">
          <b-form-checkbox v-model="dataForm.terminos" switch>
            Acepta terminos tratamiento de datos
          </b-form-checkbox>
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
          <router-link :to="cancelUrl" v-if="!this.publicform">
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  name: "colaboradoresNew",
  mixins: [validationMixin],
  data() {
    return {
      dataForm: {
        paisdocumento: "",
        tipodocumento: "",
        numerodocumento: "",
        nombres: "",
        apellidos: "",
        fechanacimiento: "",
        correopersonal: "",
        telefono: "",
        direccion: "",
        idemp: "",
        estado: 1,
        terminos: true,
        cargo: "",
      },
    };
  },
  props: {
    formName: {
      default: "Crear",
      type: String,
      required: false,
    },
    publicform: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  validations: {
    dataForm: {
      paisdocumento: {
        required,
      },
      tipodocumento: {
        required,
      },
      numerodocumento: {
        required,
        minLength: minLength(6),
      },
      nombres: {
        required,
        minLength: minLength(6),
      },
      telefono: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10),
      },
      idemp: {
        required,
      },
      fechanacimiento: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      data: (state) => state.colaboradores.dataForm,
      dataPaises: (state) => state.paises.dataList,
      dataTipoDocs: (state) => state.tipodocumento.dataList,
      dataEmpresa: (state) => state.empresas.dataList,
      statusOp: (state) => state.colaboradores.statusOp,
    }),
    cancelUrl() {
      if (!this.publicform)
        return `/${this.$route.fullPath
          .split("/")
          .slice(1)
          .splice(0, 2)
          .join("/")}`;
      else return "/";
    },
    titleForm() {
      if (this.$route.params.id) {
        return "Editar";
      } else {
        return this.formName;
      }
    },
  },
  methods: {
    ...mapActions({
      newItem: "colaboradores/newItem",
      editItem: "colaboradores/editItem",
      getDataForm: "colaboradores/getDataForm",
      getDataPais: "paises/getData",
      getDataTipoDoc: "tipodocumento/getData",
      getDataEmpresa: "empresas/getDataList",
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
          this.$router.push(this.cancelUrl);
        } else {
          if (this.dataForm.terminos) {
            if (this.publicform) {
              this.dataForm.estado = 0;
            }
            await this.newItem(this.dataForm);

            if (this.statusOp) {
              this.$router.push(this.cancelUrl);
            }
          } else {
            this.$toasted.show(
              "Para continuar con el registro debe aceptar los terminos de tratamiento de datos",
              {
                type: "error",
              }
            );
          }
        }
      } catch (e) {
        this.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },
    resetData() {
      if (this.dataForm) {
        this.dataForm = this.data;
      } else {
        this.dataForm = {
          nombres: "",
          apellidos: "",
          numerodocumento: "",
        };
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.dataForm[name];
      return $dirty ? !$error : null;
    },
    async setComponent(mode) {
      if (mode === "edit") {
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
    this.getDataPais();
    this.getDataTipoDoc();
    this.getDataEmpresa();
  },
};
</script>
