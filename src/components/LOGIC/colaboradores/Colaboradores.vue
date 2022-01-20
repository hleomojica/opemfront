<template>
  <div>
    <CoalboradoresTable :origen="origen" />
  </div>
</template>
<script>
import CoalboradoresTable from "@/components/LOGIC/colaboradores/ColaboradoresTable";
import Loader from "@/components/Loader/Loader";
export default {
  components: { Loader, CoalboradoresTable },
  name:'Colaboradores',
  data() {
    return {
      origen:'colaboradores'
    };
  },
};
</script>
