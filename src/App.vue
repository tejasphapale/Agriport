<template>
  <div :class="[{ dark: themeMode === 'dark' }, 'app-container']">
    <!-- 🌿 Navbar -->
    <nav v-if="!isLoginPage" class="navbar">
      <div class="nav-left">
        <router-link to="/transport" class="nav-link">🚛 वाहतूक</router-link>
        <router-link to="/crop" class="nav-link">🌾 पिके</router-link>
        <router-link to="/lightsensor" class="nav-link">💳 पेमेंट</router-link>
      </div>
      <div class="nav-right">
        <button @click.stop="toggleSidebar" class="menu-btn">☰ मेनू</button>
      </div>
    </nav>

    <!-- 🌿 Overlay -->
    <transition name="fade">
      <div v-if="showSidebar" class="overlay" @click="closeSidebar"></div>
    </transition>

    <!-- 🌿 Sidebar -->
    <transition name="slide">
      <aside v-if="showSidebar" class="sidebar">
        <!-- 🌿 Profile Header -->
        <div class="profile-header">
          <img
            :src="user.profilePhoto || defaultProfile"
            alt="Profile"
            class="profile-pic"
          />
          <h3 class="profile-name">{{ user.fullname || "अतिथी वापरकर्ता" }}</h3>
          <p class="profile-role">
            🚛 {{ user.transportName || "कोणतीही वाहतूक नियुक्त नाही" }}
          </p>
        </div>

        <!-- 🌿 Sidebar Content -->
        <div class="sidebar-content">
          <!-- Profile Edit -->
          <div v-if="activeSection === 'profile'" class="profile-section">
            <h3 class="section-title">👤 प्रोफाइल संपादित करा</h3>
            <div class="form-container">
              <div class="form-group">
                <label><i class="icon">🧑</i> पूर्ण नाव</label>
                <input v-model="user.fullname" placeholder="पूर्ण नाव प्रविष्ट करा" />
              </div>
              <div class="form-group">
                <label><i class="icon">🚛</i> वाहतूक नाव</label>
                <input v-model="user.transportName" placeholder="वाहतूक नाव प्रविष्ट करा" />
              </div>
              <div class="form-group upload-section">
                <label><i class="icon">📸</i> प्रोफाइल फोटो</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  @change="onImageUpload"
                  class="file-input"
                />
                <img v-if="user.profilePhoto" :src="user.profilePhoto" class="preview-photo" />
              </div>
              <button class="save-btn" @click="saveProfile">💾 प्रोफाइल जतन करा</button>
            </div>
          </div>

          <!-- Language -->
          <div v-else-if="activeSection === 'language'">
            <h3 class="section-title">🌐 भाषा निवडा</h3>
            <select v-model="selectedLanguage" @change="saveLanguage">
              <option value="English">English</option>
              <option value="Marathi">मराठी</option>
              <option value="Hindi">हिंदी</option>
            </select>
          </div>

          <!-- Settings -->
          <div v-else-if="activeSection === 'settings'">
            <h3 class="section-title">⚙️ अॅप सेटिंग्ज</h3>
            <div class="form-container">
              <div class="form-group">
                <label><i class="icon">🎨</i> थीम</label>
                <select v-model="themeMode">
                  <option value="light">🌞 लाइट मोड</option>
                  <option value="dark">🌙 डार्क मोड</option>
                  <option value="system">🖥️ सिस्टम डिफॉल्ट</option>
                </select>
              </div>
              <div class="form-group">
                <label><i class="icon">🔔</i> सूचना</label>
                <div class="checkbox-group">
                  <label><input type="checkbox" v-model="notifications.app" /> अॅप अलर्ट्स</label>
                  <label><input type="checkbox" v-model="notifications.email" /> ईमेल अपडेट्स</label>
                  <label><input type="checkbox" v-model="notifications.sms" /> SMS अलर्ट्स</label>
                </div>
              </div>
              <div class="form-group">
                <label><i class="icon">🌐</i> चालू भाषा</label>
                <p class="info-text">आपण वापरत आहात: <b>{{ selectedLanguage }}</b></p>
              </div>
              <button class="back-btn" @click="resetSettings">♻️ डीफॉल्टवर रीसेट करा</button>
              <button class="save-btn" @click="saveSettings">✅ सेटिंग्ज जतन करा</button>
            </div>
          </div>

          <!-- Help -->
          <div v-else-if="activeSection === 'help'">
            <h3 class="section-title">❓ मदत आणि समर्थन</h3>
            <div class="help-container">
              <p><b>📞 फोन:</b> +91-9999999999</p>
              <p><b>📧 ईमेल:</b> support@agriport.com</p>
              <p><b>🕒 वेळा:</b> 9:00 AM – 7:00 PM (सोम–साल)</p>
              <hr />
              <button class="save-btn" @click="contactWhatsApp">💬 WhatsApp वर चॅट करा</button>
              <button class="back-btn" @click="reportIssue">🐞 समस्या नोंदवा</button>
              <div class="help-links">
                <a href="https://agriport.com/faqs" target="_blank">📖 FAQs</a>
                <a href="https://agriport.com/user-guide" target="_blank">🧭 वापरकर्ता मार्गदर्शक</a>
              </div>
            </div>
          </div>

          <!-- Main Menu -->
          <ul v-else class="menu-list">
            <li @click="goTo('/home')">🏠 मुख्यपृष्ठ</li>
            <li @click="goTo('/about')">ℹ️ माहिती</li>
            <li @click="openSection('profile')">🧑‍🔧 प्रोफाइल संपादित करा</li>
            <li @click="openSection('language')">🌐 भाषा निवडा</li>
            <li @click="openSection('settings')">⚙️ सेटिंग्ज</li>
            <li @click="openSection('help')">❓ मदत</li>
          </ul>

          <button v-if="activeSection" class="back-btn" @click="activeSection = null">⬅ मागे</button>
        </div>

        <!-- Logout -->
        <div class="sidebar-actions">
          <button class="logout-btn" @click="logout">🚪 लॉगआउट</button>
        </div>
      </aside>
    </transition>

    <!-- 🌿 Page content -->
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const showSidebar = ref(false);
const activeSection = ref(null);
const selectedLanguage = ref("English");
const themeMode = ref("light");
const notifications = ref({ app: true, email: false, sms: false });

const defaultProfile = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const user = ref({ fullname: "", transportName: "", profilePhoto: "" });

const isLoginPage = computed(() => route.path === "/");

/* Sidebar Controls */
function toggleSidebar() { showSidebar.value = !showSidebar.value; }
function closeSidebar() { showSidebar.value = false; }
function goTo(path) { router.push(path); closeSidebar(); }
function openSection(section) { activeSection.value = section; }

/* Load user data */
onMounted(() => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) user.value = loggedInUser;

  const storedSettings = JSON.parse(localStorage.getItem("userSettings"));
  if (storedSettings) {
    themeMode.value = storedSettings.themeMode || "light";
    notifications.value = storedSettings.notifications || notifications.value;
  }

  const lang = localStorage.getItem("appLanguage");
  if (lang) selectedLanguage.value = lang;
});

/* Image Upload */
function onImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      user.value.profilePhoto = reader.result;
      localStorage.setItem("loggedInUser", JSON.stringify(user.value));
    };
    reader.readAsDataURL(file);
  }
}

/* Save Profile */
function saveProfile() {
  localStorage.setItem("loggedInUser", JSON.stringify(user.value));
  alert("✅ Profile updated successfully!");
}

/* Save Language */
function saveLanguage() {
  localStorage.setItem("appLanguage", selectedLanguage.value);
  alert(`🌐 Language changed to ${selectedLanguage.value}`);
}

/* Save & Reset Settings */
function saveSettings() {
  localStorage.setItem("userSettings", JSON.stringify({ themeMode: themeMode.value, notifications: notifications.value }));
  alert("⚙️ Settings saved successfully!");
}
function resetSettings() {
  themeMode.value = "light";
  notifications.value = { app: true, email: false, sms: false };
  alert("🔄 Settings reset to default!");
}

/* Help Options */
function contactWhatsApp() {
  const msg = encodeURIComponent("Hello, I need help with AgriPort Transport App.");
  window.open(`https://wa.me/919999999999?text=${msg}`, "_blank");
}
function reportIssue() {
  window.location.href = "mailto:support@agriport.com?subject=AgriPort%20App%20Issue";
}

/* Logout */
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("👋 Logged out successfully!");
  router.push("/");
  showSidebar.value = false;
}

/* Theme Watcher */
watch(themeMode, (newVal) => {
  document.body.classList.toggle("dark", newVal === "dark");
});
</script>

<style scoped>
/* NAVBAR */
.navbar { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg,#2e7d32,#66bb6a); padding:1rem 2rem; color:#fff; position:sticky; top:0; z-index:1000;}
.nav-link { margin-right:1rem; color:#fff; text-decoration:none; font-weight:600;}
.menu-btn { background:#fff; color:#2e7d32; border:none; padding:0.6rem 1rem; border-radius:8px; font-weight:bold; cursor:pointer;}

/* OVERLAY */
.overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.45); z-index:2000;}

/* SIDEBAR */
.sidebar { position:fixed; top:0; left:0; height:100%; width:320px; background:#f9fff7; box-shadow:4px 0 15px rgba(0,0,0,0.3); z-index:3000; padding:1.5rem; overflow-y:auto; border-radius:0 12px 12px 0;}
.profile-header { text-align:center; border-bottom:1px solid #c8e6c9; padding-bottom:1rem; margin-bottom:1rem;}
.profile-pic { width:90px; height:90px; border-radius:50%; border:3px solid #66bb6a; margin-bottom:10px; object-fit:cover;}
.profile-name { color:#2e7d32; font-weight:700;}
.profile-role { color:#555;}

/* FORM */
.form-container { display:flex; flex-direction:column; gap:1rem;}
.form-group { display:flex; flex-direction:column;}
label { font-weight:600; color:#2e7d32; margin-bottom:5px;}
input, select { border:2px solid #c8e6c9; border-radius:8px; padding:8px; font-size:1rem; transition:border 0.3s;}
input:focus, select:focus { border-color:#43a047; outline:none;}
.checkbox-group { display:flex; flex-direction:column; gap:5px;}
.info-text { background:#f1f8e9; padding:8px; border-radius:6px; color:#333;}

/* BUTTONS */
.save-btn, .back-btn, .logout-btn { width:100%; padding:10px; border:none; border-radius:8px; margin-top:10px; font-weight:600; cursor:pointer;}
.save-btn { background:#43a047; color:#fff;}
.save-btn:hover { background:#2e7d32;}
.back-btn { background:#e0f2f1; color:#2e7d32;}
.logout-btn { background:#e53935; color:white;}
.logout-btn:hover { background:#c62828;}

/* MENU */
.menu-list { list-style:none; padding:0;}
.menu-list li { background:#e8f5e9; padding:12px 16px; margin-bottom:10px; border-radius:8px; cursor:pointer; transition:background 0.2s;}
.menu-list li:hover { background:#c8e6c9;}

/* HELP LINKS */
.help-container { display:flex; flex-direction:column; gap:10px;}
.help-links { margin-top:10px; display:flex; flex-direction:column; gap:6px;}
.help-links a { color:#2e7d32; text-decoration:none; font-weight:600;}
.help-links a:hover { text-decoration:underline;}

/* DARK MODE */
.dark { background-color:#121212; color:#eee;}
.dark .navbar { background:linear-gradient(90deg,#1b5e20,#4caf50);}
.dark .sidebar { background:#1e1e1e; color:#ddd;}

/* TRANSITIONS */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity:0; }
.slide-enter-active { animation: slideIn 0.4s ease; }
.slide-leave-active { animation: slideOut 0.3s ease forwards; }
@keyframes slideIn { from { transform:translateX(-100%);} to {transform:translateX(0);} }
@keyframes slideOut { from {transform:translateX(0);} to {transform:translateX(-100%);} }
</style>
