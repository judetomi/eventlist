<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-textarea
          v-model="source"
          outlined
          name="source"
          label="Tuotavat tiedot"
        ></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ImportItems',
  props: {
    visible: {
      type: Boolean,
    }
  },
  data: () => ({
    source: ''
  })
}
