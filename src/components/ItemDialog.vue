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
              <v-col cols="12">
                <v-text-field
                  v-model="mutableItem.text"
                  label="Artikkelin nimi"
                  name="article-name"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-if="!mutableItem.id"
                  v-model="mutableItem.bundle"
                  label="Valitse luodusta nipusta"
                  :items="availableBundles"
                  :filter="customFilter"
                  :clearable="true"
                  item-text="title"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-if="!mutableItem.id"
                  v-model="mutableItem.ftext"
                  label="Valitse suosikeista"
                  :items="availableFavourites"
                  :filter="customFilter"
                  :clearable="true"
                  item-text="title"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-textarea
                  v-model="mutableItem.desc"
                  name="article-info"
                  label="Lisätietoja"
                  hint="Tähän voit antaa lisätietoja luotavasta artikkelista"
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-slider
                  v-model="mutableItem.qty"
                  label="Kappalemäärä"
                  thumb-label="always"
                  min="1"
                  max="10"
                  step="1"
                  ticks
                  color="black"
                >
                </v-slider>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-select
                  v-model="mutableItem.category"
                  :items="categories"
                  label="Artikkelin luokka"
                  item-value="id"
                  item-text="title"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-checkbox
                  v-if="!mutableItem.fid"
                  v-model="mutableItem.favourite"
                  label="Suosikki"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-select
                  v-if="mutableItem.id"
                  v-model="mutableItem.list_id"
                  :items="availableLists"
                  label="Siirrä listalle"
                  item-text="title"
                  outlined
                ></v-select>
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
  name: "ItemDialog",
  props: {
    visible: {
      type: Boolean
    },
    item: {
      type: Object
    },
    title: {
      type: String
    },
    currentList: {
      type: Number
    },
    availableLists: {
      type: Array
    },
    availableBundles: {
      type: Array
    },
    availableFavourites: {
      type: Array
    }
  },
  data: () => ({
    activator: null,
    attach: null,
    colors: ["green", "purple", "indigo", "cyan", "teal", "orange"],
    categories: [
      {id: 1, title: 'Vihannekset'},
      {id: 2, title: 'Leivät'},
      {id: 3, title: 'Juustot'},
      {id: 4, title: 'Leikkeleet'},
      {id: 5, title: 'Lihat ja kalat'},
      {id: 6, title: 'Einekset'},
      {id: 7, title: 'Maitotuotteet'},
      {id: 8, title: 'Kuivatavarat'},
      {id: 9, title: 'Säilykkeet'},
      {id: 10, title: 'Juomat'},
      {id: 11, title: 'Pakasteet'},
      {id: 12, title: 'Herkut'},
      {id: 13, title: 'Mausteet'},
      {id: 14, title: 'Yleinen'}
    ],
    editing: null,
    index: -1,
    nonce: 1,
    menu: false,
    model: [],
    x: 0,
    search: null,
    y: 0,
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
    },
    mutableItem: {
      get() {
        return this.item
      },
      set(value) {
        return value
      }
    }
  },
  methods: {
    edit(index, item) {
      if (!this.editing) {
        this.editing = item;
        this.index = index;
      } else {
        this.editing = null;
        this.index = -1;
      }
    },
    saveItem() {
      if (!this.mutableItem.id) {
        this.show = false;
        this.$emit("save", this.mutableItem);
      } else {
        this.show = false;
        this.$emit("update", this.mutableItem);
      }
      this.mutableItem = {};
    },
    customFilter(item, queryText) {
      const textOne = item.title.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    }
  }
};
</script>
