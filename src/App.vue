<template>
  <v-app id="eventlist">

    <template>
      <div>
        <v-alert type="success" v-if="success==1">
          I'm a success alert.
        </v-alert>
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

          <v-btn icon @click="reload">
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
                v-for="(elist, i) in eventlists"
                :key="`${i}`"
                @click="changeList(elist)"
                >
                <v-list-item-title v-text="elist.title"></v-list-item-title>
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
                <draggable
                  v-bind="dragOptions"
                  @start="isDragging=true"
                  @end="isDragging=false"
                >
                  <transition-group>
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
                        <v-icon v-if="item.favourite==1">mdi-star</v-icon>
                        <v-icon v-else>mdi-star-outline</v-icon>
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
                  </transition-group>
                </draggable>
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

        <v-btn
          v-if="currentList==1"
          disabled
          @click="removeList"
        >
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
      :title="title"
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
import axios from 'axios';
import draggable from 'vuedraggable';

export default {
  name: 'Eventlist',
  components: {
    ItemDialog,
    ListDialog,
    draggable
  },
  data: () => ({
    items: [],
    eventlists: [],
    model: 1,
    listModalVisible: false,
    itemModalVisible: false,
    currentItem: {},
    isDragging: false,
    editable: true,
    title: "Lisää uusi",
    currentList: 1,
    success: 0
  }),
  methods: {
    onSwipeLeft(e, item) {
      this.items.splice(this.items.indexOf(item), 1);
    },
    onTap(item) {
      if(!this.isDragging) {
        this.currentItem = {
          text: item.title,
          desc: item.description,
          qty: item.qty
        };
        this.title = "Muokkaa";
        this.itemModalVisible = true;
      }
    },
    loadLists() {
      axios.get('http://localhost/listevents/').then(response => {
        this.eventlists = response.data
      }).catch(error => {
        /* eslint-disable no-console */
        console.log(error);
        /* eslint-enable no-console */
      });
    },
    reload() {
      axios.get('http://localhost/listevents/item/' + this.currentList).then(response => {
        this.items = response.data
      }).catch(error => {
        /* eslint-disable no-console */
        console.log(error);
        /* eslint-enable no-console */
      });
    },
    changeList(list) {
      this.currentList = list.id;
    },
    removeList() {
      axios.delete('http://localhost/listevents/' + this.currentList).then(response => {
        if(response.data) {
          this.success = true;
        }
      }).catch(error => {
        /* eslint-disable no-console */
        console.log(error);
        /* eslint-enable no-console */
      });
    },
    showSuccessMessage(value) {
      this.success = value;
    }
  },
  mounted() {
    this.loadLists();
    this.reload();
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    }
  }
};
</script>
<style>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
