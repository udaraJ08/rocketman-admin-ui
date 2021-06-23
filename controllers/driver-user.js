$(window).on('load', function (e) {
    $(".admin-loader").delay(3000).slideUp({
        duration: 1000,
    })
})

$(document).ready(() => {
    // getDriver()
    getDriverDetails()
    loadShedule()
    loadBookingCount()
})

////////////API calling///////
function getDriverDetails() {

    (async () => {

        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/driver/driver-user?nic=${getParamNIC()}`, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        })
        await rawResponse.json().then(data => {
            loadDriverDataToTheTab(data.data)
        })
    })()
}

function loadShedule() {
    (async () => {

        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/driver/driver-user/allBooking?nic=${getParamNIC()}`, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        })
        await rawResponse.json().then(data => {
            renderShedule(data.data)
        })
    })()
}

function loadBookingCount() {
    (async () => {

        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/driver/driver-user/count?nic=${getParamNIC()}`, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        })
        await rawResponse.json().then(data => {
            renderDriverTripsCount(data.data)
            console.log(data.data);
        })
    })()
}

//////////rendering//////////
function loadDriverDataToTheTab(data) {

    console.log(data);
    $("#lblDriverName, .lblDriverName").html(data.driverName)
    $("#lblNic").html(data.driver_NIC)
    $("#lblAddress").html(data.address)
    $("#lblContact").html(data.contact)
    $("#lblEmail").html(data.lblEmail)
}

function renderShedule(data) {

    data.map(element => {
        const row = `
            <tr>
                <td>${element.bookingID}</td>
                <td>${new Date(element.departureDate).toLocaleDateString()}</td>
                <td>${new Date(element.arrivalDate).toLocaleDateString()}</td>
                
                <td>${element.time}</td>
                <td>${element.vehicle.vehicleNumber}</td>
                <td>${element.duration}</td>
            </tr>
        `
        $("#driver-shedule-tbody").append(row)
    })
}

function renderDriverTripsCount(data) {
    $("#lblTripCount").html(data)
}

///////////lead functions//////
function getParamNIC() {
    const search = location.search.substring(1);
    const paramData = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    return paramData.nic
}

///////event managing/////////

///////////cleaning///////////