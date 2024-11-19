<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProductList from '@/components/ProductList.vue';
import MainPagination from '@/components/MainPage.vue';
import productsService from '@/services/product.services';
import orderService from '@/services/order.services';
import axios from 'axios';

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);
// Lấy thông tin người dùng khi component được tạo
onMounted(async () => {
  if (!currentUser.value) {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
        withCredentials: true
      });
      if (response.status === 200 && response.data.user) {
        currentUser.value = response.data.user;
        localStorage.setItem('user', JSON.stringify(currentUser.value)); // Lưu vào localStorage nếu chưa có
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
});

// Hàm để lấy ID của người dùng hiện tại
function getUserId() {
  return currentUser.value ? currentUser.value.id : null;
}

const router = useRouter();
const route = useRoute();

const totalPages = ref(1);

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});

const products = ref([]);
const orderList = ref([]);

const selectedIndex = ref(-1);
const searchText = ref('');


const searchableProduct = computed(() => {
  return products.value.filter((product) => {
    const { product_Name, product_Price } = product;
    return [product_Name, product_Price].join(' ').toLowerCase().includes(searchText.value.toLowerCase());
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

// Handle adding a product to the order list
function addToOrderList(product) {

  if (!currentUser.value) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
    router.push({ name: 'login' }); // Thay 'login' bằng tên route của trang đăng nhập
    return;
  }
  // Kiểm tra xem sản phẩm đã có trong danh sách orderList chưa
  const existingOrder = orderList.value.find(order => order.product_Id === product.product_Id);

  if (existingOrder) {
    // Nếu sản phẩm đã có, tăng số lượng và tính lại tổng giá
    existingOrder.quantity += 1;
    existingOrder.totalPrice = existingOrder.quantity * existingOrder.product_Price;
  } else {
    // Nếu sản phẩm chưa có, thêm mới vào danh sách
    orderList.value.push({
      ...product,
      quantity: 1, // Đặt số lượng ban đầu là 1
      totalPrice: product.product_Price, // Tính giá ban đầu
    });
  }
}

async function checkoutOrder() {
  try {
    const customerId = getUserId();;  
    const orderData = {
      total_Price: orderList.value.reduce((sum, order) => sum + order.totalPrice, 0)
    };
    
    const orderId = await orderService.createOrder(customerId, orderData);  

    for (const order of orderList.value) {

      const detailData = {
        productId: order.product_Id,
        quantity: order.quantity,
        price: order.product_Price
      };

      await orderService.createOrderDetail(orderId, order.product_Id, detailData);
    }


    alert("Đặt hàng thành công!");
    orderList.value = [];
  } catch (error) {
    console.error("Có lỗi xảy ra khi thanh toán: ", error);
    alert("Đặt hàng không thành công!");
  }
}

// Update current page in URL
function changeCurrentPage(page) {
  router.push({ name: 'menu', query: { page } });
}

// Reset selected index when search text changes
watch(searchText, () => (selectedIndex.value = -1));

// Fetch products when current page changes
watch(currentPage, () => retrieveProducts(currentPage.value), { immediate: true });
</script>

<template>
  <section class="menu_page">
    <div class="heading">
      <div class="heading_content">
        <h2>Danh sách sản phẩm</h2>
      </div>
      <div class="find_sp">
        <form action="" method="post" @submit.prevent="changeCurrentPage(1)">
          <input v-model="searchText" class="input_ttsp" type="text" name="thongtinsp" placeholder="Thông tin sản phẩm">
          <input class="btn_timkiem" type="submit" value="Tìm">
        </form>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="no-products-found">
        <h3 style="padding-top: 20px;">Không tìm thấy sản phẩm</h3>
    </div>
    
    <div class="product_container">
      <div class="list_products_container">
        <ProductList :products="filteredProducts" @add-to-cart="addToOrderList" />
      </div>
    </div>

  </section>
  <div class="pagination-container">
    <MainPagination :total-pages="totalPages" :current-page="currentPage" @update:current-page="changeCurrentPage" />
  </div>
  <div class="order_list">
    <header>
      <h1>Chi tiết đơn hàng</h1>
    </header>

    <div class="order_detail">
      <table class="list_order">
        <tbody>
          <tr>
            <td style="width: 15px;">SL</td>
            <td style="width: 80px;">SP</td>
            <td style="width: 90px;">Giá</td>
            <td style="width: 90px;">TT</td>
            <td style="width: 22px;"></td>
          </tr>
          <tr v-for="(order, index) in orderList" :key="index">
            <td>{{ order.quantity }}</td>
            <td>{{ order.product_Name }}</td>
            <td>{{ order.product_Price.toLocaleString('vi-VN') }}</td>
            <td>{{ order.totalPrice.toLocaleString('vi-VN') }}</td>
            <td class="btn_del_product"><button @click="orderList.splice(index, 1)"><i class="fa-solid fa-trash" style="color: #ffffff; font-size: 13px;"></i></button></td>
          </tr>
        </tbody>
      </table>

      <div class="menu_footer">
        <table class="footer_detail">
          <tbody>
            <tr>
              <td style="width: 150px">Tổng:</td>
              <td style="text-align: right;">{{ orderList.reduce((sum, order) => sum + order.totalPrice,
                0).toLocaleString('vi-VN') }} VND</td>
            </tr>
            <tr>
              <td style="width: 150px">Thanh toán:</td>
              <td style="text-align: right;">{{ orderList.reduce((sum, order) => sum + order.totalPrice,
                0).toLocaleString('vi-VN') }} VND</td>
            </tr>
          </tbody>
        </table>

        <div class="thanhtoan">
          <button @click="checkoutOrder">Thanh toán</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');


/* Menu */
.menu_page {
    padding: 80px 375px 150px 10px;
}

.no-products-found {
  display: flex;
  justify-content: center;
}

.center h3 {
  text-align: center;
}

.pagination-container {
  z-index: 1000;
  padding: 0px 365px 50px 0px;
}

.pagination-container .pagination {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-container .page-item {
  margin: 0 5px;
}

.pagination-container .page-link {
  cursor: pointer;
  color: #ff5e00;
}

.pagination-container .page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}

.pagination-container .page-item.active .page-link {
  font-weight: bold;
  color: #ffffff;
  background-color: #ff5e00;
  border-color: #ff5e00;
}

.pagination-container .page-item a {
  text-decoration: none;
}

.heading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.heading_content {
    width: 50%;
}

.heading h2 {
    font-family: "Chakra Petch", sans-serif;
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

.list_products_container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    row-gap: 80px;

}

.box_sanpham {
    width: 280px;
    height: 300px;
    background-color: #fff7f1;
    border: 1px solid rgba(249, 173, 106, 0.6);
    color: var(--main-text-color);
    cursor: pointer;
    transition: 0.3s;
}

.sanpham_img {
    overflow: hidden;
    position: relative;
    width: 278px;
    height: 222px;
    border-bottom: 1px solid rgba(249, 173, 106, 0.6);
}

.sanpham_img p {
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

.sanpham_img img {
    width: 280px;
    height: 280px;
    transition: 0.3s;
}

.box_sanpham:hover img {
    scale: 1.12;
}
.box_sanpham:hover {
    scale: 1.05;
}
.sanpham_ten {
    display: flex;
    justify-content: center;
    text-align: center;
}

.sanpham_ten h2 {
    font-family: "Playfair Display";
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
    font-family: "Playfair Display";
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
    font-family: "Playfair Display";
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

/* Order List */
.order_list {
    position: fixed;
    top: 0;
    right: 0;
    width: 365px;
    height: 100%;
    background-color: #fff;
    z-index: 100;
    border-left: 1px solid #000000;
    margin-top: 60px;
}
.order_list header {
    line-height: 60px;
    height: 50px;
    padding-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--special-color);
    text-align: center;
}

.order_list header h1 {
    font-size: 22px;
    color: white;
    
}

.list_order, td, th {
    border: none;
    padding: 5px;
    font-weight: bold;
    cursor: pointer;
    font-size: 15px;
    }

.list_order tr{
    transition: 0.3s;
}

.list_order tr:not(:first-child):hover {
    background-color: #d4d6d7;
}


.list_order tr td a {
    color: #FE0000;
}

.list_order {
    width: 355px;
    margin-top: 20px;
    border-collapse: collapse;
    text-align: center;
}

.list_order a {
    color: black;
}

.menu_footer {
    position: fixed;
    bottom: 0;
    height: 27%;
    width: 355px;
    border-top: 1px solid black;
}

.list_order tr:first-child td:not(:last-child) {
    border-right: 1px solid black; /* Viền bên phải cho tất cả các ô trừ ô cuối cùng */
}

.order_detail {
  width: 370px;
  max-height: 58%;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
}

.footer_detail {
    font-size: 15px;
    width: 355px;

}

.footer_detail tr:first-child td:last-child {
    font-size: 20px;
}

.footer_detail tr:last-child td:last-child {
    font-size: 20px;
    color: #FF9800;
}


.thanhtoan {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}
.thanhtoan button {
    width: 300px;
    height: 50px;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    background-color: rgb(10, 128, 32);
    color: #fff;
    transition: 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
}

.thanhtoan a:hover {
    scale: 1.1;
}

.find_sp {
    width: 50%;
    display: flex;
    justify-content: center;
}

.find_sp form {
    width: 70%;
}

.find_sp .input_ttsp {
    width: 80%;
    height: 40px;
    font-size: 15px;
    font-weight: bold;
    border: 1px solid black;
    padding-left: 10px;
}

.btn_timkiem {
    width: 15%;
    height: 40px;
    padding: 10px;
    background-color: #ff5e00;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
}

.btn_del_product {
  background-color: #0da16d;
}

.btn_del_product button{
  background-color: #0da16d;
  color: #fff;
  font-weight: 700;
}


</style>