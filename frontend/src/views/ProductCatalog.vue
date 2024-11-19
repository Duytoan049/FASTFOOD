<script setup>
import { ref, computed, useTemplateRef, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MainPagination from '@/components/MainPage.vue';
import productsService from '@/services/product.services';
import ProductList_admin from '@/components/ProductList_admin.vue';
import { Field } from 'vee-validate';
import axios from 'axios';
const router = useRouter();
const route = useRoute();

const selectedProduct = ref(null);
const avatarFile = ref('');
const avatarFileInput = useTemplateRef('avatar-file-input');
const isAddingNewProduct = ref(false);

// Chức năng chọn sản phẩm
function selectProduct(product) {
  if (!isAddingNewProduct.value) {
    selectedProduct.value = { ...product };
    avatarFile.value = product.product_Img;
  }
}

// Chức năng xem trước ảnh sản phẩm
function previewAvatarFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      avatarFile.value = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
}

const totalPages = ref(1);
const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});

const products = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');

const searchableProduct = computed(() => {
  return products.value.filter((product) => {
    const { product_Name, product_Price } = product;
    return [product_Name, product_Price]
      .join(' ')
      .toLowerCase()
      .includes(searchText.value.toLowerCase());
  });
});

const filteredProducts = computed(() => {
  if (!searchText.value) return products.value;
  return searchableProduct.value;
});

// Fetch products for the given page
async function retrieveProducts(page) {
  try {
    const response = await productsService.fetchProducts(page);
    totalPages.value = response.metadata.lastPage ?? 1;
    products.value = response.products.sort((current, next) =>
      current.product_Name.localeCompare(next.product_Name)
    );
    selectedIndex.value = -1;
  } catch (error) {
    console.error(error);
  }
}

// Chuyển trang
function changeCurrentPage(page) {
  router.push({ name: 'productadmin', query: { page } });
}

// Reset selected index when search text changes
watch(searchText, () => (selectedIndex.value = -1));

// Fetch products when current page changes
watch(currentPage, () => retrieveProducts(currentPage.value), { immediate: true });

// Chức năng thêm sản phẩm mới
const product = ref({
  product_Name: '',
  product_Price: '',
  product_Img: ''
});
const goToAddProductPage = () => {
  router.push({ name: 'addproduct' });
};
async function handleSubmit() {
  try {
    const formData = new FormData();
    formData.append('product_Name', selectedProduct.value.product_Name);
    formData.append('product_Price', selectedProduct.value.product_Price);

    // Gửi ảnh nếu có
    const fileInput = document.querySelector('#product_Img');
    if (fileInput?.files.length) {
      formData.append('imgFile', fileInput.files[0]);
    }

    const productId = selectedProduct.value.product_Id;
    const response = await axios.put(
      `http://localhost:3000/api/v1/products/${productId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Thêm sản phẩm thành công:', response.data);
    alert('Cập nhật thành công!');
    retrieveProducts(currentPage.value);
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error);
    alert('Lỗi khi cập nhật sản phẩm!');
  }
}
</script>

<template>
  <section class="menu_page_admin">
    <div class="heading">
      <div class="heading_content">
        <h2>Sản phẩm</h2>
      </div>
      <div class="find_sp">
        <form
          action=""
          method="post"
          @submit.prevent="changeCurrentPage(1)"
        >
          <input
            v-model="searchText"
            class="input_ttsp"
            type="text"
            name="thongtinsp"
            placeholder="Thông tin sản phẩm"
          />
        </form>
      </div>
      <div>
        <button
          class="button-1"
          role="button"
          @click="goToAddProductPage"
        >
          Thêm mới
        </button>
      </div>
    </div>

    <div
      v-if="filteredProducts.length === 0"
      class="no-products-found"
    >
      <h3 style="padding-top: 20px">Không tìm thấy sản phẩm</h3>
    </div>

    <div class="product_container">
      <div class="list_products_container">
        <ProductList_admin
          :products="filteredProducts"
          @select-product="selectProduct"
        />
      </div>
    </div>
  </section>

  <div class="pagination-container-admin">
    <MainPagination
      :total-pages="totalPages"
      :current-page="currentPage"
      @update:current-page="changeCurrentPage"
    />
  </div>

  <div class="order_list">
    <header>
      <h1>Chi tiết sản phẩm</h1>
    </header>

    <div
      v-if="isAddingNewProduct || selectedProduct"
      class="product_detail"
    >
      <Form
        class="detail"
        @submit.prevent="handleSubmit"
      >
        <label
          for="img"
          class="form-label"
          >Hình ảnh sản phẩm:</label
        >
        <div>
          <img
            class="img-fluid img-thumbnail"
            :src="avatarFile || '/images/upload.png'"
            alt="Product Image"
            @click="avatarFileInput.click()"
          />
          <Field
            name="avatarFile"
            v-slot="{ handleChange }"
          >
            <input
              type="file"
              class="d-none"
              ref="avatar-file-input"
              id="product_Img"
              @change="
                (event) => {
                  handleChange(event);
                  previewAvatarFile(event);
                }
              "
              accept="image/*"
            />
          </Field>
        </div>
        <div class="mb-3">
          <label
            for="name"
            class="form-label"
            >Tên</label
          >
          <Field
            name="name"
            type="text"
            class="form-control"
            v-model="selectedProduct.product_Name"
          />
        </div>
        <div class="mb-3">
          <label
            for="price"
            class="form-label"
            >Giá</label
          >
          <Field
            name="price"
            type="text"
            class="form-control"
            v-model="selectedProduct.product_Price"
          />
        </div>

        <div class="product_btn">
          <button type="submit" class="button-1">Cập nhật</button>
        </div>
      </Form>
    </div>
  </div>
</template>

<style>
.menu_page_admin {
  padding: 80px 364px 150px 180px;
}

.no-products-found {
  display: flex;
  justify-content: center;
}

.center h3 {
  text-align: center;
}

.pagination-container-admin {
  z-index: 1000;
  padding: 0px 364px 50px 180px;
}

.pagination-container-admin .pagination {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-container-admin .page-item {
  margin: 0 5px;
}

.pagination-container-admin .page-link {
  cursor: pointer;
  color: #ff5e00;
}

.pagination-container-admin .page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}

.pagination-container-admin .page-item.active .page-link {
  font-weight: bold;
  color: #ffffff;
  background-color: #ff5e00;
  border-color: #ff5e00;
}

.pagination-container-admin .page-item a {
  text-decoration: none;
}

.heading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.heading_content {
  width: 30%;
}

.heading h2 {
  font-family: 'Chakra Petch', sans-serif;
  font-size: 30px;
  font-weight: 900;
  text-align: center;
  text-transform: uppercase;
  color: #ff5e00;
}

.product_container {
  padding-top: 40px;
  display: flex;
  justify-content: center;
}

.menu_page_admin .list_products_container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  row-gap: 80px;
}

.menu_page_admin .box_sanphamadmin {
  width: 230px;
  height: 250px;
  background-color: #fff7f1;
  border: 1px solid rgba(249, 173, 106, 0.6);
  color: var(--main-text-color);
  cursor: pointer;
  transition: 0.3s;
}

.box_sanphamadmin .sanpham_img {
  overflow: hidden;
  position: relative;
  width: 230px;
  height: 172px;
  border-bottom: 1px solid rgba(249, 173, 106, 0.6);
}

.box_sanphamadmin .sanpham_img p {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #ff5e00;
  padding: 5px;
  color: #fff;
  width: 60px;
  text-align: center;
  font-weight: bold;
}

.box_sanphamadmin .sanpham_img img {
  width: 230px;
  height: 230px;
  transition: 0.3s;
}

.box_sanphamadmin:hover img {
  scale: 1.12;
}
.box_sanphamadmin:hover {
  scale: 1.05;
}
.sanpham_ten {
  display: flex;
  justify-content: center;
  text-align: center;
}

.sanpham_ten h2 {
  font-family: 'Playfair Display';
  font-size: 22px;
  margin: 7px 0;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.sanpham_thanhphan {
  display: flex;
  justify-content: center;
}

.sanpham_thanhphan h1 {
  font-family: 'Playfair Display';
  font-size: 22px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  margin-top: 5px;
}

.sanpham_gia {
  display: flex;
  justify-content: center;
  margin: 5px 0;
}

.sanpham_gia h1 {
  font-family: 'Playfair Display';
  font-size: 22px;
  font-style: normal;
  font-weight: 900;
  margin-bottom: 7px;
}

.btn_order {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.btn_order button {
  margin: 0;
  width: 134px;
  height: 48px;
  border-radius: 24px;
  background-color: #fff7f1;
  border: 1px solid var(--special-color);
  box-shadow: 0px 6px 12px 0px rgba(230, 143, 85, 0.4);
  cursor: pointer;
  color: var(--special-color);
  font-size: 20px;
  font-weight: bold;
}

.btn_order button:hover {
  background: var(--special-color);
  color: var(--text-color);
}

input,
select {
  border: 1px grey solid;
  border-radius: 5px;
}
.info-row {
  padding-bottom: 10px;
}

.info-row label {
  font-style: bold;
  font-weight: 900;
  font-size: 20px;
}

.info-row p {
  font-size: 20px;
  padding-left: 20px;
}

.product_detail {
  width: 100%;
  position: fixed;
}

.product_detail .detail {
  width: 350px;
  height: 100%;
  padding: 10px;
}

.product_detail .detail img {
  width: 300px;
  height: 300px;
}

.button-1 {
  background-color: #25b68a;
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
  font-weight: 900;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin: 0;
  outline: none;
  padding: 10px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-1:hover {
  background-color: #82eef0;
}
</style>
