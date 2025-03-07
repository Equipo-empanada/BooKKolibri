var profilePic;
var search_bar;
var search_button;

document.addEventListener("DOMContentLoaded", function() {
    const headerHTML = `
    <header class="header">
        <div class="container d-flex align-items-center justify-content-between">
            <a href="/" class="header__logo">
                <img src="../Frontend/assets/g1.svg" alt="Logo" height="50">
            </a>
            
            <div class="flex-grow-1 mx-3">
                <div class="input-group search-bar">
                    <input type="text" class="form-control" placeholder="Buscar">
                    <div class="input-group-append">
                        <button class="btn" type="button" id="search_button">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="login_signup" class="d-flex align-items-center">
                <a href="/login" id="login-link">
                    <span id="login_text">Iniciar Sesión</span>
                </a>
                <a href="/register" id="register-link">
                    <span id="signup_text">Registrarse</span>
                </a>
                <div class="position-relative ms-2">
                    <button class="btn btn-cart" type="button" onclick='purcharse_page()'>
                        <i class="fas fa-shopping-cart"></i>
                        <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">
                            0
                        </span>
                    </button>
                </div>
                <a id="profile_pic" href="./my_info" class="ms-2">
                    <!-- Add profile picture here -->
                    <img id="profile_pic_img" src="" alt="Profile Picture" height="50" width="50" class="profile_pic">
                </a>
            </div>
        </div>
    </header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Tienda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./sales_request_1">Venta con BooKKolibri</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/search_page?mode=view_category&category=intercambio">Intercambio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/search_page?mode=view_category&category=venta">Nuevo</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/search_page?mode=search&search=Libro">Libros</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/search_page?mode=search&search=Colecci">Colecciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/search_page?mode=search&search=Progra">Programación</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Académico</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/search_page?mode=search&search=Novela">Novelas</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    document.querySelector("body").insertAdjacentHTML("afterbegin", headerHTML);

    // Fetch user info and update header
    fetch("/photo_user")
    .then(response => response.json())
    .then(user => {
        if (user.nombre) {
            const profilePicUrl = user.foto_perfil ? `../Frontend/static/perfil_photos/${user.foto_perfil}` : '../Frontend/static/perfil_photos/default.jpg';
            document.getElementById("login_signup").innerHTML = `
                <span class="user-name">${user.nombre}</span>
                <div class="position-relative ms-2">
                    <button class="btn btn-cart" type="button" onclick='purcharse_page()'>
                        <i class="fas fa-shopping-cart"></i>
                        <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">
                            0
                        </span>
                    </button>
                </div>
                <a id="profile_pic" href="./my_info" class="ms-2">
                    <img src="${profilePicUrl}" alt="Profile Picture" height="50" width="50" class="profile_pic">
                </a>
            `;
        }
        updateCartCount(); // Actualizar el conteo del carrito después de cambiar el DOM
    })
    .catch(error => console.log("Error fetching user data:", error));

    search_bar = document.getElementsByClassName('form-control')[0];
    search_bar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            window.location.href = './search_page?mode=search&search=' + search_bar.value;
        }
    });

    search_button = document.getElementById('search_button');
    search_button.addEventListener('click', function() {
        window.location.href = './search_page?mode=search&search=' + search_bar.value;
    });

    // Actualizar el conteo del carrito
    updateCartCount();
});

// Función para actualizar el conteo del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shopping_cart')) || [];
    const cartCount = cart.length;

    const cartCountElement = document.getElementById('cart-count');
    if (cartCount > 0) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = 'inline-block';
    } else {
        cartCountElement.style.display = 'none';
    }
}

// Redirigir a la página de compra
function purcharse_page() {
    window.location.href = "./purchase_page";
}

// var profilePic;
// var search_bar;
// var search_button;

// const userDetail = {
//     name: "Juan Perez",
//     pictureSource: "../Frontend/static/perfil_photos/0.jpg"  // Ruta relativa a la carpeta estática
// }

// document.addEventListener("DOMContentLoaded", function() {
//     const headerHTML = `
//     <header class="header">
//         <div class="container d-flex align-items-center justify-content-between">
//             <a href="/" class="header__logo">
//                 <img src="../Frontend/assets/g1.svg" alt="Logo" height="50">
//             </a>
            
//             <div class="flex-grow-1 mx-3">
//                 <div class="input-group search-bar">
//                     <input type="text" class="form-control" placeholder="Buscar">
//                     <div class="input-group-append">
//                         <button class="btn" type="button" id="search_button">
//                             <i class="fa fa-search"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <div id="login_signup" class="d-flex align-items-center">
//                 <a href="/login" id="login-link">
//                     <span id="login_text">Iniciar Sesión</span>
//                 </a>
//                 <a href="/register" id="register-link">
//                     <span id="signup_text">Registrarse</span>
//                 </a>
//                 <div class="position-relative ms-2">
//                     <button class="btn btn-cart" type="button" onclick='purcharse_page()'>
//                         <i class="fas fa-shopping-cart"></i>
//                         <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">
//                             0
//                         </span>
//                     </button>
//                 </div>
//                 <a id="profile_pic" href="./my_info" class="ms-2">
//                     <!-- Add profile picture here -->
//                     <img src="${userDetail.pictureSource}" alt="Profile Picture" height="50" width="50" class="profile_pic">
//                 </a>
//             </div>
//         </div>
//     </header>
//     <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div class="container-fluid">
//             <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
//                 aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//                 <span class="navbar-toggler-icon"></span>
//             </button>
//             <div class="collapse navbar-collapse" id="navbarNav">
//                 <ul class="navbar-nav mx-auto">
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Tienda</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="./sales_request_1.html">Venta con BooKKolibri</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Intercambio</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Nuevo</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Libros</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Colecciones</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Escolar</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Académico</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#">Novelas</a>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     </nav>
//     `;

//     document.querySelector("body").insertAdjacentHTML("afterbegin", headerHTML);

//     // Fetch user info and update header
//     fetch("/info_user")
//     .then(response => response.json())
//     .then(user => {
//         if (user.email) {
//             document.getElementById("login_signup").innerHTML = `
//                 <span class="user-name">${user.nombre}</span>
//                 <div class="position-relative ms-2">
//                     <button class="btn btn-cart" type="button" onclick='purcharse_page()'>
//                         <i class="fas fa-shopping-cart"></i>
//                         <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">
//                             0
//                         </span>
//                     </button>
//                 </div>
//                 <a id="profile_pic" href="./my_info" class="ms-2">
//                     <img src="${userDetail.pictureSource}" alt="Profile Picture" height="50" width="50" class="profile_pic">
//                 </a>
//             `;
//         }
//         updateCartCount(); // Actualizar el conteo del carrito después de cambiar el DOM
//     })
//     .catch(error => console.log("Not logged in"));

//     search_bar = document.getElementsByClassName('form-control')[0];
//     search_bar.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') {
//             window.location.href = './search_page?mode=search&search=' + search_bar.value;
//         }
//     });

//     search_button = document.getElementById('search_button');
//     search_button.addEventListener('click', function() {
//         window.location.href = './search_page?mode=search&search=' + search_bar.value;
//     });

//     // Actualizar el conteo del carrito
//     updateCartCount();
// });

// // Función para actualizar el conteo del carrito
// function updateCartCount() {
//     const cart = JSON.parse(localStorage.getItem('shopping_cart')) || [];
//     const cartCount = cart.length;

//     const cartCountElement = document.getElementById('cart-count');
//     if (cartCount > 0) {
//         cartCountElement.textContent = cartCount;
//         cartCountElement.style.display = 'inline-block';
//     } else {
//         cartCountElement.style.display = 'none';
//     }
// }

// // Redirigir a la página de compra
// function purcharse_page() {
//     window.location.href = "./purchase_page";
// }
