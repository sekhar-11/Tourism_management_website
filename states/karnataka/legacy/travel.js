function selectDestination(destination) {
  document.getElementById("destination").value = destination;
}

document
  .getElementById("bookingForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert(
      "Booking successful for " + document.getElementById("destination").value
    );
    // Add form submission logic here, e.g., send data to server
  });
