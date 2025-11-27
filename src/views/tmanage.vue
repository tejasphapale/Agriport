<template>
  <div class="transport-page">
    <!-- HEADER -->
    <header class="header">
      <div class="header-content">
        <h1>🚛 Transport Management</h1>
        <p>Discover and connect with reliable agricultural transport services near you</p>
      </div>
    </header>

    <!-- MAIN SECTION -->
    <main class="container">
      <h2 class="section-title">Available Transport Services</h2>

      <!-- GRID OF CARDS -->
      <div class="transport-grid">
        <div
          v-for="(transport, index) in transports"
          :key="index"
          class="transport-card"
        >
          <div class="card-header">
            <h3 class="transport-title">{{ transport.name }}</h3>
            <span class="capacity">{{ transport.capacity }}</span>
          </div>

          <div class="card-body">
            <p class="info">📍 <strong>Location:</strong> {{ transport.location }}</p>
            <p class="info">📞 <strong>Contact:</strong> {{ transport.contact }}</p>
          </div>

          <div class="card-footer">
            <a :href="'tel:' + transport.contact.replace(/\s+/g, '')" class="btn call-btn">
              📞 Call
            </a>
            <button class="btn map-btn" @click="viewOnMap(transport.location)">
              🗺️ View Map
            </button>
          </div>
        </div>
      </div>

      <!-- BACK BUTTON -->
      <router-link to="/" class="home-btn">🏠 Back to Home</router-link>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const transports = ref([
  {
    name: "Tractor Service - Ramesh",
    location: "Sangamner",
    contact: "+91 9876543210",
    capacity: "2 Tons",
  },
  {
    name: "Tempo Service - Shankar",
    location: "Akole",
    contact: "+91 9123456780",
    capacity: "1.5 Tons",
  },
  {
    name: "Truck Service - Mahesh",
    location: "Kopargaon",
    contact: "+91 9988776655",
    capacity: "10 Tons",
  },
  {
    name: "Mini Truck - Suresh",
    location: "Sangamner Rural",
    contact: "+91 9012345678",
    capacity: "3 Tons",
  },
  {
    name: "Tractor Service - Amit",
    location: "Rahata",
    contact: "+91 9823456789",
    capacity: "4 Tons",
  },
]);

const viewOnMap = (location) => {
  const query = encodeURIComponent(location);
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
};
</script>

<style scoped>
/* ===== Page Base ===== */
.transport-page {
  background: linear-gradient(180deg, #e8f5e9 0%, #f1f8e9 100%);
  color: #333;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  display: flex;
  flex-direction: column;
}

/* ===== Header ===== */
.header {
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  color: white;
  padding: 2.5rem 1rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
}
.header-content {
  max-width: 900px;
  margin: auto;
}
.header h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}
.header p {
  font-size: 1.1rem;
  opacity: 0.95;
}

/* ===== Container ===== */
.container {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

/* ===== Section Title ===== */
.section-title {
  text-align: center;
  color: #1b5e20;
  font-size: 1.9rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  position: relative;
}
.section-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: #43a047;
  border-radius: 2px;
}

/* ===== Responsive Grid ===== */
.transport-grid {
  display: grid;
  gap: 2rem;
  align-items: stretch;
}

/* 🖥️ Desktop: 3 or 4 per row */
@media (min-width: 1200px) {
  .transport-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 💻 Tablet Landscape: 3 per row */
@media (min-width: 992px) and (max-width: 1199px) {
  .transport-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 📱 Tablet Portrait: 2 per row */
@media (min-width: 600px) and (max-width: 991px) {
  .transport-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 📱 Mobile: 1 per row */
@media (max-width: 599px) {
  .transport-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Card Styling ===== */
.transport-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  border-top: 5px solid #66bb6a;
  cursor: pointer;
}
.transport-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

/* ===== Card Header ===== */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.transport-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2e7d32;
}
.capacity {
  background: #a5d6a7;
  color: #1b5e20;
  padding: 0.3rem 0.7rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* ===== Card Body ===== */
.card-body {
  margin-top: 0.8rem;
}
.info {
  font-size: 0.95rem;
  color: #444;
  margin: 0.4rem 0;
}

/* ===== Card Footer ===== */
.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn {
  flex: 1;
  text-align: center;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
  border: none;
  text-decoration: none;
}
.call-btn {
  background: #2e7d32;
  color: white;
  margin-right: 0.6rem;
}
.call-btn:hover {
  background: #1b5e20;
}
.map-btn {
  background: #c8e6c9;
  color: #1b5e20;
}
.map-btn:hover {
  background: #a5d6a7;
}

/* ===== Back Button ===== */
.home-btn {
  display: inline-block;
  text-align: center;
  margin-top: 3rem;
  padding: 0.9rem 1.7rem;
  background: #43a047;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: 0.3s;
  box-shadow: 0 4px 10px rgba(0, 128, 0, 0.3);
}
.home-btn:hover {
  background: #1b5e20;
  box-shadow: 0 6px 16px rgba(0, 128, 0, 0.4);
}
</style>
