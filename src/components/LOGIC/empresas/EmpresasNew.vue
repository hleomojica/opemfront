<template>
  <form @submit.prevent="submitHandler">
    <h4 class="h4">{{ formName }} empresa</h4>
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-group label="Razon social" label-for="nombre">
            <b-form-input
              type="text"
              label="nombre"
              v-model="dataForm.nombre"
              :state="validateState('nombre')"
              aria-describedby="input-error-nombre"
            />
            <b-form-invalid-feedback id="input-error-nombre"
              >Debe ingresar el nombre de la empresa.</b-form-invalid-feedback
            >
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Correo electrónico" label-for="correo">
            <b-form-input
              type="email"
              label="correo"
              v-model="dataForm.correo"
              :state="validateState('correo')"
              aria-describedby="input-error-correo"
            />
            <b-form-invalid-feedback id="input-error-correo"
              >Debe ingresar el correo de la empresa.</b-form-invalid-feedback
            >
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="NIT" label-for="nit">
            <b-form-input
              type="number"
              label="nit"
              v-model="dataForm.nit"
              :state="validateState('nit')"
              aria-describedby="input-error-nit"
            />
            <b-form-invalid-feedback id="input-error-nit"
              >Debe ingresar el nit de la empresa.</b-form-invalid-feedback
            >
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Teléfono" label-for="telefono">
            <b-form-input
              type="number"
              label="telefono"
              v-model="dataForm.telefono"
              :state="validateState('telefono')"
              aria-describedby="input-error-telefono"
            />
            <b-form-invalid-feedback id="input-error-telefono"
              >Debe ingresar el telefono de la empresa.</b-form-invalid-feedback
            >
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group label="Persona de contacto" label-for="personacontacto">
            <b-form-input
              type="text"
              label="personacontacto"
              v-model="dataForm.personacontacto"
              :state="validateState('personacontacto')"
              aria-describedby="input-error-personacontacto"
            />
          </b-form-group>
        </b-col>
        <b-col sm="12">
          <b-form-group label="Dirección" label-for="direccion">
            <b-form-input
              type="text"
              label="direccion"
              v-model="dataForm.direccion"
              :state="validateState('direccion')"
              aria-describedby="input-error-direccion"
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
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
export default {
  name: "empresasNew",
  mixins: [validationMixin],
  data() {
    return {
      formName: "Crear",
      dataForm: {
        nombre: "",
        nit: "",
        telefono: "",
        correo: "",
        direccion: "",
        personacontacto: "",
      },
    };
  },
  validations: {
    dataForm: {
      nombre: {
        required,
        minLength: minLength(3),
      },
      nit: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(12),
      },
      telefono: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(11),
      },
      correo: {
        required,
        email,
        minLength: minLength(3),
        maxLength: maxLength(60),
      },
      direccion: {
        minLength: minLength(3),
        maxLength: maxLength(150),
      },
      personacontacto: {
        minLength: minLength(5),
        maxLength: maxLength(150),
      },
    },
  },
  computed: {
    ...mapState({
      data: (state) => state.empresas.dataForm,
    }),
    cancelUrl() {
      return (
        "/" + this.$route.fullPath.split("/").slice(1).splice(0, 2).join("/")
      );
    },
  },
  methods: {
    ...mapActions({
      newEmpresa: "empresas/newEmpresa",
      editEmpresa: "empresas/editEmpresa",
      getDataForm: "empresas/getDataForm",
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
          await this.editEmpresa(this.dataForm);
        } else {
          await this.newEmpresa(this.dataForm);
        }
        this.$router.push(this.cancelUrl);
      } catch (e) {
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
          nombre: "",
          nit: "",
          telefono: "",
          correo: "",
          direccion: "",
          personacontacto: "",
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
    this.setComponent(this.$route.params.mode);
  },
};
</script>
