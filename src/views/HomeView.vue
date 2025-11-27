<template>
  <div class="page">

    <!-- 🕒 Greeting + Weather -->
    <section class="greeting-bar fade-in">
      <div class="greeting-container">

        <div class="greeting-left">
          <h2 class="greeting-title">{{ greetingMessage }}</h2>
          <p class="time-text">{{ currentTime }}</p>
        </div>

        <div class="weather-section" v-if="weather">
          <img class="weather-icon" :src="weather.icon" />
          <div class="weather-details">
            <p class="weather-location">{{ weather.location }}</p>
            <p class="weather-temp">{{ weather.temp }}°C</p>
            <p class="weather-condition">{{ weather.condition }}</p>
          </div>
        </div>

      </div>
    </section>

    <!-- 🌾 HERO SECTION (Beautiful Agri-Transport BG) -->
    <section class="hero-card fade-in-up">
      <div class="hero-bg"></div>

      <div class="overlay">
        <h1 class="hero-title">🌾 कृषी वाहतूक प्रणाली</h1>
        <p class="hero-tagline">{{ greetingTagline }}</p>

        <router-link to="/transport" class="cta-button">
          🚜 वाहतूक पृष्ठाकडे जा →
        </router-link>
      </div>
    </section>

    <!-- 🚛 Features -->
    <section class="features fade-in-up">
      <router-link to="/tmanage" class="feature-card-link">
        <div class="feature-card">
          <h3>🚛 वाहतूक व्यवस्थापन</h3>
          <p>शेतकऱ्यांसाठी वाहतूक नोंदी सहज जोडा, पहा आणि फिल्टर करा.</p>
        </div>
      </router-link>

      <div class="feature-card">
        <h3>📊 अहवाल आणि माहिती</h3>
        <p>दैनंदिन, साप्ताहिक आणि वार्षिक वाहतूक अहवाल तयार करा.</p>
      </div>

      <div class="feature-card">
        <h3>💾 सुरक्षित डेटा</h3>
        <p>नोंदी सुरक्षितपणे जतन केल्या जातात आणि कधीही पाहता येतात.</p>
      </div>
    </section>

    <!-- About -->
    <section class="about fade-in-up">
      <h2>कृषी वाहतूक प्रणाली बद्दल</h2>
      <p>ही प्रणाली शेतकरी आणि वाहतूक व्यवस्थापकांसाठी लॉजिस्टिक व्यवस्थापन सुलभ करते.</p>
    </section>

    <section class="external-link-card fade-in-up">
      <h2>🌐 आणखी एक्सप्लोर करा</h2>
      <p>आमचा संबंधित प्रकल्प <b>AgriHydrox</b> देखील पाहू शकता.</p>
      <a
        href="https://tejasphapale.github.io/AgriHdrox/"
        target="_blank"
        class="visit-link"
      >
        🔗 AgriHydrox पहा
      </a>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

/* ===== TIME & WEATHER ===== */
const greetingMessage = ref("");
const greetingTagline = ref("");
const currentTime = ref("");
const weather = ref(null);

/* ===== GREETING ===== */
const updateGreeting = () => {
  const now = new Date();
  const hours = now.getHours();

  currentTime.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  if (hours < 12) {
    greetingMessage.value = "🌞 शुभ सकाळ!";
    greetingTagline.value = "ताज्या पिकांच्या वाहतुकीचे निरीक्षण सुरू करा.";
  } else if (hours < 17) {
    greetingMessage.value = "☀️ शुभ दुपार!";
    greetingTagline.value = "दैनिक वाहतूक प्रभावीपणे व्यवस्थापित करा.";
  } else if (hours < 20) {
    greetingMessage.value = "🌇 शुभ संध्याकाळ!";
    greetingTagline.value = "आजच्या वाहतूक क्रियाकलापांचे पुनरावलोकन करा.";
  } else {
    greetingMessage.value = "🌙 शुभ रात्री!";
    greetingTagline.value = "आजचे अहवाल पाहा.";
  }
};

/* ===== WEATHER API ===== */
const fetchWeather = async () => {
  try {
    const lat = 19.57;
    const lon = 74.21;

    const resp = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    const data = await resp.json();
    if (!data.current_weather) return;

    const w = data.current_weather;

    const map = {
      0: "स्वच्छ आकाश",
      1: "मुख्यतः स्वच्छ",
      2: "अर्धसे ढगाळ",
      3: "पूर्ण ढगाळ",
      61: "हलका पाऊस",
      63: "पाऊस",
      65: "जोरदार पाऊस",
    };

    weather.value = {
      location: "सांगमनेर",
      temp: w.temperature,
      condition: map[w.weathercode] || "ढगाळ",
      icon: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    };
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  updateGreeting();
  setInterval(updateGreeting, 60000);
  fetchWeather();
});
</script>

<style scoped>
.page {
  font-family: 'Poppins', sans-serif;
  background: #f4fbe9;
  padding: 1rem 0.5rem;
}

/* ====================== GREETING BAR ====================== */
.greeting-bar {
  padding: 25px 20px;
}

.greeting-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.greeting-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
}

.time-text {
  font-size: 15px;
  color: #555;
}

.weather-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-icon {
  width: 48px;
  height: 48px;
}

/* ====================== HERO BG (PERFECT AGRI TRANSPORT) ====================== */
.hero-card {
  position: relative;
  height: 420px;
  border-radius: 14px;
  overflow: hidden;
  margin: 0 auto 3rem;
  max-width: 1200px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
}

.hero-bg {
  background-image: url("src/assets/agri.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: auto;       /* ensures HD clarity */
  width: 100%;
  height: 100%;
}


.overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.45);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3rem;
  text-shadow: 2px 2px 10px black;
}

.hero-tagline {
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.cta-button {
  padding: 1rem 2.5rem;
  background: linear-gradient(90deg, #43a047, #2e7d32);
  color: white;
  border-radius: 8px;
  text-decoration: none;
}

/* ====================== FEATURES GRID ====================== */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;  /* increased spacing between cards */
  margin-bottom: 3rem; /* extra space below grid */
  padding: 0 1.5rem;   /* horizontal padding */
}

/* ====================== FEATURE CARDS ====================== */
.feature-card {
  background: white;
  padding: 2.5rem 2rem;      /* more padding for content */
  border-radius: 16px;       /* slightly more rounded */
  text-align: center;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15); /* deeper shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.2); /* hover shadow */
}

/* ====================== ABOUT & EXTERNAL LINK CARDS ====================== */
.about,
.external-link-card {
  background: white;
  padding: 3.5rem 2.5rem;       /* slightly more spacious */
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12); /* deeper subtle shadow */
  margin-bottom: 3.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about:hover,
.external-link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 40px rgba(0,0,0,0.18); /* hover shadow */
}

/* ====================== VISIT LINK BUTTON ====================== */
.visit-link {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: #2e7d32;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.visit-link:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

/* ====================== RESPONSIVE ADJUSTMENTS ====================== */
@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr; /* single column on mobile */
  }
  .hero-card {
    height: 350px;
  }
  .about,
  .external-link-card {
    padding: 2.5rem 1.5rem;
  }
}

</style>
