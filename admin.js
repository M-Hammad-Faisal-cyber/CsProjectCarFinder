const API_URL = "http://localhost:3000/cars";

const adminTableBody = document.getElementById("adminTableBody");
const adminSearch = document.getElementById("adminSearch");

let adminCars = [];

/* =========================
   FETCH ALL CARS
========================= */

async function fetchCars() {

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }

    const cars = await response.json();

    adminCars = cars;

    renderCars(cars);

    showStats(cars);

  } catch (error) {

    console.log(error.message);
  }
}

/* =========================
   RENDER CARS
========================= */

function renderCars(cars) {

  adminTableBody.innerHTML = "";

  cars.forEach((car) => {

    const row = document.createElement("tr");

    row.innerHTML = `
    
      <td>
        <img
          src="${car.image}"
          width="100"
          height="60"
          class="rounded"
          style="object-fit: cover;"
        />
      </td>

      <td>${car.name}</td>

      <td>${car.brand}</td>

      <td>${car.year}</td>

      <td>PKR ${Number(car.price).toLocaleString()}</td>

      <td>${car.fuel}</td>

      <td>${car.city}</td>

      <td>

        <button
          class="btn btn-primary btn-sm me-2 edit-btn"
          data-id="${car.id}"
        >
          Edit
        </button>

        <button
          class="btn btn-danger btn-sm delete-btn"
          data-id="${car.id}"
        >
          Delete
        </button>

      </td>
    `;

    adminTableBody.appendChild(row);
  });

  addButtonEvents();
}

/* =========================
   BUTTON EVENTS
========================= */

function addButtonEvents() {

  const editButtons = document.querySelectorAll(".edit-btn");

  editButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const id = button.dataset.id;

      openEditModal(id);
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const id = button.dataset.id;

      deleteCar(id);
    });
  });
}

/* =========================
   DELETE CAR
========================= */

async function deleteCar(id) {

  const confirmDelete = confirm(
    "Are you sure you want to delete this car?"
  );

  if (!confirmDelete) {
    return;
  }

  try {

    const response = await fetch(`${API_URL}/${id}`, {

      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete car");
    }

    fetchCars();

  } catch (error) {

    console.log(error.message);
  }
}

/* =========================
   OPEN EDIT MODAL
========================= */

function openEditModal(id) {

  const selectedCar = adminCars.find(
    (car) => car.id == id
  );

  document.getElementById("editId").value =
    selectedCar.id;

  document.getElementById("editName").value =
    selectedCar.name;

  document.getElementById("editPrice").value =
    selectedCar.price;

  document.getElementById("editCity").value =
    selectedCar.city;

  document.getElementById("editContact").value =
    selectedCar.contact;

  const modal = new bootstrap.Modal(
    document.getElementById("editModal")
  );

  modal.show();
}

/* =========================
   EDIT CAR
========================= */

async function editCar(e) {

  e.preventDefault();

  const id = document.getElementById("editId").value;

  const updatedCar = {

    name: document.getElementById("editName").value,

    price: Number(
      document.getElementById("editPrice").value
    ),

    city: document.getElementById("editCity").value,

    contact: document.getElementById("editContact").value
  };

  try {

    const response = await fetch(`${API_URL}/${id}`, {

      method: "PATCH",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(updatedCar)
    });

    if (!response.ok) {
      throw new Error("Failed to update car");
    }

    fetchCars();

    const modalElement =
      document.getElementById("editModal");

    const modal =
      bootstrap.Modal.getInstance(modalElement);

    modal.hide();

  } catch (error) {

    console.log(error.message);
  }
}

/* =========================
   SHOW STATISTICS
========================= */

function showStats(cars) {

  document.getElementById("totalCars").textContent =
    cars.length;

  const totalPrice = cars.reduce(
    (sum, car) => sum + Number(car.price),
    0
  );

  const averagePrice =
    totalPrice / cars.length;

  document.getElementById("averagePrice").textContent =
    `PKR ${Math.round(averagePrice).toLocaleString()}`;

  const hybridCars = cars.filter(
    (car) => car.fuel === "Hybrid"
  );

  document.getElementById("hybridCars").textContent =
    hybridCars.length;

  const brandCount = {};

  cars.forEach((car) => {

    if (brandCount[car.brand]) {

      brandCount[car.brand]++;

    } else {

      brandCount[car.brand] = 1;
    }
  });

  let commonBrand = "";

  let highestCount = 0;

  for (let brand in brandCount) {

    if (brandCount[brand] > highestCount) {

      highestCount = brandCount[brand];

      commonBrand = brand;
    }
  }

  document.getElementById("commonBrand").textContent =
    commonBrand;
}

/* =========================
   SEARCH FUNCTIONALITY
========================= */

adminSearch.addEventListener("input", () => {

  const searchText =
    adminSearch.value.toLowerCase();

  const filteredCars = adminCars.filter((car) =>
    car.name.toLowerCase().includes(searchText)
  );

  renderCars(filteredCars);
});

/* =========================
   FORM SUBMIT
========================= */

document
  .getElementById("editForm")
  .addEventListener("submit", editCar);

/* =========================
   INITIAL LOAD
========================= */

fetchCars();