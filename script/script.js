function shareResult(){

    let text = document.getElementById("result").innerText;

    if(!navigator.share){
        alert("Sharing not supported on this device");
        return;
    }

    navigator.share({
        title: "Bank Calculator Result",
        text: text
    }).catch((err)=>{
        console.log("Share cancelled", err);
    });
}


// ==== DEFAULT =====

let senior = "no";
let panStatus = "yes";
let staff = "no";
let payoutType = "monthly";

// ======================
// UTIL
// ======================

function getDays(v,u){
    return u==="days"?v:u==="months"?v*(365/12):v*365;
}
function formatINR(val){
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(val));
}
function getMaturityDate(value, unit){
    let d = new Date();
    if(unit==="days") d.setDate(d.getDate()+Number(value));
    if(unit==="months") d.setMonth(d.getMonth()+Number(value));
    if(unit==="years") d.setFullYear(d.getFullYear()+Number(value));

    return `${d.getDate()} ${d.toLocaleString("en-GB",{month:"long"})}, ${d.getFullYear()}`;
}

// ======================
// BACK BUTTON
// ======================

function goBack(){
    if(window.history.length > 1){
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
}

// ======================
// TDS
// ======================

function calculateTDS(interest){
    let threshold = (senior==="yes") ? 100000 : 50000;

    if(interest < threshold){
        return {applicable:false, tds:0, net:interest};
    }

    let rate = (panStatus==="no") ? 0.20 : 0.10;
    let tds = interest * rate;

    return {
        applicable:true,
        tds:tds,
        net:interest - tds,
        rate:rate*100
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
    let unitVal = document.getElementById("unit").value;
    let days = getDays(D, unit.value);
    let r = getRate(days);
if(!r){
    return showError("Invalid duration");
}
    let maturity, interest;
    if(days < 180){
        interest = (P*r*days)/(365*100);
        maturity = P + interest;
    } else {
        let q = Math.floor(days/91);
        maturity = P * Math.pow(1+r/100/4,q);
        let rem = days - (q*91);
        maturity += (maturity*r*rem)/(365*100);
        interest = maturity - P;
    }
    let tdsData = calculateTDS(interest);
    result.innerHTML = `
<div class="maturity-row">

<div class="maturity-chip">
<strong>Maturity</strong> :‎ ‎ ${getMaturityDate(D, unitVal)}
</div>

<div class="share-btn" onclick="shareResult()">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M0 0h24v24H0z" fill="none"/>
<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
</svg>
</div>

</div>

${tdsData.applicable ? `
<div class="result-line">
<span>Maturity (Without TDS)</span>
<span class="strong gain">₹${formatINR(maturity)}</span>
</div>` : `
<div class="result-line">
<span>Maturity Amount</span>
<span class="strong gain">₹${formatINR(maturity)}</span>
</div>`}

<div class="result-line">
<span>Total Interest</span>
<span class="gain">+ ₹${formatINR(interest)}</span>
</div>

${tdsData.applicable ? `
<div class="result-line loss strong">
<span class="tds-label">TDS (${tdsData.rate}%)</span>
<span class="loss">- ₹${formatINR(tdsData.tds)}</span>
</div>

<div class="result-line">
<span>Net Interest</span>
<span class="gain">+ ₹${formatINR(tdsData.net)}</span>
</div>

<div class="result-line">
<span>Maturity (With TDS)</span>
<span class="strong gain">₹${formatINR(maturity - tdsData.tds)}</span>
</div>` : ""}
`;
scrollToResult();
}

// ======================
// MIDR
// ======================

function calculateMIDR(){
    let P = +amount.value;
    let D = +duration.value;
    if(!P) return showError("Enter deposit amount");
    if(!D) return showError("Enter duration");
    let unitVal = document.getElementById("unit").value;
    let days = getDays(D, unit.value);
    let r = getRate(days);
if(!r){
    return showError("Invalid duration");
}

    let interest = (P*r*days)/(365*100);
    let tdsData = calculateTDS(interest);
    let cycles = Math.max(1, Math.floor(days/(payoutType==="monthly"?30:91)));

    result.innerHTML = `
<div class="maturity-chip">
<strong>Maturity</strong> :‎ ‎ ${getMaturityDate(D, unitVal)}
</div>

${tdsData.applicable ? `
<div class="result-line">
<span>Payout (Without TDS)</span>
<span class="gain strong">₹${formatINR(interest/cycles)}</span>
</div>
` : `
<div class="result-line">
<span>Payout</span>
<span class="gain strong">₹${formatINR(interest/cycles)}</span>
</div>
`}

<div class="result-line">
<span>Maturity Amount</span>
<span>₹${formatINR(P)}</span>
</div>

<div class="result-line">
<span>Total Interest</span>
<span class="gain">+ ₹${formatINR(interest)}</span>
</div>

${tdsData.applicable ? `
<div class="result-line loss strong">
<span class="tds-label">TDS (${tdsData.rate}%)</span>
<span class="loss">- ₹${formatINR(tdsData.tds)}</span>
</div>

<div class="result-line">
<span>Net Interest</span>
<span class="gain">+ ₹${formatINR(tdsData.net)}</span>
</div>

<div class="result-line">
<span>Payout (With TDS)</span>
<span class="gain strong">₹${formatINR(tdsData.net/cycles)}</span>
</div>` : `
`}
`;
scrollToResult();
}

// ======================
// RD
// ======================

function calculateRD(){
    let P = +monthly.value;
    let D = +duration.value;
    if(!P) return showError("Enter monthly deposit");
    if(!D) return showError("Enter duration");
    let unitVal = document.getElementById("unit").value;
    let months = unit.value==="months"?D:Math.floor(D/30);
    let days = getDays(D, unit.value);
    let r = getRate(days);
if(!r){
    return showError("Invalid duration");
}
    let maturity=0;
    for(let i=0;i<months;i++){
        maturity += P*Math.pow(1+r/100/4,(months-i)/3);
    }
    let interest = maturity - (P*months);
    let tdsData = calculateTDS(interest);
    result.innerHTML = `
<div class="maturity-chip">
<strong>Maturity</strong> :‎ ‎ ${getMaturityDate(D, unitVal)}
</div>

<div class="result-line">
<span>Total Deposit</span>
<span>₹${formatINR(P*months)}</span>
</div>

${tdsData.applicable ? `
<div class="result-line">
<span>Maturity (Without TDS)</span>
<span class="gain strong">₹${formatINR(maturity)}</span>
</div>` : `
<div class="result-line">
<span>Maturity Amount</span>
<span class="gain strong">₹${formatINR(maturity)}</span>
</div>`}

<div class="result-line">
<span>Total Interest</span>
<span class="gain">+ ₹${formatINR(interest)}</span>
</div>

${tdsData.applicable ? `
<div class="result-line strong loss">
<span class="tds-label">TDS (${tdsData.rate}%)</span>
<span class="loss">- ₹${formatINR(tdsData.tds)}</span>
</div>

<div class="result-line">
<span>Net Interest</span>
<span class="gain">+ ₹${formatINR(tdsData.net)}</span>
</div>

<div class="result-line">
<span>Maturity (With TDS)</span>
<span class="gain strong">₹${formatINR(maturity - tdsData.tds)}</span>
</div>` : ""}
`;
scrollToResult();
}

// ======================
// RESET
// ======================

function resetRIDC(){
    amount.value="";
    duration.value="";
    result.innerHTML = `
<div class="result-line"><span>Maturity Amount</span><span>--</span></div>
<div class="result-line"><span>Interest Earned</span><span>--</span></div>`;
}

function resetMIDR(){
    amount.value="";
    duration.value="";
    result.innerHTML = `
<div class="result-line"><span>Payout</span><span>--</span></div>
<div class="result-line"><span>Maturity Amount</span><span>--</span></div>
<div class="result-line"><span>Total Interest</span><span>--</span></div>`;
}

function resetRD(){
    monthly.value="";
    duration.value="";
    result.innerHTML = `
<div class="result-line"><span>Total Deposit</span><span>--</span></div>
<div class="result-line"><span>Maturity Amount</span><span>--</span></div>
<div class="result-line"><span>Total Interest</span><span>--</span></div>`;
}

// ======================
// SNACKBAR ERROR
// ======================

function showError(msg){
    let bar = document.getElementById("snackbar");
    if(!bar) return alert(msg);

    bar.innerText = msg;
    bar.classList.add("show");

    setTimeout(()=>bar.classList.remove("show"),2500);
}

// ======================
window.addEventListener("pageshow", ()=>window.scrollTo(0,0));

// ======================
// TOGGLES
// ======================

// SENIOR
function setSenior(val){
    senior = val;

    seniorNo.classList.toggle("active", val==="no");
    seniorYes.classList.toggle("active", val==="yes");

    autoRate();
}

// STAFF
function setStaff(val){
    staff = val;

    staffNo.classList.toggle("active", val==="no");
    staffYes.classList.toggle("active", val==="yes");

    autoRate();
}

// PAN
function setPAN(val){
    panStatus = val;

    panYes.classList.toggle("active", val==="yes");
    panNo.classList.toggle("active", val==="no");
}

// PAYOUT (MIDR)
function setPayout(val){
    payoutType = val;

    monthly.classList.toggle("active", val==="monthly");
    quarterly.classList.toggle("active", val==="quarterly");
}

// ======================
// MODAL MENU 
// ======================

function openUnit(){
    const modal = document.getElementById("unitModal");
    if(modal) modal.style.display = "flex";
}

function closeUnit(){
    const modal = document.getElementById("unitModal");
    if(modal) modal.style.display = "none";
}

function selectUnit(val, text, el){

    const unitEl = document.getElementById("unit");
    const unitText = document.getElementById("unitText");

    if(unitEl) unitEl.value = val;
    if(unitText) unitText.innerText = text;

    document.querySelectorAll(".option").forEach(o=>o.classList.remove("active"));
    el.classList.add("active");

    closeUnit();
    autoRate();
}

// CLOSE ON OUTSIDE CLICK

window.addEventListener("click", function(e){
    const modal = document.getElementById("unitModal");
    if(e.target === modal){
        closeUnit();
    }
});


// ======================
// AUTO SCROLL TO RESULT
// ======================

function scrollToResult(){
    const el = document.getElementById("result");
    if(!el) return;

    setTimeout(()=>{
        el.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 50);
}
