<template>
  <v-app id="eventlist">
    <v-snackbar v-model="snackbar" :top="y === 'top'" :color="color">
      {{ text }}
    </v-snackbar>
    <NavBar
      :currentList="currentList"
      :eventlists="eventlists"
      :y="y"
      :color="color"
      :text="text"
      @login="login"
      @logout="logout"
      @reload="reload"
      @showItemModal="itemModalVisible = true"
      @showListModal="listModalVisible = true"
      @changeList="changeList"
    />
    <v-main>
      <v-container fluid v-if="$auth.isAuthenticated">
        <template>
          <v-card class="mx-auto">
            <v-list flat>
              <v-list-item-group v-model="model">
                <draggable
                  v-bind="dragOptions"
                  @start="isDragging = true"
                  @end="isDragging = false"
                >
                  <transition-group>
                    <template v-for="(item, i) in items">
                      <v-divider :key="`divider-${i}`"></v-divider>
                      <v-list-item
                        :key="i"
                        v-hammer:swipe.left="
                          event => onSwipeLeft(event, item, i)
                        "
                        @click.stop="onTap(item)"
                      >
                        <v-list-item-icon>
                          <v-icon v-if="item.favourite == 1">mdi-star</v-icon>
                          <v-icon v-else>mdi-star-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.title"
                          ></v-list-item-title>
                          <v-list-item-subtitle>
                            {{ item.description }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-btn text small color="primary"
                          >{{ item.qty }} kpl</v-btn
                        >
                      </v-list-item>
                    </template>
                  </transition-group>
                </draggable>
              </v-list-item-group>
            </v-list>
          </v-card>
        </template>
      </v-container>
      <BottomNav
        :currentList="currentList"
        :imported="imported"
        @truncateList="truncateList"
        @removeList="removeList"
        @saveImported="saveImported"
        @showImportModal="importModalVisible = true"
      />
    </v-main>
    <ItemDialog
      :visible="itemModalVisible"
      :item="currentItem"
      :currentList="currentList"
      :availableLists="eventlists"
      :title="title"
      @close="itemModalVisible = false"
      @save="addNewItem"
      @update="updateItem"
    />
    <ListDialog
      :visible="listModalVisible"
      @close="listModalVisible = false"
      @save="addNewList"
    />
    <ImportItems
      :visible="importModalVisible"
      @save="addItem"
      @close="importModalVisible = false"
    />
    <confirm ref="confirm"></confirm>
  </v-app>
</template>

<script>
import ItemDialog from "./components/ItemDialog";
import ListDialog from "./components/ListDialog";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import confirm from "./components/Confirm";
import ImportItems from "./components/ImportItems";
import axios from "axios";
import draggable from "vuedraggable";
import { getInstance } from "./auth";

export default {
  name: "Eventlist",
  components: {
    ItemDialog,
    ListDialog,
    NavBar,
    BottomNav,
    ImportItems,
    confirm,
    draggable
  },
  data: () => ({
    items: [],
    eventlists: [],
    model: 1,
    listModalVisible: false,
    itemModalVisible: false,
    importModalVisible: false,
    currentItem: {},
    isDragging: false,
    editable: true,
    title: "Lisää uusi",
    currentList: 1,
    snackbar: false,
    color: "",
    text: "",
    y: "top",
    imported: 0
  }),
  methods: {
    onSwipeLeft(e, item) {
      this.$refs.confirm
        .open("Poista", "Oletko varma, että haluat poistaa artikkelin?", {
          color: "red"
        })
        .then(confirm => {
          this.items.splice(this.items.indexOf(item), 1);
          axios
            .delete(process.env.VUE_APP_ITEM_ENTRYPOINT + item.id, {
              auth: {
                username: process.env.VUE_APP_USERNAME,
                password: process.env.VUE_APP_PASSWORD
              }
            })
            .then(response => {
              if (response.data) {
                if (confirm) {
                  this.text = "Artikkeli poistettu onnistuneesti";
                  this.color = "success";
                  this.snackbar = true;
                }
              }
            })
            .catch(error => {
              this.text = "Ups! Artikkelia ei voitu poistaa!";
              this.color = "error";
              this.snackbar = true;
              /* eslint-disable no-console */
              console.log(error);
              /* eslint-enable no-console */
            });
        });
    },
    onTap(item) {
      if (!this.isDragging) {
        this.currentItem = {
          id: item.id,
          text: item.title,
          desc: item.description,
          qty: item.qty,
          favourite: item.favourite == 1 ? true : false
        };
        this.title = "Muokkaa";
        this.itemModalVisible = true;
      }
    },
    loadLists() {
      axios
        .get(process.env.VUE_APP_LIST_ENTRYPOINT, {
          auth: {
            username: process.env.VUE_APP_USERNAME,
            password: process.env.VUE_APP_PASSWORD
          }
        })
        .then(response => {
          if (response.data) {
            this.eventlists = response.data;
          }
        })
        .catch(error => {
          this.text = "Ups! Listoja ei voitu ladata!";
          this.color = "error";
          this.snackbar = true;
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    },
    reload() {
      axios
        .get(process.env.VUE_APP_ITEM_ENTRYPOINT + this.currentList, {
          auth: {
            username: process.env.VUE_APP_USERNAME,
            password: process.env.VUE_APP_PASSWORD
          }
        })
        .then(response => {
          if (response.data) {
            this.items = response.data;
          }
        })
        .catch(error => {
          this.text = "Ups! Artikkeleiden lataus epäonnistui!";
          this.color = "error";
          this.snackbar = true;
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    },
    changeList(list) {
      this.currentList = parseInt(list.id);
      this.reload();
    },
    removeList() {
      this.$refs.confirm
        .open(
          "Poista",
          "Oletko varma, että haluat tämän listan ja kaikki sen artikkelit?",
          { color: "red" }
        )
        .then(confirm => {
          if (confirm) {
            axios
              .delete(process.env.VUE_APP_LIST_ENTRYPOINT + this.currentList, {
                auth: {
                  username: process.env.VUE_APP_USERNAME,
                  password: process.env.VUE_APP_PASSWORD
                }
              })
              .then(response => {
                if (response.data) {
                  this.text = "Lista poistettu poistettu onnistuneesti!";
                  this.color = "success";
                  this.snackbar = true;
                  this.currentList = 1; // load initial list
                  this.reload();
                }
              })
              .catch(error => {
                this.text = "Ups! Listan poistaminen ei onnistunut!";
                this.color = "error";
                this.snackbar = true;
                /* eslint-disable no-console */
                console.log(error);
                /* eslint-enable no-console */
              });
          }
        });
    },
    addNewList(title, description) {
      axios({
        headers: {
          "Content-type": "application/json"
        },
        method: "post",
        url: process.env.VUE_APP_LIST_ENTRYPOINT,
        auth: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_PASSWORD
        },
        data: {
          title: title,
          description: description
        }
      })
        .then(response => {
          if (response.data) {
            this.text = "Uusi Lista luotu onnistuneesti!";
            this.color = "success";
            this.snackbar = true;
          }
        })
        .catch(error => {
          this.text = "Ups! Listan luominen ei onnistunut!";
          this.color = "error";
          this.snackbar = true;
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    },
    addNewItem(item) {
      axios({
        headers: {
          "Content-type": "application/json"
        },
        method: "post",
        url: process.env.VUE_APP_ITEM_ENTRYPOINT + this.currentList,
        auth: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_PASSWORD
        },
        data: {
          text: item.text,
          ftext: item.ftext,
          description: item.desc,
          qty: item.qty,
          favourite: item.favourite
        }
      })
        .then(response => {
          if (response.data) {
            this.currentItem = {};
            this.items.push({
              title: item.text,
              description: item.desc,
              qty: item.qty
            });
          }
        })
        .catch(error => {
          this.text = "Ups! Artikkelin lisäys ei onnistunut!";
          this.color = "error";
          this.snackbar = true;
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    },
    updateItem(item) {
      axios({
        headers: {
          "Content-type": "application/json"
        },
        method: "put",
        url: process.env.VUE_APP_ITEM_ENTRYPOINT + "update/" + item.id,
        auth: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_PASSWORD
        },
        data: {
          text: item.text,
          list_id: item.list_id,
          description: item.desc,
          qty: item.qty,
          favourite: item.favourite
        }
      })
        .then(response => {
          if (response.data) {
            this.text = "Artikkelin muokkaus onnistui!";
            this.color = "success";
            this.snackbar = true;
            this.currentItem = {};
            this.reload();
          }
        })
        .catch(error => {
          this.text = "Ups! Artikkelin muokkaus epäonnistui!";
          this.color = "error";
          this.snackbar = true;
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    },
    addItem(item) {
      this.items.push({ title: item.title, description: "", qty: item.qty });
      this.imported = 1;
    },
    saveImported() {
      axios({
        headers: {
          "Content-type": "application/json"
        },
        method: "post",
        url: process.env.VUE_APP_LIST_ENTRYPOINT + "import/" + this.currentList,
        auth: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_PASSWORD
        },
        data: {
          items: this.items
        }
      })
        .then(response => {
          if (response.data) {
            this.text = "Lista tallennettu onnistuneesti";
            this.color = "success";
            this.snackbar = true;
            this.imported = 0;
          }
        })
        .catch(error => {
          this.text = "Ups! Listan tallennus ei onnistunut";
          this.color = "error";
          this.snackbar = true;
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    },
    truncateList() {
      axios
        .delete(
          process.env.VUE_APP_LIST_ENTRYPOINT + "items/" + this.currentList,
          {
            auth: {
              username: process.env.VUE_APP_USERNAME,
              password: process.env.VUE_APP_PASSWORD
            }
          }
        )
        .then(response => {
          if (response.data) {
            this.text = "Lista tyhjennetty onnistuneesti!";
            this.color = "success";
            this.snackbar = true;
            this.items = [];
          }
        })
        .catch(error => {
          this.text = "Ups! Listan tyhjentäminen ei onnistunut!";
          this.color = "error";
          this.snackbar = true;
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    },
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  },
  mounted() {
    const instance = getInstance();
    instance.$watch("loading", async loading => {
      if (!loading && instance.isAuthenticated) {
        this.loadLists();
        this.reload();
      }
    });
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
