<template>
  <v-row justify="center">
    <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="show = false">Tallenna</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="item.text"
                  label="Artikkelin nimi*"
                  name="article-name"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="item.desc"
                  name="article-info"
                  label="Lisätietoja"
                  hint="Tähän voit antaa lisätietoja luotavasta artikkelista"
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-slider
                  v-model="item.qty"
                  label="Kappalemäärä"
                  thumb-label="always"
                >
                </v-slider>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="model"
                  :filter="filter"
                  :hide-no-data="!search"
                  :items="items"
                  :search-input.sync="search"
                  hide-selected
                  label="Etsi asiasanaa"
                  multiple
                  small-chips
                  solo
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <span class="subheading">Lisää uusi</span>
                      <v-chip
                        :color="`${colors[nonce - 1]} lighten-3`"
                        label
                        small
                      >
                        {{ search }}
                      </v-chip>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ attrs, item, parent, selected }">
                    <v-chip
                      v-if="item === Object(item)"
                      v-bind="attrs"
                      :color="`${item.color} lighten-3`"
                      :input-value="selected"
                      label
                      small
                    >
                      <span class="pr-2">
                        {{ item.text }}
                      </span>
                      <v-icon
                        small
                        @click="parent.selectItem(item)"
                      >mdi-close</v-icon>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ index, item }">
                    <v-text-field
                      v-if="editing === item"
                      v-model="editing.text"
                      autofocus
                      flat
                      background-color="transparent"
                      hide-details
                      solo
                      @keyup.enter="edit(index, item)"
                    ></v-text-field>
                    <v-chip
                      v-else
                      :color="`${item.color} lighten-3`"
                      dark
                      label
                      small
                    >
                      {{ item.text }}
                    </v-chip>
                    <v-spacer></v-spacer>
                    <v-list-item-action @click.stop>
                      <v-btn
                        icon
                        @click.stop.prevent="edit(index, item)"
                      >
                        <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="lists"
                  label="Siirrä listalle"
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
  name: 'ItemDialog',
  props: {
    visible: {
      type: Boolean,
    },
    item: {
      type: Object
    }
  },
  data: () => ({
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
    lists: [],
    editing: null,
    index: -1,
    items: [
      { header: 'Valitse asiasana tai luo uusi' },
      {
        text: 'Perustarvikkeet',
        color: 'blue',
      },
      {
        text: 'Herkut',
        color: 'red',
      },
    ],
    title: "Lisää uusi artikkeli",
    currentItem: {},
    nonce: 1,
    menu: false,
    model: [],
    x: 0,
    search: null,
    y: 0,
  }),
  watch: {
    model (val, prev) {
      if (val.length === prev.length) return

      this.model = val.map(v => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1],
          }

          this.items.push(v)

          this.nonce++
        }

        return v
      })
    },
  },
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
    filter (item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },
  }
}
</script>
