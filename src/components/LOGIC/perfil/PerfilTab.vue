<template>
  <div>
    <b-tabs content-class="mt-3" fill vertical>
      <b-tab title="Información General" active
        ><p><ColaboradoresNew :formName="name"/></p
      ></b-tab>
      <b-tab title="Seguridad"
        ><p>
          <CuentaAcceso /></p
      ></b-tab>
    </b-tabs>
  </div>
</template>
<script>
import Loader from "@/components/Loader/Loader";
import ColaboradoresNew from "@/components/LOGIC/colaboradores/ColaboradoresNew";
import CuentaAcceso from "@/components/LOGIC/colaboradores/CuentaAcceso";

export default {
  components: { Loader, ColaboradoresNew, CuentaAcceso },
  data() {
    return {
        name:"Cuenta del "
    };
  },
  computed: {},
  methods: {},
};
</script>