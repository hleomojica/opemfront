<template>
  <div>
    <Header />
    <b-container class="mt-4">
      <b-alert        
        variant="info"
        dismissible
        fade
        :show="showDismissibleAlert"
        @dismissed="showDismissibleAlert = false"
      >
        <h4 class="alert-heading">Bienvenido !</h4>
        <p>
          Opem SAS le da la bienvenida, Por favor ingrese todos los datos que
          apracen a continuacion que seran necesarios para que hagas parte de
          nuestra familia.
        </p>
        <hr />
        <p class="mb-0">Su seguridad y bienestar es prioridad para nosotros.</p>
      </b-alert>
      <b-row>
        <b-card>
          <ColaboradoresNew :publicform="isPublic" :formName="titleform" />
        </b-card>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import ColaboradoresNew from "@/components/LOGIC/colaboradores/ColaboradoresNew";
import Loader from "@/components/Loader/Loader";
import Header from "@/components/Header/HeaderPublic";
export default {
  components: { Loader, ColaboradoresNew, Header },
  name: "ColaboradoresRegistro",
  data() {
    return {
      titleform: "Registro",
      isPublic: true,
      showDismissibleAlert: true,
    };
  },
};
</script>
