$(document).ready(() => {
    loadAllTable()
    clearAllVehicles()
    loadAllVehicleCountData()
})

$("#inptVehicleSearch").on("keyup", (e) => {

    searchVehicle($("#inptVehicleSearch").val())
})

function loadAllVehicleCountData() {
    setVehicleLuxCount()
    setVehicleAllCount()
    setVehiclePremCount()
    setVehicleGenCount()
}

/////////////////////setting vehicle counts/////////////////////////////
function setVehicleAllCount() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/vehicle/count/all", {
            method: "GET"
        })
        await rawResponse.json().
            then((data) => {
                $("#lblAllVehicleCount").html(data.data)
            })
    })()
}

function setVehicleLuxCount() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/vehicle/count?id=luxury", {
            method: "GET"
        })
        await rawResponse.json().
            then(data => { $("#lblLuxuryCount").html(data.data) })
    })()
}

function setVehiclePremCount() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/vehicle/count?id=premium", {
            method: "GET",
        })
        await rawResponse.json().
            then(data => {
                $("#lblPremiumCount").html(data.data)
            })
    })()
}

function setVehicleGenCount() {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/vehicle/count?id=general", {
            method: "GET"
        })
        await rawResponse.json().
            then(data => {
                $("#lblGeneralCount").html(data.data)
            })
    })()
}
//////////////////count setting over///////////////////////////////

function loadAllTable() {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/vehicle?status=open", {
            method: "GET"
        })
        const dataObj = await rawResponse.json()
        vehicleArr = dataObj.data;
    })().then(() => { renderVehicles() })
}

//use to real-time search vehicles by key
function searchVehicle(key) {

    (async () => {

        if (key.length == 0) {
            loadAllTable()
            return;
        }

        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/vehicle/searchAll?key=${key}`, {
            method: "GET"
        })
        const dataObj = await rawResponse.json()
        vehicleArr = dataObj.data;
    })().then(() => { renderVehicles() })
}

function renderVehicles() {

    emptyVehicleTable()
    clearAllVehicles()

    vehicleArr.map(element => {
        const row = `
            <tr>
                <td>${element.vehicleNumber}</td>
                <td>${element.brandName}</td>
                <td>${element.transmission}</td>
                <td>${element.fuelType}</td>
                <td>${element.type}</td>
            </tr>
        `
        $("#all-vehicle-tbody").append(row)
    })
    $("#all-vehicle-tbody>tr").on("click", function () {
        vehicleIndex = $(this).index();
        setVehicleDet()
    })
}

function emptyVehicleTable() {

    $("#all-vehicle-tbody").empty()
}

// when the manage button clicked in the modal
// first see whether the `vehicleUpdateOrAdd` is true or false
// false ---> vehicleSave()
// true ---> vehicleUpdater()
function vehicleSaveStateManager() {

    clearAllVehicleModalData()

    if (vehicleUpdateOrAdd) vehicleUpdater()
    else saveVehicle()
}

////////////This will load the vehicle data to fileds in the modal. Then user can change them/////////
function vehicleUpdater() {

    $("#inptVehicleNumber").val("").prop("disabled", true)

    const vehicleData = vehicleArr[vehicleIndex]

    let type = vehicleData.type
    let fuelType = vehicleData.fuelType
    let transmission = vehicleData.transmission

    switch (type) {
        case "luxury": $("#chkLuxury").prop("checked", true); break;
        case "premium": $("#chkPremium").prop("checked", true); break;
        case "general": $("#chkGeneral").prop("checked", true); break;
    }

    switch (fuelType) {
        case "petrol": {
            $("#chkPetrol").prop("checked", true)
            break;
        }
        case "diesel": {
            $("#chkDiesal").prop("checked", true)
            break
        }
    }

    switch (transmission) {
        case "gear": {
            $("#chkGear").prop("checked", true)
            break;
        }
        case "manual": {
            $("#chkManual").prop("checked", true)
            break;
        }
    }

    if ($("#chkPetrol").is(":checked")) fuelType = "petrol"
    else if ($("#chkDiesal").is(":checked")) fuelType = "diesel"

    if ($("#chkLuxury").is(":checked")) type = "luxury"
    else if ($("#chkPremium").is(":checked")) type = "premium"
    else if ($("#chkGeneral").is(":checked")) type = "general"

    if ($("#chkGear").is(":checked")) transmission = "gear"
    else if ($("#chkManual").is(":checked")) transmission = "manual"


    $("#inptVehicleNumber").val(vehicleData.vehicleNumber)

    $("#inptDamagewaiver").val(vehicleData.damageWaiver)
    $("#inptFreeMilgForMonth").val(vehicleData.freeMileageForMonth)
    $("#inptFreeMilgForDay").val(vehicleData.freeMileageForDay)

    $("#inptMonthlyRental").val(vehicleData.monthlyRental)
    $("#inptDailyRental").val(vehicleData.dailyRental)
    $("#inptExcessAmount").val(vehicleData.excessForMonth)

    $("#inptNumberOfPasseneger").val(vehicleData.numberOfPassengers)
    $("#inptBrandName").val(vehicleData.brandName)
    $("#inptColor").val(vehicleData.color)
}

////////////use to save vehicle data///////////////////
function saveVehicle() {

    let type = ""
    let fuelType = ""
    let transmission = ""

    if ($("#chkPetrol").is(":checked")) fuelType = "petrol"
    else if ($("#chkDiesal").is(":checked")) fuelType = "diesel"

    if ($("#chkLuxury").is(":checked")) type = "luxury"
    else if ($("#chkPremium").is(":checked")) type = "premium"
    else if ($("#chkGeneral").is(":checked")) type = "general"

    if ($("#chkGear").is(":checked")) transmission = "gear"
    else if ($("#chkManual").is(":checked")) transmission = "manual"

    const data = {
        "vehicleNumber": $("#inptVehicleNumber").val(),
        "vehicleCount": 1,
        "type": type,
        "fuelType": fuelType,
        "damageWaiver": $("#inptDamagewaiver").val(),
        "freeMileageForMonth": $("#inptFreeMilgForMonth").val(),
        "freeMileageForDay": $("#inptFreeMilgForDay").val(),
        "monthlyRental": $("#inptMonthlyRental").val(),
        "dailyRental": $("#inptDailyRental").val(),
        "excessForMonth": $("#inptExcessAmount").val(),
        "numberOfPassengers": $("#inptNumberOfPasseneger").val(),
        "brandName": $("#inptBrandName").val(),
        "frontImg": "asdasd",
        "backImg": "adasd",
        "leftImg": "adasd",
        "rightImg": "asdasdas",
        "transmission": transmission,
        "color": $("#inptColor").val(),
        "vehicleStatus": "open"
    }

    addNewVehicleOrUpdate(data)
    loadAllVehicleCountData()
}

function addNewVehicleOrUpdate(data) {

    (async () => {
        const rawResponse = await fetch('http://localhost:8080/rocketman_war/vehicle/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const content = await rawResponse.json().
            then(data => {
                alert("success !!")
            });
    })().then(() => {
        clearAllVehicles()
        loadAllTable()
    });


}

function deleteVehicle() {

    (async () => {
        let vehicleNumber = vehicleArr[vehicleIndex].vehicleNumber
        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/vehicle/remove?vehicleNumber=${vehicleNumber}`, {
            method: "DELETE",
            headers: {
                'Accept': "application/json"
            }
        })
        await rawResponse.json()
            .then(data => {
                alert(data.body)
                console.log(data);
            })
    })().then(() => {
        clearAllVehicles()
        clearAllVehicleModalData()
        loadAllTable()
        loadAllVehicleCountData()
    })
}

//////////setting vehicle data to the details tab////////////////
function setVehicleDet() {

    enableVehicleUpdateBtns()

    const data = vehicleArr[vehicleIndex];

    $("#lblVehicleNumber").html(data.vehicleNumber)
    $("#lblBrandName").html(data.brandName)
    $("#lblType").html(data.type)

    $("#lblTransmission").html(data.transmission)
    $("#lblColor").html(data.color)
    $("#lblFuelType").html(data.fuelType)

    $("#lblNumberOfPassengers").html(data.numberOfPassengers)
    $("#lblDailyRental").html(data.dailyRental)
    $("#lblMonthlyRental").html(data.monthlyRental)

    $("#lblDmgWaiver").html(data.damageWaiver)
    $("#lblExcesForDay").html(data.excessForMonth)
    $("#lblFreeMgForDay").html(data.freeMileageForDay)

    $("#lblFreeMgForMonth").html(data.freeMileageForMonth)
}

function enableVehicleUpdateBtns() {
    $("#btnVehicleUpdate").attr("disabled", false)
    $("#btnVehicleRemove").attr("disabled", false)
}

function clearAllVehicles() {

    $("#btnVehicleUpdate").attr("disabled", true)
    $("#btnVehicleRemove").attr("disabled", true)

    $("#lblVehicleNumber").html("..........")
    $("#lblBrandName").html("..........")
    $("#lblType").html("..........")

    $("#lblTransmission").html("..........")
    $("#lblColor").html("..........")
    $("#lblFuelType").html("..........")

    $("#lblNumberOfPassengers").html("..........")
    $("#lblDailyRental").html("..........")
    $("#lblMonthlyRental").html("..........")

    $("#lblDmgWaiver").html("..........")
    $("#lblExcesForDay").html("..........")
    $("#lblFreeMgForDay").html("..........")

    $("#lblFreeMgForMonth").html("..........")
}

////////this will clean the vehicle modal//////////
function clearAllVehicleModalData() {


    $("#chkLuxury").prop("checked", false)
    $("#chkPremium").prop("checked", false)
    $("#chkGeneral").prop("checked", false)
    $("#chkPetrol").prop("checked", false)
    $("#chkDiesal").prop("checked", false)
    $("#chkGear").prop("checked", false)
    $("#chkManual").prop("checked", false)

    $("#inptVehicleNumber").val("").prop("disabled", false)

    $("#inptDamagewaiver").val("")
    $("#inptFreeMilgForMonth").val("")
    $("#inptFreeMilgForDay").val("")

    $("#inptMonthlyRental").val("")
    $("#inptDailyRental").val("")
    $("#inptExcessAmount").val("")

    $("#inptNumberOfPasseneger").val("")
    $("#inptBrandName").val("")
    $("#inptColor").val("")
}

///////////check boxes controlling/////////////////

$("#chkGear").on('click', () => {
    $("#chkManual").prop('checked', false)
})

$("#chkManual").on('click', () => {
    $("#chkGear").prop('checked', false)
})

$("#chkPetrol").on('click', () => {
    $("#chkDiesal").prop('checked', false)
})

$("#chkDiesal").on('click', () => {
    $("#chkPetrol").prop('checked', false)
})

$("#chkLuxury").on('click', () => {
    $("#chkPremium").prop('checked', false)
    $("#chkGeneral").prop('checked', false)
})

$("#chkPremium").on('click', () => {
    $("#chkLuxury").prop('checked', false)
    $("#chkGeneral").prop('checked', false)
})

$("#chkGeneral").on('click', () => {
    $("#chkLuxury").prop('checked', false)
    $("#chkPremium").prop('checked', false)
})

//////////btn add Vehicle//////////////
$("#btnAddVehicle").on("click", () => {
    clearAllVehicleModalData()
    vehicleUpdateOrAdd = false
})

$("#btnVehicleUpdate").on("click", () => {
    vehicleUpdateOrAdd = true
    vehicleSaveStateManager()
})

$("#btnVehicleManage").on('click', () => {
    saveVehicle()
})

$("#btnVehicleClearAll").on("click", () => {
    clearAllVehicleModalData();
    clearAllVehicles()
})

$("#btnVehicleRemove").on("click", () => {
    deleteVehicle()
})