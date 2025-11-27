<template>
  <div class="page">
    <header class="page-header">
      <h2>💳 स्मार्ट पेमेंट व्यवस्थापन (AI-सह)</h2>
      <p class="subtitle">
        वाहतूक पेमेंट ट्रॅक करा, विश्लेषण करा आणि ग्राहकांना WhatsApp वर संदेश पाठवा 💬
      </p>
    </header>

    <!-- AI Summary -->
    <div class="ai-summary-card">
      <h3>📊 AI स्मार्ट सारांश</h3>
      <p>एकूण नोंदी: <strong>{{ payments.length }}</strong></p>
      <p>
        ✅ भरलेले: <strong class="green">{{ totalPaid }}</strong> |
        ❌ न भरलेले: <strong class="red">{{ totalUnpaid }}</strong>
      </p>
      <p class="ai-prediction">
        🤖 AI सूचना: <em>{{ aiMessage }}</em>
      </p>
    </div>

    <!-- Filter -->
    <div class="card">
      <h3 class="card-title">🔍 पेमेंट फिल्टर करा</h3>
      <div class="filter-bar">
        <input v-model="search" placeholder="ग्राहक शोधा..." />
        <select v-model="filterStatus">
          <option value="">सर्व</option>
          <option value="Paid">भरलेले</option>
          <option value="Unpaid">न भरलेले</option>
        </select>
      </div>
    </div>

    <!-- Payment Table -->
    <div class="card table-card">
      <h3 class="card-title">📋 पेमेंट नोंदी</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ग्राहक</th>
              <th>मोबाईल</th>
              <th>पिक</th>
              <th>क्रेट</th>
              <th>तारीख</th>
              <th>रक्कम (₹)</th>
              <th>पेमेंट पद्धत</th>
              <th>स्थिती</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="record in filteredPayments" :key="record.id">
              <td>{{ record.customer }}</td>
              <td>{{ record.mobile }}</td>
              <td>{{ record.crop }}</td>
              <td>{{ record.crates }}</td>
              <td>{{ new Date(record.date).toLocaleDateString() }}</td>

              <!-- Amount -->
              <td>
                <input
                  v-model="record.amount"
                  type="number"
                  placeholder="₹"
                  class="amount-input"
                  @input="autoSave(record)"
                />
              </td>

              <!-- Payment Mode -->
              <td>
                <select
                  v-model="record.mode"
                  class="mode-select"
                  @change="autoSave(record)"
                >
                  <option value="">--निवडा--</option>
                  <option value="Cash">रोख</option>
                  <option value="Online">ऑनलाइन</option>
                  <option value="UPI">यूपीआय</option>
                </select>
              </td>

              <!-- Status Toggle Box -->
              <td>
                <div
                  class="status-box"
                  :class="record.status === 'Paid' ? 'paid-box' : 'unpaid-box'"
                  @click="toggleStatus(record)"
                >
                  {{ record.status === 'Paid' ? 'भरलेले' : 'न भरलेले' }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!filteredPayments.length" class="empty-msg">
        ⚠ कोणतीही नोंद सापडली नाही
      </p>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="showSuccess" class="success-toast">
        🎉 पेमेंट जतन झाले & WhatsApp संदेश पाठवला!
      </div>
    </transition>

    <router-link to="/" class="home-btn">🏠 मुख्य पृष्ठ</router-link>
  </div>
</template>




<script setup>
import { ref, computed, onMounted } from "vue";

const payments = ref([]);
const search = ref("");
const filterStatus = ref("");
const showSuccess = ref(false);

// Load all data
onMounted(() => {
  const storedPayments = JSON.parse(localStorage.getItem("transportPayments") || "[]");
  const storedRecords = JSON.parse(localStorage.getItem("transportRecords") || "[]");

  const merged = [...storedRecords, ...storedPayments].reduce((acc, curr) => {
    const key = `${curr.customer}-${curr.crop}-${curr.date}`;
    const existing = acc.find((r) => `${r.customer}-${r.crop}-${r.date}` === key);
    if (existing) {
      acc[acc.indexOf(existing)] = { ...existing, ...curr };
    } else acc.push(curr);
    return acc;
  }, []);

  payments.value = merged.map((r) => ({
    id: r.id || crypto.randomUUID(),
    customer: r.customer || "",
    mobile: r.mobile || "",
    crop: r.crop || "",
    crates: r.crates || "",
    date: r.date || new Date().toISOString(),
    amount: r.amount || "",
    mode: r.mode || "",
    status: r.status || "Unpaid",
  }));

  localStorage.setItem("transportPayments", JSON.stringify(payments.value));
});

// Filters
const filteredPayments = computed(() =>
  payments.value.filter((p) => {
    const searchMatch = p.customer?.toLowerCase().includes(search.value.toLowerCase());
    const statusMatch = filterStatus.value ? p.status === filterStatus.value : true;
    return searchMatch && statusMatch;
  })
);

const totalPaid = computed(() => payments.value.filter((p) => p.status === "Paid").length);
const totalUnpaid = computed(() => payments.value.filter((p) => p.status === "Unpaid").length);

// Marathi AI Message
const aiMessage = computed(() => {
  if (totalUnpaid.value === 0) return "सर्व ग्राहकांचे पेमेंट पूर्ण झाले आहे ✅";
  if (totalUnpaid.value <= 3) return "फक्त थोडी पेमेंट बाकी आहेत 💪";
  return "AI सूचना: बाकी पेमेंट वाढत आहेत — ग्राहकांना संदेश पाठवा!";
});

// Toggle Status + WhatsApp
function toggleStatus(record) {
  record.status = record.status === "Paid" ? "Unpaid" : "Paid";
  autoSave(record);

  if (record.status === "Paid" && record.mobile) {
    sendWhatsAppMessage(record);
  }
}

// Auto save
function autoSave(record) {
  const index = payments.value.findIndex((p) => p.id === record.id);
  if (index !== -1) payments.value[index] = record;

  localStorage.setItem("transportPayments", JSON.stringify(payments.value));

  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 2000);
}

// WhatsApp Message — Marathi
function sendWhatsAppMessage(record) {
  const msg = `🌾 *अॅग्री ट्रान्सपोर्ट सेवा* 🚛

नमस्कार *${record.customer}* 👋,

आपले पेमेंट यशस्वीरीत्या प्राप्त झाले आहे.

🧾 *बिल तपशील*
---------------------------------
📅 *तारीख:* ${new Date(record.date).toLocaleDateString()}
🌿 *पिक:* ${record.crop}
🧺 *क्रेट:* ${record.crates}
💰 *रक्कम:* ₹${record.amount || "N/A"}
💳 *पेमेंट पद्धत:* ${record.mode || "N/A"}
---------------------------------

🙏 तुमच्या पेमेंटबद्दल धन्यवाद!
🚛 विश्वासार्ह - जलद - सुरक्षित वाहतूक सेवा`;

  const encoded = encodeURIComponent(msg);
  const phone = record.mobile.startsWith("+91") ? record.mobile : `+91${record.mobile}`;

  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}
</script>






<style scoped>
.page {
  padding: 0.5rem;
  max-width: 1100px;
  margin: auto;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(145deg, #e9f5eb, #f1f8e9);
  min-height: 100vh;
  border-radius: 18px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-header h2 {
  color: #2e7d32;
  font-size: 1.8rem;
  font-weight: 700;
}
.subtitle {
  color: #555;
}

.ai-summary-card {
  background: #ffffff;
  border-left: 6px solid #43a047;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
}
.green {
  color: #2e7d32;
}
.red {
  color: #c62828;
}

.card {
  background: #fff;
  border-radius: 14px;
  padding: 1.3rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}
.card-title {
  color: #2e7d32;
  border-left: 4px solid #43a047;
  padding-left: 10px;
  font-weight: 600;
  margin-bottom: 10px;
}
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
th {
  background: #e8f5e9;
  color: #1b5e20;
  font-weight: 600;
}

.amount-input,
.mode-select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.status-box {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  color: white;
}
.paid-box {
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
}
.unpaid-box {
  background: linear-gradient(135deg, #c62828, #ef5350);
}

.success-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #43a047;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.home-btn {
  display: block;
  text-align: center;
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  background: #2e7d32;
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
}
</style>
