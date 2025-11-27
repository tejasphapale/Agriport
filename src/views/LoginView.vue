<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="title">{{ isSignup ? 'Create Account 🌾' : 'Welcome 🚜' }}</h1>
      <p class="subtitle">
        {{ isSignup
          ? 'Register to manage your transport & crops easily.'
          : 'Login to continue to AgriPort.' }}
      </p>

      <form @submit.prevent="handleSubmit">
        <!-- Signup Fields -->
        <div v-if="isSignup" class="input-group">
          <input v-model.trim="fullname" type="text" placeholder="Full Name" required />
        </div>

        <div v-if="isSignup" class="input-group">
          <input v-model.trim="mobile" type="tel" placeholder="Mobile Number" required />
        </div>

        <div v-if="isSignup" class="input-group">
          <input v-model.trim="transportName" type="text" placeholder="Transport Name" required />
        </div>

        <div v-if="isSignup" class="input-group">
          <input v-model.trim="email" type="email" placeholder="Email" required />
        </div>

        <!-- Common Fields -->
        <div class="input-group">
          <input v-model.trim="username" type="text" placeholder="Username" required />
        </div>

        <div class="input-group">
          <input v-model.trim="password" type="password" placeholder="Password" required />
        </div>

        <button class="action-btn" type="submit">
          {{ isSignup ? 'Sign Up' : 'Login' }}
        </button>
      </form>

      <p class="toggle-text">
        {{ isSignup ? 'Already have an account?' : 'New user?' }}
        <a href="#" @click.prevent="toggleMode">
          {{ isSignup ? 'Login here' : 'Sign up here' }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const isSignup = ref(false);
const fullname = ref("");
const mobile = ref("");
const transportName = ref("");
const email = ref("");
const username = ref("");
const password = ref("");
const router = useRouter();

function toggleMode() {
  isSignup.value = !isSignup.value;
  fullname.value = "";
  mobile.value = "";
  transportName.value = "";
  email.value = "";
  username.value = "";
  password.value = "";
}

function handleSubmit() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (isSignup.value) {
    // Prevent duplicate username
    if (users.some((u) => u.username === username.value)) {
      alert("⚠️ Username already exists! Please use another.");
      return;
    }

    // Save new user
    const newUser = {
      fullname: fullname.value,
      mobile: mobile.value,
      transportName: transportName.value,
      email: email.value,
      username: username.value,
      password: password.value,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ Signup successful! Please login now.");
    toggleMode();
  } else {
    // Login check
    const found = users.find(
      (u) => u.username === username.value && u.password === password.value
    );

    if (found) {
      localStorage.setItem("loggedInUser", JSON.stringify(found));
      alert(`🌾 Welcome back, ${found.fullname}!`);
      router.push("/home");
    } else {
      alert("❌ Invalid username or password.");
    }
  }
}
</script>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #b2f7ef, #a0e4b0, #9be15d, #00c9a7);
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
  font-family: 'Poppins', sans-serif;
}

.auth-card {
  background: rgba(255, 255, 255, 0.25);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 370px;
  text-align: center;
  backdrop-filter: blur(20px);
  transition: transform 0.3s ease;
}
.auth-card:hover {
  transform: translateY(-6px);
}

.title {
  color: #1b5e20;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #333;
  margin-bottom: 1.8rem;
  font-size: 0.95rem;
}

.input-group {
  margin-bottom: 1.2rem;
}
input {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}
input:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
}

.action-btn {
  background: linear-gradient(135deg, #43a047, #1b5e20);
  color: white;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: 0.3s;
}
.action-btn:hover {
  transform: scale(1.03);
  background: linear-gradient(135deg, #2e7d32, #004d40);
}

.toggle-text {
  margin-top: 1.5rem;
  color: #333;
  font-size: 0.9rem;
}
.toggle-text a {
  color: #1b5e20;
  font-weight: bold;
  text-decoration: none;
}
.toggle-text a:hover {
  text-decoration: underline;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
