// ======================
// STATE
// ======================
let apyFreq = "monthly";
let selectedPension = 1000;


// ======================
// SET FREQUENCY
// ======================
function setAPYFreq(type){
    apyFreq = type;

    ["monthly","quarterly","halfyearly"].forEach(id=>{
        document.getElementById(id).classList.remove("active");
    });

    document.getElementById(type).classList.add("active");
}


// ======================
// SET PENSION
// ======================
function setPension(value){
    selectedPension = value;

    [1000,2000,3000,4000,5000].forEach(v=>{
        document.getElementById("p"+v).classList.remove("active");
    });

    document.getElementById("p"+value).classList.add("active");
}


// ======================
// APY TABLE (OFFICIAL)
// ======================
const apyTable = {
18:{1000:{m:42,q:125,h:248,c:170000},2000:{m:84,q:250,h:496,c:340000},3000:{m:126,q:376,h:744,c:510000},4000:{m:168,q:501,h:991,c:680000},5000:{m:210,q:626,h:1239,c:850000}},
19:{1000:{m:46,q:137,h:271,c:170000},2000:{m:92,q:274,h:543,c:340000},3000:{m:138,q:411,h:814,c:510000},4000:{m:183,q:545,h:1080,c:680000},5000:{m:228,q:679,h:1346,c:850000}},
20:{1000:{m:50,q:149,h:295,c:170000},2000:{m:100,q:298,h:590,c:340000},3000:{m:150,q:447,h:885,c:510000},4000:{m:198,q:590,h:1169,c:680000},5000:{m:248,q:739,h:1464,c:850000}},
21:{1000:{m:54,q:161,h:319,c:170000},2000:{m:108,q:322,h:637,c:340000},3000:{m:162,q:483,h:956,c:510000},4000:{m:215,q:641,h:1269,c:680000},5000:{m:269,q:802,h:1588,c:850000}},
22:{1000:{m:59,q:176,h:348,c:170000},2000:{m:117,q:349,h:690,c:340000},3000:{m:177,q:527,h:1046,c:510000},4000:{m:234,q:697,h:1381,c:680000},5000:{m:292,q:870,h:1723,c:850000}},
23:{1000:{m:64,q:191,h:378,c:170000},2000:{m:127,q:378,h:749,c:340000},3000:{m:192,q:572,h:1133,c:510000},4000:{m:254,q:757,h:1499,c:680000},5000:{m:318,q:948,h:1877,c:850000}},
24:{1000:{m:70,q:209,h:413,c:170000},2000:{m:139,q:414,h:820,c:340000},3000:{m:208,q:620,h:1228,c:510000},4000:{m:277,q:826,h:1635,c:680000},5000:{m:346,q:1031,h:2042,c:850000}},
25:{1000:{m:76,q:226,h:449,c:170000},2000:{m:151,q:450,h:891,c:340000},3000:{m:226,q:674,h:1334,c:510000},4000:{m:301,q:897,h:1776,c:680000},5000:{m:376,q:1121,h:2219,c:850000}},
26:{1000:{m:82,q:244,h:484,c:170000},2000:{m:164,q:489,h:968,c:340000},3000:{m:246,q:733,h:1452,c:510000},4000:{m:327,q:975,h:1930,c:680000},5000:{m:409,q:1219,h:2414,c:850000}},
27:{1000:{m:90,q:268,h:531,c:170000},2000:{m:178,q:530,h:1050,c:340000},3000:{m:268,q:799,h:1582,c:510000},4000:{m:356,q:1061,h:2101,c:680000},5000:{m:446,q:1329,h:2632,c:850000}},
28:{1000:{m:97,q:289,h:572,c:170000},2000:{m:194,q:578,h:1145,c:340000},3000:{m:292,q:870,h:1723,c:510000},4000:{m:388,q:1156,h:2290,c:680000},5000:{m:485,q:1445,h:2862,c:850000}},
29:{1000:{m:106,q:316,h:626,c:170000},2000:{m:212,q:632,h:1251,c:340000},3000:{m:318,q:948,h:1877,c:510000},4000:{m:423,q:1261,h:2496,c:680000},5000:{m:529,q:1577,h:3122,c:850000}},
30:{1000:{m:116,q:346,h:685,c:170000},2000:{m:231,q:688,h:1363,c:340000},3000:{m:347,q:1034,h:2048,c:510000},4000:{m:462,q:1377,h:2727,c:680000},5000:{m:577,q:1720,h:3405,c:850000}},
31:{1000:{m:126,q:376,h:744,c:170000},2000:{m:252,q:751,h:1487,c:340000},3000:{m:379,q:1129,h:2237,c:510000},4000:{m:504,q:1502,h:2974,c:680000},5000:{m:630,q:1878,h:3718,c:850000}},
32:{1000:{m:138,q:411,h:814,c:170000},2000:{m:276,q:823,h:1629,c:340000},3000:{m:414,q:1234,h:2443,c:510000},4000:{m:551,q:1642,h:3252,c:680000},5000:{m:689,q:2053,h:4066,c:850000}},
33:{1000:{m:151,q:450,h:891,c:170000},2000:{m:302,q:900,h:1782,c:340000},3000:{m:453,q:1350,h:2673,c:510000},4000:{m:602,q:1794,h:3553,c:680000},5000:{m:752,q:2241,h:4438,c:850000}},
34:{1000:{m:165,q:492,h:974,c:170000},2000:{m:330,q:983,h:1948,c:340000},3000:{m:495,q:1475,h:2921,c:510000},4000:{m:659,q:1964,h:3889,c:680000},5000:{m:824,q:2456,h:4863,c:850000}},
35:{1000:{m:181,q:539,h:1068,c:170000},2000:{m:362,q:1079,h:2136,c:340000},3000:{m:543,q:1618,h:3205,c:510000},4000:{m:722,q:2152,h:4261,c:680000},5000:{m:902,q:2688,h:5323,c:850000}},
36:{1000:{m:198,q:590,h:1169,c:170000},2000:{m:396,q:1180,h:2337,c:340000},3000:{m:594,q:1770,h:3506,c:510000},4000:{m:792,q:2360,h:4674,c:680000},5000:{m:990,q:2950,h:5843,c:850000}},
37:{1000:{m:218,q:650,h:1287,c:170000},2000:{m:436,q:1299,h:2573,c:340000},3000:{m:654,q:1949,h:3860,c:510000},4000:{m:870,q:2593,h:5134,c:680000},5000:{m:1087,q:3239,h:6415,c:850000}},
38:{1000:{m:240,q:715,h:1416,c:170000},2000:{m:480,q:1430,h:2833,c:340000},3000:{m:720,q:2146,h:4249,c:510000},4000:{m:957,q:2852,h:5648,c:680000},5000:{m:1196,q:3564,h:7058,c:850000}},
39:{1000:{m:264,q:787,h:1558,c:170000},2000:{m:528,q:1574,h:3116,c:340000},3000:{m:792,q:2360,h:4674,c:510000},4000:{m:1054,q:3141,h:6220,c:680000},5000:{m:1318,q:3928,h:7778,c:850000}},
40:{1000:{m:291,q:868,h:1719,c:170000},2000:{m:582,q:1735,h:3438,c:340000},3000:{m:873,q:2603,h:5156,c:510000},4000:{m:1164,q:3469,h:6873,c:680000},5000:{m:1454,q:4335,h:8591,c:850000}}
};


// ======================
// CALCULATE
// ======================
function calculateAPY(){

    let age = +document.getElementById("age").value;
    let result = document.getElementById("result");

    if(!age) return showError("Enter age");
    if(age < 18 || age > 40) return showError("Age must be 18–40");

    let data = apyTable[age]?.[selectedPension];
    if(!data) return showError("Data not available");

    let contribution, label;

    if(apyFreq === "monthly"){
        contribution = data.m;
        label = "Monthly Contribution";
    }
    else if(apyFreq === "quarterly"){
        contribution = data.q;
        label = "Quarterly Contribution";
    }
    else{
        contribution = data.h;
        label = "Half-Yearly Contribution";
    }

    let years = 60 - age;
    let total = data.m * 12 * years;

    result.innerHTML = `
    <div class="result-line">
        <span>${label}</span>
        <span>₹${contribution}</span>
    </div>

    <div class="result-line">
        <span>Contribution Period</span>
        <span>${years} years</span>
    </div>

    <div class="result-line">
        <span>Total Contribution</span>
        <span>₹${total.toLocaleString('en-IN')}</span>
    </div>

    <div class="result-line">
        <span>Amount to Nominee</span>
        <span>₹${data.c.toLocaleString('en-IN')}</span>
    </div>
    `;
closeKeyboard();
}


// ======================
// RESET
// ======================
function resetAPY(){
    document.getElementById("age").value = "";
    document.getElementById("result").innerHTML =` <div id="result">

    <div class="result-line">
        <span>Contribution</span>
        <span>--</span>
    </div>

    <div class="result-line">
        <span>Frequency</span>
        <span>--</span>
    </div>

    <div class="result-line">
        <span>Total Contribution</span>
        <span>--</span>
    </div>

    <div class="result-line">
        <span>Amount to Nominee</span>
        <span>--</span>
    </div>

</div>`;

    setPension(1000);
    setAPYFreq("monthly");
}


// ======================
// NAVIGATION
// ======================
function goBack(){
    window.location.href = "index.html";
}


// ======================
// ERROR
// ======================
function showError(msg){
    let bar = document.getElementById("snackbar");
    if(!bar) return;

    bar.innerText = msg;
    bar.classList.add("show");

    setTimeout(()=>bar.classList.remove("show"),2500);
}

function closeKeyboard(){
    if(document.activeElement){
        document.activeElement.blur();
    }
}