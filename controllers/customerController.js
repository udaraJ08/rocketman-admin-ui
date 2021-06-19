$(document).ready(() => {
    cleanCustomerTab(0)
    loadAllCustomer()
})

/////API callings/////////
function searchCustomer(key) {

    (async () => {
        if (key.length == 0) {
            loadAllCustomer()
            return;
        }

        const rawResponse = await fetch(`http://localhost:8080/rocketman_war/customer/search?key=${key}`, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        })
        await rawResponse.json().then(data => {
            customerOrArr = data.data
            renderCustomerTable()
        })
    })()
}

function loadAllCustomer() {

    (async () => {
        const rawResponse = await fetch("http://localhost:8080/rocketman_war/customer", {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        })
        await rawResponse.json().then(data => {
            customerOrArr = data.data
            $("#lblCustomerOrCount").html(customerOrArr.length)
        })
    })().then(() => {
        renderCustomerTable()
    })
}

//////rendering//////////
function renderCustomerTable() {

    cleanCustomerTable()
    customerOrArr.map(element => {
        const row = `
            <tr>
                <td>${element.customer_NIC}</td>
                <td>${element.lic_no}</td>
                <td>${element.customerName}</td>
                <td>${element.address}</td>
                <td>${element.contact}</td>
            </tr>
        `
        $("#all-customer-tbody").append(row)
    })

    $("#all-customer-tbody>tr").on("click", function () {
        customerOrIndex = $(this).index()
        loadCustomerToTheTab()
    })
}

//////lead functions//////
function loadCustomerToTheTab() {

    const customerData = customerOrArr[customerOrIndex]

    $("#lblCustomerNIC").html(customerData.customer_NIC)
    $("#lblCustomerName").html(customerData.customerName)
    $("#lblCustomerAddress").html(customerData.address)
    $("#lblCustomerContact").html(customerData.contact)
    $("#lblLicNo").html(customerData.lic_no)
}

//////event maneging/////
$("#inptCustomerSearch").on("keyup", () => {
    searchCustomer($("#inptCustomerSearch").val())
    cleanCustomerTab()
})

//////cleaners and loaders//////
function cleanCustomerTable() {
    $("#all-customer-tbody").empty()
}

function cleanCustomerTab() {

    $("#lblCustomerNIC").html(".........")
    $("#lblCustomerName").html(".........")
    $("#lblCustomerAddress").html(".........")
    $("#lblCustomerContact").html(".........")
    $("#lblLicNo").html(".........")
}
