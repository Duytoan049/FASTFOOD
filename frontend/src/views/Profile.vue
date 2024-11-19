<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('user')) || null,
      userInfo: {},
      orders: [],
      form: {
        name: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        avatar: ''
      },
      form_order: {
        order_Date: '',
        total_Price: '',
      }
    };
  },
  computed: {
    genderText() {
      return this.userInfo.gender === 1 ? 'Nam' : 'Nữ';
    }
  },
  async created() {
    if (!this.currentUser) {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
          withCredentials: true
        });
        if (response.status === 200 && response.data.user) {
          this.currentUser = response.data.user;
          localStorage.setItem('user', JSON.stringify(this.currentUser));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    this.getUserInfo();
    this.getOrderInfo();
  },
  methods: {
    formatDateTime(dateString) {
      return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
    },
    async getUserInfo() {
      if (this.currentUser) {
        try {
          const result = await axios.get(
            `http://localhost:3000/api/v1/customers/${this.currentUser.id}`,
            {
              withCredentials: true
            }
          );
          if (result.status === 200 && result.data.data.customer) {
            this.userInfo = result.data.data.customer;
            this.form = { ...this.userInfo }; // Đồng bộ dữ liệu
          }
        } catch (error) {
          console.error('Error fetching customer information:', error);
        }
      }
    },
    async updateProfile() {
      try {
        const result = await axios.put(
          `http://localhost:3000/api/v1/customers/${this.currentUser.id}`,
          this.form, // Sử dụng form để cập nhật
          {
            withCredentials: true
          }
        );
        if (result.status === 200) {
          this.userInfo = { ...this.form };
          alert('Thông tin đã được cập nhật thành công!');
        }
      } catch (error) {
        console.error('Error updating customer information:', error);
      }
    },
    async getOrderInfo() {
      if (this.currentUser) {
        try {
          const result = await axios.get(
            `http://localhost:3000/api/v1/cart/customers/${this.currentUser.id}`,
            { withCredentials: true }
          );
          if (result.status === 200 && result.data.data.order) {
            this.orders = result.data.data.order; // Gán dữ liệu vào `orders`
            console.log('Orders:', this.orders); // Kiểm tra log
          }
        } catch (error) {
          console.error('Error fetching order information:', error);
        }
      }
    },
    // Lấy chi tiết đơn hàng
    async getOrderDetail(orderId) {
      try {
        const result = await axios.get(
          `http://localhost:3000/api/v1/cart/${orderId}/details`,
          { withCredentials: true }
        );
        if (result.status === 200 && result.data.data.orderDetail) {
          this.selectedOrderDetail = result.data.data.orderDetail;
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }
  }
};
</script>


<template>
  <section class="profile">
    <div class="heading">
      <h1>THÔNG TIN CÁ NHÂN</h1>
    </div>

    <div class="profile_container">
      <div class="profile_detail">
        <div class="profile_info">
          <div class="info-row">
            <label for="customerName">Tên: </label>
            <br />
            <input v-model="form.name" />
          </div>
          <div class="info-row">
            <label>Email: </label>
            <br />
            <input v-model="form.email" />
          </div>
          <div class="info-row">
            <label>Số điện thoại: </label>
            <br />
            <input v-model="form.phone" />
          </div>
          <div class="info-row">
            <label>Địa chỉ: </label>
            <br />
            <input v-model="form.address" />
          </div>
          <div class="info-row">
            <label>Giới tính: </label>
            <br />
            <select v-model="form.gender">
              <option :value="1">Nam</option>
              <option :value="0">Nữ</option>
            </select>
          </div>

          <div class="profile_btn">
            <button class="button-1" role="button" @click="updateProfile()">
              Cập nhật
            </button>
          </div>
        </div>
        <div class="profile_img">
          <img :src="form.avatar" alt="User Avatar" />
        </div>
      </div>
    </div>
  </section>

    <section class="profile">
    <div class="heading">
      <h1>THÔNG TIN ĐƠN HÀNG</h1>
    </div>

    <div class="profile_container">
      <div class="profile_detail">
        <div class="profile_info">
          <ul class="list-group">
            <li
              class="list-group-item px-3"
              v-for="(order, index) in orders" 
              :key="order.order_Id"
              @click="showOrderDetail(order)"
            >
              Ngày đặt: {{ formatDateTime(order.order_Date) }} - <strong>Tổng giá: {{ order.total_Price.toLocaleString('vi-VN') }} VND</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>


<style scope>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  border: none;
  outline: none;
  box-sizing: border-box;
  font-family: 'Chakra Petch', sans-serif;
  max-width: 100vw;
}

.profile {
  padding: 70px 10px 70px 10px;
}

.profile .heading {
  color: #25b68a;
}

.profile .heading h1 {
  font-weight: 800;
  text-decoration: underline;
}

.profile_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile_detail {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  padding: 30px;
  border: 1px #25b68a solid;
  border-radius: 30px;
  margin-top: 20px;
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

.profile_img img {
  width: 300px;
  height: 300px;
}

.profile_img {
  flex: 0.7;
  display: flex;
  justify-content: center;
  align-items: center;
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
