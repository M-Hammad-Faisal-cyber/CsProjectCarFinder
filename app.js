const API_URL = "http://localhost:3000/cars";

const carContainer = document.getElementById("carContainer");
const messageBox = document.getElementById("messageBox");

const brandFilter = document.getElementById("brandFilter");
const fuelFilter = document.getElementById("fuelFilter");
const searchInput = document.getElementById("searchInput");
const sortPrice = document.getElementById("sortPrice");

const carForm = document.getElementById("carForm");

let allCars = [];

/* =========================
   FETCH CARS
========================= */

async function fetchCars() {

  try {

    showMessage("Loading cars...", "primary");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }

    const cars = await response.json();

    allCars = cars;

    renderCars(cars);

    showMessage("", "");

  } catch (error) {

    showMessage(error.message, "danger");
  }
}

/* =========================
   RENDER CARS
========================= */

function renderCars(cars) {

  carContainer.innerHTML = "";

  if (cars.length === 0) {

    carContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center">
          No cars found
        </div>
      </div>
    `;

    return;
  }

  cars.forEach((car) => {

    const card = document.createElement("div");

    card.className = "col-md-6 col-lg-4";

    card.innerHTML = `
      <div class="card car-card shadow-sm">

        <img
          src="${car.image}"
          class="card-img-top car-image"
          alt="${car.name}"
        />

        <div class="card-body d-flex flex-column">

          <h5 class="card-title">${car.name}</h5>

          <p class="text-muted mb-1">
            ${car.brand} • ${car.year}
          </p>

          <p class="mb-1">
            <strong>Fuel:</strong> ${car.fuel}
          </p>

          <p class="mb-1">
            <strong>Transmission:</strong> ${car.transmission}
          </p>

          <p class="mb-1">
            <strong>Mileage:</strong> ${car.mileage}
          </p>

          <p class="mb-1">
            <strong>City:</strong> ${car.city}
          </p>

          <p class="card-text">
            ${car.description}
          </p>

          <p class="price-tag mt-auto">
            PKR ${Number(car.price).toLocaleString()}
          </p>

          <p>
            <strong>Contact:</strong> ${car.contact}
          </p>

        </div>

      </div>
    `;

    carContainer.appendChild(card);
  });
}

/* =========================
   FILTER CARS
========================= */

function filterCars() {

  let filteredCars = [...allCars];

  const selectedBrand = brandFilter.value;
  const selectedFuel = fuelFilter.value;
  const searchText = searchInput.value.toLowerCase();

  if (selectedBrand !== "all") {
    filteredCars = filteredCars.filter(
      (car) => car.brand === selectedBrand
    );
  }

  if (selectedFuel !== "all") {
    filteredCars = filteredCars.filter(
      (car) => car.fuel === selectedFuel
    );
  }

  if (searchText !== "") {
    filteredCars = filteredCars.filter((car) =>
      car.name.toLowerCase().includes(searchText)
    );
  }

  if (sortPrice.value === "lowToHigh") {

    filteredCars.sort((a, b) => a.price - b.price);

  } else if (sortPrice.value === "highToLow") {

    filteredCars.sort((a, b) => b.price - a.price);
  }

  renderCars(filteredCars);
}

/* =========================
   VALIDATE FORM
========================= */

function validateForm() {

  let isValid = true;

  const name = document.getElementById("name").value.trim();
  const brand = document.getElementById("brand").value;
  const year = document.getElementById("year").value;
  const price = document.getElementById("price").value;
  const fuel = document.getElementById("fuel").value;
  const transmission = document.getElementById("transmission").value;
  const mileage = document.getElementById("mileage").value.trim();
  const city = document.getElementById("city").value.trim();
  const image = document.getElementById("image").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const description = document.getElementById("description").value.trim();

  clearErrors();

  if (name === "") {
    showError("nameError", "Car name is required");
    isValid = false;
  }

  if (brand === "") {
    showError("brandError", "Brand is required");
    isValid = false;
  }

  if (year < 2000 || year > 2026) {
    showError("yearError", "Enter valid year");
    isValid = false;
  }

  if (price <= 0) {
    showError("priceError", "Price must be positive");
    isValid = false;
  }

  if (fuel === "") {
    showError("fuelError", "Fuel type required");
    isValid = false;
  }

  if (transmission === "") {
    showError("transmissionError", "Transmission required");
    isValid = false;
  }

  if (mileage === "") {
    showError("mileageError", "Mileage required");
    isValid = false;
  }

  if (city === "") {
    showError("cityError", "City required");
    isValid = false;
  }

  if (image === "") {
    showError("imageError", "Image URL required");
    isValid = false;
  }

  const phonePattern = /^03[0-9]{9}$/;

  if (!phonePattern.test(contact)) {
    showError(
      "contactError",
      "Enter valid Pakistani phone number"
    );

    isValid = false;
  }

  if (description.length < 10) {
    showError(
      "descriptionError",
      "Description should be at least 10 characters"
    );

    isValid = false;
  }

  return isValid;
}

/* =========================
   ADD CAR
========================= */

async function addCar(e) {

  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const newCar = {
    name: document.getElementById("name").value,
    brand: document.getElementById("brand").value,
    year: document.getElementById("year").value,
    price: Number(document.getElementById("price").value),
    fuel: document.getElementById("fuel").value,
    transmission: document.getElementById("transmission").value,
    mileage: document.getElementById("mileage").value,
    city: document.getElementById("city").value,
    image: document.getElementById("image").value,
    contact: document.getElementById("contact").value,
    description: document.getElementById("description").value
  };

  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(newCar)
    });

    if (!response.ok) {
      throw new Error("Failed to add car");
    }

    carForm.reset();

    showMessage("Car added successfully", "success");

    fetchCars();

  } catch (error) {

    showMessage(error.message, "danger");
  }
}

/* =========================
   HELPER FUNCTIONS
========================= */

function showMessage(message, type) {

  messageBox.innerHTML = "";

  if (message !== "") {

    messageBox.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
  }
}

function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {

  const errorElements = document.querySelectorAll(".text-danger");

  errorElements.forEach((element) => {
    element.textContent = "";
  });
}

/* =========================
   DARK MODE
========================= */

const darkModeBtn = document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");
});

/* =========================
   EVENT LISTENERS
========================= */

brandFilter.addEventListener("change", filterCars);

fuelFilter.addEventListener("change", filterCars);

searchInput.addEventListener("input", filterCars);

sortPrice.addEventListener("change", filterCars);

carForm.addEventListener("submit", addCar);

/* =========================
   INITIAL LOAD
========================= */

fetchCars();