<template>
  <v-bottom-navigation
    background-color="black"
    color="white"
    dark
    fixed
    grow
    v-if="$auth.isAuthenticated"
    app
  >
    <v-btn v-if="currentList !== 2" @click="truncateList">
      <span>Tyhjennä</span>
      <v-icon>mdi-autorenew</v-icon>
    </v-btn>

    <v-btn v-if="currentList > 3" @click="removeList">
      <span>Poista</span>
      <v-icon>mdi-delete</v-icon>
    </v-btn>

    <v-btn v-if="currentList !== 2" @click="showImportModal">
      <span>Tuo lista</span>
      <v-icon>mdi-download</v-icon>
    </v-btn>

    <v-btn
      v-if="currentList !== 2"
      :disabled="imported === 0"
      @click="saveImported"
    >
      <span>Tallenna</span>
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomNav",
  props: {
    currentList: {
      type: Number
    },
    imported: {
      type: Number
    }
  },
  methods: {
    truncateList() {
      this.$emit("truncateList");
    },
    removeList() {
      this.$emit("removeList");
    },
    saveImported() {
      this.$emit("saveImported");
    },
    showImportModal() {
      this.$emit("showImportModal");
    }
  }
};
</script>
