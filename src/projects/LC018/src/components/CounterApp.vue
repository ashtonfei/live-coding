<template>
  <v-container>
    <v-card>
      <v-card-title> Counter App </v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12">
              <v-chip-group>
                <v-chip close>Count: {{ counter.count }}</v-chip>
                <v-chip close>Double Count: {{ counter.doubleCount }}</v-chip>
              </v-chip-group>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Amount"
                v-model.number="amount"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn color="primary" @click="counter.submit">Submit</v-btn>
              <v-btn
                color="primary"
                class="mx-2"
                @click="() => counter.increment(amount)"
                >Inrement</v-btn
              >
              <v-btn color="primary" @click="() => counter.increment(-amount)"
                >Derement</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useCounterStore } from "../stores/counter";
const amount = ref(1);
const counter = useCounterStore();
</script>
