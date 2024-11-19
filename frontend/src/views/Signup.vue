<script>
import { useRouter, useRoute } from 'vue-router';
import userServices from '@/services/user.services';
export default {
  data() {
    return {
      form: {
        name: '',
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async Signup() {
      if (this.form.password !== this.form.password2) {
        alert('Passwords do not match!');
        return;
      }

      if (!this.form.username || !this.form.password) {
        alert('Please fill in all fields.');
        return;
      }

      let userInfo = {
        name: this.form.name,
        username: this.form.username,
        password: this.form.password
      };

      try {
        let result = await userServices.createUser(userInfo);
        console.log(result);
        if (result) {
          alert('Signup successfully!');
        }
      } catch (error) {
        console.error('Error during signup', error);
      }
    }
  }
};
</script>
<template>
  <div class="frame2">
    <div class="signup_index">
      <div class="img_index">
        <img
          src="\images\banner_login.png"
          alt=""
        />
      </div>
      <div class="right_login">
        <div class="text_header">
          <h1>Sign up</h1>
          <p>We are very happy to see all you</p>
        </div>
        <div class="input_login">
          <div class="fullname">
            <input
              type="text"
              placeholder=" "
              name="fullname"
              v-model="form.name"
            />
            <label>Full name</label>
          </div>
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
          <div class="password2">
            <input
              type="password"
              placeholder=" "
              name="password2"
              v-model="form.password2"
            />
            <label>Password again</label>
          </div>
          <button @click="Signup()">Sign up</button>
        </div>
        <div class="signup">
          <p>Already have account?<router-link :to="{ name: 'login' }">Login</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@100..700&family=Noto+Sans+TC:wght@387&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Rock+Salt&family=Sedgwick+Ave+Display&family=Titan+One&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
/* 
body {
  background: #ececec;
  font-family: 'Chakra Petch', sans-serif;
  font-weight: 300;
  font-style: normal;
} */
.frame2 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.signup_index {
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
.frame2 img {
  width: 500px;
  border-radius: 15px;
  background-color: lightgrey;
}
.right_login {
  padding-top: 50px;
  padding-bottom: 30px;
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
.frame2 input {
  width: 85%;
  margin-top: 20px;
  height: 30px;
  background: light;
  border-color: lightgray;
  border-radius: 7px;
  padding-left: 10px;
  border: 1px solid black;
}
.frame2 button {
  width: 90%;
  margin-top: 30px;
  height: 35px;
  background-color: lightgray;
  border: none;
  border-radius: 7px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}
.frame2 button:hover {
  transform: scale(1.05);
}
.signup {
  margin-top: 10px;
}
.frame2 a {
  color: blue;
  text-decoration: none;
}
.frame2 a:hover {
  text-decoration: underline;
}
.frame2 label {
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
.frame2 input:focus ~ label,
input:not(:placeholder-shown) ~ label {
  top: 0px;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
}
</style>
