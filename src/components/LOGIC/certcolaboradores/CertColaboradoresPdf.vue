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
            <b-button pill variant="primary" @click="download(true)">
              <span v-if="!loadingsend"> Desacargando ...</span>
              <span v-else> Descargar Certificado!</span>
              <b-spinner small v-if="!loadingsend"></b-spinner>
              <b-icon v-else icon="download"></b-icon>
            </b-button>
          </b-col>
          <b-col>
            <b-button
              pill
              :disabled="!loadingsend"
              variant="success"
              @click="download(false)"
            >
              <span v-if="!loadingsend"> Enviando ...</span>
              <span v-else> Enviar al correo</span>
              <b-spinner small v-if="!loadingsend"></b-spinner>
              <b-icon v-else icon="envelope"></b-icon>
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
        :filename="certificacionname"
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
      certificacionname: "",
      loadingsend: true,
    };
  },
  methods: {
    ...mapActions({
      getData: "certcolaboradores/getDataById",
      sendEmail: "email/sendEmail",
    }),
    download(sending) {
      this.loadingsend = false;
      this.send = sending;
      this.$refs.html2Pdf.generatePdf();
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      const that = this;
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
              filename: this.certificacionname,
            };
            await that.sendEmail(dataemail);
          }
        });
      this.loadingsend = true;
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
    this.certificacionname =
      this.dataItem.certificacione.curso.iniciales_cur +
      "_" +
      this.dataItem.colaboradore.nombres_col;
  },
};
</script>
