// ======================
// GLOBAL STATE
// ======================
let senior = "no";
let tdsMode = "off";
let panStatus = "yes";
let form121 = "no";
let payoutType = "monthly";


// ======================
// SAFE GET
// ======================
function el(id){
    return document.getElementById(id);
}


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
// TOGGLES
// ======================
function setSenior(v){
    senior = v;
    el("seniorNo")?.classList.toggle("active", v==="no");
    el("seniorYes")?.classList.toggle("active", v==="yes");
    autoRate();
}

function setTDS(v){
    tdsMode = v;
    el("tdsOff")?.classList.toggle("active", v==="off");
    el("tdsOn")?.classList.toggle("active", v==="on");
    if(el("tdsOptions")) el("tdsOptions").style.display = v==="on"?"block":"none";
}

function setPAN(v){
    panStatus = v;
}

function setForm(v){
    form121 = v;
}

function setPayout(v){
    payoutType = v;
    el("monthly")?.classList.toggle("active", v==="monthly");
    el("quarterly")?.classList.toggle("active", v==="quarterly");
}


// ======================
// AUTO RATE
// ======================
function autoRate(){
    let d = +el("duration")?.value;
    let unit = el("unit")?.value;
    let display = el("rateDisplay");

    if(!d || !unit || !display) return;

    let days = getDays(d, unit);
    let slab = table.find(r=>days>=r.min && days<=r.max);

    if(slab){
        let r = senior==="yes"?slab.s:slab.g;
        display.innerText = r + "%";
    }
}

document.addEventListener("input", autoRate);


// ======================
// TDS
// ======================
function calculateTDS(interest){

    if(tdsMode==="off") return {tds:0,net:interest,status:"TDS Off"};

    let threshold = senior==="yes"?100000:50000;
    let rate = panStatus==="no"?0.20:0.10;

    if(form121==="yes") return {tds:0,net:interest,status:"Form 121 Submitted"};

    if(interest<=threshold) return {tds:0,net:interest,status:"Below Threshold"};

    let tds = interest * rate;

    return {tds,net:interest-tds,status:"TDS Deducted",rate:rate*100};
}


// ======================
// RENDER
// ======================
function render(html){
    let r = el("result");
    if(r) r.innerHTML = html;
}


// ======================
// RIDC
// ======================
function calculateRIDC(){

    let P = +el("amount")?.value;
    let D = +el("duration")?.value;
    let unit = el("unit")?.value;

    if(!P) return showError("Enter deposit amount");
    if(!D) return showError("Enter duration");

    let days = getDays(D, unit);
    let slab = table.find(r=>days>=r.min && days<=r.max);
    if(!slab) return showError("Invalid duration");

    let r = senior==="yes"?slab.s:slab.g;

    let maturity, interest;

    if(days<180){
        interest=(P*r*days)/(365*100);
        maturity=P+interest;
    } else {
        let q=Math.floor(days/91);
        maturity=P*Math.pow(1+r/100/4,q);
        let rem=days-(q*91);
        maturity+=(maturity*r*rem)/(365*100);
        interest=maturity-P;
    }

    let tds=calculateTDS(interest);

    render(`
    <div class="result-line"><span>Maturity</span><span>₹${formatINR(maturity)}</span></div>
    <div class="result-line"><span>Interest</span><span>₹${formatINR(interest)}</span></div>
    <div class="result-line"><span>Status</span><span>${tds.status}</span></div>
    `);
}


// ======================
// MIDR
// ======================
function calculateMIDR(){

    let P = +el("amount")?.value;
    let D = +el("duration")?.value;
    let unit = el("unit")?.value;

    if(!P) return showError("Enter amount");
    if(!D) return showError("Enter duration");

    let days = getDays(D, unit);
    let slab = table.find(r=>days>=r.min && days<=r.max);

    let r = senior==="yes"?slab.s:slab.g;
    let interest=(P*r*days)/(365*100);

    let cycle=payoutType==="monthly"?30:91;
    let payouts=Math.floor(days/cycle);
    let per=interest/payouts;

    render(`
    <div class="result-line"><span>Payout</span><span>₹${formatINR(per)}</span></div>
    <div class="result-line"><span>Total Interest</span><span>₹${formatINR(interest)}</span></div>
    `);
}


// ======================
// RD
// ======================
function calculateRD(){

    let P=+el("monthly")?.value;
    let D=+el("duration")?.value;
    let unit=el("unit")?.value;

    if(!P) return showError("Enter monthly deposit");

    let months=unit==="months"?D:Math.floor(D/30);
    let days=getDays(D,unit);

    let slab=table.find(r=>days>=r.min&&days<=r.max);
    let r=senior==="yes"?slab.s:slab.g;

    let maturity=0;

    for(let i=0;i<months;i++){
        let rem=months-i;
        maturity+=P*Math.pow(1+r/100/4,rem/3);
    }

    let total=P*months;
    let interest=maturity-total;

    render(`
    <div class="result-line"><span>Total</span><span>₹${formatINR(total)}</span></div>
    <div class="result-line"><span>Maturity</span><span>₹${formatINR(maturity)}</span></div>
    <div class="result-line"><span>Interest</span><span>₹${formatINR(interest)}</span></div>
    `);
}


// ======================
function showError(msg){
    let bar=el("snackbar");
    if(!bar) return;
    bar.innerText=msg;
    bar.classList.add("show");
    setTimeout(()=>bar.classList.remove("show"),2000);
}

function goBack(){
    history.length>1?history.back():location.href="index.html";
}