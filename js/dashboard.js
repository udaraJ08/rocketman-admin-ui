let dataArr = [];
let holdBooking = []
let driverArr = []
let vehicleArr = []

let driverOrArr = []
let customerOrArr = []
let PaymentOrArr = []

let vehicleIndex = 0;
let hldIndex = 0;
let driverOrIndex = 0;
let customerOrIndex = 0
let paymentOrIndex = 0

let rotate = false;
let bookingTableLoad = false

/////false = add
////true = update
let vehicleUpdateOrAdd = false

$(window).on('load', function (e) {
    $(".admin-loader").delay(3000).slideUp({
        duration: 1000,
    })
})

$(document).ready(() => {
    $.ajax({
        url: "../html/fragments/dashboard.html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });

    $(".side-bar").animate({
        width: "toggle"
    });
})

$("#backBtn").on("click", () => {

    slider()
})

$("#bookingBtn").on('click', () => {
    $.ajax({
        url: "../html/fragments/booking.html",
        // type: "text/html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });
    slider()
})



$("#btnBookingHold").on('click', () => {
    $.ajax({
        url: "../html/fragments/bookingHold.html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });
    slider()
})

$("#btnPaymentView").on('click', () => {
    $.ajax({
        url: "../html/fragments/payment.html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });
    slider()
})

$("#btnVehiclesView").on('click', () => {
    $.ajax({
        url: "../html/fragments/vehicle.html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });
    slider()
})

$("#btnDriversView").on('click', () => {
    $.ajax({
        url: "../html/fragments/driver.html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });
    slider()
})

$("#brand-logo").on('click', () => {
    $.ajax({
        url: "../html/fragments/dashboard.html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });
    slider()
})

$("#btnCustomerView").on('click', () => {
    $.ajax({
        url: "../html/fragments/customer.html",
        success: function (result) {
            $(".panel-container").html(result);
        }
    });
    slider()
})

function slider() {

    $(".side-bar").animate({
        width: "toggle"
    });
    if (!rotate) {
        $("#backBtn").css({
            "transition": "0.5s",
            "transform": "rotate(360deg)"
        })
        rotate = true;
    } else {
        $("#backBtn").css({
            "transition": "0.5s",
            "transform": "rotate(180deg)"
        })
        rotate = false
    }
}

function tableCleaner() {
    $("#tblbookingData").empty()
}

function loadAllDrivers() {

    fetch("http://localhost:8080/rocketman_war/driver")
        .then(res => res.json()
            .then(data => { driverArr = data.data }))
}

function loadBookings() {
    $.ajax({
        url: "http://localhost:8080/rocketman_war/booking",
        success: function (result) {
            dataArr = result.data;
            const date = new Date();

            dataArr.map(element => {
                let row = `
                    <tr>
                        <td>${element.bookingID}</td>
                        <td>${new Date(element.bookingDate).toLocaleDateString()}</td>
                        <td>${new Date(element.departureDate).toLocaleDateString()}</td>
                        <td>${new Date(element.arrivalDate).toLocaleDateString()}</td>
                        <td>${element.time}</td>
                        <td>${element.bookingType}</td>

                        <td>${element.duration}</td>
                        <td>${element.bookingStatus}</td>
                        <td>${element.customer.customer_NIC}</td>

                        <td>${element.vehicle.vehicleNumber}</td>
                        <td>${element.driver.driver_NIC}</td>
                        <td>${element.startMileage}</td>

                        <td>${element.endMileage}</td>
                        <td>${new Date(element.releaseDate).toLocaleDateString()}</td>
                        <td>${element.releaseStatus}</td>
                    </tr>
                `
                $("#tblbookingData").append(row)

                $("#tblbookingData>tr").on('click', function () {
                    setData($(this).index())
                })
            })
        },
    });
}