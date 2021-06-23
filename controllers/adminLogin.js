//////API calling///////
function validateAdmin(data) {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/admin-user", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        await rawResponse.json().then(data => {
            if (data) {
                loadAdminPage()
            }
            else alert("No user found")
        })
    })().then(() => {
        cleanLogDetails()
    })
}

function validateDriver(data) {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/driver-user", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        await rawResponse.json().then(data => {
            if (data.title !== "error") {
                loadDriverPage(data.data.driver_NIC)
            }
            else alert("No user found")
        })
    })().then(() => {
        cleanLogDetails()
    })
}

function signupDriver(data) {
    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/driver-user/signup", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        await rawResponse.json().then(data => {
            if (data.data == "signup")
                alert(data.body)
            else alert(data.body)
        })
    })().then(() => {
        cleanLogDetails()
    })
}

function loadSignupDet() {
    const nic = $("#idRegNIC").val()
    const username = $("#idRegUsername").val()
    const password = $("#idRegPassword").val()

    const data = {
        "customerNIC": nic,
        "customerUsername": username,
        "customerPassword": password
    }

    signupDriver(data)
}
/////////rendering/////

/////lead functions////
function getCredentials() {

    const username = $("#inptUsername").val()
    const password = $("#inptPassword").val()

    const data = {
        "username": username,
        "password": password
    }

    if ($("#chkAdmin").is(":checked"))
        validateAdmin(data)
    else if ($("#chkDriver").is(":checked"))
        validateDriver(data)
    else
        alert("must select a role")
}

/////event managing////
$("#chkAdmin").on("click", () => {
    $("#chkDriver").prop('checked', false)
})

$("#chkDriver").on("click", () => {
    $("#chkAdmin").prop('checked', false)
})

$("#frmAdminLogin").on('submit', e => {
    e.preventDefault()
    getCredentials()
})

$("#frmDriverSignup").on("submit", (e) => {
    e.preventDefault()
    loadSignupDet();
})
////////Http req manager////////
function loadAdminPage() {
    window.location.href = "../admin.html"
    return false;
}

function loadDriverPage(nic) {
    window.location.href = `../html/driverProfile.html?nic=${nic}`
    return false;
}

///////cleaners////////
function cleanLogDetails() {

    $("#inptUsername").val("")
    $("#inptPassword").val("")
    $("#chkDriver").prop('checked', false)
    $("#chkAdmin").prop('checked', false)
}