// Function to clear localStorage
function clearLocalStorage() {
    localStorage.clear();
    console.log("Local storage cleared");
}

// Function to handle logout process
function handleLogout() {
    clearLocalStorage();
    window.location.href = "/sign_out";
}

// Attach the handleLogout function to both logout links
document.addEventListener("DOMContentLoaded", function() {
    const navbarSignOutLink = document.getElementById("navbarSignOut");
    const mainSignOutButton = document.getElementById("mainSignOut");

    if (navbarSignOutLink) {
        navbarSignOutLink.addEventListener("click", function(event) {
            event.preventDefault();
            handleLogout();
        });
    }

    if (mainSignOutButton) {
        mainSignOutButton.addEventListener("click", function(event) {
            event.preventDefault();
            handleLogout();
        });
    }
});
