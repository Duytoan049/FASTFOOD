<script setup>
defineProps({
  customer: { type: Object, required: true }
});
</script>
<template>
  <div>
    <div class="p-1 w-75 h-75">
      <img
        class="img-fluid img-thumbnail"
        :src="customer.avatar"
        alt=""
      />
    </div>
    <div class="p-1">
      <strong>Tên:</strong>
      {{ customer.name }}
    </div>
    <div class="p-1">
      <strong>E-mail:</strong>
      {{ customer.email }}
    </div>
    <div class="p-1">
      <strong>Địa chỉ:</strong>
      {{ customer.address }}
    </div>
    <div class="p-1">
      <strong>Điện thoại:</strong>
      {{ customer.phone }}
    </div>
  </div>
</template>
