(function () {
  "use strict";

  const homeUrl = "../../home.html";

  function getSavedName() {
    try {
      return localStorage.getItem("southernSafariName") || "";
    } catch (error) {
      console.error("Could not read the saved traveler name.", error);
      return "";
    }
  }

  function showTravelerName() {
    const name = getSavedName();
    const bookingContainer = document.querySelector(".booking-container");
    const heading = bookingContainer && bookingContainer.querySelector("h2");
    if (!name || !heading || bookingContainer.querySelector(".booking-welcome")) {
      return;
    }

    const welcome = document.createElement("p");
    welcome.className = "booking-welcome";
    welcome.textContent = "Welcome, " + name;
    heading.insertAdjacentElement("afterend", welcome);
  }

  function selectTravelDestination() {
    const destination = document.getElementById("destination");
    const place = new URLSearchParams(window.location.search).get("place");
    if (destination && place) {
      if (destination instanceof HTMLSelectElement) {
        const matchingOption = Array.from(destination.options).find(
          (option) => option.value.toLowerCase() === place.toLowerCase()
        );
        if (matchingOption) {
          destination.value = matchingOption.value;
        }
      } else {
        destination.value = place;
      }
    }
  }

  function getOrCreateConfirmation() {
    let dialog = document.querySelector(".booking-confirmation");
    if (dialog) {
      return dialog;
    }

    dialog = document.createElement("div");
    dialog.className = "booking-confirmation";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "booking-confirmation-title");
    dialog.innerHTML =
      '<div class="booking-confirmation__panel" role="document">' +
      '<h2 id="booking-confirmation-title">Thank you for booking!</h2>' +
      '<p class="booking-confirmation__message"></p>' +
      '<div class="booking-confirmation__actions">' +
      '<button type="button" class="booking-confirmation__continue">Continue browsing</button>' +
      '<button type="button" class="booking-confirmation__return">Return to Home</button>' +
      "</div></div>";
    document.body.appendChild(dialog);

    const continueButton = dialog.querySelector(".booking-confirmation__continue");
    const returnButton = dialog.querySelector(".booking-confirmation__return");

    function closeDialog() {
      dialog.hidden = true;
    }

    continueButton.addEventListener("click", closeDialog);
    returnButton.addEventListener("click", function () {
      window.location.href = homeUrl;
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        closeDialog();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !dialog.hidden) {
        closeDialog();
      }
    });

    return dialog;
  }

  function bookTravel() {
    const destination = document.getElementById("destination");
    const personsField = document.getElementById("persons");
    if (!destination || !personsField) {
      return;
    }

    const persons = Number(personsField.value);
    if (!Number.isInteger(persons) || persons < 1) {
      personsField.setCustomValidity("Enter at least one traveler.");
      personsField.reportValidity();
      return;
    }

    window.location.href = "hotels.html?place=" + encodeURIComponent(destination.value);
  }

  function showConfirmation(card) {
    const dialog = getOrCreateConfirmation();
    const hotelName = card.querySelector("h2");
    const message = dialog.querySelector(".booking-confirmation__message");
    const name = getSavedName();
    message.textContent =
      (name ? "Thank you, " + name + "! " : "Thank you! ") +
      "Your booking at " +
      (hotelName ? hotelName.textContent.trim() : "the hotel") +
      " is confirmed.";
    dialog.hidden = false;
    dialog.querySelector(".booking-confirmation__return").focus();
  }

  function setupHotelBookings() {
    document.querySelectorAll(".book-button").forEach(function (button) {
      button.addEventListener("click", function () {
        const card = button.closest(".card");
        if (card) {
          showConfirmation(card);
        }
      });
    });
  }

  if (document.getElementById("destination")) {
    selectTravelDestination();
    showTravelerName();
    document.getElementById("persons").addEventListener("input", function () {
      this.setCustomValidity("");
    });
    window.bookNow = bookTravel;
  }

  if (document.querySelector(".book-button")) {
    setupHotelBookings();
  }
})();
