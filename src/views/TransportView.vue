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

    <!-- Payment / Records Table -->
    <section class="card fade-in">
      <h3 class="card-title">📋 वाहतूक नोंदी व पेमेंट्स</h3>
      <div class="table-responsive" v-if="paginatedData.length">
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
            <tr v-for="item in paginatedData" :key="item.id">
              <td class="cell-left">{{ item.customer }}</td>
              <td>{{ item.mobile }}</td>
              <td>{{ item.crop }}</td>
              <td>{{ item.crates }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>
                <input type="checkbox" v-model="item.paid" @change="saveRecords" /> {{ item.paid ? 'Paid' : 'Unpaid' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="empty-msg">⚠ नोंदी सापडल्या नाहीत</p>

      <div class="pagination" v-if="paginatedData.length">
        <button @click="prevPage" :disabled="currentPage===1">⏮ मागे</button>
        <span>पृष्ठ {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage===totalPages">पुढे ⏭</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const customer = ref('')
const mobile = ref('')
const crop = ref('')
const crates = ref('')
const date = ref('')
const data = ref([])
const currentPage = ref(1)
const pageSize = 5
const listeningTarget = ref(null)
let recognition = null

// Load records from localStorage
onMounted(() => {
  const stored = localStorage.getItem('transportRecords')
  if(stored){
    try{ data.value = JSON.parse(stored) }catch(e){ data.value=[] }
  }
})

// Save records to localStorage
function saveRecords(){
  localStorage.setItem('transportRecords', JSON.stringify(data.value))
}

// Add new transport record
function addRecord(){
  const newRecord = {
    id: Date.now(),
    customer: customer.value,
    mobile: mobile.value,
    crop: crop.value,
    crates: crates.value,
    date: date.value || new Date().toISOString(),
    paid: false
  }
  data.value.unshift(newRecord)
  saveRecords()
  customer.value = mobile.value = crop.value = crates.value = date.value = ''
  currentPage.value = 1
}

// Computed lists
const customerList = computed(()=>[...new Set(data.value.map(r=>r.customer).filter(Boolean))])
const cropList = computed(()=>[...new Set(data.value.map(r=>r.crop).filter(Boolean))])

// Pagination
const totalPages = computed(()=>Math.max(1, Math.ceil(data.value.length/pageSize)))
const paginatedData = computed(()=>{
  const start = (currentPage.value-1)*pageSize
  return data.value.slice(start,start+pageSize)
})
const nextPage=()=>{ if(currentPage.value<totalPages.value) currentPage.value++ }
const prevPage=()=>{ if(currentPage.value>1) currentPage.value-- }

// Format date in Marathi
function formatDate(d){ return d? new Date(d).toLocaleDateString('mr-IN') : '' }

// Speech Recognition
function initSpeechRecognition(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if(!SpeechRecognition) return
  recognition = new SpeechRecognition()
  recognition.lang = 'mr-IN'
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event)=>{
    let transcript = ''
    for(let i=0;i<event.results.length;i++){ transcript+=event.results[i][0].transcript }
    transcript = transcript.trim()
    switch(listeningTarget.value){
      case 'customer': customer.value = transcript; break;
      case 'mobile': mobile.value = transcript.replace(/\D/g,'').slice(0,10); break;
      case 'crop': crop.value = transcript; break;
      case 'crates': crates.value = transcript.replace(/\D/g,''); break;
    }
  }

  recognition.onend = ()=>{ listeningTarget.value=null }
}

function toggleMic(target){
  if(!recognition) initSpeechRecognition()
  if(listeningTarget.value===target){ recognition.stop(); listeningTarget.value=null; return }
  if(listeningTarget.value){ recognition.stop(); listeningTarget.value=null }
  listeningTarget.value = target
  try{ recognition.start() } catch(e){ setTimeout(()=>{ try{ recognition.start() } catch(e){ listeningTarget.value=null } },250) }
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

</style>
