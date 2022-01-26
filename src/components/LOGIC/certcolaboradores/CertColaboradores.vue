<template>
  <div>
    <CertCoalboradoresTable />
  </div>
</template>
<script>
import CertCoalboradoresTable from "@/components/LOGIC/certcolaboradores/CertColaboradoresTable";
import Loader from "@/components/Loader/Loader";
import { mapActions } from "vuex";
export default {
  components: { Loader, CertCoalboradoresTable },
  name: "CertCoalboradores",
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      getactions: "modulos/getaction",
      getcurrent: "auth/getcurrent",
    }),
  },
  beforeMount() {
    this.getactions(this.$route.params.actions);
    this.getcurrent();
  },
};
</script>
