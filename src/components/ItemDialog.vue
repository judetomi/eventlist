<template>
  <v-row justify="center">
    <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{title}}</v-toolbar-title>
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
                  v-model="item.text"
                  label="Artikkelin nimi"
                  name="article-name"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-if="!item.id"
                  v-model="item.ftext"
                  label="Valitse suosikeista"
                  :items="favourites"
                  :filter="customFilter"
                  :clearable=true
                  item-text="title"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-textarea
                  v-model="item.desc"
                  name="article-info"
                  label="Lisätietoja"
                  hint="Tähän voit antaa lisätietoja luotavasta artikkelista"
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-slider
                  v-model="item.qty"
                  label="Kappalemäärä"
                  thumb-label="always"
                >
                </v-slider>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-checkbox
                  v-if="!item.fid"
                  v-model="item.favourite"
                  label="Suosikki"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" v-if="currentList !== 2">
                <v-select
                  v-if="item.id"
                  v-model="item.list_id "
                  :items="availableLists"
                  label="Siirrä listalle"
                  item-text=title
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
import axios from 'axios';

export default {
  name: 'ItemDialog',
  props: {
    visible: {
      type: Boolean,
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
    }
  },
  data: () => ({
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
    editing: null,
    index: -1,
    nonce: 1,
    menu: false,
    model: [],
    x: 0,
    search: null,
    y: 0,
    favourites: []
  }),
  computed: {
    show: {
      get() {
        return this.visible
      },
      set(value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  methods: {
    edit (index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    saveItem() {
      if(!this.item.id) {
        this.show = false;
        this.$emit('save', this.item);
      } else {
        this.show = false;
        this.$emit('update', this.item);
      }
    },
    customFilter (item, queryText) {
      const textOne = item.title.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.indexOf(searchText) > -1
    },
  },
  mounted() {
    if(!this.item.qty) this.item.qty = 1;

    axios.get(process.env.VUE_APP_ITEMS_ENTRYPOINT, {
      auth: {
        username: process.env.VUE_APP_USERNAME,
        password: process.env.VUE_APP_PASSWORD
      }
    }).then(response => {
      if(response.data) {
        this.favourites = response.data
      }
    }).catch(error => {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable no-console */
    });
  }
}
</script>
