<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('user')) || null // Lấy thông tin người dùng từ localStorage nếu có
    };
  },
  async created() {
    if (!this.currentUser) {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/profile', {
          withCredentials: true
        });
        if (response.status === 200 && response.data.user) {
          this.currentUser = response.data.user;
          localStorage.setItem('user', JSON.stringify(this.currentUser)); // Lưu vào localStorage nếu chưa có
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  },
  methods: {
    async logout() {
      try {
        // Gửi yêu cầu đăng xuất đến backend
        await axios.post(
          'http://localhost:3000/api/v1/users/logout',
          {},
          {
            withCredentials: true
          }
        );

        // Xóa thông tin người dùng khỏi localStorage
        this.currentUser = null;
        localStorage.removeItem('user');

        // Chuyển hướng người dùng đến trang chủ
        this.$router.push({ name: 'homepage' });
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  }
};
</script>

<template>
  <header class="nav_bar">
    <div class="nav_menu">
      <div class="nav_logo">
        <router-link
          :to="{ name: 'homepage' }"
          class="nav_link"
        >
          <img
            src="/images/logo-fast-food.png"
            alt=""
          />
          <span> Fast Food</span>
        </router-link>
      </div>
      <nav class="nav_content">
        <router-link
          :to="{ name: 'homepage' }"
          class="nav_link"
          >TRANG CHỦ</router-link
        >
        <router-link
          :to="{ name: 'menu' }"
          class="nav_link"
          >MENU</router-link
        >
        <!-- <router-link
          :to="{ name: 'homepage' }"
          class="nav_link"
          >ABOUT</router-link
        > -->
      </nav>
      <div class="nav_btn">
        <!-- Kiểm tra nếu currentUser có giá trị, hiển thị thông tin người dùng -->
        <div
          v-if="currentUser"
          class="nav_btn"
        >
          <div v-if="currentUser.user_role == 0">
            <router-link
              :to="{ name: 'profile' }"
              class="nav_link username-hover"
            >
              <span>{{ currentUser.username }}</span>
            </router-link>
          </div>
          <div v-else>
            <router-link
              :to="{ name: 'productadmin' }"
              class="nav_link username-hover"
            >
              <span>{{ currentUser.username }}</span>
            </router-link>
          </div>
          <i
            class="fas fa-sign-out-alt"
            @click="logout"
          ></i>
        </div>
        <!-- Nếu currentUser không có giá trị, hiển thị nút đăng nhập và đăng ký -->
        <div v-else>
          <router-link :to="{ name: 'login' }"
            ><button class="login">Đăng nhập</button></router-link
          >
          <router-link :to="{ name: 'signup' }"
            ><button class="signup">Đăng ký</button></router-link
          >
        </div>
      </div>
    </div>
  </header>
</template>

<style>
.nav_bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  padding: 5px 15px;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  text-decoration: none;
}
.nav_user {
  position: flex;
  flex-direction: column;
}
.nav_menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav_logo a {
  color: var(--text-color);
  font-size: 35px;
  font-weight: 600;
  text-decoration: none;
}

.nav_logo img {
  width: 30px;
  height: 30px;
}

.nav_logo span {
  font-family: 'Advertising Script', sans-serif;
  font-size: 25px;
  line-height: 40px;
  text-decoration: none;
}

.nav_content a {
  list-style: none;
  display: inline-block;
  color: var(--text-color);
  font-size: 18px;
  font-weight: bold;
  margin: 0 25px;
  text-decoration: none;
}

.nav_btn {
  display: flex;
  justify-content: center;
}

.username-hover {
  text-decoration: none;
  color: white;
  transition: color 0.3s;
}

.username-hover:hover {
  color: var(--special-color);
}

.nav_btn .login {
  background-color: var(--special-color);
  border-radius: 0.65rem;
  width: 100px;
  height: 40px;
  margin-left: 0.65rem;
  cursor: pointer;
  color: var(--text-color);
  font-weight: bold;
  transition: 0.3s;
}

.nav_btn .login:hover {
  scale: 1.1;
}

.nav_btn .signup {
  border: 2px solid var(--special-color);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0.65rem;
  width: 100px;
  height: 40px;
  margin-left: 0.65rem;
  margin-top: 0;
  cursor: pointer;
  color: var(--text-color);
  font-weight: bold;
  transition: 0.3s;
}

.nav_btn .signup:hover {
  background-color: var(--special-color);
}

.fa-bag-shopping {
  color: var(--text-color);
  width: 100%;
  height: 100%;
  font-size: 30px;
  padding: 4px;
  cursor: pointer;
}

.nav_content a {
  position: relative;
  padding: 10px;
  border-radius: 5px;
}

.nav_content a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 3px;
  background-color: var(--special-color);
  transition: width 0.3s ease-in-out;
}

.nav_content a.active::after,
.nav_content a:hover::after {
  width: 100%;
}

.fa-sign-out-alt {
  color: #63e6be;
  padding-left: 20px;
  font-size: 20px;
  cursor: pointer;
  transform: 0.5s;
}

.fa-sign-out-alt:hover {
  scale: 1.1;
}
</style>
