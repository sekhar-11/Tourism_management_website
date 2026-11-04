(function () {
  "use strict";

  const stateImageFiles = {
    "andhra-pradesh": [
      "../../assets/images/shared/hotels/ap1.jpg",
      "../../assets/images/shared/hotels/ap2.jpg",
      "../../assets/images/shared/hotels/ap3.jpg",
    ],
    goa: [
      "../../states/goa/assets/images/hotels/goa1.webp",
      "../../states/goa/assets/images/hotels/goa2.webp",
      "../../states/goa/assets/images/hotels/goa3.webp",
    ],
    karnataka: [
      "../../states/karnataka/assets/images/hotels/kar1.jpg",
      "../../states/karnataka/assets/images/hotels/kar2.jpg",
      "../../states/karnataka/assets/images/hotels/kar3.jpg",
    ],
    kerala: [
      "../../states/kerala/assets/images/hotels/1.jpg",
      "../../states/kerala/assets/images/hotels/2.jpg",
      "../../states/kerala/assets/images/hotels/3.jpg",
    ],
    "tamil-nadu": [
      "../../states/tamil-nadu/assets/images/hotels/tamil1.jpg",
      "../../states/tamil-nadu/assets/images/hotels/tamil2.avif",
      "../../states/tamil-nadu/assets/images/hotels/tamil3.jpg",
    ],
    telangana: [
      "../../states/telangana/assets/images/hotels/tel1.jpg",
      "../../states/telangana/assets/images/hotels/tel2.jpg",
      "../../states/telangana/assets/images/hotels/tel3.webp",
    ],
  };

  const script = document.currentScript;
  const state = window.location.pathname.split("/states/")[1]?.split("/")[0];
  const imageFiles = stateImageFiles[state];
  if (!script || !imageFiles) {
    console.error("Could not find hotel card images for this state.");
    return;
  }

  document.querySelectorAll(".hotel-listing > .card").forEach((card, index) => {
    if (card.querySelector("img")) return;

    const heading = card.querySelector("h2");
    if (!heading) return;

    const image = document.createElement("img");
    image.src = new URL(imageFiles[index % imageFiles.length], script.src).href;
    image.alt = heading.textContent.trim() + " hotel";
    image.loading = "lazy";
    image.decoding = "async";
    image.className = "hotel-card-image";
    heading.insertAdjacentElement("afterend", image);
  });
})();
