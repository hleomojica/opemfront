<template>
  <div>
    <CursosTable />
  </div>
</template>
<script>
import CursosTable from "@/components/LOGIC/cursos/CursosTable";
import Loader from "@/components/Loader/Loader";

export default {
  components: { Loader, CursosTable },
  data() {
    //lo que agregue
    return {};
  },
  computed: {},
  methods: {},
};
</script>
