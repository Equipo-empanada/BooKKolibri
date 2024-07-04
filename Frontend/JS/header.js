var profilePic;

const userDetail = {
    name: "Juan Perez",
    pictureSource: "../Frontend/assets/icon.jpg"  // Ruta relativa a la carpeta estática
}

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
                        <button class="btn" type="button">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="login_signup" class="d-flex align-items-center">
                <a href="./login.html">
                    <span id="login_text">Iniciar Sesión</span>
                </a>
                <a href="./register.html">
                    <span id="signup_text">Registrarse</span>
                </a>
                <button class="btn btn-cart ms-2" type="button">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <a id="profile_pic" href="./my_info" class="ms-2">
                    <!-- Add profile picture here -->
                    <img src="${userDetail.pictureSource}" alt="Profile Picture" height="50" width="50" class="profile_pic">
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
                        <a class="nav-link" href="./sales_request_1.html">Venta con BooKKolibri</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Intercambio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Nuevo</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Libros</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Colecciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Escolar</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Académico</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Novelas</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    document.querySelector("body").insertAdjacentHTML("afterbegin", headerHTML);
});
