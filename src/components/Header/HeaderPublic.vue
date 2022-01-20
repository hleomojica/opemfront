<template>
  <b-navbar class="header d-print-none app-header" variant="dark" type="dark">
    <b-navbar-brand href="#">
      <router-link to="/">
        <img
          src="../../assets/logoblanco.png"
          class="d-inline-block align-top"
          style="width: 120px"
          alt="Kitten"
        />
      </router-link>
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <b-button
          size="sm"
          class="my-2 my-sm-0"
          variant="success"
          to="/login"
          type="button"
          >Iniciar sesion</b-button
        >
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
import Loader from "@/components/Loader/Loader";
export default {
  components: { Loader },
  name: "HeaderPublic",
  data() {
    return {};
  },
};
</script>
