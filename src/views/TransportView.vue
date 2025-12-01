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

        <!-- Vyapari Name -->
        <div class="input-with-mic">
          <input v-model="vyapari" placeholder="🧑‍💼 व्यापाऱ्याचे नाव" list="vyapariSuggestions" required />
          <button type="button" class="mic-btn" @click="startMic('vyapari')">🎤</button>
        </div>

        <datalist id="vyapariSuggestions">
          <option v-for="c in vyapariList" :key="c">{{ c }}</option>
        </datalist>

        <!-- Customer Name -->
        <div class="input-with-mic">
          <input v-model="customer" placeholder="👤 ग्राहकाचे नाव" list="customerSuggestions" required />
          <button type="button" class="mic-btn" @click="startMic('customer')">🎤</button>
        </div>

        <datalist id="customerSuggestions">
          <option v-for="c in customerList" :key="c">{{ c }}</option>
        </datalist>

        <!-- Mobile -->
        <div class="input-with-mic">
          <input v-model="mobile" placeholder="📞 मोबाईल नंबर" type="tel" maxlength="10" required />
        </div>

        <!-- Crop -->
        <div class="input-with-mic">
          <input v-model="crop" placeholder="🌾 पिकाचे नाव" list="cropSuggestions" required />
          <button type="button" class="mic-btn" @click="startMic('crop')">🎤</button>
        </div>

        <datalist id="cropSuggestions">
          <option v-for="c in cropList" :key="c">{{ c }}</option>
        </datalist>

        <!-- Crates -->
        <div class="input-with-mic">
          <input v-model="crates" type="text" placeholder="📦 क्रेट्सची संख्या" required />
          <button type="button" class="mic-btn" @click="startMic('crates')">🎤</button>
        </div>

        <!-- Date -->
        <input v-model="date" type="date" required />

        <button type="submit" class="btn-primary">💾 नोंद जतन करा</button>
      </form>
    </section>



    <!-- FILTER SECTION -->
    <section class="card fade-in">
      <h3 class="card-title">🔍 नोंदी फिल्टर करा</h3>

      <div class="filter-grid">
        <div class="filter-item">
          <label>👤 नाव (व्यापारी / ग्राहक)</label>
          <input v-model="filter.name" placeholder="नावाने शोधा" />
        </div>

        <div class="filter-item">
          <label>📅 तारीख</label>
          <input v-model="filter.date" type="date" />
        </div>

        <div class="filter-item">
          <label>🗓 महिना</label>
          <select v-model="filter.month">
            <option value="">महिना निवडा</option>
            <option v-for="m in 12" :key="m" :value="m">{{ m }} महिना</option>
          </select>
        </div>

        <div class="filter-item">
          <label>📆 वर्ष</label>
          <select v-model="filter.year">
            <option value="">वर्ष निवडा</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <div class="filter-actions">
        <button class="btn-small" @click="filterToday">📌 आजचे</button>
        <button class="btn-small" @click="filterWeek">🗓 मागील ७ दिवस</button>
        <button class="btn-small clear" @click="clearFilters">❌ क्लिअर</button>
      </div>
    </section>



    <!-- EXPORT SECTION -->
    <section class="card fade-in">
      <h3 class="card-title">📤 नोंदी एक्सपोर्ट करा</h3>

      <div class="export-flex">
        <button class="btn-export" @click="downloadCSV">📄 CSV डाउनलोड</button>

        <button class="btn-export" @click="downloadPDF">📕 PDF डाउनलोड</button>
      </div>
    </section>



    <!-- Records Table -->
    <section class="card fade-in">
      <h3 class="card-title">📋 वाहतूक नोंदी व पेमेंट्स</h3>

      <div class="table-responsive" v-if="filteredPaginated.length">
        <table>
          <thead>
            <tr>
              <th>व्यापारी</th>
              <th>ग्राहक</th>
              <th>मोबाईल</th>
              <th>पिक</th>
              <th>क्रेट्स</th>
              <th>तारीख</th>
              <th>पेमेंट</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in filteredPaginated" :key="item.id">
              <td class="cell-left">{{ item.vyapari }}</td>
              <td>{{ item.customer }}</td>
              <td>{{ item.mobile }}</td>
              <td>{{ item.crop }}</td>
              <td>{{ item.crates }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>
                <input type="checkbox" v-model="item.paid" @change="saveRecords" />
                {{ item.paid ? 'Paid' : 'Unpaid' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="empty-msg">⚠ नोंदी सापडल्या नाहीत</p>

      <div class="pagination" v-if="filteredPaginated.length">
        <button @click="prevPage" :disabled="currentPage===1">⏮ मागे</button>
        <span>पृष्ठ {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage===totalPages">पुढे ⏭</button>
      </div>
    </section>




    <!-- ANALYTICS -->
    <section class="card fade-in">
      <h3 class="card-title">📊 मासिक वाहतूक विश्लेषण</h3>

      <canvas id="analyticsChart" height="120"></canvas>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Chart from "chart.js/auto";

/* ---------------- INPUTS ---------------- */
const vyapari = ref('');
const customer = ref('');
const mobile = ref('');
const crop = ref('');
const crates = ref('');
const date = ref('');

const data = ref([]);

/* -------------- FILTERS ---------------- */
const filter = ref({
  name: "",
  date: "",
  month: "",
  year: "",
  week: false
});

/* ---------- Load Data ---------- */
onMounted(() => {
  const stored = localStorage.getItem("transportRecords");
  if (stored) data.value = JSON.parse(stored);
});

/* ---------- Save Data ---------- */
function saveRecords() {
  localStorage.setItem("transportRecords", JSON.stringify(data.value));
}

/* -------------- Add Record -------------- */
function addRecord() {
  data.value.unshift({
    id: Date.now(),
    vyapari: vyapari.value,
    customer: customer.value,
    mobile: mobile.value,
    crop: crop.value,
    crates: crates.value,
    date: date.value,
    paid: false
  });

  saveRecords();

  vyapari.value = "";
  customer.value = "";
  mobile.value = "";
  crop.value = "";
  crates.value = "";
  date.value = "";
  currentPage.value = 1;
}

/* -------- Auto Suggestions -------- */
const vyapariList = computed(() => [...new Set(data.value.map(r => r.vyapari))]);
const customerList = computed(() => [...new Set(data.value.map(r => r.customer))]);
const cropList = computed(() => [...new Set(data.value.map(r => r.crop))]);
const years = computed(() => [...new Set(data.value.map(r => new Date(r.date).getFullYear()))]);

/* -------------- MIC Input -------------- */
function startMic(field) {
  const rec = new window.webkitSpeechRecognition();
  rec.lang = "mr-IN";

  rec.onresult = (e) => {
    const text = e.results[0][0].transcript;

    if (field === "vyapari") vyapari.value = text;
    if (field === "customer") customer.value = text;
    if (field === "crop") crop.value = text;
    if (field === "crates") crates.value = text;
  };

  rec.start();
}

/* ------------ FILTER LOGIC ------------ */
const filteredData = computed(() => {
  const now = new Date();
  const weekStart = new Date();
  weekStart.setDate(now.getDate() - 7);

  return data.value.filter(r => {
    const d = new Date(r.date);

    const matchesName =
      !filter.value.name ||
      r.vyapari.toLowerCase().includes(filter.value.name.toLowerCase()) ||
      r.customer.toLowerCase().includes(filter.value.name.toLowerCase());

    const matchesDate = !filter.value.date || r.date === filter.value.date;
    const matchesMonth = !filter.value.month || (d.getMonth() + 1) == filter.value.month;
    const matchesYear = !filter.value.year || d.getFullYear() == filter.value.year;

    const matchesWeek =
      !filter.value.week || (d >= weekStart && d <= now);

    return matchesName && matchesDate && matchesMonth && matchesYear && matchesWeek;
  });
});

/* -------------- CLEAR FILTERS -------------- */
function clearFilters() {
  filter.value = { name: "", date: "", month: "", year: "", week: false };
}

/* ----- TODAY FILTER ----- */
function filterToday() {
  filter.value = { name: "", month: "", year: "", week: false };
  filter.value.date = new Date().toISOString().split("T")[0];
}

/* ----- WEEK FILTER ----- */
function filterWeek() {
  filter.value = { name: "", date: "", month: "", year: "", week: true };
}

/* -------- Pagination -------- */
const currentPage = ref(1);
const pageSize = 7;

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredData.value.length / pageSize))
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

/* ---------- CSV EXPORT ---------- */
function downloadCSV() {
  const rows = filteredData.value.map(r =>
    `${r.vyapari},${r.customer},${r.mobile},${r.crop},${r.crates},${r.date},${r.paid ? "Paid" : "Unpaid"}`
  );

  const csv = "Vyapari,Customer,Mobile,Crop,Crates,Date,Paid\n" + rows.join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transport_records.csv";
  link.click();
}

/* ---------- PDF EXPORT ---------- */
function downloadPDF() {
  const content = filteredData.value
    .map(r => `${r.vyapari} | ${r.customer} | ${r.mobile} | ${r.crop} | ${r.crates} | ${r.date} | ${r.paid ? "Paid" : "Unpaid"}`)
    .join("\n");

  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transport_records.pdf";
  link.click();
}

/* ---------- Date Format ---------- */
function formatDate(d) {
  return new Date(d).toLocaleDateString("mr-IN");
}

/* ---------- Analytics Chart ---------- */
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
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

onMounted(() => {
  setTimeout(generateAnalytics, 300);
});

watch(data, () => generateAnalytics(), { deep: true });

</script>


<style scoped>
/* ---- UI DESIGN ---- */
.page {
  padding:0.5rem; 
  max-width:1100px;
  margin:auto;
  font-family:'Poppins',sans-serif;
  background:linear-gradient(145deg,#f1f8e9,#ffffff);
  border-radius:18px;
  box-shadow:0 6px 25px rgba(0,0,0,0.08);
  min-height:100vh;
}

.page-header{text-align:center;margin-bottom:1.5rem;}
.page-header h1{color:#2e7d32;font-weight:700;font-size:1.6rem;}

.card{
  background: rgba(255,255,255,0.85);
  border-radius:12px; 
  padding:1.4rem; 
  margin-bottom:1.4rem; 
  box-shadow:0 6px 18px rgba(12,60,26,0.04); 
}

.input-with-mic{
  position: relative;
  display:flex;
  align-items:center;
  width:100%;
}

.input-with-mic input{
  flex:1;
  padding:.8rem .9rem;
  border:1px solid #dfeee0;
  border-radius:10px;
  font-size:.95rem;
}

.mic-btn{
  margin-left:6px;
  padding:.6rem .8rem;
  background:#007bff;
  color:#fff;
  border:none;
  border-radius:10px;
  cursor:pointer;
}

/* Table */
.table-responsive { overflow-x: auto; padding: 8px 0; }

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

.pagination { display:flex; justify-content:center; gap:12px; }

</style>
