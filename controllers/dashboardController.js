$(document).ready(() => {
    loadAllDB()
})


//////////API calling///////////////
function loadAllDBPayment() {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/payment/search/today", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
        })
        await rawResponse.json().then(data => {
            renderPaymentRouter(data.data)
        })
    })()
}

function todayAllDbBookings() {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/booking/getAll/today", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
        })
        await rawResponse.json().then(data => {
            renderTodayBookingTable(data.data)
            renderBookingRouter(data.data)
        })
    })()
}

function loadAllBookingHolds() {

    (async () => {
        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/bookingHold/status/all?status=request`, {
            method: 'GET',
        });
        const content = await rawResponse.json();
        holdBooking = content.data
        renderHoldRouter(holdBooking)
    })();
}

function loadDbVehicleAllCount() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/vehicle/count/all", {
            method: "GET"
        })
        await rawResponse.json().
            then((data) => {
                renderVehicleRouter(data)
            })
    })()
}

function loadAllDbCustomer() {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/customer", {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        })
        await rawResponse.json().then(data => {
            renderCustomerRouter(data.data)
        })
    })()
}

function loadAllDriverDbCount() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/driver/count", {
            method: "GET",
            headers: {
                accept: "application/json"
            }
        })
        await rawResponse.json().then(data => {
            renderDriverRouter(data)
        })
    })();
}
/////////Rendering////////////////
function renderTodayBookingTable(data) {

    dbBookingTableCleaner()
    data.map((element) => {
        console.log(element);
        const row = `
            <tr>
                <td>${element.bookingID}</td>
                <td>${element.customer.customer_NIC}</td>
                <td>${element.driver.driver_NIC}</td>

                <td>${element.vehicle.vehicleNumber}</td>
                <td>${element.departureDate}</td>
                <td>${element.time}</td>

                <td>${element.arrivalDate}</td>
                <td>${element.duration}</td>
            </tr>
        `
        $("#db-booking-tbody").append(row)
    })

    $("#db-booking-tbody>tr").on('click', () => {
        alert($(this).index())
    })
}

function renderDbTodayVehicleSchedule(data) {

    dbVehicleTableCleaner()

    data.map((element) => {
        const vehicle = element.vehicle
        const row = `
            <tr>
                <td>${vehicle.vehicleNumber}</td>
                <td>${element.time}</td>
                <td>${vehicle.type}</td>
                <td>${element.driver.driver_NIC}</td>
            </tr>
        `
        $("#db-vehicle-tbody").append(row)
    })

    $("#db-vehicle-tbody>tr").on('click', () => {
        alert($(this).index())
    })
}

function renderDbTodayDriverSchedule(data) {

    dbDriverTableCleaner()

    data.map((element) => {
        const driver = element.driver
        const row = `
            <tr>
                <td>${driver.driver_NIC}</td>
                <td>${driver.driverName}</td>
                <td>${element.time}</td>
                <td>${element.vehicle.vehicleNumber}</td>
            </tr>
        `
        $("#db-driver-tbody").append(row)
    })

    $("#db-driver-tbody>tr").on('click', () => {
        alert($(this).index())
    })
}

function setDbPaymentAmount(data) {

    let amount = 0;

    data.map(element => {
        amount += element.fullPayment
    })


    $("#lblDbProfit").html(amount)
}

function setTodayBookings(data) {
    $("#lblDbBookingCount").html(data.length)
}

function setHoldDbBooking(data) {
    $("#lblHoldCount").html(data.length)
}

function setVehicleDbCount(data) {
    $("#lblDbVehicleCount").html(data)
}

function setCustomerDbCount(data) {
    $("#lblDbCustomerCount").html(data.length)
}

function setDriverDbCount(data) {
    $("#lblDbDriverCount").html(data)

}

//////////lead functions///////////
function loadAllDB() {

    loadAllDBPayment()
    todayAllDbBookings()
    loadAllBookingHolds()

    loadDbVehicleAllCount()
    loadAllDbCustomer()
    loadAllDriverDbCount()
}

function renderPaymentRouter(data) {
    setDbPaymentAmount(data)
}

function renderBookingRouter(data) {
    setTodayBookings(data)
    renderDbTodayVehicleSchedule(data)
    renderDbTodayDriverSchedule(data)
}

function renderHoldRouter(data) {
    setHoldDbBooking(data)
}

function renderVehicleRouter(data) {
    setVehicleDbCount(data.data)
}

function renderCustomerRouter(data) {
    setCustomerDbCount(data)
}

function renderDriverRouter(data) {
    setDriverDbCount(data)
}

/////////cleaners//////////////
function dbBookingTableCleaner() {

    $("#db-booking-tbody").empty()
}

function dbVehicleTableCleaner() {
    $("#db-vehicle-tbody").empty()
}

function dbDriverTableCleaner() {
    $("#db-driver-tbody").empty()
}