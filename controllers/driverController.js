$(document).ready(() => {
    fetchAllDrivers()
    clearDriverForm()
    disableDriverButton()
    getDriverCount()
})
///////////API calling/////////////////////////////
function fetchAllDrivers() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/driver", {
            method: "GET",
            headers: {
                accept: "application/json"
            }
        })
        await rawResponse.json().then(data => {
            driverOrArr = data.data;
            renderDriverTable()
        })
    })();
}

function searchAndFetchDrivers(key) {


    (async () => {

        if (key.length == 0) {
            fetchAllDrivers()
            return;
        }

        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/driver/search?key=${key}`, {
            method: "POST",
            headers: {
                accept: "application/json"
            }
        })
        const data = await rawResponse.json()
        driverOrArr = data.data;

    })().then(() => {
        renderDriverTable()
    })
}

function getDriverCount() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/driver/count", {
            method: "GET",
            headers: {
                accept: "application/json"
            }
        })
        await rawResponse.json().then(data => {
            $("#lblDriverCount").html(data)
        })
    })();
}

function addDriverData(data) {

    (async () => {
        await fetch("http://localhost:8080/rocketman_war/driver/add", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

    })().then(() => {
        cleanAllDriver()
    })
}

function removeDriver() {

    (async () => {
        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/driver/remove?driverNIC=${$("#inptDriverNIC").val()}`, {
            method: "DELETE",
            headers: {
                accept: "application/json"
            }
        })
        await rawResponse.json().then(data => {
            alert(data.body)
        })
    })().then(() => {
        cleanAllDriver()
    })
}

function updateDriver(data) {

    (async () => {
        await fetch("http://localhost:8080/rocketman_war/driver/update", {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
    })().then(() => {
        cleanAllDriver()
    })
}

////////////lead functions/////////////////////////
function driverSearch() { }

function addDriver() { }

function driverbuttonManager() { }

function loadDataToTheDriverForm() {

    $("#btn-driver-add").prop("disabled", true)

    const tempData = driverOrArr[driverOrIndex];


    $("#inptDriverNIC").val(tempData.driver_NIC)
    $("#inptDriverName").val(tempData.driverName)
    $("#inptDriverContact").val(tempData.contact)
    $("#inptDriverAddress").val(tempData.address)
    $("#inptDriverMail").val(tempData.gmail)
}

function fetchData() {
    const driverNic = $("#inptDriverNIC").val()
    const driverName = $("#inptDriverName").val()
    const driverContact = $("#inptDriverContact").val()
    const driverAddress = $("#inptDriverAddress").val()
    const driverMail = $("#inptDriverMail").val()

    const data = {
        "driver_NIC": driverNic,
        "driverName": driverName,
        "address": driverAddress,
        "contact": driverContact,
        "gmail": driverMail,
        "driverStatus": "open"
    }

    addDriverData(data)
}

function updateDriverData() {

    $("#btn-driver-add").prop("disabled", true)

    const driverNic = $("#inptDriverNIC").val()
    const driverName = $("#inptDriverName").val()
    const driverContact = $("#inptDriverContact").val()
    const driverAddress = $("#inptDriverAddress").val()
    const driverMail = $("#inptDriverMail").val()

    const data = {
        "driver_NIC": driverNic,
        "driverName": driverName,
        "address": driverAddress,
        "contact": driverContact,
        "gmail": driverMail,
        "driverStatus": "open"
    }

    updateDriver(data)
}

//////////DOM rendering//////////
function renderDriverTable() {

    cleanDriverTable()
    driverOrArr.map(element => {
        const row = `
            <tr>
                <td>${element.driver_NIC}</td>
                <td>${element.driverName}</td>
                <td>${element.contact}</td>
                <td>${element.address}</td>
                <td>${element.gmail}</td>
            </tr>
        `
        $("#all-driver-tbody").append(row)
    })
    $("#all-driver-tbody>tr").on("click", function () {
        $("#btn-driver-add").prop("disabled", true)
        driverOrIndex = $(this).index()
        loadDataToTheDriverForm()
        enableDriverButton()
        $("#inptDriverNIC").prop("disabled", true)
    })

}

//////////Events managing//////////
$("#btnDriverClear").on('click', () => {
    cleanAllDriver()
})

$("#btn-driver-add").on("click", () => {
    fetchData()
})

$("#btn-driver-update").on("click", () => {
    updateDriverData()

})

$("#btn-driver-remove").on("click", () => {
    removeDriver()
})

$("#inptDriverSearch").on("keyup", () => {
    searchAndFetchDrivers($("#inptDriverSearch").val())
})
/////////cleaner functions///////

///use only when you want to use all cleaner at once
function cleanAllDriver() {
    getDriverCount()
    fetchAllDrivers()
    disableDriverButton()
    clearDriverForm()
    $("#inptDriverNIC").prop("disabled", false)
    $("#btn-driver-add").prop("disabled", false)
}

function clearDriverForm() {
    $("#inptDriverNIC").val("")
    $("#inptDriverName").val("")
    $("#inptDriverContact").val("")
    $("#inptDriverAddress").val("")
    $("#inptDriverMail").val("")
}

function enableDriverButton() {
    // $("#btn-driver-add").prop("disabled", false)
    $("#btn-driver-remove").prop("disabled", false)
    $("#btn-driver-update").prop("disabled", false)
}

function disableDriverButton() {
    // $("#btn-driver-add").prop("disabled", true)
    $("#btn-driver-remove").prop("disabled", true)
    $("#btn-driver-update").prop("disabled", true)
}

function cleanDriverTable() {
    $("#all-driver-tbody").empty()
}