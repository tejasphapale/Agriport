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

        <!-- Customer Name -->
        <div class="input-with-mic">
          <input v-model="customer" placeholder="👤 ग्राहकाचे नाव" list="customerSuggestions" required />
          <button type="button" class="mic-btn" :class="{ listening: listeningTarget==='customer' }" @click="toggleMic('customer')">
            <span v-if="listeningTarget==='customer'">⏺</span>
            <span v-else>🎤</span>
          </button>
        </div>
        <datalist id="customerSuggestions">
          <option v-for="c in customerList" :key="c">{{ c }}</option>
        </datalist>

        <!-- Mobile -->
        <div class="input-with-mic">
          <input v-model="mobile" placeholder="📞 मोबाईल नंबर" type="tel" maxlength="10" required />
          <button type="button" class="mic-btn" :class="{ listening: listeningTarget==='mobile' }" @click="toggleMic('mobile')">
            <span v-if="listeningTarget==='mobile'">⏺</span>
            <span v-else>🎤</span>
          </button>
        </div>

        <!-- Crop -->
        <div class="input-with-mic">
          <input v-model="crop" placeholder="🌾 पिकाचे नाव" list="cropSuggestions" required />
          <button type="button" class="mic-btn" :class="{ listening: listeningTarget==='crop' }" @click="toggleMic('crop')">
            <span v-if="listeningTarget==='crop'">⏺</span>
            <span v-else>🎤</span>
          </button>
        </div>
        <datalist id="cropSuggestions">
          <option v-for="c in cropList" :key="c">{{ c }}</option>
        </datalist>

        <!-- Crates -->
        <div class="input-with-mic">
          <input v-model="crates" type="text" placeholder="📦 क्रेट्सची संख्या" required />
          <button type="button" class="mic-btn" :class="{ listening: listeningTarget==='crates' }" @click="toggleMic('crates')">
            <span v-if="listeningTarget==='crates'">⏺</span>
            <span v-else>🎤</span>
          </button>
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
      <label>👤 ग्राहकाचे नाव</label>
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


    <section class="card fade-in">
  <h3 class="card-title">📤 नोंदी एक्सपोर्ट करा</h3>

  <div class="export-flex">
    <button class="btn-export" @click="downloadCSV">
      📄 CSV डाउनलोड
    </button>

    <button class="btn-export" @click="downloadPDF">
      📕 PDF डाउनलोड
    </button>
  </div>
</section>


    <!-- Payment / Records Table -->
    <section class="card fade-in">
      <h3 class="card-title">📋 वाहतूक नोंदी व पेमेंट्स</h3>

      <div class="table-responsive" v-if="filteredPaginated.length">
        <table>
          <thead>
            <tr>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Inputs
const customer = ref('')
const mobile = ref('')
const crop = ref('')
const crates = ref('')
const date = ref('')

// DATA STORAGE
const data = ref([])

// FILTERS
const filter = ref({
  name: '',
  date: '',
  month: '',
  year: ''
})

// PAGINATION
const currentPage = ref(1)
const pageSize = 7

// Load Records
onMounted(() => {
  const stored = localStorage.getItem('transportRecords')
  if (!stored) return
  try { data.value = JSON.parse(stored) } catch (e) {}
})

// Save Records
function saveRecords() {
  localStorage.setItem('transportRecords', JSON.stringify(data.value))
}

// Add New Record
function addRecord() {
  data.value.unshift({
    id: Date.now(),
    customer: customer.value,
    mobile: mobile.value,
    crop: crop.value,
    crates: crates.value,
    date: date.value,
    paid: false
  })
  saveRecords()
  customer.value = mobile.value = crop.value = crates.value = date.value = ''
  currentPage.value = 1
}

// Unique Lists
const customerList = computed(() => [...new Set(data.value.map(r => r.customer))])
const cropList = computed(() => [...new Set(data.value.map(r => r.crop))])
const years = computed(() => [...new Set(data.value.map(r => new Date(r.date).getFullYear()))])

// ----------------------
// FILTER LOGIC
// ----------------------
const filteredData = computed(() => {
  return data.value.filter(r => {
    const d = new Date(r.date)

    return (
      (!filter.value.name || r.customer.includes(filter.value.name)) &&
      (!filter.value.date || r.date === filter.value.date) &&
      (!filter.value.month || d.getMonth() + 1 == filter.value.month) &&
      (!filter.value.year || d.getFullYear() == filter.value.year)
    )
  })
})

function clearFilters() {
  filter.value = { name: '', date: '', month: '', year: '' }
}

function filterToday() {
  filter.value.date = new Date().toISOString().split("T")[0]
}

function filterWeek() {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  filter.value.date = ''
  filter.value.month = ''
  filter.value.year = ''

  data.value = data.value.filter(r => new Date(r.date) >= weekStart)
}

// ----------------------
// PAGINATION
// ----------------------
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredData.value.length / pageSize))
)

const filteredPaginated = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// ----------------------
// EXPORT CSV
// ----------------------
function downloadCSV() {
  const rows = filteredData.value.map(r =>
    `${r.customer},${r.mobile},${r.crop},${r.crates},${r.date},${r.paid ? "Paid" : "Unpaid"}`
  )

  const csv =
    "Customer,Mobile,Crop,Crates,Date,Paid\n" + rows.join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "transport_records.csv"
  link.click()
}

// ----------------------
// EXPORT PDF
// ----------------------
function downloadPDF() {
  const content = filteredData.value
    .map(r => `${r.customer} | ${r.mobile} | ${r.crop} | ${r.crates} | ${r.date} | ${r.paid ? "Paid" : "Unpaid"}`)
    .join("\n")

  const blob = new Blob([content], { type: "application/pdf" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "transport_records.pdf"
  link.click()
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("mr-IN")
}
</script>



<style scoped>
.page{padding:0.5rem; max-width:1100px;margin:auto;font-family:'Poppins',sans-serif;background:linear-gradient(145deg,#f1f8e9,#ffffff);border-radius:18px;box-shadow:0 6px 25px rgba(0,0,0,0.08);min-height:100vh;}
.page-header{text-align:center;margin-bottom:1.5rem;}
.page-header h1{color:#2e7d32;font-weight:700;font-size:1.6rem;}
.subtitle{color:#555;}
.card{background: rgba(255,255,255,0.85); border-radius:12px; padding:1.4rem; margin-bottom:1.4rem; box-shadow:0 6px 18px rgba(12,60,26,0.04); border:1px solid rgba(255,255,255,0.6); backdrop-filter: blur(8px);}
.card-title{color:#2e7d32; border-left:4px solid #43a047; padding-left:10px; margin-bottom:1rem; font-weight:600;}
.form{display:flex; flex-wrap:wrap; gap:12px; align-items:center;}
.input-with-mic{position: relative; display:flex; align-items:center; width:100%;}
.input-with-mic input{flex:1; min-width:180px; padding:.8rem 3.4rem .8rem .9rem; border:1px solid #dfeee0; border-radius:10px; font-size:.95rem; background:#fff; outline:none;}
.mic-btn{position:absolute; right:8px; border:none; background:transparent; width:38px; height:38px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; transition: transform .12s ease, background .12s ease; color:#2e7d32;}
.mic-btn:hover{transform: scale(1.06); background: rgba(67,160,71,0.06);}
.mic-btn.listening{background: rgba(255, 92, 92, 0.12); color: #c62828; box-shadow: 0 4px 14px rgba(198,40,40,0.12);}
.btn-primary{background:#43a047;color:white;padding:.8rem 1.5rem;border:none;border-radius:10px;cursor:pointer;font-weight:700;box-shadow:0 6px 14px rgba(67,160,71,0.12);}
.btn-primary:hover{background:#2e7d32; transform:translateY(-1px);}
/* Container for table */
/* Table container */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 0;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px; /* compact spacing between rows */
  min-width: 780px;
  font-family: 'Poppins', sans-serif;
}

/* Table header */
thead tr {
  background: #2e7d32;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 8px;
  text-align: center;
}

thead th {
  padding: 12px;
  position: sticky;
  top: 0;
  z-index: 2;
  background: #2e7d32;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* Table body rows as cards */
tbody tr {
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(67, 160, 71, 0.08);
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 50px; /* reduced row height */
}

/* Hover effect */
tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(67, 160, 71, 0.15);
}

/* Table cells */
td {
  padding: 10px 12px; /* reduced padding */
  text-align: center;
  font-size: 0.9rem;
  color: #2e7d32;
  vertical-align: middle;
}

/* Left-aligned cells */
.cell-left {
  text-align: left;
  padding-left: 16px;
  font-weight: 500;
}

/* Zebra effect for card rows */
tbody tr:nth-child(even) {
  background: #f9fdf9;
}

/* Payment checkbox */
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #43a047;
  transform: scale(1.2);
}

/* Empty table message */
.empty-msg {
  text-align: center;
  font-style: italic;
  color: #a3b9a9;
  padding: 16px 0;
  font-size: 0.95rem;
}

/* Pagination styling */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.pagination button {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #43a047;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.15s ease;
}

.pagination button:disabled {
  background: #b2dfdb;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #2e7d32;
  transform: translateY(-1px);
}

.pagination span {
  font-weight: 500;
  color: #2e7d32;
  font-size: 0.9rem;
}


/* FILTER GRID */
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  font-size: 0.8rem;
  color: #2e7d32;
  font-weight: 600;
  margin-bottom: 4px;
}

.filter-item input,
.filter-item select {
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid #d9eadf;
  background: #ffffff;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
}

.filter-item input:focus,
.filter-item select:focus {
  border-color: #43a047;
  box-shadow: 0 0 6px rgba(67, 160, 71, 0.2);
}

/* FILTER ACTIONS */
.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.btn-small {
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  background: #2e7d32;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
}

.btn-small:hover {
  background: #1b5e20;
}

.btn-small.clear {
  background: #d32f2f;
}

.btn-small.clear:hover {
  background: #b71c1c;
}

/* EXPORT SECTION */
.export-flex {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-export {
  background: #00796b;
  color: #fff;
  border: none;
  padding: 0.9rem 1.4rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 121, 107, 0.15);
  transition: 0.2s ease;
}

.btn-export:hover {
  background: #004d40;
  transform: translateY(-2px);
}

</style>
