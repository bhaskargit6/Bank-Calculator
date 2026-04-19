function refreshApp(){
    localStorage.clear(); // optional reset
    window.location.href = window.location.pathname + "?v=" + Date.now();
}
// ======================
// INTEREST TABLE
// ======================
const table = [
    {min:7,max:14,g:3.0,s:3.0},
    {min:15,max:29,g:3.0,s:3.0},
    {min:30,max:45,g:3.0,s:3.0},
    {min:46,max:90,g:4.5,s:4.5},
    {min:91,max:179,g:4.5,s:4.5},
    {min:180,max:270,g:5.5,s:5.5},
    {min:271,max:364,g:5.5,s:5.5},
    {min:365,max:554,g:6.0,s:6.5},
    {min:555,max:555,g:6.5,s:7.0},
    {min:556,max:730,g:6.25,s:6.75},
    {min:731,max:1095,g:6.25,s:6.75},
    {min:1096,max:1825,g:6.0,s:6.5},
    {min:1826,max:3650,g:6.0,s:6.5}
];

// ======================
// INDEX FUNCTION
// ======================

function openInterest(){  
    window.location.href = "interest.html";  
}  
  
function setScheme(val, id){  
    localStorage.setItem("scheme", val);  
    document.getElementById(id).innerText = val;  
}

// ======================
// GLOBAL STATE
// ======================

let senior = "no";
let tdsMode = "off";
let panStatus = "yes";
let form121 = "no";


// ======================
// UTIL
// ======================

function formatINR(val){
    return new Intl.NumberFormat('en-IN').format(val.toFixed(2));
}

function getDays(v,u){
    return u==="days"?v:u==="months"?v*(365/12):v*365;
}

// ======================
// TOGGLES
// ======================
function setSenior(v){
    senior = v;
    seniorNo.classList.toggle("active", v==="no");
    seniorYes.classList.toggle("active", v==="yes");
    autoRate();
}

function setTDS(v){
    tdsMode = v;
    tdsOff.classList.toggle("active", v==="off");
    tdsOn.classList.toggle("active", v==="on");

    let box = document.getElementById("tdsOptions");
    if(box) box.style.display = (v==="on") ? "block" : "none";
}

function setPAN(v){
    panStatus = v;
    panYes.classList.toggle("active", v==="yes");
    panNo.classList.toggle("active", v==="no");
}

function setForm(v){
    form121 = v;
    formYes.classList.toggle("active", v==="yes");
    formNo.classList.toggle("active", v==="no");
}


// ======================
// AUTO RATE
// ======================
function autoRate(){
    if(!duration || !unit) return;

    let d = +duration.value;
    if(!d){
        rateDisplay.innerText="--";
        return;
    }

    let days = getDays(d, unit.value);
    let slab = table.find(r=>days>=r.min && days<=r.max);

    if(slab){
        let r = senior==="yes"?slab.s:slab.g;
        rateDisplay.innerText = r + "%";
    }
}

document.addEventListener("input", autoRate);


// ======================
// TDS ENGINE
// ======================

function calculateTDS(interest){

    if(tdsMode === "off"){
        return {tds:0, net:interest, status:"TDS Off"};
    }

    let threshold = (senior === "yes") ? 100000 : 50000;
    let rate = (panStatus === "no") ? 0.20 : 0.10;

    if(form121 === "yes"){
        return {tds:0, net:interest, status:"Form 121 Submitted"};
    }

    if(interest <= threshold){
        return {tds:0, net:interest, status:"Below Threshold"};
    }

    let tds = interest * rate;

    return {
        tds: tds,
        net: interest - tds,
        status: "TDS Deducted",
        rate: rate * 100
    };
}


// ======================
// RIDC
// ======================

function calculateRIDC(){

    let P = +amount.value;
    let D = +duration.value;

    if(!P) return showError("Enter deposit amount");
    if(!D) return showError("Enter duration");

    let days = getDays(D, unit.value);
    let slab = table.find(r => days >= r.min && days <= r.max);

    if(!slab) return showError("Duration not supported");

    let r = senior === "yes" ? slab.s : slab.g;

    let maturity, interest;

    if(days < 180){
        interest = (P * r * days) / (365 * 100);
        maturity = P + interest;
    } else {
        let q = Math.floor(days / 91);
        maturity = P * Math.pow(1 + r / 100 / 4, q);

        let rem = days - (q * 91);
        maturity += (maturity * r * rem) / (365 * 100);

        interest = maturity - P;
    }

    let tdsData = calculateTDS(interest);

    renderResult(maturity, interest, tdsData);
}
function renderResult(maturity, interest, tdsData){

    let result = document.getElementById("result");

    if(!result) return;

    result.innerHTML = `
    <div class="result-line">
        <span>Maturity Amount</span>
        <span>₹${formatINR(maturity)}</span>
    </div>

    <div class="result-line">
        <span>Interest Earned</span>
        <span>₹${formatINR(interest)}</span>
    </div>

    <div class="result-line">
        <span>Status</span>
        <span>${tdsData.status}</span>
    </div>

    ${tdsMode==="on" && tdsData.tds>0 ? `
    <div class="result-line">
        <span>TDS (${tdsData.rate}%)</span>
        <span>₹${formatINR(tdsData.tds)}</span>
    </div>

    <div class="result-line">
        <span>Net Interest</span>
        <span>₹${formatINR(tdsData.net)}</span>
    </div>` : ""}
    `;
}

// ======================
// MIDR
// ======================

let payoutType = "monthly";

function setPayout(v){
    payoutType = v;
    monthly.classList.toggle("active", v==="monthly");
    quarterly.classList.toggle("active", v==="quarterly");
}

function calculateMIDR(){

    let P = +amount.value;
    let D = +duration.value;

    if(!P) return showError("Enter deposit amount");
    if(!D) return showError("Enter duration");

    let days = getDays(D, unit.value);
    let slab = table.find(r => days >= r.min && days <= r.max);

    if(!slab) return showError("Duration not supported");

    let r = senior === "yes" ? slab.s : slab.g;

    let totalInterest = (P * r * days) / (365 * 100);

    let tdsData = calculateTDS(totalInterest);

    let cycleDays = payoutType === "monthly" ? 30 : 91;
    let cycles = Math.floor(days / cycleDays);

    let payout = (tdsData.net) / cycles;

    result.innerHTML =
    `<div class="result-line"><span>Maturity</span><span>₹${formatINR(P)}</span></div>
     <div class="result-line"><span>Total Interest</span><span>₹${formatINR(totalInterest)}</span></div>
     <div class="result-line"><span>Status</span><span>${tdsData.status}</span></div>

     ${tdsMode==="on" && tdsData.tds>0 ? `
     <div class="result-line"><span>TDS (${tdsData.rate}%)</span><span>₹${formatINR(tdsData.tds)}</span></div>
     <div class="result-line"><span>Net Interest</span><span>₹${formatINR(tdsData.net)}</span></div>` : ""}

     <div class="result-line"><span>Payout</span><span>₹${formatINR(payout)}</span></div>
     <div class="result-line"><span>No. of Payouts</span><span>${cycles}</span></div>`;
}


// ======================
// RD
// ======================

function calculateRD(){

    let P = +document.getElementById("monthly").value;
    let D = +duration.value;

    if(!P) return showError("Enter monthly deposit");
    if(!D) return showError("Enter duration");

    let months = unit.value==="months"?D:Math.floor(D/30);
    if(months<=0) return showError("Invalid duration");

    let days = getDays(D, unit.value);
    let slab = table.find(r => days >= r.min && days <= r.max);

    if(!slab) return showError("Duration not supported");

    let r = senior === "yes" ? slab.s : slab.g;

    let maturity = 0;

    for(let i=0;i<months;i++){
        let rem = months - i;
        let q = rem/3;
        maturity += P * Math.pow(1 + r/100/4, q);
    }

    let totalDeposit = P * months;
    let interest = maturity - totalDeposit;

    let tdsData = calculateTDS(interest);

    result.innerHTML =
    `<div class="result-line"><span>Total Deposit</span><span>₹${formatINR(totalDeposit)}</span></div>
     <div class="result-line"><span>Maturity</span><span>₹${formatINR(maturity)}</span></div>
     <div class="result-line"><span>Interest</span><span>₹${formatINR(interest)}</span></div>
     <div class="result-line"><span>Status</span><span>${tdsData.status}</span></div>

     ${tdsMode==="on" && tdsData.tds>0 ? `
     <div class="result-line"><span>TDS (${tdsData.rate}%)</span><span>₹${formatINR(tdsData.tds)}</span></div>
     <div class="result-line"><span>Net Interest</span><span>₹${formatINR(tdsData.net)}</span></div>` : ""}`;
}


// ======================
// RESET + ERROR
// ======================

function resetRIDC(){
    amount.value="";
    duration.value="";
    result.innerHTML="";
    rateDisplay.innerText="--";
}

function resetRD(){
    document.getElementById("monthly").value="";
    duration.value="";
    result.innerHTML="";
}

function showError(msg){
    let bar = document.getElementById("snackbar");
    if(!bar) return;

    bar.innerText = msg;
    bar.classList.add("show");

    setTimeout(()=>bar.classList.remove("show"),2500);
}

function goBack(){

    // If history exists → go back
    if(window.history.length > 1){
        window.history.back();
    } 
    else {
        // fallback → home
        window.location.href = "index.html";
    }
}