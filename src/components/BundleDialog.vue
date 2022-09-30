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
            <v-btn dark text @click="saveBundle">Tallenna</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="mutableBundle.title"
                  label="Nipun nimi*"
                  name="bundle-name"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="mutableBundle.description"
                  name="bundle-info"
                  label="Lisätietoja"
                  hint="Tähän voit antaa lisätietoja luotavasta nipusta"
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="12" class="mb-5">
                <v-subheader>Kategoriat: 1 = vihannekset, 2 = leivät, 3 = juustot, 4 = Leikkeleet, 5 = Lihat ja kalat, 6 = Einekset,
                  7 = Maitotuotteet, 8 = Kuivatavarat, 9 = Säilykkeet, 10 = Juomat, 11 = Pakasteet, 12 = Herkut, 13 = Mausteet, 14 = yleinen</v-subheader>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="mutableBundle.items"
                  name="bundle-items"
                  label="Nipun artikkelit"
                  hint="Syötä tähän nipun artikkelit jokainen omalla rivilleen. Kappalemäärä ja kategoria erotetaan pilkulla esim. Maito, 1, 7"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-bottom-navigation
          background-color="black"
          color="white"
          dark
          fixed
          grow
        >
          <v-btn v-if="bundle.id" dark text @click="removeBundle">
            <span>Poista</span>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "BundleDialog",
  props: {
    visible: {
      type: Boolean
    },
    title: {
      type: String
    },
    bundle: {
      type: Object
    },
  },
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
    },
    mutableBundle: {
      get() {
        return this.bundle
      },
      set(value) {
        return value
      }
    }
  },
  methods: {
    saveBundle() {
      let rows = this.bundle.items.split("\n");
      let items;
      let bundle_items = [];
      rows.forEach(row => {
        items = row.split(",");
        if (items[0].length > 0) {
          let item = {
            title: items[0],
            qty: items[1],
            category: items[2] > 0 ? items[2] : 0
          };
          bundle_items.push(item);
        }
      });
      this.show = false;
      if (!this.bundle.id) {
        this.$emit("save", this.bundle, bundle_items);
      } else {
        this.$emit("update", this.bundle, bundle_items);
      }
    },
    removeBundle() {
      this.$emit("removeBundle", this.bundle);
    }
  }
};
</script>
