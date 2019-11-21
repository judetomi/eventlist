<template>
  <div v-if="!$auth.loading">
    <v-app-bar
      color="blue accent-4"
      dense
      dark
      v-if="$auth.isAuthenticated"
    >
      <v-btn
        icon
        @click="logout"
      >
        <v-icon>mdi-export-variant</v-icon>
      </v-btn>

      <v-btn icon @click="itemModalVisible">
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>

      <v-btn icon @click="reload">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>

      <v-btn icon @click="listModalVisible">
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
    <v-app-bar
      color="blue accent-4"
      dense
      dark
      v-if="!$auth.isAuthenticated"
    >
      <v-toolbar-title>Login</v-toolbar-title>

      <v-btn
        icon
        @click="login"
      >
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    eventlists: {
      type: Array,
    },
    y: {
      type: String,
    },
    color: {
      type: String,
    },
    text: {
      type: String,
    }
  },
  methods: {
    login() {
      this.$emit('login');
    },
    logout() {
      this.$emit('logout');
    },
    reload() {
      this.$emit('reload');
    },
    showItemModal() {
      this.$emit('showItemModal');
    },
    showListModal() {
      this.$emit('showListModal');
    },
    changeList() {
      this.$emit('changeList');
    },
    itemModalVisible() {
      this.$emit('showItemModal');
    },
    listModalVisible() {
      this.$emit('showListModal');
    }
  }
}
</script>
