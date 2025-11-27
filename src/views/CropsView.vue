<template>
  <div class="page">
<header class="page-header">
  <h1>🌾 पीक माहिती</h1>
  <p>वेगवेगळ्या पिकांची माहिती आणि त्यांचे तपशील जाणून घ्या.</p>
</header>

<!-- माहिती + लिंक सेक्शन -->
<div class="link-container">
  <h2>AgriHydrox बद्दल</h2>
  <p>
    AgriHydrox ही एक आधुनिक प्लॅटफॉर्म आहे जी शेतकऱ्यांना त्यांच्या 
    वाहतूक नोंदी, पीक तपशील आणि पेमेंट्स प्रभावीपणे व्यवस्थापित करण्यात मदत करते.  
    खाली दिलेला लाइव डेमो पाहा:
  </p>
  <a 
    href="https://tejasphapale.github.io/AgriHdrox/" 
    target="_blank" 
    class="visit-link">
    🔗 AgriHydrox भेट द्या
  </a>
</div>

    <div class="container">
      <div v-for="crop in crops" :key="crop.id" class="crop-card">
        <img :src="crop.image" :alt="crop.name" />
        <div class="crop-info">
          <h3>{{ crop.name }}</h3>
          <p>{{ crop.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// स्थानिक प्रतिमा इंपोर्ट करा
import wheatImg from '../assets/wheat.jpeg'
import cornImg from '../assets/corn.jpeg'
import riceImg from '../assets/rice.jpeg'
import tomatoImg from '../assets/tomato.jpeg'
import bringleImg from '../assets/bringle.jpeg'
import onion from '../assets/onion.jpeg'


const crops = ref([
  {
    id: 1,
    name: 'गहू',
    description:
      'गहू हा जगभर पिकवला जाणारा धान्याचा प्रकार आहे, ब्रेड, पास्ता आणि इतर पदार्थांसाठी पीठ तयार करण्यासाठी वापरला जातो.',
    image: wheatImg
  },
  {
    id: 2,
    name: 'मका',
    description:
      'मका हा बहुपयोगी पीक आहे जो अन्न, पशूखाद्य आणि औद्योगिक उत्पादनांसाठी वापरला जातो. उष्ण हवामानात उत्तम वाढतो.',
    image: cornImg
  },
  {
    id: 3,
    name: 'तांदूळ',
    description:
      'तांदूळ हा जगाच्या अर्ध्याहून अधिक लोकांसाठी मुख्य अन्न आहे, सहसा जलयुक्त शेतांमध्ये (पॅडी) पिकवला जातो.',
    image: riceImg
  },
  {
    id: 4,
    name: 'टोमॅटो',
    description:
      'टोमॅटो त्याच्या खाद्य फळांसाठी पिकवला जातो आणि सलाड, सॉस आणि स्वयंपाकासाठी वापरला जातो.',
    image: tomatoImg
  },
  {
    id: 5,
    name: 'वांगी',
    description:
      'वांगी ही शाकाहारी पदार्थांसाठी पिकवली जाते आणि विविध स्वयंपाकात वापरली जाते.',
    image: bringleImg
  },
  {
    id: 6,
    name: 'कांदा',
    description:
      'कांदा विविध पदार्थांसाठी वापरला जातो आणि त्याचे सेवन अनेक प्रकारे केले जाते.',
    image: onion
  }
])
</script>

<style scoped>
.page {
  font-family: 'Segoe UI', sans-serif;
  padding: 0.5rem;
  max-width: 1200px;
  margin: auto;
}
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-header h1 {
  margin: 0;
  color: #388e3c;
}
.page-header p {
  margin: 5px 0 0;
  color: #555;
}
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.crop-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.crop-card:hover {
  transform: translateY(-5px);
}
.crop-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.crop-info {
  padding: 1rem;
}
.crop-info h3 {
  margin: 0 0 0.5rem;
  color: #2e7d32;
}
.crop-info p {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
}

.link-container {
  background: #f9fbe7;
  border: 1px solid #c8e6c9;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem auto;
  text-align: center;
  max-width: 700px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.link-container h2 {
  margin-bottom: 0.5rem;
  color: #2e7d32;
}

.link-container p {
  color: #444;
  font-size: 1rem;
  margin-bottom: 1.2rem;
}

.visit-link {
  display: inline-block;
  padding: 10px 18px;
  background: #388e3c;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.3s, transform 0.2s;
}

.visit-link:hover {
  background: #2e7d32;
  transform: scale(1.05);
}
</style>
