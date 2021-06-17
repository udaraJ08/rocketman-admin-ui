$(document).ready(() => {

    loadAllHldDet();
    bkHldClearAll()

    setHldMsg()
})

function setHldMsg() {
    $("#vehicle-tab-section").append("<h6 class='text-dark'>All drivers are available</h6>");
    $("#driver-tab-section").append("<h6 class='text-dark'>All Vehicles are Available</h6>");
}

$("#btnDtSubmit").on("click", () => {
    dt_startDate = $("#inptStartDate").val()
    dt_endDate = $("#inptEndDate").val()

    if (dt_startDate.length !== 0 && dt_endDate.length !== 0) {
        loadVehicleBooking(dt_startDate, dt_endDate)
    }

})

$("#btnOpenReq").on("click", () => {

    bkHldClearAll()
    openHldRequest()
    setHldMsg()
})

$("#btnClsReq").on("click", () => {
    bkHldClearAll()
    deleteHldRequest()
    setHldMsg()
})

function loadAllHldDet() {

    loadAllBookingHolds()
    loadAllDrivers();
}

function loadVehicleBooking(start_date, end_date) {

    (async () => {
        const rawResponse = await fetch('http://localhost:8080/rocketman_war/bookingHold/all/vehicleDriverValid', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "startDate": start_date,
                    "endDate": end_date
                }
            )
        });
        const content = await rawResponse.json();

        validityDriverArr = content.data.driverDTOList;
        validityVehicleArr = content.data.vehicleDTOList;
        renderVehicleBookingDet(validityDriverArr, validityVehicleArr)
    })();
}

function renderVehicleBookingDet(driverList, vehicleLsit) {

    clearValidityTabs()

    if (driverList.length === 0)
        $("#vehicle-tab-section").append("<h6 class='text-dark'>All drivers available</h6>");
    if (vehicleLsit.length === 0)
        $("#vehicle-tab-section").append("<h6 class='text-dark'>All Vehicles Available</h6>");


    driverList.map(element => {
        const driverTab = `
        <section class="dv-tab-mid d-flex">
          <section class="dv-mid-driver-data">
            NIC
            <h6>${element.driver_NIC}</h6>
          </section>
          <section class="dv-mid-driver-data">
            name
            <h6>${element.driverName}</h6>
          </section>
          <section class="dv-mid-driver-data">
            contact
            <h6 style="text-align: center">${element.contact}</h6>
          </section>
        </section>
`
        $("#driver-tab-section").append(driverTab);
    })

    vehicleLsit.map(element => {
        const vehicleTab = `
        <section class="dv-tab-mid d-flex">
          <section class="dv-mid-driver-data">
            vehicle number
            <h6>${element.vehicleNumber}</h6>
          </section>
          <section class="dv-mid-driver-data">
            vehicle brand
            <h6>${element.brandName}</h6>
          </section>
          <section class="dv-mid-driver-data">
            vehicle type
            <h6 style="text-align: center">${element.type}</h6>
          </section>
        </section>
`
        $("#vehicle-tab-section").append(vehicleTab);
    })
}

function renderDriverHold(nic) {
    $("#drpdwn-hld").empty()


    if (nic !== "0" && nic !== ".............") {
        driverArr.map(element => {
            if (element.driver_NIC != 0) {
                const row = `
                <option class="dropdown-item"
                type="button" value=${element.driver_NIC}>${element.driver_NIC}</option>
                `
                $("#drpdwn-hld").append(row)
            };
        })
    } else {
        $("#drpdwn-hld").append(`
        <option class="dropdown-item"
            type="button" value=0>0
        </option>`
        )
    }
}


function loadAllBookingHolds() {

    (async () => {
        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/bookingHold/status/all?status=request`, {
            method: 'GET',
        });
        const content = await rawResponse.json();
        holdBooking = content.data
        renderAllRequestedHolds(content.data)
    })();
}

function renderAllRequestedHolds(hold) {

    $("#bk-hld-tbody").empty()

    hold.map(element => {

        let color = "wheat"

        if (element.bookingStatus === "open") {
            color = "#ff5e57"
        }

        const row = `
            <tr style="color: ${color};">
                <td>${element.customer.customer_NIC}</td>
                <td>${element.driver.driver_NIC}</td>
                <td>${element.vehicle.vehicleNumber}</td>
                <td>${new Date(element.bookingDate).toLocaleDateString()}</td>
                <td>${new Date(element.departureDate).toLocaleDateString()}</td>
                <td>${new Date(element.arrivalDate).toLocaleDateString()}</td>
                <td>${new Date(element.releaseDate).toLocaleDateString()}</td>
                <td>${element.time}</td>
                <td>${element.duration}</td>
            </tr>
        `
        $("#bk-hld-tbody").append(row)

        $("#bk-hld-tbody>tr").on('click', function () {
            setHoldDetails($(this).index())
        })
    })
}

function openHldRequest() {

    (async () => {
        const data = holdBooking[hldIndex]
        const rawResponse = await fetch('http://localhost:8080/rocketman_war/booking/open', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "id": data.bookingID,
                    "bookingStatus": "open",
                    "startMileage": 0,
                    "endMileage": 0,
                    "releaseStatus": false
                }
            )
        });
        const content = await rawResponse.json().then(loadAllHldDet());
        console.log(content);
    })();
}

function deleteHldRequest() {
    (async () => {
        const data = holdBooking[hldIndex]
        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/bookingHold/delete?id=${data.bookingID}`, {
            method: 'DELETE',
        });
        const content = await rawResponse.json().then(loadAllHldDet());
    })();
}

function setHoldDetails(index) {

    hldIndex = index;

    bkHldSetAccess()

    const data = holdBooking[index];

    renderDriverHold(data.driver.driver_NIC)

    const date = new Date();

    $("#hldCustomerNIC").html(data.customer.customer_NIC)
    $("#hldHoldID").html(data.bookingID)
    $("#hldDriverNIC").html(data.driver.driver_NIC)
    $("#hldVehicleNumber").html(data.vehicle.vehicleNumber)
    $("#hldBookedDate").html(new Date(data.bookingDate).toLocaleDateString())
    $("#hldDepartureDate").html(new Date(data.departureDate).toLocaleDateString())
    $("#hldarrivalDate").html(new Date(data.arrivalDate).toLocaleDateString())
    $("#hldBookingType").html(data.bookingType)
    $("#hldDepartureTime").html(data.time)
    $("#hldDuration").html(data.duration)
}

function bkHldSetAccess() {
    $("#btnOpenReq").attr("disabled", false)
    $("#btnClsReq").attr("disabled", false)
    $("#drpdwn-hld").attr("disabled", false)
}

function bkHldClearAll() {

    $("#btnOpenReq").attr("disabled", true)
    $("#btnClsReq").attr("disabled", true)
    $("#drpdwn-hld").attr("disabled", true)
    $(".bk-hld-det").html(".............")

    clearValidityTabs()
}

function clearValidityTabs() {
    $("#vehicle-tab-section").empty();
    $("#driver-tab-section").empty();
}