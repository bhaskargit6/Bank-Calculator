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

    document.getElementById("monthly").classList.remove("active");
    document.getElementById("quarterly").classList.remove("active");
    document.getElementById("halfyearly").classList.remove("active");

    document.getElementById(type).classList.add("active");
}

// ======================
// SET PENSION (SEGMENTED)
// ======================
function setPension(value){

    selectedPension = value;

    [1000,2000,3000,4000,5000].forEach(v=>{
        document.getElementById("p"+v).classList.remove("active");
    });

    document.getElementById("p"+value).classList.add("active");
}

// ======================
// APY TABLE (18–40)
// ======================
const apyTable = {
18:{1000:42,2000:84,3000:126,4000:168,5000:210},
19:{1000:46,2000:92,3000:138,4000:183,5000:228},
20:{1000:50,2000:100,3000:150,4000:198,5000:248},
21:{1000:54,2000:108,3000:162,4000:214,5000:269},
22:{1000:59,2000:117,3000:177,4000:234,5000:292},
23:{1000:64,2000:127,3000:192,4000:254,5000:318},
24:{1000:70,2000:139,3000:208,4000:277,5000:346},
25:{1000:76,2000:151,3000:226,4000:301,5000:376},
26:{1000:82,2000:164,3000:246,4000:327,5000:409},
27:{1000:90,2000:178,3000:268,4000:356,5000:446},
28:{1000:97,2000:194,3000:292,4000:388,5000:485},
29:{1000:106,2000:212,3000:318,4000:423,5000:529},
30:{1000:116,2000:231,3000:347,4000:462,5000:577},
31:{1000:126,2000:252,3000:379,4000:504,5000:630},
32:{1000:138,2000:276,3000:414,4000:551,5000:689},
33:{1000:151,2000:302,3000:453,4000:602,5000:752},
34:{1000:165,2000:330,3000:495,4000:659,5000:824},
35:{1000:181,2000:362,3000:543,4000:722,5000:902},
36:{1000:198,2000:396,3000:594,4000:792,5000:990},
37:{1000:218,2000:436,3000:654,4000:870,5000:1087},
38:{1000:240,2000:480,3000:720,4000:960,5000:1199},
39:{1000:264,2000:528,3000:792,4000:1054,5000:1318},
40:{1000:291,2000:582,3000:873,4000:1164,5000:1454}
};

// ======================
// CALCULATE APY
// ======================
function calculateAPY(){

    const ageInput = document.getElementById("age");
    const resultBox = document.getElementById("result");

    let age = +ageInput.value;
    let pension = selectedPension;

    // Validation
    if(!age){
        showError("Enter age");
        return;
    }

    if(age < 18 || age > 40){
        showError("Age must be 18–40");
        return;
    }

    let monthly = apyTable[age]?.[pension];

    if(!monthly){
        showError("Data not available");
        return;
    }

    // ======================
    // Frequency logic
    // ======================
    let contribution, label;

    if(apyFreq === "monthly"){
        contribution = monthly;
        label = "Monthly Contribution";
    }
    else if(apyFreq === "quarterly"){
        contribution = monthly * 3;
        label = "Quarterly Contribution";
    }
    else{
        contribution = monthly * 6;
        label = "Half-Yearly Contribution";
    }

    let years = 60 - age;
    let total = monthly * 12 * years;

    // ======================
    // RESULT
    // ======================
    resultBox.innerHTML =
    `<div class="result-line">
        <span>${label}</span>
        <span>₹${contribution}</span>
     </div>
     <div class="result-line">
        <span>Contribution Period</span>
        <span>${years} years</span>
     </div>
     <div class="result-line">
        <span>Total Contribution</span>
        <span>₹${total}</span>
     </div>
     <div class="result-line">
        <span>Amount to Nominee</span>
        <span>₹2,00,000</span>
     </div>`;
}

// ======================
// RESET
// ======================
function resetAPY(){
    document.getElementById("age").value = "";
    document.getElementById("result").innerHTML = "";

    // reset pension UI
    setPension(1000);

    // reset frequency UI
    setAPYFreq("monthly");
}

// ======================
// NAVIGATION
// ======================
function goBack(){
    window.location.href = "index.html";
}

// ======================
// SNACKBAR ERROR
// ======================
function showError(msg){
    let bar = document.getElementById("snackbar");

    if(!bar) return;

    bar.innerText = msg;
    bar.classList.add("show");

    setTimeout(()=>{
        bar.classList.remove("show");
    }, 2500);
}