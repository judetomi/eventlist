<template>
  <v-app id="eventlist">

    <template>
      <div>
        <v-app-bar
          color="blue accent-4"
          dense
          dark
        >
          <v-btn icon>
            <v-icon>mdi-export-variant</v-icon>
          </v-btn>

          <v-btn icon @click.stop="itemModalVisible = true">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>

          <v-btn icon @click.stop="listModalVisible = true">
            <v-icon>mdi-folder-plus-outline</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-menu
            left
            bottom
            >
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="n in 5"
                :key="n"
                @click="() => {}"
                >
                <v-list-item-title>Option {{ n }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
      </div>
    </template>

    <v-content>
      <v-container fluid>
        <template>
          <v-card
            class="mx-auto"
          >
            <v-list
              flat
            >
              <v-list-item-group v-model="model">
                <template v-for="(item, i) in items">
                  <v-divider
                    :key="`divider-${i}`"
                  ></v-divider>
                  <v-list-item
                    :key="i"
                    v-hammer:swipe.left="(event) => onSwipeLeft(event, item, i)"
                    @click.stop="onTap(item)"
                  >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.title"></v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.description }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn text small color="primary">{{ item.qty }} kpl</v-btn>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </template>
      </v-container>
    </v-content>
    <template>
      <v-bottom-navigation
        background-color="blue accent-4"
        color="white"
        dark
        fixed
        grow
      >
        <v-btn>
          <span>Tyhjennä</span>
          <v-icon>mdi-autorenew</v-icon>
        </v-btn>

        <v-btn>
          <span>Poista</span>
          <v-icon>mdi-delete</v-icon>
        </v-btn>

        <v-btn>
          <span>Järjestä</span>
          <v-icon>mdi-border-color</v-icon>
        </v-btn>

        <v-btn>
          <span>Tuo lista</span>
          <v-icon>mdi-download</v-icon>
        </v-btn>

        <v-btn disabled>
          <span>Tallenna</span>
          <v-icon>mdi-content-save</v-icon>
        </v-btn>

      </v-bottom-navigation>
    </template>
    <ItemDialog
      :visible="itemModalVisible"
      :item="currentItem"
      @close="itemModalVisible=false"
    />
    <ListDialog
      :visible="listModalVisible"
      @close="listModalVisible=false"
    />
  </v-app>
</template>

<script>
import ItemDialog from './components/ItemDialog';
import ListDialog from './components/ListDialog';
import axios from 'axios'

export default {
  name: 'Eventlist',
  components: {
    ItemDialog,
    ListDialog
  },
  data: () => ({
    items: [],
     model: 1,
     listModalVisible: false,
     itemModalVisible: false,
     currentItem: {}
  }),
  methods: {
    onSwipeLeft(e, item) {
      this.items.splice(this.items.indexOf(item), 1);
    },
    onTap(item) {
      this.currentItem = {
        text: item.title,
        desc: item.description,
        qty: item.qty
      };
      this.itemModalVisible = true;
    }
  },
  mounted() {
    axios.get('http://localhost/listevents/item/1').then(response => {
      this.items = response.data
    }).catch(error => {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable no-console */
    });
  }
};
</script>
