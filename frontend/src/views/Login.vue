<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async Login() {
      if (!this.form.username || !this.form.password) {
        alert('Please fill in all fields');
        return;
      }

      let userInfo = {
        username: this.form.username,
        password: this.form.password
      };

      try {
        let result = await axios.post('http://localhost:3000/api/v1/users/login', userInfo, {
          withCredentials: true
        });
        if (result.status === 200 || result.status === 201) {
          console.log('User login successfully!', result.data);
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem('user', JSON.stringify(result.data.user));
          // Chuyển hướng đến trang chủ
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error during login', error);
      }
    }
  }
};
</script>

<template>
  <div class="frame1">
    <div class="login_index">
      <div class="img_index">
        <img
          src="/images/home/home.png"
          alt="Banner"
        />
      </div>
      <div class="right_login">
        <div class="text_header">
          <h1>Hello</h1>
          <p>We are very happy to see all you</p>
        </div>
        <div class="input_login">
          <div class="username">
            <input
              type="text"
              placeholder=" "
              name="username"
              v-model="form.username"
            />
            <label>Username</label>
          </div>
          <div class="password">
            <input
              type="password"
              placeholder=" "
              name="password"
              v-model="form.password"
            />
            <label>Password</label>
          </div>
          <button @click="Login()">Login</button>
        </div>
        <div class="signup">
          <p>Don't have account? <router-link :to="{ name: 'signup' }">Signup</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@100..700&family=Noto+Sans+TC:wght@387&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Rock+Salt&family=Sedgwick+Ave+Display&family=Titan+One&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');

/* body {
  background: #ececec;
  font-family: 'Chakra Petch', sans-serif;
  font-weight: 300;
  font-style: normal;
} */
.frame1 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_index {
  width: 830px;
  height: 500px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 10px grey;
  border-radius: 15px;
  background: white;
}
.login_index img {
  flex: 1;
  width: 500px;
  border-radius: 15px;
  background-color: lightgrey;
}
.frame1 button {
  width: 90%;
  margin-top: 30px;
  height: 35px;
  background-color: lightgray;
  border: none;
  border-radius: 7px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}
.frame1 button:hover {
  transform: scale(1.05);
}
.right_login {
  padding-bottom: 50px;
  width: 280px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
}
.text_header {
  margin-bottom: 20;
}
.input_login {
  display: flex;
  flex-direction: column;
}
.login_index input {
  width: 85%;
  margin-top: 20px;
  height: 30px;
  background: light;
  border-color: lightgray;
  border-radius: 7px;
  padding-left: 10px;
  border: 1px solid black;
}
.login_button {
  width: 90%;
  margin-top: 30px;
  height: 35px;
  background-color: lightgray;
  border: none;
  border-radius: 7px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}
.login_button:hover {
  transform: scale(1.05);
}
.signup {
  margin-top: 10px;
}
.login_index a {
  color: blue;
  text-decoration: none;
}
.login_index a:hover {
  text-decoration: underline;
}
.login_index label {
  color: black;
  position: absolute;
  top: 25px;
  left: 10px;
}
.fullname,
.username,
.password,
.password2 {
  position: relative;
}
.login_index input:focus ~ label,
input:not(:placeholder-shown) ~ label {
  top: 0px;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
}
</style>
