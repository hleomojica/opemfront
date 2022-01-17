<template>
  <form @submit.prevent="submitHandler">
    <h4 class="h4">{{ formName }} Colaboradores</h4>
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
              :state="validateState('apellidos')"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Fecha Nacimiento" label-for="fechanacimiento">
            <b-form-datepicker
              id="fechanacimiento"
              v-model="dataForm.fechanacimiento"
              class="mb-2"
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
            >
            </b-form-select>
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  name: "colaboradoresNew",
  mixins: [validationMixin],
  data() {
    return {
      formName: "Crear",
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
      },
    };
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
      apellidos: {
        required,
        minLength: minLength(6),
      },
      telefono: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10),
      },
    },
  },
  computed: {
    ...mapState({
      data: (state) => state.colaboradores.dataForm,
      dataPaises: (state) => state.paises.dataList,
      dataTipoDocs: (state) => state.tipodocumento.dataList,
      dataEmpresa: (state) => state.empresas.dataList,
    }),
    cancelUrl() {
      return (
        "/" + this.$route.fullPath.split("/").slice(1).splice(0, 2).join("/")
      );
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
        } else {
          await this.newItem(this.dataForm);
        }
        this.$router.push(this.cancelUrl);
      } catch (e) {
        console.log(e);

        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
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
    this.getDataPais();
    this.getDataTipoDoc();
    this.getDataEmpresa();
  },
};
</script>
