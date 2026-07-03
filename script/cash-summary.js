window.onload = function(){

    loadDate();

    calculate();

    const firstNote = document.getElementById("n500");

    firstNote.focus();

    firstNote.click();

};

// ======================================
// CASH SUMMARY
// Part 1
// ======================================

const NOTES = [500, 200, 100, 50, 20, 10];

// ----------------------------
// SHORTCUT
// ----------------------------

const $ = id => document.getElementById(id);

// ----------------------------
// FORMAT MONEY
// ----------------------------

function money(value){

    value = Number(value);

    return value === 0
        ? ""
        : value.toLocaleString("en-IN");

}

// ----------------------------
// GET NUMBER
// ----------------------------

function num(id){

    return Number($(id).value) || 0;

}

// ----------------------------
// LOAD DATE
// ----------------------------

function loadDate(){

    const today = new Date();

    $("todayDate").textContent =
        today.toLocaleDateString("en-GB");

}

// ----------------------------
// CALCULATE
// ----------------------------

function calculate(){

    let grand = 0;

    // Denominations

    NOTES.forEach(note=>{

        const pieces = num("n"+note);

        const amount = pieces * note;

        $("a"+note).textContent =
            money(amount);

        grand += amount;

    });

    // Coins

    grand += num("coins");

    // Grand Total

    $("grandTotal").value =
        money(grand);

    // Balance

    $("balance").value =
        money(grand);

    // Summary

    updateSummary(grand);

    // Amount in Words

    $("amountWords").textContent =
        numberToWords(grand);

}

// ----------------------------
// SUMMARY
// ----------------------------

function updateSummary(balance){

    const last = num("lastBalance");

    const total = num("totalCash");

    $("receivedToday").value =
    money(total-last);

$("paidToday").value =
    money(Math.abs(balance-total));

}

// ======================================
// CASH SUMMARY
// Part 2
// ======================================

// ----------------------------
// INPUT FIELDS
// ----------------------------

const fields = [

    "lastBalance",
    "totalCash",

    "n500",
    "n200",
    "n100",
    "n50",
    "n20",
    "n10",

    "coins"

];

// ----------------------------
// LIVE CALCULATION
// ----------------------------

fields.forEach(id=>{

    const input = $(id);

    input.addEventListener("input",()=>{

        if(Number(input.value) < 0){

            input.value = "";

        }

        calculate();

    });

});

// ----------------------------
// ENTER = NEXT FIELD
// ----------------------------

fields.forEach((id,index)=>{

    $(id).addEventListener("keydown",e=>{

        if(e.key !== "Enter") return;

        e.preventDefault();

        if(index < fields.length-1){

            const next = $(fields[index+1]);

            next.focus();

            next.select();

        }else{

            calculate();

            $(id).blur();

        }

    });

});

// ----------------------------
// SELECT ALL ON FOCUS
// ----------------------------

fields.forEach(id=>{

    $(id).addEventListener("focus",function(){

        this.select();

    });

});

// ----------------------------
// ESC = CLEAR CURRENT FIELD
// ----------------------------

document.addEventListener("keydown",e=>{

    if(e.key !== "Escape") return;

    const active = document.activeElement;

    if(active.tagName === "INPUT" && !active.readOnly){

        active.value = "";

        calculate();

    }

});

// ----------------------------
// RESET
// ----------------------------

function resetCashSummary(){

    fields.forEach(id=>{

        $(id).value = "";

    });

    calculate();

    $("lastBalance").focus();

}

$("resetBtn").addEventListener(

    "click",

    resetCashSummary

);

// ----------------------------
// START
// ----------------------------

window.addEventListener("load",()=>{

    loadDate();

    calculate();

    $("lastBalance").focus();

});

// ======================================
// CASH SUMMARY
// Part 3
// NUMBER TO WORDS
// ======================================

const ONES = [
"",
"One","Two","Three","Four","Five",
"Six","Seven","Eight","Nine",
"Ten","Eleven","Twelve","Thirteen",
"Fourteen","Fifteen","Sixteen",
"Seventeen","Eighteen","Nineteen"
];

const TENS = [
"",
"",
"Twenty","Thirty","Forty",
"Fifty","Sixty","Seventy",
"Eighty","Ninety"
];

// ----------------------------
// TWO DIGITS
// ----------------------------

function twoDigit(num){

    if(num < 20)
        return ONES[num];

    return TENS[Math.floor(num / 10)] +
        (num % 10 ? " " + ONES[num % 10] : "");

}

// ----------------------------
// THREE DIGITS
// ----------------------------

function threeDigit(num){

    let text = "";

    if(num >= 100){

        text += ONES[Math.floor(num / 100)] + " Hundred";

        num %= 100;

        if(num) text += " ";

    }

    if(num)
        text += twoDigit(num);

    return text;

}

// ----------------------------
// NUMBER TO WORDS
// ----------------------------

function numberToWords(num){

    num = Math.floor(num);

    if(num === 0)
        return "Zero Only";

    let words = "";

    const crore = Math.floor(num / 10000000);
    num %= 10000000;

    const lakh = Math.floor(num / 100000);
    num %= 100000;

    const thousand = Math.floor(num / 1000);
    num %= 1000;

    const hundred = num;

    if(crore)
        words += threeDigit(crore) + " Crore ";

    if(lakh)
        words += threeDigit(lakh) + " Lakh ";

    if(thousand)
        words += threeDigit(thousand) + " Thousand ";

    if(hundred)
        words += threeDigit(hundred);

    return words.trim() + " Only";

}