<template>
  <div class="page">

    <!-- Header -->
    <header class="page-header fade-in">
      <h1>🚜 कृषी वाहतूक AI डॅशबोर्ड</h1>
      <p class="subtitle">व्यापारी, पिके आणि पेमेंट्स यांचे स्मार्ट व्यवस्थापन</p>
    </header>

    <!-- Add Record -->
    <section class="card fade-in">
      <h3 class="card-title">➕ नवीन वाहतूक नोंद जोडा</h3>

      <form @submit.prevent="addRecord" class="form">

        <!-- VYAPARI -->
        <div class="input-with-mic">
          <input
            v-model="vyapari"
            placeholder="🏪 व्यापाऱ्याचे नाव"
            list="vyapariSuggestions"
            required
          />
          <button class="mic-btn" @click.prevent="startMic('vyapari')" title="व्हॉइस इनपुट">🎤</button>
        </div>
        <datalist id="vyapariSuggestions">
          <option v-for="v in vyapariList" :key="v">{{ v }}</option>
        </datalist>

        <!-- CUSTOMER -->
        <div class="input-with-mic">
          <input
            v-model="customer"
            placeholder="👤 ग्राहकाचे नाव"
            list="customerSuggestions"
            required
          />
          <button class="mic-btn" @click.prevent="startMic('customer')" title="व्हॉइस इनपुट">🎤</button>
        </div>
        <datalist id="customerSuggestions">
          <option v-for="c in customerList" :key="c">{{ c }}</option>
        </datalist>

        <!-- MOBILE -->
        <div class="input-with-mic">
          <input
            v-model="mobile"
            placeholder="📞 मोबाईल नंबर"
            type="tel"
            maxlength="10"
            inputmode="numeric"
            required
          />
          <button class="mic-btn" @click.prevent="startMic('mobile')" title="व्हॉइस इनपुट">🎤</button>
        </div>

        <!-- CROP -->
        <div class="input-with-mic">
          <input
            v-model="crop"
            placeholder="🌾 पिकाचे नाव"
            list="cropSuggestions"
            required
          />
          <button class="mic-btn" @click.prevent="startMic('crop')" title="व्हॉइस इनपुट">🎤</button>
        </div>
        <datalist id="cropSuggestions">
          <option v-for="c in cropList" :key="c">{{ c }}</option>
        </datalist>

        <!-- CRATES -->
        <div class="input-with-mic">
          <input
            v-model.number="crates"
            placeholder="📦 क्रेट्सची संख्या"
            type="number"
            min="0"
            required
          />
          <button class="mic-btn" @click.prevent="startMic('crates')" title="व्हॉइस इनपुट">🎤</button>
        </div>

        <!-- DATE -->
        <input v-model="date" type="date" required />

        <button type="submit" class="btn-primary">💾 नोंद जतन करा</button>
      </form>
    </section>

    <!-- FILTER SECTION -->
    <section class="card fade-in">
      <h3 class="card-title">🔍 नोंदी फिल्टर करा</h3>

      <div class="filter-grid">
        <div class="filter-item">
          <label>👤 व्यापाऱ्याचे / ग्राहकाचे नाव</label>
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
        <button class="btn-small" @click="filterWeek">🗓 आठवड्यातील</button>
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

    <!-- Payment / Records Table -->
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
              <td class="cell-left">{{ item.customer }}</td>
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

/* ---------- Reactive Inputs ---------- */
const vyapari = ref("");
const customer = ref("");
const mobile = ref("");
const crop = ref("");
const crates = ref(0);
const date = ref("");

/* ---------- Storage ---------- */
const data = ref([]);

/* ---------- Filters & Pagination ---------- */
const filter = ref({ name: "", date: "", month: "", year: "" });
const currentPage = ref(1);
const pageSize = 7;

/* ---------- Load saved records ---------- */
onMounted(() => {
  const stored = localStorage.getItem("transportRecords");
  if (stored) {
    try { data.value = JSON.parse(stored); }
    catch (e) { data.value = []; }
  }
  // initial chart
  setTimeout(generateAnalytics, 300);
});

/* ---------- Save records ---------- */
function saveRecords() {
  localStorage.setItem("transportRecords", JSON.stringify(data.value));
}

/* ---------- Add new record ---------- */
function addRecord() {
  data.value.unshift({
    id: Date.now(),
    vyapari: vyapari.value || "—",
    customer: customer.value || "—",
    mobile: String(mobile.value || "").replace(/\D/g, ""),
    crop: crop.value || "—",
    crates: Number(crates.value || 0),
    date: date.value || new Date().toISOString().split("T")[0],
    paid: false
  });
  saveRecords();
  vyapari.value = ""; customer.value = ""; mobile.value = ""; crop.value = ""; crates.value = 0; date.value = "";
  currentPage.value = 1;
}

/* ---------- Suggestion lists ---------- */
const vyapariList = computed(() => [...new Set(data.value.map(r => r.vyapari).filter(Boolean))]);
const customerList = computed(() => [...new Set(data.value.map(r => r.customer).filter(Boolean))]);
const cropList = computed(() => [...new Set(data.value.map(r => r.crop).filter(Boolean))]);
const years = computed(() => [...new Set(data.value.map(r => r.date ? new Date(r.date).getFullYear() : null).filter(Boolean))]);

/* ---------- Filtering ---------- */
const filteredData = computed(() => {
  return data.value.filter(r => {
    const d = new Date(r.date);
    const matchesName = !filter.value.name || (String(r.vyapari).includes(filter.value.name) || String(r.customer).includes(filter.value.name));
    const matchesDate = !filter.value.date || r.date === filter.value.date;
    const matchesMonth = !filter.value.month || (d.getMonth() + 1) == filter.value.month;
    const matchesYear = !filter.value.year || d.getFullYear() == filter.value.year;
    return matchesName && matchesDate && matchesMonth && matchesYear;
  });
});

function clearFilters() { filter.value = { name: "", date: "", month: "", year: "" }; }
function filterToday() { filter.value.date = new Date().toISOString().split("T")[0]; }
function filterWeek() {
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  filter.value = { name: "", date: "", month: "", year: "" };
  // preserve original data (do not permanently remove) — just filter view by date range:
  // We'll set filter.date to empty and rely on in-memory filter: use a temporary filteredData view by adjusting filter object:
  // Using the simplest approach: set a temporary date range filter by preparing an internal flag is more code.
  // For simplicity here we'll set filter.date to blank and set filter.month/year to blank and then apply a more explicit week filter:
  // We'll return items from last 7 days by temporarily setting a virtual filter via special flag:
  // Implement by applying filter.value._week = weekStart.toISOString()
  filter.value._week = weekStart.toISOString();
}

/* Adjust filteredData to support week filter flag */
const filteredDataComputed = computed(() => {
  const weekStartIso = filter.value._week || null;
  return data.value.filter(r => {
    const d = new Date(r.date);
    const matchesWeek = weekStartIso ? (new Date(r.date) >= new Date(weekStartIso)) : true;
    const matchesName = !filter.value.name || (String(r.vyapari).includes(filter.value.name) || String(r.customer).includes(filter.value.name));
    const matchesDate = !filter.value.date || r.date === filter.value.date;
    const matchesMonth = !filter.value.month || (d.getMonth() + 1) == filter.value.month;
    const matchesYear = !filter.value.year || d.getFullYear() == filter.value.year;
    return matchesWeek && matchesName && matchesDate && matchesMonth && matchesYear;
  });
});

/* ---------- Pagination based on filteredDataComputed ---------- */
const totalPages = computed(() => Math.max(1, Math.ceil(filteredDataComputed.value.length / pageSize)));
const filteredPaginated = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredDataComputed.value.slice(start, start + pageSize);
});
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }
function prevPage() { if (currentPage.value > 1) currentPage.value--; }

/* ---------- CSV & PDF Export ---------- */
function downloadCSV() {
  const rows = filteredDataComputed.value.map(r =>
    `${escapeCsv(r.vyapari)},${escapeCsv(r.customer)},${escapeCsv(r.mobile)},${escapeCsv(r.crop)},${r.crates},${r.date},${r.paid ? "Paid" : "Unpaid"}`
  );
  const csv = "Vyapari,Customer,Mobile,Crop,Crates,Date,Paid\n" + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transport_records.csv";
  link.click();
}
function escapeCsv(str) {
  if (str === null || str === undefined) return "";
  str = String(str);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
function downloadPDF() {
  const content = filteredDataComputed.value
    .map(r => `${r.vyapari} | ${r.customer} | ${r.mobile} | ${r.crop} | ${r.crates} | ${r.date} | ${r.paid ? "Paid" : "Unpaid"}`)
    .join("\n\n");
  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transport_records.pdf";
  link.click();
}

/* ---------- Format Date ---------- */
function formatDate(d) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("mr-IN"); } catch { return d; }
}

/* ---------- Analytics (Chart.js) ---------- */
let chartInstance = null;
function generateAnalytics() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const crateData = Array(12).fill(0);
  data.value.forEach(r => {
    const m = new Date(r.date).getMonth();
    crateData[m] += Number(r.crates) || 0;
  });
  const ctx = document.getElementById("analyticsChart");
  if (!ctx) return;
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "line",
    data: { labels: months, datasets: [{ label: "Monthly Crates Transported", data: crateData, borderWidth: 2, tension: 0.3 }] },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}
watch(data, () => {
  saveRecords();
  generateAnalytics();
}, { deep: true });

/* ---------- Speech to Text (mic) ---------- */
function browserHasSpeech() {
  return (typeof window !== "undefined") && (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
}
function startMic(field) {
  if (!browserHasSpeech()) {
    alert("तुमच्या ब्राउझरमध्ये Speech Recognition उपलब्ध नाही. Chrome/Edge वापरा.");
    return;
  }
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recog = new SpeechRec();
  recog.lang = "mr-IN";
  recog.interimResults = false;
  recog.maxAlternatives = 1;
  recog.start();
  recog.onresult = (ev) => {
    const text = ev.results[0][0].transcript || "";
    if (field === "vyapari") vyapari.value = text;
    else if (field === "customer") customer.value = text;
    else if (field === "mobile") mobile.value = text.replace(/\D/g, "").slice(0, 10);
    else if (field === "crop") crop.value = text;
    else if (field === "crates") {
      const num = text.replace(/\D/g, "");
      crates.value = num ? Number(num) : crates.value;
    }
  };
  recog.onerror = () => { /* silent fail */ };
  recog.onend = () => { /* stops automatically */ };
}
</script>

<style scoped>
.page{padding:0.75rem;max-width:1200px;margin:24px auto;font-family:'Poppins',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;min-height:100vh;background:linear-gradient(145deg,#f4fbf2,#ffffff);}
.page-header{text-align:center;margin-bottom:1.25rem;}
.page-header h1{color:#2e7d32;font-weight:800;font-size:1.7rem;margin:0;}
.subtitle{color:#556b2f;margin-top:6px;}

.card{background:rgba(255,255,255,0.95);border-radius:12px;padding:1.2rem;margin-bottom:1.1rem;box-shadow:0 8px 20px rgba(0,0,0,0.06);border:1px solid rgba(67,160,71,0.06);}
.card-title{color:#2e7d32;border-left:4px solid #43a047;padding-left:10px;margin-bottom:0.9rem;font-weight:700;}

.form{display:flex;flex-wrap:wrap;gap:12px;align-items:center;}
.input-with-mic{position:relative;display:flex;align-items:center;width:100%;}
.input-with-mic input{flex:1;padding:0.78rem 0.9rem;border:1px solid #e6f1ea;border-radius:10px;background:#fff;outline:none;font-size:0.95rem;}
.input-with-mic .mic-btn{position:absolute;right:8px;border:none;background:#2e7d32;color:#fff;padding:8px;border-radius:8px;cursor:pointer;font-size:14px;box-shadow:0 4px 12px rgba(46,125,50,0.12);}
.input-with-mic .mic-btn:hover{background:#1b5e20;}

.input{width:100%;padding:0.78rem;border-radius:10px;border:1px solid #e6f1ea;}
.btn-primary{background:#43a047;color:#fff;padding:0.9rem 1.2rem;border-radius:10px;border:none;font-weight:700;cursor:pointer;box-shadow:0 8px 18px rgba(67,160,71,0.12);}
.btn-primary:hover{transform:translateY(-2px);}

.filter-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:8px;}
.filter-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;}
.btn-small{background:#2e7d32;color:#fff;padding:8px 12px;border-radius:8px;border:none;cursor:pointer;font-weight:700;}
.btn-small.clear{background:#d32f2f;}

.export-flex{display:flex;gap:10px;flex-wrap:wrap;}
.btn-export{background:#00796b;color:#fff;padding:8px 12px;border-radius:8px;border:none;cursor:pointer;font-weight:700;}

.table-responsive{width:100%;overflow-x:auto;padding-top:8px;}
table{width:100%;min-width:800px;border-collapse:separate;border-spacing:0 10px;font-size:0.95rem;}
thead tr{background:#2e7d32;color:#fff;font-weight:700;}
thead th{padding:12px;text-align:center;position:sticky;top:0;}
tbody tr{background:#fff;border-radius:10px;box-shadow:0 6px 14px rgba(67,160,71,0.06);transition:transform .15s ease;}
tbody tr:hover{transform:translateY(-3px);}
td{padding:10px;text-align:center;color:#2e7d32;vertical-align:middle;}
.cell-left{text-align:left;padding-left:16px;font-weight:600;}

.empty-msg{text-align:center;color:#8aa58f;padding:20px;font-style:italic;}

.pagination{display:flex;gap:12px;justify-content:center;align-items:center;margin-top:12px;}
.pagination button{padding:8px 12px;border-radius:8px;border:none;background:#43a047;color:#fff;cursor:pointer;}
.pagination button:disabled{opacity:0.5;cursor:not-allowed;}
</style>
