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
// RATE
// ======================

function getRate(days){
    let slab = table.find(r => days>=r.min && days<=r.max);
    if(!slab) return null;
    let r = senior==="yes"?slab.s:slab.g;
    if(staff==="yes") r += 1.00;
    let amountEl = document.getElementById("amount");
    let amt = amountEl ? Number(amountEl.value) : 0;
    if(amt >= 10000000){ 
        r += 0.10;
    }
    return r;
}

// ======================
// AUTO RATE
// ======================

function autoRate(){
    const dEl = document.getElementById("duration");
    const uEl = document.getElementById("unit");
    const rateDisplay = document.getElementById("rateDisplay");
    if(!dEl || !uEl || !rateDisplay) return;
    let d = +dEl.value;
    if(!d){
        rateDisplay.innerText="--";
        return;
    }
    let days = getDays(d, uEl.value);
    let slab = table.find(r=>days>=r.min && days<=r.max);
    if(slab){
    let r = senior==="yes"?slab.s:slab.g;
    if(staff==="yes") r += 1.00;
    let amt = Number(document.getElementById("amount")?.value || 0);
    if(amt >= 10000000){
        r += 0.10;
    }
    rateDisplay.innerText = r + "%";
}
}
document.addEventListener("input", autoRate);