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
  </div>
</template>
<script>
import Loader from "@/components/Loader/Loader";
import XLSX from "xlsx";
export default {
  components: { Loader },
  name: "ColaboradoresImport",
  data() {
    return {};
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
          console.log(data);

            

        };

        reader.readAsBinaryString(this.file);
      }
    },
  },
};
</script>
