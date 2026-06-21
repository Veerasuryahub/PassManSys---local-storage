// ====================================
// PASSENGER MANAGEMENT SYSTEM
// Version: 3.0 - Thoroughly Tested
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
    toast._t = setTimeout(() => { toast.className = "toast"; }, 4000);
}

// ====================================
// VALIDATION HELPERS
// ====================================

// Name must contain letters only (allows spaces and dots for initials like "Priya S.")
function isValidName(val) {
    return /^[a-zA-Z][a-zA-Z\s.']{1,}$/.test(val.trim()) && val.trim().length >= 2;
}

// Station names: letters, spaces, hyphens only — no pure numbers
function isValidStation(val) {
    return /^[a-zA-Z][a-zA-Z\s\-'\.]{1,}$/.test(val.trim()) && val.trim().length >= 2;
}

// PNR: must be 3-10 alphanumeric characters (e.g. PNR1001, A12345)
function isValidPNR(val) {
    return /^[A-Z0-9]{3,10}$/.test(val.trim().toUpperCase());
}

// Train number: letters+numbers, 2-10 chars
function isValidTrain(val) {
    return /^[A-Z0-9\-]{2,10}$/.test(val.trim().toUpperCase());
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
        showToast("Please fill in all fields.", "error"); return;
    }
    if (userid.length < 8) {
        showToast("User ID must be at least 8 characters.", "error"); return;
    }
    if (!/^[a-zA-Z0-9]{8,}$/.test(userid)) {
        showToast("User ID must contain only alphanumeric characters (letters and numbers).", "error"); return;
    }
    if (password.length < 10) {
        showToast("Password must be at least 10 characters.", "error"); return;
    }
    if (!/[A-Z]/.test(password)) {
        showToast("Password must contain at least 1 uppercase letter.", "error"); return;
    }
    if (!/[0-9]/.test(password)) {
        showToast("Password must contain at least 1 number.", "error"); return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
        showToast("Password must contain at least 1 special character (!@#$%^&*).", "error"); return;
    }

    if (userid === DEMO_USER.userId && password === DEMO_USER.password) {
        localStorage.setItem("pms_loggedIn", "true");
        showToast("Login successful. Welcome!", "success");
        setTimeout(showApp, 800);
    } else {
        showToast("Invalid User ID or Password. Please try again.", "error");
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
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-list a").forEach(a => a.classList.remove("active"));
    document.getElementById("navList").classList.remove("open");

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

    if (page === "dashboard") refreshDashboard();
    if (page === "view")      displayAllPassengers();

    // Clear search/delete results when navigating away
    if (page === "search") {
        clearSearch();
    }
    if (page === "delete") {
        clearDeleteResult();
    }
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
    const others  = list.filter(p => p.gender === "Other").length;
    const revenue = list.reduce((s, p) => s + Number(p.price), 0);

    setText("totalPassengers", total);
    setText("maleCount",       males);
    setText("femaleCount",     females);
    setText("totalRevenue",    "Rs. " + revenue.toLocaleString("en-IN"));

    const tbody = document.getElementById("recentTbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">No records found.</td></tr>';
        return;
    }

    const recent = list.slice(-5).reverse();
    recent.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td data-label="PNR">${escapeHtml(p.pnr)}</td>
                <td data-label="Name">${escapeHtml(p.name)}</td>
                <td data-label="Age">${p.age}</td>
                <td data-label="Gender">${escapeHtml(p.gender)}</td>
                <td data-label="Origin">${escapeHtml(p.origin)}</td>
                <td data-label="Destination">${escapeHtml(p.destination)}</td>
                <td data-label="Train No.">${escapeHtml(p.train)}</td>
                <td data-label="Ticket Price">Rs. ${Number(p.price).toLocaleString("en-IN")}</td>
            </tr>`;
    });
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// Prevent XSS by escaping HTML in output
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ====================================
// ADD PASSENGER — with full validation
// ====================================
function addPassenger() {
    const pnr         = (document.getElementById("pnr").value         || "").trim().toUpperCase();
    const name        = (document.getElementById("name").value        || "").trim();
    const ageRaw      = document.getElementById("age").value;
    const gender      = document.getElementById("gender").value;
    const origin      = (document.getElementById("origin").value      || "").trim();
    const destination = (document.getElementById("destination").value || "").trim();
    const train       = (document.getElementById("train").value       || "").trim().toUpperCase();
    const priceRaw    = document.getElementById("price").value;

    // 1. Empty check
    if (!pnr || !name || !ageRaw || !origin || !destination || !train || !priceRaw) {
        showToast("All fields are mandatory. Please fill in every field.", "error"); return;
    }

    // 2. PNR format
    if (!isValidPNR(pnr)) {
        showToast("PNR must be 3–10 alphanumeric characters (e.g. PNR1005, A12345).", "error"); return;
    }

    // 3. Name: letters only
    if (!isValidName(name)) {
        showToast("Passenger Name must contain only letters (min 2 characters). Numbers not allowed.", "error"); return;
    }

    // 4. Age: integer, 1–120
    if (!/^\d+$/.test(ageRaw.trim())) {
        showToast("Age must be a whole number (e.g. 25). Decimals not allowed.", "error"); return;
    }
    const age = parseInt(ageRaw, 10);
    if (age < 1 || age > 120) {
        showToast("Age must be between 1 and 120.", "error"); return;
    }

    // 5. Origin: letters only, no numbers
    if (!isValidStation(origin)) {
        showToast("Origin Station must contain only letters (e.g. Chennai, New Delhi). Numbers not allowed.", "error"); return;
    }

    // 6. Destination: letters only, no numbers
    if (!isValidStation(destination)) {
        showToast("Destination Station must contain only letters. Numbers not allowed.", "error"); return;
    }

    // 7. Origin ≠ Destination
    if (origin.toUpperCase() === destination.toUpperCase()) {
        showToast("Origin and Destination stations cannot be the same.", "error"); return;
    }

    // 8. Train number format
    if (!isValidTrain(train)) {
        showToast("Train Number must be 2–10 alphanumeric characters (e.g. TN01, 12302).", "error"); return;
    }

    // 9. Price: positive integer
    if (!/^\d+$/.test(priceRaw.trim())) {
        showToast("Ticket Price must be a whole number in Rupees (e.g. 500). Decimals not allowed.", "error"); return;
    }
    const price = parseInt(priceRaw, 10);
    if (price < 1) {
        showToast("Ticket Price must be at least Rs. 1.", "error"); return;
    }
    if (price > 100000) {
        showToast("Ticket Price cannot exceed Rs. 1,00,000.", "error"); return;
    }

    // 10. Unique PNR check
    const list = getPassengers();
    if (list.some(p => p.pnr.toUpperCase() === pnr)) {
        showToast(`PNR "${pnr}" already exists. Please use a unique PNR number.`, "error"); return;
    }

    list.push({ pnr, name, age, gender, origin, destination, train, price });
    savePassengers(list);
    document.getElementById("passengerForm").reset();
    showToast(`Passenger "${name}" (PNR: ${pnr}) added successfully.`, "success");
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
        tbody.innerHTML = '<tr><td colspan="10" class="empty-msg">No records found. Add passengers using the "Add Passenger" menu.</td></tr>';
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
                <td data-label="#">${i + 1}</td>
                <td data-label="PNR">${escapeHtml(p.pnr)}</td>
                <td data-label="Name">${escapeHtml(p.name)}</td>
                <td data-label="Age">${p.age}</td>
                <td data-label="Gender">${escapeHtml(p.gender)}</td>
                <td data-label="Origin">${escapeHtml(p.origin)}</td>
                <td data-label="Destination">${escapeHtml(p.destination)}</td>
                <td data-label="Train No.">${escapeHtml(p.train)}</td>
                <td data-label="Price (Rs.)">Rs. ${price.toLocaleString("en-IN")}</td>
                <td data-label="Action">
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
// FILTER TABLE (by PNR or Name)
// ====================================
function filterPassengers() {
    const q    = (document.getElementById("filterBox").value || "").trim().toUpperCase();
    const rows = document.querySelectorAll("#viewTbody tr");
    let visible = 0;
    rows.forEach(row => {
        if (row.cells.length < 3) { row.style.display = ""; return; }
        const pnr  = (row.cells[1] ? row.cells[1].innerText : "").toUpperCase();
        const name = (row.cells[2] ? row.cells[2].innerText : "").toUpperCase();
        const show = !q || pnr.includes(q) || name.includes(q);
        row.style.display = show ? "" : "none";
        if (show) visible++;
    });
}

// ====================================
// DELETE FROM VIEW TABLE
// ====================================
function deleteFromView(index) {
    const list = getPassengers();
    const p = list[index];
    if (!p) { showToast("Record not found.", "error"); return; }
    if (!confirm(`Permanently delete passenger "${p.name}" (PNR: ${p.pnr})?`)) return;
    list.splice(index, 1);
    savePassengers(list);
    showToast(`Passenger "${p.name}" (PNR: ${p.pnr}) deleted.`, "success");
    displayAllPassengers();
}

// ====================================
// EDIT / UPDATE — with full validation
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
        showToast("No passenger selected for update. Go to View All and click Edit.", "error"); return;
    }

    const name        = (document.getElementById("updateName").value        || "").trim();
    const ageRaw      = document.getElementById("updateAge").value;
    const gender      = document.getElementById("updateGender").value;
    const origin      = (document.getElementById("updateOrigin").value      || "").trim();
    const destination = (document.getElementById("updateDestination").value || "").trim();
    const train       = (document.getElementById("updateTrain").value       || "").trim().toUpperCase();
    const priceRaw    = document.getElementById("updatePrice").value;

    // Empty check
    if (!name || !ageRaw || !origin || !destination || !train || !priceRaw) {
        showToast("All fields are mandatory.", "error"); return;
    }

    // Name
    if (!isValidName(name)) {
        showToast("Passenger Name must contain only letters (min 2 characters). Numbers not allowed.", "error"); return;
    }

    // Age
    if (!/^\d+$/.test(ageRaw.trim())) {
        showToast("Age must be a whole number. Decimals not allowed.", "error"); return;
    }
    const age = parseInt(ageRaw, 10);
    if (age < 1 || age > 120) {
        showToast("Age must be between 1 and 120.", "error"); return;
    }

    // Origin
    if (!isValidStation(origin)) {
        showToast("Origin Station must contain only letters. Numbers not allowed.", "error"); return;
    }

    // Destination
    if (!isValidStation(destination)) {
        showToast("Destination Station must contain only letters. Numbers not allowed.", "error"); return;
    }

    // Origin ≠ Destination
    if (origin.toUpperCase() === destination.toUpperCase()) {
        showToast("Origin and Destination stations cannot be the same.", "error"); return;
    }

    // Train
    if (!isValidTrain(train)) {
        showToast("Train Number must be 2–10 alphanumeric characters.", "error"); return;
    }

    // Price
    if (!/^\d+$/.test(priceRaw.trim())) {
        showToast("Ticket Price must be a whole number in Rupees. Decimals not allowed.", "error"); return;
    }
    const price = parseInt(priceRaw, 10);
    if (price < 1) {
        showToast("Ticket Price must be at least Rs. 1.", "error"); return;
    }
    if (price > 100000) {
        showToast("Ticket Price cannot exceed Rs. 1,00,000.", "error"); return;
    }

    const oldPnr = list[idx].pnr;

    list[idx] = {
        pnr:         oldPnr,  // PNR is read-only
        name, age, gender, origin, destination, train, price
    };

    savePassengers(list);
    localStorage.removeItem("pms_editIndex");
    showToast(`Passenger "${name}" (PNR: ${oldPnr}) updated successfully.`, "success");
    setTimeout(() => navigateTo("view"), 800);
}

// ====================================
// SEARCH — by full or partial PNR, or by name
// ====================================
function searchPassenger() {
    const query  = (document.getElementById("searchPNR").value || "").trim().toUpperCase();
    const result = document.getElementById("searchResult");

    if (!query || query.length < 2) {
        showToast("Please enter at least 2 characters to search.", "error"); return;
    }

    const allPassengers = getPassengers();

    // Match: PNR contains query, OR name contains query (case-insensitive)
    const matches = allPassengers.filter(x =>
        x.pnr.toUpperCase().includes(query) ||
        x.name.toUpperCase().includes(query)
    );

    if (matches.length === 1) {
        // Single result — show detail view
        const p = matches[0];
        result.innerHTML = `
            <p class="search-found-msg">&#10003; 1 record found for: <strong>${escapeHtml(query)}</strong></p>
            <table class="result-table">
                <tr><td>PNR Number</td><td>${escapeHtml(p.pnr)}</td></tr>
                <tr><td>Passenger Name</td><td>${escapeHtml(p.name)}</td></tr>
                <tr><td>Age</td><td>${p.age} years</td></tr>
                <tr><td>Gender</td><td>${escapeHtml(p.gender)}</td></tr>
                <tr><td>Origin Station</td><td>${escapeHtml(p.origin)}</td></tr>
                <tr><td>Destination Station</td><td>${escapeHtml(p.destination)}</td></tr>
                <tr><td>Train Number</td><td>${escapeHtml(p.train)}</td></tr>
                <tr><td>Ticket Price</td><td>Rs. ${Number(p.price).toLocaleString("en-IN")}</td></tr>
            </table>`;
        showToast("1 passenger record found.", "success");

    } else if (matches.length > 1) {
        // Multiple results — show table
        let rows = matches.map((p, i) => `
            <tr>
                <td data-label="#">${i + 1}</td>
                <td data-label="PNR">${escapeHtml(p.pnr)}</td>
                <td data-label="Name">${escapeHtml(p.name)}</td>
                <td data-label="Age">${p.age}</td>
                <td data-label="Gender">${escapeHtml(p.gender)}</td>
                <td data-label="Origin">${escapeHtml(p.origin)}</td>
                <td data-label="Destination">${escapeHtml(p.destination)}</td>
                <td data-label="Train No.">${escapeHtml(p.train)}</td>
                <td data-label="Price (Rs.)">Rs. ${Number(p.price).toLocaleString("en-IN")}</td>
            </tr>`).join("");

        result.innerHTML = `
            <p class="search-found-msg">&#10003; ${matches.length} records found for: <strong>${escapeHtml(query)}</strong></p>
            <div class="table-wrap">
                <table>
                    <thead><tr>
                        <th>#</th><th>PNR</th><th>Name</th><th>Age</th>
                        <th>Gender</th><th>Origin</th><th>Destination</th>
                        <th>Train No.</th><th>Price (Rs.)</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
        showToast(`${matches.length} records found.`, "success");

    } else {
        result.innerHTML = `<div class="empty-msg">No passenger record found matching: <strong>${escapeHtml(query)}</strong><br>Try a different PNR or name.</div>`;
        showToast("No matching record found.", "error");
    }
}

function clearSearch() {
    const input = document.getElementById("searchPNR");
    if (input) input.value = "";
    const result = document.getElementById("searchResult");
    if (result) result.innerHTML =
        '<div class="empty-msg">Enter a PNR number or passenger name above and click Search.</div>';
}

// ====================================
// DELETE BY PNR
// ====================================
function findPassengerToDelete() {
    const pnr    = (document.getElementById("deletePNR").value || "").trim().toUpperCase();
    const result = document.getElementById("deleteResult");

    if (!pnr) {
        showToast("Please enter a PNR number.", "error"); return;
    }
    if (!isValidPNR(pnr)) {
        showToast("PNR must be 3–10 alphanumeric characters.", "error"); return;
    }

    const p = getPassengers().find(x => x.pnr.toUpperCase() === pnr);

    if (p) {
        result.innerHTML = `
            <p style="font-weight:bold; margin-bottom:10px; color:#333;">
                Passenger found. Review details below and confirm deletion.
            </p>
            <table class="result-table">
                <tr><td>PNR Number</td><td>${escapeHtml(p.pnr)}</td></tr>
                <tr><td>Passenger Name</td><td>${escapeHtml(p.name)}</td></tr>
                <tr><td>Age</td><td>${p.age} years</td></tr>
                <tr><td>Gender</td><td>${escapeHtml(p.gender)}</td></tr>
                <tr><td>Origin Station</td><td>${escapeHtml(p.origin)}</td></tr>
                <tr><td>Destination Station</td><td>${escapeHtml(p.destination)}</td></tr>
                <tr><td>Train Number</td><td>${escapeHtml(p.train)}</td></tr>
                <tr><td>Ticket Price</td><td>Rs. ${Number(p.price).toLocaleString("en-IN")}</td></tr>
            </table>
            <div style="margin-top:16px;">
                <button class="btn btn-danger" onclick="confirmDelete('${escapeHtml(p.pnr)}')" id="confirmDeleteBtn">
                    Confirm Delete
                </button>
                <button class="btn btn-secondary" onclick="clearDeleteResult()" style="margin-left:8px;" id="cancelDeleteBtn">
                    Cancel
                </button>
            </div>`;
        showToast(`Passenger "${p.name}" found. Click Confirm Delete to proceed.`, "success");
    } else {
        result.innerHTML = `<div class="empty-msg">No passenger record found for PNR: <strong>${escapeHtml(pnr)}</strong><br>Please check and try again.</div>`;
        showToast("No record found for the given PNR.", "error");
    }
}

function confirmDelete(pnr) {
    const list = getPassengers();
    const p = list.find(x => x.pnr === pnr);
    if (!p) { showToast("Record not found.", "error"); return; }

    if (!confirm(`Permanently delete passenger "${p.name}" with PNR "${pnr}"?\n\nThis action cannot be undone.`)) return;

    const newList = list.filter(x => x.pnr !== pnr);
    savePassengers(newList);
    showToast(`Passenger "${p.name}" (PNR: ${pnr}) deleted successfully.`, "success");
    document.getElementById("deletePNR").value = "";
    document.getElementById("deleteResult").innerHTML =
        `<div class="empty-msg" style="color:#1a5c1a;">&#10003; Passenger record for PNR <strong>${escapeHtml(pnr)}</strong> has been permanently deleted.</div>`;
}

function clearDeleteResult() {
    const input = document.getElementById("deletePNR");
    if (input) input.value = "";
    const result = document.getElementById("deleteResult");
    if (result) result.innerHTML =
        '<div class="empty-msg">Enter a PNR number and click Find Passenger to locate the record before deleting.</div>';
}

// ====================================
// RESET DATABASE
// ====================================
function resetDatabase() {
    if (!confirm("Reset all data to the 4 default demo records?\n\nAll your current records will be permanently lost.")) return;
    localStorage.removeItem("pms_passengers");
    initializeData();
    showToast("Database reset to demo defaults (4 records restored).", "success");
    refreshDashboard();
}

// ====================================
// KEYBOARD SUPPORT — Enter key triggers search/find
// ====================================
function handleSearchKey(event) {
    if (event.key === "Enter") searchPassenger();
}

function handleDeleteKey(event) {
    if (event.key === "Enter") findPassengerToDelete();
}

// ====================================
// INIT
// ====================================
window.addEventListener("DOMContentLoaded", () => {
    checkSession();

    // Bind Enter key to search and delete inputs
    const searchInput = document.getElementById("searchPNR");
    if (searchInput) searchInput.addEventListener("keydown", handleSearchKey);

    const deleteInput = document.getElementById("deletePNR");
    if (deleteInput) deleteInput.addEventListener("keydown", handleDeleteKey);
});

console.log("Passenger Management System v3.0 loaded.");
