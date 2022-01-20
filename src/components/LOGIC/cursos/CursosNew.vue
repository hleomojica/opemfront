<template>
  <form @submit.prevent="submitHandler">
    <h4 class="h4">{{ formName }} curso</h4>

    <b-form-group label="nombre" label-for="nombre">
      <b-form-input
        type="text"
        label="nombre"
        v-model="dataForm.nombre"
        :state="validateState('nombre')"
        aria-describedby="input-error-nombre"
      />
      <b-form-invalid-feedback id="input-error-nombre"
        >Debe ingresar el nombre.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group label="Iniciales" label-for="iniciales">
      <b-form-input
        type="text"
        label="iniciales"
        v-model="dataForm.iniciales"
        :state="validateState('iniciales')"
        aria-describedby="input-error-iniciales"
      />
      <b-form-invalid-feedback id="input-error-iniciales"
        >Debe ingresar las iniciales.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-form-group label="descripcion" label-for="descripcion">
      <b-form-textarea
        :rows="3"
        label="descripcion"
        v-model="dataForm.descripcion"
        :state="validateState('descripcion')"
        aria-describedby="input-descripcion-error"
      />
      <b-form-invalid-feedback id="input-descripcion-error"
        >Debe ingresar descripcion minimo 5 caracteres.</b-form-invalid-feedback
      >
    </b-form-group>

    <b-row>
      <b-col>
        <button type="submit" class="btn btn-primary">Guardar</button>
        <button @click="resetData" type="button" class="btn btn-light ml-2">
          Limpiar
        </button>
        <router-link :to="cancelUrl">
          <button type="button" class="btn btn-light ml-2">Volver</button>
        </router-link>
      </b-col>
    </b-row>
  </form>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
export default {
  name: "cursosNew",
  mixins: [validationMixin],
  data() {
    return {
      formName: "Crear",
      dataForm: {
        id_cur: null,
        nombre: "",
        descripcion: "",
        iniciales: "",
      },
    };
  },
  validations: {
    dataForm: {
      nombre: {
        required,
      },
      descripcion: {
        required,
        minLength: minLength(5),
      },
      iniciales: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(6),
      },
    },
  },
  computed: {
    ...mapState({
      dataState: (state) => state.cursos.dataForm,
    }),
    cancelUrl() {
      return (
        "/" + this.$route.fullPath.split("/").slice(1).splice(0, 2).join("/")
      );
    },
  },
  methods: {
    ...mapActions({
      newCurso: "cursos/newCurso",
      editCurso: "cursos/editCurso",
      getDataForm: "cursos/getDataForm",
    }),
    async submitHandler() {
      // -- Form Validation with Vuevalidate
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
          await this.editCurso(this.dataForm);
        } else {
          await this.newCurso(this.dataForm);
        }
        this.$router.push(this.cancelUrl);
      } catch (e) {
        this._vm.$toasted.show("Error: " + e, {
          type: "error",
        });
      }
    },

    resetData() {
      if (this.dataState) {
        this.dataForm = {
          id_cur: this.dataState.id_cur,
          nombre: this.dataState.descripcion_cur,
          descripcion: this.dataState.nombre_cur,
          iniciales: this.dataState.iniciales_cur,
        };
      } else {
        this.dataForm = {
          id_cur: null,
          nombre: "",
          descripcion: "",
          iniciales: "",
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
        let id_cur = this.$route.params.id;
        try {
          await this.getDataForm(id_cur);
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
  },
};
</script>
