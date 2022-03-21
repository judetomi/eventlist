<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark>
          <v-btn icon dark @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Uusi Lista</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveList">Tallenna</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  label="Listan nimi*"
                  name="list-name"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  name="list-info"
                  label="Lisätietoja"
                  hint="Tähän voit antaa lisätietoja luotavasta listasta"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ListDialog",
  props: {
    visible: {
      type: Boolean
    }
  },
  data: () => ({
    title: "",
    description: ""
  }),
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    }
  },
  methods: {
    saveList() {
      this.show = false;
      this.$emit("save", this.title, this.description);
    }
  }
};
</script>
