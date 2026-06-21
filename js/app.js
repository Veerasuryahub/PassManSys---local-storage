// ====================================
// PASSENGER MANAGEMENT SYSTEM
// Version: 2.0
// Storage: Browser LocalStorage
// ====================================

const DEMO_USER = {
    userId: "travel123",
    password: "Travel@123"
};

// ====================================
// INITIALIZE DEMO DATA
// ====================================
function initializeData() {
    if (!localStorage.getItem("pms_passengers")) {
        const passengers = [
            { pnr: "PNR1001", name: "Surya Kumar", age: 22, gender: "Male",   origin: "Madurai",    destination: "Chennai",  train: "TN01", price: 650 },
            { pnr: "PNR1002", name: "Arun Raj",   age: 25, gender: "Male",   origin: "Coimbatore", destination: "Salem",    train: "TN02", price: 500 },
            { pnr: "PNR1003", name: "Priya S",    age: 24, gender: "Female", origin: "Trichy",     destination: "Chennai",  train: "TN03", price: 720 },
            { pnr: "PNR1004", name: "Anitha D",   age: 28, gender: "Female", origin: "Erode",      destination: "Madurai",  train: "TN04", price: 450 }
        ];
        localStorage.setItem("pms_passengers", JSON.stringify(passengers));
    }
}

initializeData();

// ====================================
// HELPERS
// ====================================
function getPassengers() {
    return JSON.parse(localStorage.getItem("pms_passengers")) || [];
}

function savePassengers(list) {
    localStorage.setItem("pms_passengers", JSON.stringify(list));
}

// ====================================
// TOAST
// ====================================
function showToast(msg, type) {
    const toast = document.getElementById("toast");
    if (!toast) { alert(msg); return; }
    toast.textContent = msg;
    toast.className = "toast show " + type;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.className = "toast"; }, 3500);
}

// ====================================
// PASSWORD TOGGLE
// ====================================
function togglePassword() {
    const inp = document.getElementById("password");
    const btn = document.getElementById("togglePassword");
    if (inp.type === "password") {
        inp.type = "text";
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        inp.type = "password";
        btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

// ====================================
// LOGIN
// ====================================
function login() {
    const userid   = (document.getElementById("userid").value   || "").trim();
    const password = (document.getElementById("password").value || "").trim();

    if (!userid || !password) {
        showToast("Please fill all fields.", "error"); return;
    }
    if (!/^[a-zA-Z0-9]{8,}$/.test(userid)) {
        showToast("User ID: minimum 8 alphanumeric characters.", "error"); return;
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/.test(password)) {
        showToast("Password: min 10 chars, 1 uppercase, 1 number, 1 special character.", "error"); return;
    }
    if (userid === DEMO_USER.userId && password === DEMO_USER.password) {
        localStorage.setItem("pms_loggedIn", "true");
        showToast("Login successful.", "success");
        setTimeout(showApp, 800);
    } else {
        showToast("Invalid User ID or Password.", "error");
    }
}

// ====================================
// LOGOUT
// ====================================
function logout() {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("pms_loggedIn");
    document.getElementById("loginForm").reset();
    showLogin();
}

// ====================================
// PAGE SWITCH
// ====================================
function showLogin() {
    document.getElementById("loginPage").classList.add("active");
    document.getElementById("appPage").classList.remove("active");
}

function showApp() {
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("appPage").classList.add("active");
    navigateTo("dashboard");
}

function checkSession() {
    if (localStorage.getItem("pms_loggedIn") === "true") {
        showApp();
    } else {
        showLogin();
    }
}

// ====================================
// SPA NAVIGATION
// ====================================
function navigateTo(page) {
    // Hide all sections
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    // Remove active from all nav links
    document.querySelectorAll(".nav-list a").forEach(a => a.classList.remove("active"));
    // Close mobile menu
    document.getElementById("navList").classList.remove("open");

    // Activate selected
    const sectionMap = {
        dashboard: "dashboardSection",
        add:       "addSection",
        view:      "viewSection",
        update:    "updateSection",
        search:    "searchSection",
        delete:    "deleteSection"
    };

    const sectionId = sectionMap[page];
    if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) el.classList.add("active");
    }

    const navLink = document.querySelector('.nav-list a[data-page="' + page + '"]');
    if (navLink) navLink.classList.add("active");

    // Run page-specific logic
    if (page === "dashboard") refreshDashboard();
    if (page === "view")      displayAllPassengers();
}

function toggleMobileNav() {
    document.getElementById("navList").classList.toggle("open");
}

// ====================================
// DASHBOARD
// ====================================
function refreshDashboard() {
    const list    = getPassengers();
    const total   = list.length;
    const males   = list.filter(p => p.gender === "Male").length;
    const females = list.filter(p => p.gender === "Female").length;
    const revenue = list.reduce((s, p) => s + Number(p.price), 0);

    setText("totalPassengers", total);
    setText("maleCount",       males);
    setText("femaleCount",     females);
    setText("totalRevenue",    "Rs. " + revenue.toLocaleString("en-IN"));

    // Recent 5 rows
    const tbody = document.getElementById("recentTbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">No records found.</td></tr>';
        return;
    }

    const recent = list.slice(-5).reverse();
    recent.forEach((p, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${p.pnr}</td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.origin}</td>
                <td>${p.destination}</td>
                <td>${p.train}</td>
                <td>Rs. ${Number(p.price).toLocaleString("en-IN")}</td>
            </tr>`;
    });
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ====================================
// ADD PASSENGER
// ====================================
function addPassenger() {
    const pnr  = (document.getElementById("pnr").value || "").trim().toUpperCase();
    const name = (document.getElementById("name").value || "").trim();
    const age  = Number(document.getElementById("age").value);
    const gender      = document.getElementById("gender").value;
    const origin      = (document.getElementById("origin").value || "").trim();
    const destination = (document.getElementById("destination").value || "").trim();
    const train       = (document.getElementById("train").value || "").trim().toUpperCase();
    const price       = Number(document.getElementById("price").value);

    if (!pnr || !name || !age || !origin || !destination || !train || !price) {
        showToast("Please fill all mandatory fields.", "error"); return;
    }
    if (age <= 0) {
        showToast("Age must be greater than 0.", "error"); return;
    }
    if (price <= 0) {
        showToast("Ticket price must be greater than 0.", "error"); return;
    }

    const list = getPassengers();
    if (list.some(p => p.pnr === pnr)) {
        showToast("PNR number already exists. Please use a unique PNR.", "error"); return;
    }

    list.push({ pnr, name, age, gender, origin, destination, train, price });
    savePassengers(list);
    document.getElementById("passengerForm").reset();
    showToast("Passenger record added successfully.", "success");
}

// ====================================
// VIEW ALL PASSENGERS
// ====================================
function displayAllPassengers() {
    const list  = getPassengers();
    const tbody = document.getElementById("viewTbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-msg">No records found.</td></tr>';
        setText("viewTotalCount", 0);
        setText("viewAvgPrice",   "Rs. 0");
        setText("viewHighPrice",  "Rs. 0");
        return;
    }

    let total   = 0;
    let highest = 0;

    list.forEach((p, i) => {
        const price = Number(p.price);
        total += price;
        if (price > highest) highest = price;

        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${p.pnr}</td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.origin}</td>
                <td>${p.destination}</td>
                <td>${p.train}</td>
                <td>Rs. ${price.toLocaleString("en-IN")}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="openEditPassenger(${i})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFromView(${i})">Delete</button>
                </td>
            </tr>`;
    });

    const avg = Math.round(total / list.length);
    setText("viewTotalCount", list.length);
    setText("viewAvgPrice",   "Rs. " + avg.toLocaleString("en-IN"));
    setText("viewHighPrice",  "Rs. " + highest.toLocaleString("en-IN"));
}

// ====================================
// FILTER TABLE
// ====================================
function filterPassengers() {
    const q    = (document.getElementById("filterBox").value || "").toUpperCase();
    const rows = document.querySelectorAll("#viewTbody tr");
    rows.forEach(row => {
        const pnr  = (row.cells[1] ? row.cells[1].innerText : "").toUpperCase();
        const name = (row.cells[2] ? row.cells[2].innerText : "").toUpperCase();
        row.style.display = (pnr.includes(q) || name.includes(q)) ? "" : "none";
    });
}

// ====================================
// DELETE FROM VIEW TABLE
// ====================================
function deleteFromView(index) {
    if (!confirm("Are you sure you want to permanently delete this passenger record?")) return;
    const list = getPassengers();
    list.splice(index, 1);
    savePassengers(list);
    showToast("Passenger record deleted.", "success");
    displayAllPassengers();
}

// ====================================
// EDIT / UPDATE
// ====================================
function openEditPassenger(index) {
    const list = getPassengers();
    const p    = list[index];
    if (!p) return;

    localStorage.setItem("pms_editIndex", index);

    setValue("updatePnr",         p.pnr);
    setValue("updateName",        p.name);
    setValue("updateAge",         p.age);
    setValue("updateGender",      p.gender);
    setValue("updateOrigin",      p.origin);
    setValue("updateDestination", p.destination);
    setValue("updateTrain",       p.train);
    setValue("updatePrice",       p.price);

    navigateTo("update");
}

function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function updatePassenger() {
    const idx  = localStorage.getItem("pms_editIndex");
    const list = getPassengers();

    if (idx === null || !list[idx]) {
        showToast("No passenger selected for update.", "error"); return;
    }

    const age   = Number(document.getElementById("updateAge").value);
    const price = Number(document.getElementById("updatePrice").value);

    if (age <= 0)   { showToast("Age must be greater than 0.", "error"); return; }
    if (price <= 0) { showToast("Price must be greater than 0.", "error"); return; }

    list[idx] = {
        pnr:         document.getElementById("updatePnr").value,
        name:        (document.getElementById("updateName").value || "").trim(),
        age:         age,
        gender:      document.getElementById("updateGender").value,
        origin:      (document.getElementById("updateOrigin").value || "").trim(),
        destination: (document.getElementById("updateDestination").value || "").trim(),
        train:       (document.getElementById("updateTrain").value || "").trim().toUpperCase(),
        price:       price
    };

    savePassengers(list);
    localStorage.removeItem("pms_editIndex");
    showToast("Passenger record updated successfully.", "success");
    setTimeout(() => navigateTo("view"), 800);
}

// ====================================
// SEARCH
// ====================================
function searchPassenger() {
    const pnr    = (document.getElementById("searchPNR").value || "").trim().toUpperCase();
    const result = document.getElementById("searchResult");
    if (!pnr) { showToast("Please enter a PNR number.", "error"); return; }

    const p = getPassengers().find(x => x.pnr.toUpperCase() === pnr);

    if (p) {
        result.innerHTML = `
            <p style="color:#1a5c1a; font-weight:bold; margin-bottom:10px;">
                &#10003; Passenger record found for PNR: ${p.pnr}
            </p>
            <table class="result-table">
                <tr><td>PNR Number</td><td>${p.pnr}</td></tr>
                <tr><td>Passenger Name</td><td>${p.name}</td></tr>
                <tr><td>Age</td><td>${p.age} years</td></tr>
                <tr><td>Gender</td><td>${p.gender}</td></tr>
                <tr><td>Origin Station</td><td>${p.origin}</td></tr>
                <tr><td>Destination Station</td><td>${p.destination}</td></tr>
                <tr><td>Train Number</td><td>${p.train}</td></tr>
                <tr><td>Ticket Price</td><td>Rs. ${Number(p.price).toLocaleString("en-IN")}</td></tr>
            </table>`;
        showToast("Passenger record found.", "success");
    } else {
        result.innerHTML = `<div class="empty-msg">No passenger record found for PNR: <strong>${pnr}</strong></div>`;
        showToast("No record found for the given PNR.", "error");
    }
}

function clearSearch() {
    document.getElementById("searchPNR").value = "";
    document.getElementById("searchResult").innerHTML =
        '<div class="empty-msg">Enter a PNR number above and click Search to view passenger details.</div>';
}

// ====================================
// DELETE BY PNR
// ====================================
function findPassengerToDelete() {
    const pnr    = (document.getElementById("deletePNR").value || "").trim().toUpperCase();
    const result = document.getElementById("deleteResult");
    if (!pnr) { showToast("Please enter a PNR number.", "error"); return; }

    const p = getPassengers().find(x => x.pnr.toUpperCase() === pnr);

    if (p) {
        result.innerHTML = `
            <p style="font-weight:bold; margin-bottom:10px; color:#333;">
                Passenger record found. Review details and confirm deletion.
            </p>
            <table class="result-table">
                <tr><td>PNR Number</td><td>${p.pnr}</td></tr>
                <tr><td>Passenger Name</td><td>${p.name}</td></tr>
                <tr><td>Age</td><td>${p.age} years</td></tr>
                <tr><td>Gender</td><td>${p.gender}</td></tr>
                <tr><td>Origin Station</td><td>${p.origin}</td></tr>
                <tr><td>Destination Station</td><td>${p.destination}</td></tr>
                <tr><td>Train Number</td><td>${p.train}</td></tr>
                <tr><td>Ticket Price</td><td>Rs. ${Number(p.price).toLocaleString("en-IN")}</td></tr>
            </table>
            <div style="margin-top:16px;">
                <button class="btn btn-danger" onclick="confirmDelete('${p.pnr}')" id="confirmDeleteBtn">
                    Confirm Delete
                </button>
                <button class="btn btn-secondary" onclick="clearDeleteResult()" style="margin-left:8px;" id="cancelDeleteBtn">
                    Cancel
                </button>
            </div>`;
    } else {
        result.innerHTML = `<div class="empty-msg">No passenger record found for PNR: <strong>${pnr}</strong></div>`;
        showToast("No record found for the given PNR.", "error");
    }
}

function confirmDelete(pnr) {
    if (!confirm('Permanently delete passenger with PNR "' + pnr + '"?')) return;
    let list = getPassengers();
    list = list.filter(p => p.pnr !== pnr);
    savePassengers(list);
    showToast("Passenger record deleted successfully.", "success");
    document.getElementById("deletePNR").value = "";
    document.getElementById("deleteResult").innerHTML =
        `<div class="empty-msg" style="color:#1a5c1a;">Passenger record for PNR <strong>${pnr}</strong> has been deleted.</div>`;
}

function clearDeleteResult() {
    document.getElementById("deletePNR").value = "";
    document.getElementById("deleteResult").innerHTML =
        '<div class="empty-msg">Enter a PNR number and click Find to locate the passenger before deleting.</div>';
}

// ====================================
// RESET DATABASE
// ====================================
function resetDatabase() {
    if (!confirm("Reset all data to default demo records? All current records will be lost.")) return;
    localStorage.removeItem("pms_passengers");
    initializeData();
    showToast("Database reset to demo defaults.", "success");
    refreshDashboard();
}

// ====================================
// INIT
// ====================================
window.addEventListener("DOMContentLoaded", checkSession);

console.log("Passenger Management System v2.0 loaded.");
