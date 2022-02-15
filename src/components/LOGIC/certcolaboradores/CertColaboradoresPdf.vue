<template>
  <div>
    <div v-if="!loading">
      <b-alert show variant="success">
        <h4 class="alert-heading">
          Felicitaciones {{ dataItem.colaboradore.nombres_col }} !
        </h4>
        <p>
          Aprobo satisfactoriamente el curso de
          {{ dataItem.certificacione.curso.nombre_cur }}, a continuacion esta la
          vista previa del certificado, esperamos seguir trabajando juntos para
          ser mejores.
        </p>
        <hr />
        <p class="mb-0">
          <b-button pill variant="primary" @click="download"
            >Descargar Certificado!</b-button
          >
        </p>
      </b-alert>
      <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="false"
        :preview-modal="true"
        filename="certificacion"
        @beforeDownload="beforeDownload($event)"
        :pdf-quality="2"
        :manual-pagination="true"
        pdf-format="a4"
        pdf-orientation="portrait"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <CertColaboradoresTemplate
            v-if="!loading"
            :certificacion="dataItem"
          />
        </section>
      </vue-html2pdf>
    </div>
    <CertColaboradoresTemplate v-if="!loading" :certificacion="dataItem" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import Loader from "@/components/Loader/Loader";
import CertColaboradoresTemplate from "./CertColaboradoresTemplate.vue";
import VueHtml2pdf from "vue-html2pdf";
export default {
  components: { Loader, VueHtml2pdf, CertColaboradoresTemplate },
  name: "CertCoalboradoresPdf",
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      getData: "certcolaboradores/getDataById",
    }),
    download() {
      this.$refs.html2Pdf.generatePdf();
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      await html2pdf()
        .set(options)
        .from(pdfContent)
        .outputPdf()
        .then(function (pdf) {
          const pdfbase64 = btoa(pdf);
          console.log(pdfbase64);
        })
        .save();
    },
  },
  computed: {
    ...mapState({
      dataItem: (state) => state.certcolaboradores.dataItem,
      loading: (state) => state.certcolaboradores.loading,
    }),
  },
  async created() {
    const id = this.$route.params.id;
    await this.getData(id);
  },
};
</script>
