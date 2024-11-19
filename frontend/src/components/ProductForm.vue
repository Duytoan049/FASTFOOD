<script setup>
import { ref } from 'vue';
import { Field } from 'vee-validate';

const avatarFile = ref('');
const avatarFileInput = ref(null);

const previewAvatarFile = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      avatarFile.value = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const selectedProduct = ref({
  product_Name: '',
  product_Price: ''
});
</script>

<template>
<div class="detail">
    <label for="img" class="form-label">Hình ảnh sản phẩm:</label>
    <div>
        <img
            class="img-fluid img-thumbnail"
            :src="avatarFile"
            alt="Product Image"
            @click="avatarFileInput.click()"
        />
        <Field name="avatarFile" v-slot="{ handleChange }">
            <input
                type="file"
                class="d-none"
                ref="avatar-file-input"
                @change="(event) => {
                    handleChange(event);
                    previewAvatarFile(event);
                }"
            />
        </Field>
    </div>
    <div class="mb-3">
        <label for="name" class="form-label">Tên</label>
        <Field name="name" type="text" class="form-control" v-model="selectedProduct.product_Name" />
    </div>
    <div class="mb-3">
        <label for="price" class="form-label">Giá</label>
        <Field name="price" type="text" class="form-control" v-model="selectedProduct.product_Price" />
    </div>

    <div class="product_btn">
        <button
        class="button-1"
        role="button"
        >
        Cập nhật
        </button>
    </div>
</div>

</template>
