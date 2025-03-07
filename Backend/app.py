
import requests
from flask import Flask, request, jsonify, render_template, jsonify, url_for, redirect
from flask_login import LoginManager, login_user, logout_user,login_required,current_user,UserMixin
from chat import get_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
#from flask_wtf.csrf import CSRFProtect
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
import json
import os
import random

from werkzeug.security import generate_password_hash, check_password_hash


from datetime import datetime
from werkzeug.utils import secure_filename
from PIL import Image

#socket
from flask_socketio import SocketIO, send,emit, join_room, leave_room


#Utils
from app_utils import check_password
from app_utils import hash_password
from app_utils import generate_unique_code

#Templates folder
template_dir = os.path.abspath('../Frontend')
static_dir = os.path.abspath('../Frontend')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres.asjubxyoqpiyuxewoxwg:empanada.123@aws-0-us-west-1.pooler.supabase.com:6543/postgres'
app.config['UPLOAD_FOLDER'] = '../Frontend/static/uploads'
app.secret_key = 'empanada_viento'
#csrf = CSRFProtect()
db = SQLAlchemy(app)
login_mannager_app = LoginManager(app)
login_mannager_app.login_view = 'login'
socketIO = SocketIO(app)

# Models definition DB
class Libro(db.Model):
    __tablename__ = 'libro'
    id_libro = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(255), nullable=False)
    edicion = db.Column(db.String(50), nullable=True)
    precio = db.Column(db.Numeric(10, 2), nullable=True)
    autor = db.Column(db.Text, nullable=True)
    idioma = db.Column(db.Text, nullable=True)
    fec_lamzamiento = db.Column(db.DateTime, nullable=True)
    editorial = db.Column(db.Text, nullable=True)
    estado = db.Column(db.String(50), nullable=True)
    descripcion = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.Text, nullable=True)

class Usuario(db.Model,UserMixin):
    __tablename__ = 'usuario'
    id_usuario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    contraseña = db.Column(db.String(255), nullable=False)
    fecha_nac = db.Column(db.DateTime, nullable=False)
    ciudad = db.Column(db.String(20), nullable=False)
    cod_postal = db.Column(db.String(20), nullable=False)
    rol = db.Column(db.String(10), nullable=False)
    foto_perfil = db.Column(db.Text, nullable=True)
    def get_id(self):
        return str(self.id_usuario)

class Tienda(db.Model):
    __tablename__ = 'tienda'
    id_tienda = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombrecomercial = db.Column(db.String(100), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    usuario = db.relationship('Usuario', backref=db.backref('tiendas', lazy=True))

class Publicacion(db.Model):
    __tablename__ = 'publicacion'
    id_publicacion = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo_publicacion = db.Column(db.String(50), nullable=False)
    latitud = db.Column(db.Numeric(9, 6), nullable=False)
    longitud = db.Column(db.Numeric(9, 6), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    activo = db.Column(db.Boolean, nullable=False)
    id_libro = db.Column(db.Integer, db.ForeignKey('libro.id_libro'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    libro = db.relationship('Libro', backref=db.backref('publicaciones', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('publicaciones', lazy=True))

class Pedido(db.Model):
    __tablename__ = 'pedido'
    id_pedido = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha = db.Column(db.Date, nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    tipotransaccion = db.Column(db.String(50), nullable=False)
    id_libro = db.Column(db.Integer, db.ForeignKey('publicacion.id_publicacion'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    Publicacion = db.relationship('Publicacion', backref=db.backref('pedidos', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('pedidos', lazy=True))

class ImagenLibro(db.Model):
    __tablename__ = 'imagenlibro'
    id_imagen = db.Column(db.Integer, primary_key=True, autoincrement=True)
    imagen = db.Column(db.LargeBinary, nullable=False)
    id_libro = db.Column(db.Integer, db.ForeignKey('libro.id_libro'), nullable=False)
    descripcion = db.Column(db.String(255), nullable=True)
    libro = db.relationship('Libro', backref=db.backref('imagenes', lazy=True))

class Reseña(db.Model):
    __tablename__ = 'reseña'
    id_reseña = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(100), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    puntuacion = db.Column(db.Integer, nullable=False)
    id_publicacion = db.Column(db.Integer, db.ForeignKey('publicacion.id_publicacion'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    publicacion = db.relationship('Publicacion', backref=db.backref('reseñas', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('reseñas', lazy=True))

class Mensaje(db.Model):
    __tablename__ = 'mensaje'
    id_mensaje = db.Column(db.Integer, primary_key=True, autoincrement=True)
    texto = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, nullable=False)
    leido = db.Column(db.Boolean, nullable=False)
    usuario = db.Column(db.Text,nullable=False)
    id_chat = db.Column(db.Integer, db.ForeignKey('chat.id_chat'), nullable=False)
    chat = db.relationship('Chat', backref=db.backref('mensajes', lazy=True))

class Chat(db.Model):
    __tablename__ = 'chat'
    id_chat = db.Column(db.Integer, primary_key=True) #número unico de la sala 
    fechainicio = db.Column(db.DateTime, nullable=False)
    fechafin = db.Column(db.DateTime, nullable=True)
    activo = db.Column(db.Boolean, nullable=False)
    id_publicacion = db.Column(db.Integer, db.ForeignKey('publicacion.id_publicacion'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    publicador = db.Column(db.Integer, nullable=False)
    publicacion = db.relationship('Publicacion', backref=db.backref('chats', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('chats', lazy=True))

class Etiqueta(db.Model):
    __tablename__ = 'etiqueta'
    id_etiqueta = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nometiqueta = db.Column(db.String(50), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)

class EtiquetaLibro(db.Model):
    __tablename__ = 'etiquetalibro'
    id_etiqueta = db.Column(db.Integer, db.ForeignKey('etiqueta.id_etiqueta'), primary_key=True)
    id_libro = db.Column(db.Integer, db.ForeignKey('libro.id_libro'), primary_key=True)
    etiqueta = db.relationship('Etiqueta', backref=db.backref('etiquetalibros', lazy=True))
    libro = db.relationship('Libro', backref=db.backref('etiquetalibros', lazy=True))

#Foto de perfil
@app.route('/photo_user',methods=['GET'])
def photo_user():
    default_info = {
        'nombre' : "usuario",
        'foto_perfil' : "0.jpg"
    }
    if current_user.is_authenticated:
        usuario = Usuario.query.filter_by(id_usuario = current_user.id_usuario).first()
        user_info = {
            'nombre' : usuario.nombre,
            'foto_perfil' : usuario.foto_perfil
        }
        return jsonify(user_info)
    return jsonify(default_info)

# Render templates
@app.route('/', methods=['GET'])
@app.route('/index',methods=['GET'])
def index():
    return render_template('home.html')

@app.route('/my_info', methods=['GET'])
@login_required
def myInfo():
    #Obtenemos la información del usuario
    user = Usuario.query.filter_by(id_usuario=current_user.id_usuario).first()
    user_info = {
        'id': current_user.id_usuario,
        'user_name': current_user.nombre,
        'apellido': current_user.apellido,
        'email': current_user.email,
        'rol': current_user,
        'foto_perfil' : user.foto_perfil
    }
    return render_template('my_info.html', user=user_info)

@app.route('/new_product', methods=['GET'])
@login_required
def newProduct():
    #Verificar si el usuario tiene el rol de tienda
    if current_user.rol != 'tienda':
         return render_template('error_store.html'), 401
    else:
        return render_template('new_product.html')

@app.route('/manage_posts', methods=['GET'])
@login_required
def managePosts():
    if current_user.rol != 'tienda':
         return render_template('error_store.html'), 401
    else:
        return render_template('manage_posts.html')

@app.route('/hello', methods=['GET'])
def index_get():
    return render_template('base.html')

@app.route('/personal_details', methods=['GET'])
def personal_details():
    return render_template('personal_details.html')


@app.route('/view_transactions', methods=['GET'])
@login_required
def view_transactions():
    # Obtener las transacciones del usuario
    compras = Pedido.query.filter_by(id_usuario=current_user.id_usuario, tipotransaccion='Compra').all()
    publicaciones_comprados = Publicacion.query.filter(Publicacion.id_publicacion.in_([compra.id_libro for compra in compras])).all()
    libros_comprados = [publicacion.libro for publicacion in publicaciones_comprados]
    imagenes_comprados = [ImagenLibro.query.filter_by(id_libro=libro.id_libro).first() for libro in libros_comprados]

    intercambios = Pedido.query.filter_by(id_usuario=current_user.id_usuario, tipotransaccion='Intercambio').all()
    publicaciones_cambiadas = Publicacion.query.filter(Publicacion.id_publicacion.in_([intercambio.id_libro for intercambio in intercambios])).all()
    libros_cambiados = [publicacion.libro for publicacion in publicaciones_cambiadas]
    imagenes_cambiados = [ImagenLibro.query.filter_by(id_libro=libro.id_libro).first() for libro in libros_cambiados]

    compras_con_imagenes = zip(libros_comprados, imagenes_comprados,compras)
    intercambios_con_imagenes = zip(libros_cambiados, imagenes_cambiados,intercambios, intercambios)

    return render_template('view_transactions.html', compras=compras_con_imagenes, intercambios=intercambios_con_imagenes)


@app.route('/view_reviews', methods=['GET'])
def view_reviews():
    return render_template('view_reviews.html')

@app.route('/payment_page', methods=['GET'])
def payment_page():
    return render_template('payment_page.html')




@app.route('/chat', methods=['GET'])
@login_required
def chat():
    chat = Chat.query.filter(or_(
    Chat.id_usuario == current_user.id_usuario,
    Chat.publicador == current_user.id_usuario
    )).all()
    if not chat:
        return render_template('message_page.html',user=current_user,chats=chat)
    return render_template('message_page.html', chats=chat,user=current_user)



@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.form
        email = data.get('email')
        password = data.get('password')

        user = Usuario.query.filter_by(email=email).first()

        if user and check_password_hash(user.contraseña, password):
            login_user(user)
            return redirect(url_for('index'))
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    return render_template('login.html')

@app.route('/search_page', methods=['GET'])
def searchPage():
    return render_template('search_page.html')

# API de  geolocalización
def get_location_name(latitude, longitude):
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}"
    headers = {
        'User-Agent': 'MiAplicacionGeocodificacion/1.0 (tuemail@ejemplo.com)'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if 'address' in data:
            address = data['address']
            return ', '.join([value for key, value in address.items() if value])
        else:
            return "No se encontró ninguna dirección para estas coordenadas."
    elif response.status_code == 403:
        return "Error 403: Acceso prohibido. Verifica que estás cumpliendo con los términos de uso de Nominatim."
    else:
        return f"Error en la solicitud: {response.status_code}"



@app.route('/item_sell_page', methods=['GET'])
def purchasePage():
    id_post = request.args.get('id')
    post = db.session.get(Publicacion, id_post)
    if not post:
        return jsonify({'message': 'Publication not found'}), 404
    else:
        book = post.libro
        title = book.titulo
        description = book.descripcion
        price = book.precio
        author = book.autor
        language = book.idioma
        launch_year = book.fec_lamzamiento[:4] if book.fec_lamzamiento else None
        post_date = post.fecha
        #Cast to datetime
        post_date = datetime.strptime(str(post_date), '%Y-%m-%d')
        #Calcular la antiguedad de la publicación
        days_since_post = (datetime.now() - post_date).days
        if days_since_post < 1:
            post_age = "Hoy"
        elif days_since_post == 1:
            post_age = "Ayer"
        else:
            post_age = f"hace {days_since_post} días"
        publisher = book.editorial
        state = book.estado
        tags = [tag.etiqueta.nometiqueta for tag in book.etiquetalibros]
        #Consultamos la tabla intermedia para obtener las imagenes
        img_mid = ImagenLibro.query.filter_by(id_libro=book.id_libro)
        image_src = [url_for('static', filename=f'static/uploads/{img.descripcion}') for img in img_mid]

        #Consultamos el nombre de la tienda del vendedor
        seller = Tienda.query.filter_by(id_usuario=post.id_usuario)
        if not seller:
            seller = Usuario.query.filter_by(id_usuario=post.id_usuario).first().nombre
        else:
            seller = seller.first().nombrecomercial
        # sell_books = sample_book.sell_books
        # rating = sample_book.rating
        location = get_location_name(post.latitud, post.longitud)

        #Consultamos las publicaciones vendidas por el vendedor (publicaciones con estado activo = False)
        sell_books = Publicacion.query.filter_by(id_usuario=post.id_usuario, activo=False).count()

        if sell_books == 0:
            sell_books = "Ninguno"
            
        #mapeamos state 
        if state == '1':
            state = 'Nuevo'
        elif state == '2':
            state = 'Semi-nuevo'
        else:
            state = 'Usado'

        book_json = {
            'title': title,
            'description': description,
            'price': price,
            'author': author,
            'language': language,
            'launch_year': launch_year,
            'publisher': publisher,
            'state': state,
            'category': post.tipo_publicacion,
            'tags': tags,
            'image_src': image_src,
            'seller': seller,
            'sell_books': sell_books,
            'rating': 'rating',
            'location': location,
            'post_age': post_age
        }
        # print(id_book)
        # sample_book = {
        #     'title': 'The Lord of the Rings: The Fellowship of the Ring',
        #     'description': 'The first installment of the epic fantasy trilogy written by J.R.R. Tolkien.',
        #     'price': '25.00',
        #     'author': 'J.R.R. Tolkien',
        #     'language': 'English',
        #     'launch_year': '1954',
        #     'publisher': 'Allen & Unwin',
        #     'state': 'New',
        #     'category': 'Fantasy',
        #     'tags': ['Fantasy', 'Adventure', 'Epic'],
        #     'image_src': ['https://via.placeholder.com/150','https://via.placeholder.com/200'],
        #     'seller': 'John Doe',
        #     'sell_books': '4',
        #     'rating': '4.5',
        #     'location': 'Mall del Sol, Guayaquil',
        # }
        return render_template('item_sell_page.html', book=book_json)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confir-password')

        if password != confirm_password:
            return jsonify({'message': 'Passwords do not match'}), 400

        hashed_password = generate_password_hash(password, method='sha256')

        new_user = Usuario(
            nombre='Nombre',
            apellido='Apellido',
            email=email,
            contraseña=hashed_password,
            fecha_nac='2000-01-01',
            ciudad='Ciudad',
            cod_postal='00000',
            rol='usuario'
        )

        try:
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('login'))
        except IntegrityError:
            db.session.rollback()
            return jsonify({'message': 'Email already registered'}), 400

    return render_template('register.html')


@app.route('/purchase_page', methods=['GET'])
def purchase_page():
    return render_template('purchase_page.html')

@app.route('/sales_request_1', methods=['GET'])
def sales_request_1():
    return render_template('sales_request_1.html')

@app.route('/sales_request_2', methods=['GET'])
def sales_request_2():
    return render_template('sales_request_2.html')

@app.route('/sales_request_3', methods=['GET'])
def sales_request_3():
    return render_template('sales_request_3.html')


# API


@app.route('/predict', methods=['POST'])
#@login_required
def predict():
    text = request.get_json().get('message')
    response = get_response(text)
    message = {'answer': response}
    print(message)
    return jsonify(message)

@app.route('/addBook', methods=['POST'])
@login_required
def addBook():
    data = request.form
    files = request.files
    usuario_id = current_user.id_usuario  # Obtener el ID del usuario actual
    tags_selected = json.loads(data.get('tags_selected', '[]'))  # Lista de etiquetas seleccionadas

    # Guardar el libro
    new_book = Libro(
        titulo=data.get('title'),
        descripcion=data.get('description'),
        precio=data.get('price'),
        autor=data.get('author'),
        idioma=data.get('language'),
        fec_lamzamiento=datetime.strptime(data.get('launch_year'), "%Y"),
        editorial=data.get('publisher'),
        estado=data.get('state'),
        categoria=data.get('category')
    )

    db.session.add(new_book)
    db.session.commit()

    # Guardar la publicación
    new_publication = Publicacion(
        tipo_publicacion=data.get('category'),  # Ajustar según el tipo de publicación
        latitud=data.get('location_lat'),
        longitud=data.get('location_lng'),
        fecha=datetime.utcnow(),
        activo=True,
        id_libro=new_book.id_libro,
        id_usuario=usuario_id
    )

    db.session.add(new_publication)
    db.session.commit()

    # Guardar las imágenes
    for key in files:
        file = files[key]
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            # Cambiar el tamaño de la imagen a 150x150 píxeles
            image = Image.open(file)
            image = image.resize((150, 150))
            image.save(file_path)

            new_image = ImagenLibro(
                imagen=file.read(),
                id_libro=new_book.id_libro,
                descripcion=filename
            )
            db.session.add(new_image)

    # Guardar las etiquetas
    for tag_name in tags_selected:
        # Verificar si la etiqueta ya existe
        etiqueta = Etiqueta.query.filter_by(nometiqueta=tag_name).first()
        if not etiqueta:
            etiqueta = Etiqueta(nometiqueta=tag_name)
            db.session.add(etiqueta)
            db.session.commit()

        etiqueta_libro = EtiquetaLibro(
            id_libro=new_book.id_libro,
            id_etiqueta=etiqueta.id_etiqueta
        )
        db.session.add(etiqueta_libro)

    db.session.commit()

    return jsonify({"message": "Book added successfully!"}), 201


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}
    
@app.route('/posts', methods=['GET'])
@login_required
def getBooks():
    publicaciones = Publicacion.query.filter_by(id_usuario=current_user.id_usuario).all()
    books_list = []
    for publicacion in publicaciones:
        book = publicacion.libro
        first_image = book.imagenes[0].descripcion if book.imagenes else None
        image_url = url_for('static', filename=f'static/uploads/{first_image}') if first_image else "https://via.placeholder.com/150"
        
        books_list.append({
            'id': book.id_libro,
            'title': book.titulo,
            'description': book.descripcion,
            'price': str(book.precio),
            'author': book.autor,
            'language': book.idioma,
            'launch_year': book.fec_lamzamiento,
            'publisher': book.editorial,
            'state': book.estado,
            'tags': [tag.etiqueta.nometiqueta for tag in book.etiquetalibros],
            'image_src': image_url,  # Incluir la URL de la imagen en la respuesta
            'publication_id': publicacion.id_publicacion,
            'lat': publicacion.latitud,
            'lng': publicacion.longitud,
            'fecha': publicacion.fecha,
            'activo': publicacion.activo
        })
    return jsonify(books_list)




@app.route('/posts', methods=['DELETE'])
#@login_required
def deleteBook():
    publicacion_id = request.args.get('publication_id')
    publicacion = db.session.get(Publicacion, publicacion_id)
    if publicacion:
        book = publicacion.libro
        db.session.delete(publicacion)
        db.session.commit()
        
        #Eliminar el libro si no tiene otras publicaciones
        if not book.publicaciones:
            # Eliminar todas las referencias en etiqueta_libro
            EtiquetaLibro.query.filter_by(id_libro=book.id_libro).delete()
            # Eliminar todas las imágenes
            ImagenLibro.query.filter_by(id_libro=book.id_libro).delete()
            db.session.commit()
            db.session.delete(book)
            db.session.commit()


        return jsonify({"message": "Publication and associated book deleted successfully!"}), 200
    return jsonify({"message": "Publication not found!"}), 404


# Get book by post id
@app.route('/post', methods=['GET'])
#@login_required
def getBook():
    publicacion_id = request.args.get('publication_id')
    publicacion = db.session.get(Publicacion, publicacion_id)
    if publicacion:
        book = publicacion.libro
        first_image = book.imagenes[0].descripcion if book.imagenes else None
        image_url = url_for('static', filename=f'static/uploads/{first_image}') if first_image else "https://via.placeholder.com/150"
        
        book_info = {
            'id': book.id_libro,
            'title': book.titulo,
            'description': book.descripcion,
            'price': str(book.precio),
            'author': book.autor,
            'language': book.idioma,
            'launch_year': book.fec_lamzamiento,
            'publisher': book.editorial,
            'state': book.estado,
            'tags': [tag.etiqueta.nometiqueta for tag in book.etiquetalibros],
            'image_src': image_url,  # Incluir la URL de la imagen en la respuesta
            'publication_id': publicacion.id_publicacion,
            'lat': publicacion.latitud,
            'lng': publicacion.longitud,
            'fecha': publicacion.fecha,
            'activo': publicacion.activo
        }
        return jsonify(book_info)
    return jsonify({"message": "Publication not found!"}), 404


@app.route('/edit_post', methods=['POST'])
#@login_required
def editPost():
    data = request.json
    publicacion_id = data.get('publication_id')
    publicacion = db.session.get(Publicacion, publicacion_id)
    if publicacion:
        book = publicacion.libro
        book.titulo = data.get('title')
        book.descripcion = data.get('description')
        book.precio = data.get('price')
        book.autor = data.get('author')
        book.idioma = data.get('language')
        book.fec_lamzamiento = data.get('year')
        book.editorial = data.get('publisher')
        db.session.commit()
        return jsonify({"message": "Book updated successfully!"}), 200
    return jsonify({"message": "Publication not found!"}), 404

@app.route('/sign_up', methods=['POST'])
def sign_up():
    num_photo = random.randint(1, 5)
    data = request.form
    nombre = data.get('name')
    apellido = data.get('lastname')
    email = data.get('email')
    fec_nac = data.get('fec_nac')
    password = data.get('password')
    confirm_password = data.get('confir-password')
    #url_photo = url_for('static',filename=f'static/perfil_photos/{str(num_photo)}')
    photo = str(num_photo)+".jpg"
    if password != confirm_password:
        return jsonify({'message': 'Passwords do not match'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = Usuario(
        nombre=nombre,
        apellido=apellido,
        email=email,
        contraseña=hashed_password,
        fecha_nac=fec_nac,
        ciudad='Ciudad',
        cod_postal='00000',
        rol='usuario',
        foto_perfil = photo
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Email already registered'}), 400

@app.route('/sign_in', methods=['POST'])
def sign_in():
    data = request.get_json()
    email_user = data.get('email_user')
    password_user = data.get('password_user')

    user = Usuario.query.filter_by(email=email_user).first()
    if user and check_password_hash(user.contraseña, password_user):
        login_user(user)
        return jsonify({'message': 'User authenticated successfully'})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/sign_out',methods=['GET'])
def sign_out():
    logout_user()
    return redirect('/')
    # return jsonify({'message': 'logout'})

#DATOS PEROSONALES
@app.route('/personal_details',methods=['GET'])
@login_required
def personal_detail():
    user = Usuario.query.filter_by(id_usuario=current_user.id_usuario).first()
    
    usuario = {
        "id_usuario" : user.id_usuario,
        "nombre" : user.nombre,
        "apellido": user.apellido,
        "fecha_nac": user.fecha_nac,
        "cod_postal": user.cod_postal,
        "ciudad": user.ciudad
    }
    return render_template("personal_details.html",usuario=usuario)

@app.route('/edit_user_info', methods=['POST'])
@login_required
def edit_user_info():
    data = request.json
    user = Usuario.query.filter_by(id_usuario=current_user.id_usuario).first()
    print(data)
    user.nombre = data.get('nombre')
    user.apellido = data.get('appellido')
    user.fecha_nac = data.get('fecha_nac')
    user.cod_postal = data.get('postal')
    user.ciudad = data.get('ciudad')

    db.session.commit()
    
    return jsonify({'message': 'User updated successfully'})

@app.route('/register_store', methods=['POST'])
@login_required
def register_store():
    try:
        data = request.json
        nombre_comercial = data.get('nombre_comercial')
        ciudad = data.get('ciudad')
        cod_postal = data.get('cod_postal')
        
        nueva_tienda = Tienda(
            nombrecomercial=nombre_comercial,
            id_usuario=current_user.id_usuario,
            direccion=ciudad,
            # cod_postal=cod_postal
        )

        db.session.add(nueva_tienda)
        db.session.commit()
        return jsonify({'message': 'Tienda registrada exitosamente'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Error al registrar la tienda'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
    

# Set store role
@app.route('/set_store_role', methods=['GET'])
@login_required
def set_store_role():
    user = Usuario.query.filter_by(id_usuario=current_user.id_usuario).first()
    user.rol = 'tienda'
    db.session.commit()
    return jsonify({'message': 'Store role set successfully'}), 200


# --------------------------------------------------------------
# Change password
@app.route('/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        data = request.get_json()
        prev_pass = data.get('prevPass')
        new_pass = data.get('newPass')
        print(data)
        if not prev_pass or not new_pass:
            return jsonify({'message': 'Please provide all required fields'}), 400

        user = Usuario.query.filter_by(id_usuario=current_user.id_usuario).first()
        if not check_password_hash(user.contraseña, prev_pass):
            return jsonify({'message': 'Incorrect previous password'}), 400

        user.contraseña = generate_password_hash(new_pass, method='pbkdf2:sha256')
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200

    return render_template('change_password.html')

# --------------------------------------------------------------
@app.route('/search/<title>',methods=['GET'])
def search_title(title):
    #Busqueda principal por titulo
    if not title:
        return jsonify({'alert':'title is required'})
    title = title.upper()
    #Definición de la consulta
    query_resultados = db.session.query(
        Publicacion.id_publicacion, Libro.id_libro,
        Libro.titulo, Libro.autor, Libro.precio, Libro.estado,
    ).join(
        Publicacion, Publicacion.id_libro == Libro.id_libro
    ).where(
        Publicacion.activo == True,
        db.func.upper(Libro.titulo).like(f'%{title}%')
    ).all()
    lista_resultados = []
    for qr in query_resultados:
        img = ImagenLibro.query.filter_by(id_libro=qr.id_libro).first()
        img_desc = img.descripcion
        img_url = url_for('static',filename=f'static/uploads/{img_desc}') if img_desc else "https://via.placeholder.com/150"
        lista_resultados.append({
            "id_publication": qr.id_publicacion,
            'image': {
                'src': img_url,
                'alt': img_desc if img_desc else "Placeholder image"
            },
            'info': {
                'title': {
                    'main': qr.titulo,
                    'author': qr.autor
                },
                'status': qr.estado
            },
            'price': f"{qr.precio:,.2f} US$"
        })
    return jsonify(lista_resultados)

@app.route('/galery/<tipo>', methods=['GET'])
def books_galery(tipo=None):#usar en home y en ver-mas
    #/galery/tipo?limit
    if not tipo:
        return jsonify({"message": "type is required"})
    
    limit_results = request.args.get('limit', type=int)
    
    query_sales = db.session.query(
        Publicacion.id_publicacion, Libro.id_libro,
        Libro.titulo, Libro.autor, Libro.precio, Libro.estado,
    ).join(
        Publicacion, Publicacion.id_libro == Libro.id_libro
    ).filter(
        Publicacion.activo == True,
        db.func.upper(Publicacion.tipo_publicacion) == tipo.upper()
    )
    
    if limit_results:
        query_sales = query_sales.limit(limit_results)
    
    query_sales = query_sales.all()
    
    lista_resultados = []
    for libro in query_sales:
        img = ImagenLibro.query.filter_by(id_libro=libro.id_libro).first()
        img_desc = img.descripcion if img else None
        img_url = url_for('static', filename=f'uploads/{img_desc}') if img_desc else "https://via.placeholder.com/150"

        #Replace /Frontend with ./
        img_url = img_url.replace('/Frontend','../Frontend/static')
        lista_resultados.append({
            "id_publication": libro.id_publicacion,
            "image": {
                "src": img_url,
                "alt": img.descripcion if img else "Placeholder"
            },
            "info": {
                "title": {
                    "main": libro.titulo,
                    "author": libro.autor
                },
                "status": libro.estado
            },
            "price": f"{libro.precio:,.2f} US$",
        })
    
    return jsonify(lista_resultados)

@app.route('/search_label/<label>',methods=['GET'])
def search_for_label(label=None):
    if not label:
        return jsonify({"message":"label is required"})
    query_books = db.session.query(
        Publicacion.id_publicacion, Libro.id_libro,
        Libro.titulo, Libro.autor, Libro.precio, Libro.estado
    ).join(
        Publicacion, Publicacion.id_libro == Libro.id_libro
    ).join(
        EtiquetaLibro, Libro.id_libro == EtiquetaLibro.id_libro
    ).join(
        Etiqueta, Etiqueta.id_etiqueta == EtiquetaLibro.id_etiqueta
    ).filter(
        Etiqueta.nometiqueta == label.lower()
    ).all()

    lista_resultados = []
    for libro in query_books:
        img = ImagenLibro.query.filter_by(id_libro=libro.id_libro).first()
        img_desc = img.descripcion if img else None
        img_url = url_for('static', filename=f'uploads/{img_desc}') if img_desc else "https://via.placeholder.com/150"

        lista_resultados.append({
            "id_publication": libro.id_publicacion,
            "image": {
                "src": img_url,
                "alt": img.descripcion if img else "Placeholder"
            },
            "info": {
                "title": {
                    "main": libro.titulo,
                    "author": libro.autor
                },
                "status": libro.estado
            },
            "price": f"{libro.precio:,.2f} US$",
        })
    
    return jsonify(lista_resultados)

#Register purchase
@app.route('/register_purchase', methods=['POST'])
@login_required
def register_purchase():
    try:
        data = request.json
        items = data.get('items', [])

        if not items:
            return jsonify({'success': False, 'message': 'No items to purchase'}), 400

        for item in items:
            # Register the purchase in Pedido table
            new_pedido = Pedido(
                fecha=datetime.utcnow(),
                cantidad=1,  # Assuming each item is one unit
                tipotransaccion='Compra',
                id_libro=item['id'],  # This should be id_publicacion now
                id_usuario=current_user.id_usuario
            )
            db.session.add(new_pedido)

            # Update the status of the publication
            publication = Publicacion.query.filter_by(id_publicacion=item['id']).first()
            if publication:
                publication.activo = False

        db.session.commit()
        return jsonify({'success': True, 'message': 'Purchase registered successfully'})

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Database Integrity Error: ' + str(e)}), 500

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error registering purchase: {e}")
        return jsonify({'success': False, 'message': 'An error occurred: ' + str(e)}), 500

#Chat
#data = ['room','receiver','message']
#room -> id_chat
@app.route('/create_chat/<id_publicacion>', methods=['GET'])
@login_required
def create_chat(id_publicacion): #Al dar click para enviar mensaje
    rooms = Chat.query.all()
    id_chats = []
    for room in rooms:
        #Primero comprobar que no exista un chat anterior
        if str(room.id_publicacion) == str(id_publicacion):
            return redirect(url_for('chat'))
        id_chats.append(room.id_chat)
    print(id_chats)
    publicacion = Publicacion.query.filter_by(id_publicacion=id_publicacion).first()
    chat_code = generate_unique_code(4,rooms=id_chats)
    new_chat = Chat(id_chat=chat_code, 
                    fechainicio=datetime.now(),
                    activo=True,id_publicacion=id_publicacion,
                    id_usuario=current_user.id_usuario,
                    publicador = publicacion.usuario.id_usuario)
    db.session.add(new_chat)
    db.session.commit()
    return redirect(url_for('chat'))



@app.route('/join_chat', methods=['POST'])
@login_required
def join_chat():
    chat_code = request.form['chat_code'] 
    chat = Chat.query.filter_by(id_chat=chat_code).first()
    if chat and chat.activo:
        chat.id_usuario = current_user.id_usuario
        db.session.commit()
    return redirect(url_for('index'))

@app.route('/save_message', methods=['POST'])
@login_required
def send_message():
    messages = request.get_json()
    text = messages['texto']
    chat_code = messages['id_chat']
    chat = Chat.query.filter_by(id_chat=chat_code).first()
    if chat:
        new_message = Mensaje(texto=text, fecha=datetime.now(), leido=False, id_chat=chat.id_chat)
        db.session.add(new_message)
        db.session.commit()
    return jsonify({"message": "Mensaje guardado"})

@app.route('/chat_message/<chat_code>') #Mensajes segun el chat 
@login_required
def chat_messages(chat_code):
    messages = Mensaje.query.filter_by(id_chat=chat_code).all()
    chat_messages = [{
        "texto": m.texto,
        "fecha": m.fecha,
        "leido": m.leido,
        "id_chat": m.id_chat,
        "usuario" : m.usuario
    } for m in messages]
    return jsonify(chat_messages)

@socketIO.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    emit('status', {'msg': f'{current_user.nombre} has joined the room.'}, room=room)

@socketIO.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f'{current_user.nombre} has left the room.'}, room=room)

@socketIO.on('connect')
def handle_connect():
    send({"message": "Client connected"})

@socketIO.on('disconnect')
def handle_disconnect():
    send({"message": "Client disconnected"})


@socketIO.on('message')
def handle_message(data):
    try:
        print(f"Received data: {data}")
        room = data['room']
        message_text = data['text']
        user_email = data['user']
        print(room)
        # Guardar el mensaje en la base de datos
        new_message = Mensaje(texto=message_text, fecha=datetime.now(), leido=False, id_chat=room,usuario=current_user.email)
        db.session.add(new_message)
        db.session.commit()
        
        # Enviar el mensaje solo a los miembros de la sala
        emit('message', {'text': message_text, 'user': user_email}, room=room)
    except Exception as e:
        print(f"Error handling message: {e}")



#Mannage Session


@login_mannager_app.user_loader
def load_user(user_id):
    sql_query = text("""
        SELECT id_usuario, nombre, apellido, email, rol
        FROM usuario 
        WHERE id_usuario = :user_id
    """)
    
    # Ejecutar la consulta y obtener la primera fila
    result = db.session.execute(sql_query, {'user_id': user_id}).first()
    
    if result:
        # Crear el objeto Usuario
        user = Usuario(
            id_usuario=result.id_usuario,
            nombre=result.nombre,
            apellido=result.apellido,
            email=result.email,
            rol=result.rol
        )
        return user
    return None

@app.route('/info_user', methods=['GET'])
@login_required
def get_current_user():
    user_info = {
        'id': current_user.id_usuario,
        'nombre': current_user.nombre,
        'apellido': current_user.apellido,
        'email': current_user.email,
        'rol': current_user.rol
    }
    return jsonify(user_info)


if __name__ == '__main__':
    #csrf.init_app(app)
    #app.run(debug=True,host='0.0.0.0', port=5000)
    socketIO.run(app,debug=True,host='0.0.0.0', port=5000)