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
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveItem">Tallenna</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="source"
                  outlined
                  label="Tuotavat tiedot"
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
  name: "ImportItems",
  props: {
    visible: {
      type: Boolean
    }
  },
  data: () => ({
    title: "Tuo lista",
    source: ""
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
    saveItem() {
      let rows = this.source.split("\n");
      let items;
      let regex = /\d+/;
      let qty;
      let item = {};
      rows.forEach(row => {
        items = row.split(" ");
        if (items[0].length > 0) {
          qty = items[0].match(regex);
          if (qty) {
            items.shift();
            item = {
              title: items.join(),
              qty: qty[0] > 10 ? "1" : qty[0]
            };
            this.$emit("save", item);
          }
        }
      });
      this.show = false;
    }
  }
};
</script>
