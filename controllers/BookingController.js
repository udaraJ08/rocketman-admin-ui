$(document).ready(() => {

    $("#startMileage").val("")
    $("#endMileage").val("")

    $("#startMileage").attr("disabled", true)
    $("#endMileage").attr("disabled", true)

    loadBookings()
    clearAll();
})

$('#btnSubmit').on('click', (e) => {
    e.preventDefault()

    const disDept = $("#chkDepartured").is(":checked")
    const disArr = $("#chkArrived").is(":checked")
    const disCls = $("#chkClosed").is(":checked")
    const disCancel = $("#chkCanceled").is(":checked")
    const disRelease = $("#chkReleased").is(":checked")

    const bookingID = $("#lblBookingID").html();
    const startMileage = $("#startMileage").val()
    const endMileage = $("#endMileage").val()

    if (disDept) {
        (async () => {
            const rawResponse = await fetch('http://localhost:8080/rocketman_war/booking/departure', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        id: bookingID,
                        bookingStatus: "departure",
                        startMileage: startMileage,
                        endMileage: endMileage,
                        releaseStatus: false
                    }
                )
            });
            const content = await rawResponse.json();
            tableCleaner()
            loadBookings();
            clearAll()
        })();
    } else if (disArr) {
        (async () => {
            const rawResponse = await fetch('http://localhost:8080/rocketman_war/booking/arrived', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        id: bookingID,
                        bookingStatus: "departure",
                        startMileage: startMileage,
                        endMileage: endMileage,
                        releaseStatus: false
                    }
                )
            });
            const content = await rawResponse.json();
            tableCleaner()
            loadBookings();
            clearAll()
        })();
    } else if (disCls) {
        if (disCls && disRelease) {
            (async () => {
                const rawResponse = await fetch('http://localhost:8080/rocketman_war/booking/release', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            id: bookingID,
                            bookingStatus: "departure",
                            startMileage: startMileage,
                            endMileage: endMileage,
                            releaseStatus: true
                        }
                    )
                });
                const content = await rawResponse.json();
                console.log(content);
                tableCleaner()
                loadBookings();
                clearAll()
            })();
        } else
            alert("You must check release and released status")
    } else if (disCancel) {

    } else alert("please select a status first !!!")
})

function setBooking() {
    $.ajax({
        url: "http://localhost:8080/rocketman_war/booking",
        type: "POST",
        data: {
            "id": "B-",
            "bookingStatus": "departure",
            "startMileage": 20000,
            "endMileage": 0,
            "releaseStatus": false
        },
        dataType: "json",
        success: function (result) {
        },
    });
}
//this will populate the bk-details
function setData(index) {
    clearAll()
    const bookingData = dataArr[index]
    const date = new Date();

    $("#lblBookingID").html(bookingData.bookingID)
    $("#lblBookingStatus").html(bookingData.bookingStatus)
    $("#lblCustomerNIC").html(bookingData.customer.customer_NIC)

    $("#lblBookingType").html(bookingData.bookingType)
    $("#lblBookedDate").html(new Date(bookingData.bookingDate).toLocaleDateString())
    $("#lblDepDate").html(new Date(bookingData.departureDate).toLocaleDateString())
    $("#lblReleaseDate").html(new Date(bookingData.releaseDate).toLocaleDateString())

    $("#lblArrDate").html(new Date(bookingData.arrivalDate).toLocaleDateString())
    $("#lblDepartureTime").html(bookingData.time)
    $("#lblStartMileage").html(bookingData.startMileage)

    $("#lblEndMileage").html(bookingData.endMileage)
    $("#lblVehicleNumber").html(bookingData.vehicle.vehicleNumber)
    $("#lblDriverNIC").html(bookingData.driver.driver_NIC)

    $("#lblNotReleased").html(bookingData.bookingID)
    $("#lblDuration").html(bookingData.duration)

    if (!bookingData.releaseStatus) {
        $("#lblReleaseStatus").html("not released")
    } else $("#lblReleaseStatus").html("released")


    $("#startMileage").val(bookingData.startMileage)
    $("#endMileage").val(bookingData.endMileage)

    if (bookingData.releaseStatus) $("#btnSubmit").attr("disabled", true)
    else $("#btnSubmit").attr("disabled", false)

    SetBookings(index);
}

$('#chkArrived').on('click', () => {
    $('#chkDepartured').prop("checked", false)
    $('#chkClosed').prop("checked", false)
    $('#chkCanceled').prop("checked", false)
    $('#chkArrived').prop("checked", true)
})
$('#chkDepartured').on('click', () => {
    $('#chkDepartured').prop("checked", true)
    $('#chkClosed').prop("checked", false)
    $('#chkCanceled').prop("checked", false)
    $('#chkArrived').prop("checked", false)
})
$('#chkClosed').on('click', () => {
    $('#chkDepartured').prop("checked", false)
    $('#chkClosed').prop("checked", true)
    $('#chkCanceled').prop("checked", false)
    $('#chkArrived').prop("checked", false)
})
$('#chkCanceled').on('click', () => {
    $('#chkDepartured').prop("checked", false)
    $('#chkClosed').prop("checked", false)
    $('#chkCanceled').prop("checked", true)
    $('#chkArrived').prop("checked", false)
})
$('#chkReleased').on('click', () => {
    $('#chkReleased').prop("checked", true)
    $('#chkNtReleased').prop("checked", false)
})
$('#chkNtReleased').on('click', () => {
    $('#chkReleased').prop("checked", false)
    $('#chkNtReleased').prop("checked", true)
})

//use to handle the booking detail tab (1st tab)
function SetBookings(index) {

    $("#btnSubmit").attr("disabled", false)

    const bookingData = dataArr[index];
    console.log(bookingData);

    if (!bookingData.releaseStatus) {
        switch (bookingData.bookingStatus) {
            case "open": {
                clearAll()

                $("#startMileage").attr("disabled", false)
                $("#endMileage").attr("disabled", true)

                $("#btnSubmit").attr("disabled", false)
                $('#chkArrived').attr("disabled", true)
                $('#chkDepartured').attr("disabled", false)
                $('#chkClosed').attr("disabled", true)
                $('#chkCanceled').attr("disabled", false)
                $('#chkNtReleased').prop("checked", true)

                $("#startMileage").attr("disabled", false)
                $("#endMileage").attr("disabled", true)
                break;
            }
            case "departure": {
                clearAll()
                $("#endMileage").attr("disabled", false)
                $("#btnSubmit").attr("disabled", false)

                $('#chkArrived').attr("disabled", false)
                $('#chkDepartured').attr("disabled", true)
                $('#chkClosed').attr("disabled", true)

                $('#chkCanceled').attr("disabled", true)
                $('#chkNtReleased').prop("checked", true)

                $("#startMileage").attr("disabled", true)
                $("#endMileage").attr("disabled", false)
                break;
            }
            case "arrived": {
                clearAll()
                $("#btnSubmit").attr("disabled", false)

                $('#chkNtReleased').prop("checked", false)
                $('#chkReleased').prop("checked", false)

                $('#chkArrived').attr("disabled", true)
                $('#chkDepartured').attr("disabled", true)
                $('#chkClosed').attr("disabled", false)

                $('#chkCanceled').attr("disabled", true)

                $("#chkReleased").attr("disabled", false)
                $("#chkNtReleased").attr("disabled", true)

                $("#startMileage").attr("disabled", true)
                $("#endMileage").attr("disabled", true)
                break;
            }
        }
    } else $("#btnSubmit").attr("disabled", false)
}

function tableCleaner() {
    $("#tblbookingData").empty()
}

function clearAll() {

    $("#btnSubmit").prop("disabled", true)

    $('#chkArrived').prop("disabled", true)
    $('#chkDepartured').prop("disabled", true)
    $('#chkCanceled').prop("disabled", true)
    $('#chkClosed').prop("disabled", true)

    $('#chkArrived').prop("checked", false)
    $('#chkDepartured').prop("checked", false)
    $('#chkCanceled').prop("checked", false)
    $('#chkClosed').prop("checked", false)

    $('#chkNtReleased').prop("disabled", true)
    $('#chkReleased').prop("disabled", true)

    $('#chkNtReleased').prop("checked", false)
    $('#chkReleased').prop("checked", false)

    $("#startMileage").attr("disabled", true)
    $("#endMileage").attr("disabled", true)

    // $("#startMileage").val("")
    // $("#endMileage").val("")
}