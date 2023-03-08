// jshint esversion: 6
/* ========================================================================= */
/* BE SURE TO COMMENT CODE/IDENTIFY PER PLUGIN CALL */
/* ========================================================================= */

$(document).ready(function(){

    console.log(1)

    //Calculator jQuery
    // Text input fields max length
    $('.input-amount').on('input', function() {
        let decimals = ($(this).val().match(/\./g)); // Array of decimals, if they exist

        // Adjusts max length of percent field if decimals are present
        if (decimals){ // Decimals exist?
            switch (decimals.length){ // Check how many
                case 1: $('.percent').attr('maxlength', 4); break;
                default: $('.percent').attr('maxlength', 3); break;
            }
        } else {
            $('.percent').attr('maxlength', 2); // No decimals, max length 2 (ex: 99 percent)
        }

        // Shows and hides errors if max value is exceeded
        $('.dollar').val().replace(/\,/g, '') > 5000000 ? $('.error-loan').show() : $('.error-loan').hide();
        $('.percent').val() > 10 ? $('.error-interest').show() : $('.error-interest').hide();
        $('.pound').val() > 30 ? $('.error-term').show() : $('.error-term').hide();
    })

    $('.dollar').on('input', function(){
        let num = $(this).val().replace(/,/g, "");
        let num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
        $(this).val(num2);
    })

    // Hides errors when interacting with slider
    $('.borrow-amount').on('input', function(){
        $('.error-loan').hide();
    })

    $('.interest-rate').on('input', function(){
        $('.error-interest').hide();
    })

    $('.term-length').on('input', function(){
        $('.error-term').hide();
    })

});

// On change of the value of SLIDER, set the value of TEXT INPUT to value of SLIDER

function setInputValue(){

    // DOM ELEMENT VARIABLES, TEXT CONTENT IS MODIFIED INSIDE MAP WITH CALCULATED VALUES

    const sliders = Array.from(document.getElementsByClassName("slider"));
    const inputs = Array.from(document.getElementsByClassName("input-amount"));
    const monthlyRate = document.querySelector(".monthly-rate");
    const totalPaid = document.querySelector(".total-paid");
    const totalInterest = document.querySelector(".total-interest");

    function calculateLoan(){
        const amountBorrowed = parseFloat(inputs[0].value.replace(/\,/g,''));
        const interestRate = parseFloat(inputs[1].value, 10) / 100;
        const monthlyInterest = interestRate / 12
        const term = parseFloat(inputs[2].value, 10);
        const termInMonths = term * 12;

        // FORMULA FOR SOLVING SIMPLE INTEREST

        let monthlyPaymentSimple = ((amountBorrowed * monthlyInterest * (1 + monthlyInterest)**termInMonths) / ((1 + monthlyInterest)**termInMonths - 1));
        let totalPaymentSimple = monthlyPaymentSimple * termInMonths;
        let totalInterestPaidSimple = totalPaymentSimple - amountBorrowed;

        // SIMPLE INTEREST LOGIC

        // Else statement handles the bug where calculator still produces values even if one of the sliders is set back to 0

        if ((amountBorrowed && (amountBorrowed <= 5000000)) && (interestRate && (interestRate <= .1)) && (term && (term <= 30))){
            monthlyRate.textContent = "$" + monthlyPaymentSimple.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            monthlyRate.style.cssText = "color: #000;"
            totalPaid.textContent = "$" + totalPaymentSimple.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            totalInterest.textContent = "$" + totalInterestPaidSimple.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else if (amountBorrowed > 5000000 || interestRate > .1 || term > 30){
            monthlyRate.textContent = "ERROR";
            monthlyRate.style.cssText = "color: #DA291C;"
            totalPaid.textContent = "$" + 0;
            totalInterest.textContent = "$" + 0;
        } else {    
            monthlyRate.textContent = "$" + 0;
            monthlyRate.style.cssText = "color: #000;"
            totalPaid.textContent = "$" + 0;
            totalInterest.textContent = "$" + 0;
        }
    }

    sliders[0].addEventListener("input", () => {
        sliders[0].max = 500000;
    })

    inputs[0].addEventListener("input", () => {
        sliders[0].max = 5000000;
    })

    sliders.map((slider, i) => {
        slider.addEventListener("input", () => {

            // SETS TEXT INPUT VALUE TO SLIDER VALUE

            inputs[i].value = slider.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            calculateLoan();

        })
    })

    inputs.map((input, i) => {
        input.addEventListener("input", () => {

            // SETS SLIDER VALUE TO TEXT VALUE

            if (inputs[0].value > 500000){
                sliders[0].max = 5000000;
            }

            sliders[i].value = input.value.toString().replace(/\,/g,'');

            calculateLoan();

        })
    })
}

setInputValue();

function restrictCharacters(event) {
    event = (event) ? event : window.event;
    let charCode = (event.which) ? event.which : event.keyCode;
    if (event.target.className === 'input-amount percent'){
        if (charCode > 31 && ((charCode < 48 || charCode > 57) && charCode !== 46)) { // Numbers and decimals
            return false;
        }
    } else {
        if (charCode > 31 && (charCode < 48 || charCode > 57)) { // Only numbers
            return false;
        }
    }
    return true;
}