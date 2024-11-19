<script setup>
import { ref } from 'vue';
import axios from 'axios';

const product = ref({
  product_Name: '',
  product_Price: '',
  product_Img: ''
});
const avatarFile = ref(null);

function previewAvatarFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarFile.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
async function handleSubmit() {
  try {
    const formData = new FormData();
    formData.append('product_Name', product.value.product_Name);
    formData.append('product_Price', product.value.product_Price);

    // Gửi ảnh nếu có
    const fileInput = document.querySelector('#product_Img');
    if (fileInput?.files.length) {
      formData.append('imgFile', fileInput.files[0]); // Dùng imgFile thay cho product_Img
    }

    const response = await axios.post('http://localhost:3000/api/v1/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Thêm sản phẩm thành công:', response.data);
    alert('Thêm sản phẩm thành công!');
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error);
    alert('Lỗi khi thêm sản phẩm!');
  }
}
</script>
<template>
  <div class="abc">
    <h2>Thêm sản phẩm mới</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="product_Name">Tên sản phẩm:</label>
        <input
          type="text"
          id="product_Name"
          v-model="product.product_Name"
          required
        />
      </div>

      <div>
        <label for="product_Price">Giá sản phẩm:</label>
        <input
          type="number"
          id="product_Price"
          v-model="product.product_Price"
          required
        />
      </div>

      <div>
        <label for="product_Img">Ảnh sản phẩm:</label>
        <input
          type="file"
          id="product_Img"
          @change="previewAvatarFile"
          accept="image/*"
        />
      </div>

      <div v-if="avatarFile">
        <h4>Ảnh xem trước:</h4>
        <img
          :src="avatarFile"
          alt="preview"
          width="100"
          height="100"
        />
      </div>

      <button type="submit">Thêm sản phẩm</button>
    </form>
  </div>
</template>

<style scoped>

.abc {
  padding: 70px 50px 50px 50px;
}
form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 10px;
}

input[type='text'],
input[type='number'],
input[type='file'] {
  width: 100%;
  padding: 0.5em;
  margin: 0.5em 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 0.7em;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
