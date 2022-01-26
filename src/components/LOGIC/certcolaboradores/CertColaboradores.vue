<template>
  <div>
    <CertCoalboradoresTable />
  </div>
</template>
<script>
import CertCoalboradoresTable from "@/components/LOGIC/certcolaboradores/CertColaboradoresTable";
import Loader from "@/components/Loader/Loader";
export default {
  components: { Loader, CertCoalboradoresTable },
  name: "CertCoalboradores",

  data() {
    return {};
  },
  mounted(){
    
  }
};
</script>
