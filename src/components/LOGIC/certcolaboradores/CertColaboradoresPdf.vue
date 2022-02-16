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
      </b-alert>
      <br />
      <b-container>
        <b-row>
          <b-col>
            <b-button pill variant="primary" @click="download(true)"
              >Descargar Certificado!</b-button
            >
          </b-col>
          <b-col>
            <b-button pill variant="success" @click="download(false)">
              Enviar al correo
              <b-icon icon="envelope"></b-icon>
            </b-button>
          </b-col>
        </b-row>
      </b-container>
      <br />
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
    return {
      send: false,
    };
  },
  methods: {
    ...mapActions({
      getData: "certcolaboradores/getDataById",
      sendEmail: "email/sendEmail",
    }),
    download(sending) {
      this.send = sending;
      this.$refs.html2Pdf.generatePdf();
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      const that = this
      const cert = this.dataItem;

      await html2pdf()
        .set(options)
        .from(pdfContent)
        .outputPdf()
        .then(async function(pdf) {
          const pdfbase64 = btoa(pdf);

          if (!that.send) {
            
            const dataemail = {
              tipo: 2,
              to: cert.colaboradore.correopersonal_col,
              username: "",
              pass: "",
              nombre: cert.nombres,
              pdf: pdfbase64,
            };   
            await that.sendEmail(dataemail);
          }
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
