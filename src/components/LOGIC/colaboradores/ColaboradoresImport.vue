<template>
  <div>
    <b-card>
      <b-form-group label="Cargar archivo" label-cols-sm="2">
        <b-form-file
          @change="setFile($event)"
          browse-text="Seleccione"
          id="file-default"
          placeholder="Seleccione archivo .xlsx"
          accept=".xlsx"
        ></b-form-file>
      </b-form-group>
    </b-card>
    <b-container>
      <b-row>
        <b-col>
          <b-table responsive striped hover :items="dataAprendiz"></b-table>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col lg="3">
          <b-button class="mt-3" variant="success" block @click="save"
            >Guardar</b-button
          >
        </b-col>
        <b-col lg="3">
          <b-button class="mt-3" variant="info" block @click="template"
            >Plantilla</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Loader from "@/components/Loader/Loader";
import { mapActions, mapState } from "vuex";
import XLSX from "xlsx";
export default {
  components: { Loader },
  name: "ColaboradoresImport",
  data() {
    return {
      dataAprendiz: [],
    };
  },
  computed: {
    ...mapState({
      dataEmpresa: (state) => state.empresas.dataList,
    }),
  },
  methods: {
    setFile(event) {
      this.file = event.target.files ? event.target.files[0] : null;
      if (this.file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

          data.map((val) => {
            this.dataAprendiz.push({
              paisdocumento_col: val[0],
              tipodocumento_col: val[1],
              numerodocumento_col: val[2],
              nombres_col: val[3],
              apellidos_col: val[4],
              fechanacimiento_col: val[5],
              correopersonal_col: val[6],
              telefono_col: val[7],
              direccion_col: val[8],
              idemp_col: val[9],
              estado_col: 1,
              terminos_col: 1,
            });
          });

          this.dataAprendiz.splice(0, 1);
        };

        reader.readAsBinaryString(this.file);
      }
    },
    save() {
      if (this.dataAprendiz.length > 1) {
        this.newArrayItem(this.dataAprendiz);
      }
    },
    template() {
      let datatemplate = [
        {
          codigopais: "",
          codigotipodocumento: "",
          numerodocumento: "",
          nombres: "",
          Apellidos: "",
          fechanacimiento: "",
          correopersonal: "",
          telefono: "",
          direccion: "",
          codigoempresa: "",
        },
      ];

      let data = XLSX.utils.json_to_sheet(datatemplate);
      let dataemp = XLSX.utils.json_to_sheet(this.dataEmpresa);
      const workbook = XLSX.utils.book_new();
      const filename = "Aprendices";
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.utils.book_append_sheet(workbook, dataemp, 'Empresas');
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    },

    ...mapActions({
      newArrayItem: "colaboradores/newArrayItem",
      getDataEmpresa: "empresas/getDataList",
    }),
  },
  async mounted(){
    await this.getDataEmpresa()
  }
};
</script>
