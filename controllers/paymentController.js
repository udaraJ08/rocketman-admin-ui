$(document).ready(() => {
    loadAllTodayPayments()
    getAllHoldPaymentCount()
})

//////API Calling///////
function loadAllPayment(startDate, endDate) {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/payment/search/byDateRange", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "startDate": startDate,
                "endDate": endDate
            })
        })
        await rawResponse.json().then(data => {
            PaymentOrArr = data.data
            $("#lblPaymentCount").html(PaymentOrArr.length)
        })
    })().then(() => {
        renderPaymentTable();
    })
}

function loadAllTodayPayments() {


    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/payment/search/today", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
        })
        await rawResponse.json().then(data => {
            PaymentOrArr = data.data
            $("#lblPaymentCount").html(PaymentOrArr.length)
        })
    })().then(() => {
        renderPaymentTable();
    })
}

function getAllHoldPaymentCount() {


    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/payment/count/holdPayment", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
        })
        await rawResponse.json().then(data => {
            $("#lblHoldPaymentCounts").html(data.data)
        })
    })()
}

//////rendering////////
function renderPaymentTable() {

    cleanPaymentTable()
    let paymentAmount = 0

    PaymentOrArr.map(element => {
        const row = `
            <tr>
                <td>${element.bookingID.bookingID}</td>
                <td>${new Date(element.paymentDate).toLocaleDateString()}</td>
                <td>${element.damageWaiver}</td>

                <td>${element.standardPayment}</td>
                <td>${element.excess}</td>
                <td>${element.excessAmount}</td>

                <td>${element.fullPayment}</td>
            </tr>
        `
        paymentAmount += element.fullPayment;

        $("#bk-payment-tbody").append(row)
    })
    $("#bk-payment-tbody>tr").on('click', function () {
        alert($(this).index())
    })

    $("#lblPaymentAmount").html(paymentAmount)
}

/////lead functions////


//////Event managing///////
$("#btnPaymentSearchByRange").on("click", () => {
    if ($("#clndrPaymentStart").val().length == 0 || $("#clndrPaymentEnd").val().length == 0) {
        alert("You must Set Dates first !!!")
    } else {
        loadAllPayment($("#clndrPaymentStart").val(), $("#clndrPaymentEnd").val());
    }
})

$("#btnSearchPaymentToday").on('click', () => {
    loadAllTodayPayments()
})

//////cleaning////////
function cleanPaymentTable() {
    $("#bk-payment-tbody").empty()
}