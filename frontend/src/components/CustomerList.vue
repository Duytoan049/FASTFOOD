<script setup>
defineProps({
  customers: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 }
});
const $emit = defineEmits(['update:selectedIndex']);
</script>
<template>
  <ul class="list-group">
    <li
      class="list-group-item px-3"
      v-for="(customer, index) in customers"
      :class="{ active: index === selectedIndex }"
      :key="customer.id"
      @click="$emit('update:selectedIndex', index)"
    >
      {{ customer.name }}
    </li>
  </ul>
</template>
