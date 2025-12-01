<template>
  <div class="page">

    <!-- Header -->
    <header class="page-header fade-in">
      <h1>🚜 कृषी वाहतूक AI डॅशबोर्ड</h1>
      <p class="subtitle">दैनंदिन कार्यांसाठी स्मार्ट विश्लेषण आणि माहिती</p>
    </header>

    <!-- Add Record -->
    <section class="card fade-in">
      <h3 class="card-title">➕ नवीन वाहतूक नोंद जोडा</h3>

      <form @submit.prevent="addRecord" class="form">

        <!-- CUSTOMER -->
        <div class="input-with-mic">
          <input v-model="customer" placeholder="👤 ग्राहकाचे नाव" list="customerSuggestions" required />
          <button type="button" class="mic-btn" @click="startMic(customer)">
            🎤
          </button>
        </div>

        <datalist id="customerSuggestions">
          <option v-for="c in customerList" :key="c">{{ c }}</option>
        </datalist>

        <!-- VYAPARI -->
        <div class="input-with-mic">
          <input v-model="vyapari" placeholder="🏪 व्यापाऱ्याचे नाव" list="vyapariSuggestions" required />
          <button type="button" class="mic-btn" @click="startMic(vyapari)">
            🎤
          </button>
        </div>

        <datalist id="vyapariSuggestions">
          <option v-for="c in vyapariList" :key="c">{{ c }}</option>
        </datalist>

        <!-- MOBILE -->
        <input
          v-model="mobile"
          placeholder="📞 मोबाईल नंबर"
          class="input"
          type="tel"
          maxlength="10"
          required
        />

        <!-- CROP -->
        <div class="input-with-mic">
          <input v-model="crop" placeholder="🌾 पिकाचे नाव" list="cropSuggestions" required />
          <button type="button" class="mic-btn" @click="startMic(crop)">
            🎤
          </button>
        </div>

        <datalist id="cropSuggestions">
          <option v-for="c in cropList" :key="c">{{ c }}</option>
        </datalist>

        <!-- CRATES -->
        <input
          v-model="crates"
          placeholder="📦 क्रेट्सची संख्या"
          class="input"
          required
        />

        <!-- DATE -->
        <input v-model="date" type="date" class="input" required />

        <button type="submit" class="btn-primary">💾 नोंद जतन करा</button>
      </form>
    </section>

    <!-- FILTERS -->
    <section class="card fade-in">
      <h3 class="card-title">🔍 नोंदी फिल्टर करा</h3>

      <div class="filter-grid">

        <input v-model="filter.name" placeholder="👤 ग्राहकाचे नाव" />
        <input v-model="filter.date" type="date" />
        <select v-model="filter.month">
          <option value="">महिना निवडा</option>
          <option v-for="m in 12" :key="m" :value="m">{{ m }} महिना</option>
        </select>

        <select v-model="filter.year">
          <option value="">वर्ष निवडा</option>
          <option v-for="y in years" :key="y">{{ y }}</option>
        </select>

      </div>

      <div class="filter-actions">
        <button class="btn-small" @click="filterToday">📌 आजचे</button>
        <button class="btn-small" @click="filterWeek">🗓 आठवड्यातील</button>
        <button class="btn-small clear" @click="clearFilters">❌ क्लिअर</button>
      </div>
    </section>

    <!-- EXPORT -->
    <section class="card fade-in">
      <h3 class="card-title">📤 नोंदी एक्सपोर्ट करा</h3>

      <div class="export-flex">
        <button class="btn-export" @click="downloadCSV">📄 CSV डाउनलोड</button>
        <button class="btn-export" @click="downloadPDF">📕 PDF डाउनलोड</button>
      </div>
    </section>

    <!-- TABLE -->
    <section class="card fade-in">
      <h3 class="card-title">📋 नोंदी व पेमेंट</h3>

      <div v-if="filteredPaginated.length" class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ग्राहक</th>
              <th>व्यापारी</th>
              <th>मोबाईल</th>
              <th>पिक</th>
              <th>क्रेट्स</th>
              <th>तारीख</th>
              <th>पेमेंट</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in filteredPaginated" :key="item.id">
              <td>{{ item.customer }}</td>
              <td>{{ item.vyapari }}</td>
              <td>{{ item.mobile }}</td>
              <td>{{ item.crop }}</td>
              <td>{{ item.crates }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>
                <input type="checkbox" v-model="item.paid" @change="saveRecords" />
                {{ item.paid ? "Paid" : "Unpaid" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="empty-msg">⚠ नोंदी सापडल्या नाहीत</p>

      <div v-if="filteredPaginated.length" class="pagination">
        <button @click="prevPage" :disabled="currentPage == 1">⬅</button>
        <span>पृष्ठ {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage == totalPages">➡</button>
      </div>

    </section>

    <!-- CHART -->
    <section class="card fade-in">
      <h3 class="card-title">📊 मासिक विश्लेषण</h3>
      <canvas id="analyticsChart" height="110"></canvas>
    </section>

  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Chart from "chart.js/auto";

// MIC FUNCTION
function startMic(modelRef) {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support Speech Recognition.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "mr-IN";      // Marathi  
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    modelRef.value = text;
  };

  recognition.onerror = () => {
    alert("Mic Error! Please try again.");
  };
}

// INPUT MODELS
const customer = ref('');
const vyapari = ref('');
const mobile = ref('');
const crop = ref('');
const crates = ref('');
const date = ref('');

// STORAGE
const data = ref([]);

// FILTERS
const filter = ref({
  name: "",
  date: "",
  month: "",
  year: ""
});

// Load from storage
onMounted(() => {
  const stored = localStorage.getItem("transportRecords");
  if (stored) data.value = JSON.parse(stored);
});

// Save
function saveRecords() {
  localStorage.setItem("transportRecords", JSON.stringify(data.value));
}

// Add record
function addRecord() {
  data.value.unshift({
    id: Date.now(),
    customer: customer.value,
    vyapari: vyapari.value,
    mobile: mobile.value,
    crop: crop.value,
    crates: crates.value,
    date: date.value,
    paid: false
  });

  saveRecords();

  customer.value = "";
  vyapari.value = "";
  mobile.value = "";
  crop.value = "";
  crates.value = "";
  date.value = "";

  currentPage.value = 1;
}

// Auto suggestion lists
const customerList = computed(() => [...new Set(data.value.map(r => r.customer))]);
const vyapariList = computed(() => [...new Set(data.value.map(r => r.vyapari))]);
const cropList = computed(() => [...new Set(data.value.map(r => r.crop))]);
const years = computed(() => [...new Set(data.value.map(r => new Date(r.date).getFullYear()))]);

// Filters
const filteredData = computed(() => {
  return data.value.filter(r => {
    const d = new Date(r.date);
    return (
      (!filter.value.name || r.customer.includes(filter.value.name)) &&
      (!filter.value.date || r.date === filter.value.date) &&
      (!filter.value.month || d.getMonth() + 1 == filter.value.month) &&
      (!filter.value.year || d.getFullYear() == filter.value.year)
    );
  });
});

// Clear Filters
function clearFilters() {
  filter.value = { name: "", date: "", month: "", year: "" };
}

function filterToday() {
  filter.value.date = new Date().toISOString().split("T")[0];
}

function filterWeek() {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  filter.value = { name: "", date: "", month: "", year: "" };
  data.value = data.value.filter(r => new Date(r.date) >= weekStart);
}

// Pagination
const currentPage = ref(1);
const pageSize = 7;

const totalPages = computed(
  () => Math.max(1, Math.ceil(filteredData.value.length / pageSize))
);

const filteredPaginated = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredData.value.slice(start, start + pageSize);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

// CSV Export
function downloadCSV() {
  const rows = filteredData.value.map(r =>
    `${r.customer},${r.vyapari},${r.mobile},${r.crop},${r.crates},${r.date},${r.paid ? "Paid" : "Unpaid"}`
  );

  const csv = "Customer,Vyapari,Mobile,Crop,Crates,Date,Paid\n" + rows.join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transport_records.csv";
  link.click();
}

// PDF Export
function downloadPDF() {
  const content = filteredData.value
    .map(r => `${r.customer} | ${r.vyapari} | ${r.mobile} | ${r.crop} | ${r.crates} | ${r.date} | ${r.paid ? "Paid" : "Unpaid"}`)
    .join("\n");

  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transport_records.pdf";
  link.click();
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("mr-IN");
}

// Chart
let chartInstance = null;

function generateAnalytics() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const crateData = Array(12).fill(0);

  data.value.forEach(r => {
    const m = new Date(r.date).getMonth();
    crateData[m] += Number(r.crates);
  });

  const ctx = document.getElementById("analyticsChart");
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Monthly Crates Transported",
          data: crateData,
          borderWidth: 2,
          tension: 0.3
        }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

onMounted(() => setTimeout(generateAnalytics, 300));
watch(data, () => generateAnalytics(), { deep: true });
</script>


<style scoped>
/* --- BEAUTIFUL UI STYLE --- */

.page{padding:0.5rem; max-width:1100px;margin:auto;font-family:'Poppins',sans-serif;background:linear-gradient(145deg,#f1f8e9,#ffffff);border-radius:18px;box-shadow:0 6px 25px rgba(0,0,0,0.08);min-height:100vh;}
.page-header{text-align:center;margin-bottom:1.5rem;}
.page-header h1{color:#2e7d32;font-weight:700;font-size:1.6rem;}
.subtitle{color:#555;}
.card{background: rgba(255,255,255,0.85); border-radius:12px; padding:1.4rem; margin-bottom:1.4rem; box-shadow:0 6px 18px rgba(12,60,26,0.04); border:1px solid rgba(255,255,255,0.6); backdrop-filter: blur(8px);}
.card-title{color:#2e7d32; border-left:4px solid #43a047; padding-left:10px; margin-bottom:1rem; font-weight:600;}

.form{display:flex; flex-wrap:wrap; gap:12px; align-items:center;}
.input-with-mic{position: relative; display:flex; align-items:center; width:100%;}
.input-with-mic input{flex:1; min-width:180px; padding:.8rem .9rem; border:1px solid #dfeee0; border-radius:10px; font-size:.95rem; background:#fff; outline:none;}

.btn-primary{background:#43a047;color:white;padding:.8rem 1.5rem;border:none;border-radius:10px;cursor:pointer;font-weight:700;box-shadow:0 6px 14px rgba(67,160,71,0.12);}
.btn-primary:hover{background:#2e7d32; transform:translateY(-1px);}

/* Table */
.table-responsive { width: 100%; overflow-x: auto; padding: 8px 0; }

table { width: 100%; min-width: 800px; border-collapse: separate; border-spacing: 0 8px; }

thead tr { background:#2e7d32; color:#fff; }
thead th { padding: 12px; }

tbody tr {
  background:#fff;
  border-radius: 8px;
  height: 50px;
  box-shadow:0 3px 10px rgba(67, 160, 71, 0.08);
}
tbody tr:hover { transform: translateY(-2px); }

td { padding: 10px; text-align:center; color:#2e7d32; }
.cell-left { text-align:left; font-weight:600; padding-left:16px; }

.pagination {
  margin-top:15px;
  display:flex;
  justify-content:center;
  gap:12px;
}

.pagination button { padding:8px 15px; background:#43a047; color:#fff; border:none; border-radius:8px; }

/* Filters */
.filter-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;}
.filter-item input, .filter-item select{padding:0.7rem;border-radius:10px;border:1px solid #d9eadf;}

.btn-small{padding:8px 14px;background:#2e7d32;color:#fff;border:none;border-radius:10px;}
.btn-small.clear{background:#d32f2f;}

.export-flex{display:flex;gap:12px;justify-content:center;}
.btn-export{background:#00796b;color:#fff;padding:0.9rem 1.4rem;border-radius:10px;}


.mic-btn {
  position:absolute;
  right:10px;
  background:#2e7d32;
  border:none;
  color:white;
  padding:6px 10px;
  border-radius:50%;
  cursor:pointer;
  font-size:14px;
  box-shadow:0 2px 6px rgba(0,0,0,0.2);
}

.mic-btn:hover {
  background:#1b5e20;
}

</style>
