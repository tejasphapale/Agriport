<template>
  <div class="about-page">
    <!-- हेडर सेक्शन -->
    <header class="header">
      <h1 class="title">🚛 {{ user?.transportName || "तेजस ट्रान्सपोर्ट सर्व्हिसेस" }}</h1>
      <p class="subtitle">
        शेतकरी आणि व्यवसायांसाठी आधुनिक कृषी वाहतूक उपाय
      </p>
    </header>

    <!-- इंट्रो कार्ड -->
    <section class="intro-card">
      <h2>ℹ️ {{ user?.transportName || "आमच्या वाहतूक प्रणाली" }} बद्दल</h2>
      <p>
        स्वागत आहे <strong>{{ user?.transportName || "तेजस ट्रान्सपोर्ट सर्व्हिसेस" }}</strong> मध्ये,  
        जिथे तंत्रज्ञान आणि कृषी हातमिळवणी करतात.  
        आम्ही <strong>स्मार्ट आणि विश्वसनीय वाहतूक उपाय</strong> प्रदान करण्यात तज्ज्ञ आहोत, 
        जे शेतकरी आणि कृषी व्यवसायांना लॉजिस्टिक प्रभावीपणे व्यवस्थापित करण्यास मदत करतात.
      </p>
    </section>

    <!-- वैयक्तिकृत स्वागत -->
    <section v-if="user" class="section user-info">
      <h3>👋 नमस्कार, {{ user.fullname }}</h3>
      <p>
        आपण <strong>{{ user.transportName }}</strong> चा भाग म्हणून लॉगिन केलेले आहात —  
        कृषी लॉजिस्टिकमध्ये उत्कृष्टता प्रदान करत आहोत.
      </p>
    </section>

    <!-- मिशन सेक्शन -->
    <section class="section mission">
      <h3>🌿 आमचे मिशन</h3>
      <p>
        कृषी समुदाय सशक्त करणे आणि एक  
        <strong>डिजिटल-प्रथम वाहतूक व्यवस्थापन प्लॅटफॉर्म</strong> तयार करणे,  
        जे लॉजिस्टिक सोपे करेल, मॅन्युअल त्रुटी कमी करेल, आणि जबाबदारी वाढवेल.
      </p>
    </section>

    <!-- सेवा सेक्शन -->
    <section class="section services">
      <h3>🚜 आमच्या मुख्य सेवा</h3>
      <div class="services-grid">
        <div class="service-card">
          <span class="icon">🕒</span>
          <h4>वेळेवर पिकांची वाहतूक</h4>
          <p>विश्वसनीय आणि वेळेवर वितरण, रिअल-टाइम ट्रॅकिंगसह.</p>
        </div>
        <div class="service-card">
          <span class="icon">💾</span>
          <h4>डिजिटल नोंदी प्रणाली</h4>
          <p>सर्व वाहतूक नोंदी डिजिटल स्वरूपात सुरक्षितपणे जतन करा.</p>
        </div>
        <div class="service-card">
          <span class="icon">💰</span>
          <h4>स्मार्ट पेमेंट ट्रॅकिंग</h4>
          <p>पेमेंट स्थिती (Paid/Unpaid) आणि तपशील एका डॅशबोर्डमध्ये ट्रॅक करा.</p>
        </div>
        <div class="service-card">
          <span class="icon">📊</span>
          <h4>तपशीलवार विश्लेषण</h4>
          <p>वाहतूक डेटा विश्लेषित करा आणि कार्यक्षमता सुधारण्यासाठी निर्णय घ्या.</p>
        </div>
        <div class="service-card">
          <span class="icon">🤝</span>
          <h4>ग्राहक सहाय्य</h4>
          <p>सर्व ग्राहकांच्या गरजांसाठी मित्रवत आणि व्यावसायिक सहाय्य.</p>
        </div>
      </div>
    </section>

    <!-- संपर्क सेक्शन -->
    <section class="section contact">
      <h3>📞 संपर्क करा</h3>
      <p>कोणत्याही चौकशीसाठी किंवा वाहतूक सहाय्यासाठी आम्ही नेहमी तयार आहोत.</p>

      <div class="contact-card">
        <div>
          <p><strong>👤 मालक:</strong> {{ user?.fullname || "तेजस ट्रान्सपोर्ट सर्व्हिसेस" }}</p>
          <p><strong>📱 मोबाईल:</strong> {{ user?.mobile || "+91 98765 43210" }}</p>
          <p><strong>📧 ई-मेल:</strong> {{ user?.email || "tejas.transport@gmail.com" }}</p>
          <p><strong>📍 पत्ता:</strong> सांगमनेर, महाराष्ट्र, भारत</p>
        </div>
      </div>
    </section>

    <!-- नकाशा सेक्शन -->
    <section class="section map-section">
      <h3>🗺️ नकाशावर शोधा</h3>
      <iframe
        class="map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.671918022933!2d74.20397231490104!3d19.566295086798464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdcb1f25e7f2d7d%3A0x1d9a2efbd6c72c2f!2sSangamner%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1695482812345!5m2!1sen!2sin"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

// ✅ LocalStorage मधून लॉगिन केलेला वापरकर्ता माहिती मिळवा
onMounted(() => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    user.value = loggedInUser;
  }
});
</script>

<style scoped>
.about-page {
  font-family: "Poppins", sans-serif;
  color: #333;
  background: linear-gradient(to bottom right, #f8fff6, #e9f5ec);
  min-height: 100vh;
  padding: 0.5rem;
  max-width: 1100px;
  margin: auto;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.title {
  color: #2e7d32;
  font-size: 2.4rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
.subtitle {
  color: #555;
  font-size: 1.1rem;
}

/* Intro Card */
.intro-card {
  background: #ffffff;
  padding: 1.8rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  margin-bottom: 2.5rem;
}
.intro-card h2 {
  color: #2e7d32;
  margin-bottom: 1rem;
}
.intro-card p {
  line-height: 1.7;
  color: #444;
}

/* Personalized User Info */
.user-info {
  background: #f1f8e9;
  padding: 1.2rem;
  border-left: 5px solid #388e3c;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}
.user-info h3 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

/* Generic Section */
.section {
  margin-bottom: 2.8rem;
}
.section h3 {
  color: #388e3c;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}
.section p {
  color: #555;
  line-height: 1.6;
}

/* Services */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.2rem;
  margin-top: 1.5rem;
}
.service-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}
.service-card .icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.8rem;
}
.service-card h4 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}
.service-card p {
  font-size: 0.95rem;
  color: #555;
}

/* Contact */
.contact-card {
  background: #f1f8e9;
  padding: 1.5rem;
  border-left: 5px solid #388e3c;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 600px;
  margin-top: 1.2rem;
}
.contact-card p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

/* Map Section */
.map {
  width: 100%;
  height: 350px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}
</style>
