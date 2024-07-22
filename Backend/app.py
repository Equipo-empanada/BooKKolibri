from flask import Flask, request, jsonify, render_template, jsonify, url_for, redirect
from flask_login import LoginManager, login_user, logout_user,login_required,current_user,UserMixin
from chat import get_response
from flask_sqlalchemy import SQLAlchemy
#from flask_wtf.csrf import CSRFProtect
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
import json
import os
import random

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
    foto_perfil = db.Column(db.LargeBinary, nullable=True)
    def get_id(self):
        return str(self.id_usuario)

class Tienda(db.Model):
    __tablename__ = 'tienda'
    id_tienda = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_comercial = db.Column(db.String(100), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    usuario = db.relationship('Usuario', backref=db.backref('tiendas', lazy=True))


class Pedido(db.Model):
    __tablename__ = 'pedido'
    id_pedido = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha = db.Column(db.Date, nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    tipotransaccion = db.Column(db.String(50), nullable=False)
    id_libro = db.Column(db.Integer, db.ForeignKey('libro.id_libro'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    libro = db.relationship('Libro', backref=db.backref('pedidos', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('pedidos', lazy=True))

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


# Render templates
@app.route('/', methods=['GET'])
@app.route('/index',methods=['GET'])
def index():
    return render_template('home.html')

@app.route('/my_info', methods=['GET'])
#@login_required
def myInfo():
    return render_template('my_info.html')

@app.route('/new_product', methods=['GET'])
#@login_required
def newProduct():
    return render_template('new_product.html')

@app.route('/manage_posts', methods=['GET'])
#@login_required
def managePosts():
    return render_template('manage_posts.html')

@app.route('/hello', methods=['GET'])
def index_get():
    return render_template('base.html')

@app.route('/chat', methods=['GET'])
@login_required
def chat():
    chat = Chat.query.filter_by(id_usuario=current_user.id_usuario).all()
    if not chat:
        print("Chta not found")
        return 'Chat not found'
    return render_template('message_page.html', chats=chat)

@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@app.route('/item_sell_page', methods=['GET'])
def item_sell_page():
    id_book = request.args.get('id')
    print(id_book)
    sample_book = {
        'title': 'The Lord of the Rings: The Fellowship of the Ring',
        'description': 'The first installment of the epic fantasy trilogy written by J.R.R. Tolkien.',
        'price': '25.00',
        'author': 'J.R.R. Tolkien',
        'language': 'English',
        'launch_year': '1954',
        'publisher': 'Allen & Unwin',
        'state': 'New',
        'category': 'Fantasy',
        'tags': ['Fantasy', 'Adventure', 'Epic'],
        'image_src': ['https://via.placeholder.com/150','https://via.placeholder.com/200'],
        'seller': 'John Doe',
        'sell_books': '4',
        'rating': '4.5',
        'location': 'Mall del Sol, Guayaquil',
    }
    return render_template('item_sell_page.html', book=sample_book)

@app.route('/register', methods=['GET'])
def register():
    return render_template('register.html')


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
#@login_required
def addBook():
    data = request.form
    files = request.files
    usuario_id = data.get('usuario_id')  # Suponiendo que se pasa el ID del usuario que hace la publicación
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
        tipo_publicacion='Libro',  # Ajustar según el tipo de publicación
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
#@login_required
def getBooks():
    publicaciones = Publicacion.query.all()
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

@app.route('/sing_up',methods=['POST'])
def sign_up(): #Crea usuario
    data = request.get_json()
    #Agregar validaciones
    new_user=Usuario(
        nombre = data.get("name"),
        apellido = data.get("last_name"),
        email = data.get("email"),
        contraseña = hash_password(data.get("password")),
        fecha_nac = data.get("birthdate"),
        ciudad = data.get("city"),
        cod_postal = data.get("postalcode"),
        rol = data.get("role")
    ) #Rol debe tener un valor por defecto
    if new_user.email:
        if new_user.contraseña:
            try:
                db.session.add(new_user)
                db.session.commit()
                return jsonify({'message': 'User added successfully'})
            except IntegrityError:
                db.session.rollback()
                return jsonify({'message': 'This email is already registered'})
        return jsonify({'message':'No password'})
    return jsonify({'message':'No email'})

@app.route('/sign_in',methods = ['POST'])
def sign_in():
    data = request.get_json()  # Obtener datos del cuerpo de la solicitud
    email_user = data.get('email_user')
    password_user = data.get('password_user')
    #Consulta y obtine si es que existe el usuario ingresado
    #persona = db.session.execute(db.select(Persona)).one()
    user = Usuario.query.filter_by(email=email_user).first()
    if user:
        #Usuario identificado - Validación de password
        if check_password(user.contraseña,password_user):
            login_user(user) #almecena como usuario logeado 
            return jsonify({'message': 'User authenticated successfully'})
        return jsonify({'message': 'Invalid password'}), 401
    return jsonify({'message':'Unregistered user'}), 404

@app.route('/sign_out',methods=['GET'])
def sign_out():
    logout_user()
    return jsonify({'message': 'logout'})

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

#Chat
#data = ['room','receiver','message']
#room -> id_chat
@app.route('/create_chat/<id_publicacion>', methods=['POST'])
@login_required
def create_chat(id_publicacion): #Al dar click para enviar mensaje
    rooms = Chat.query.all()
    id_chats = []
    for room in rooms:
        #Primero comprobar que no exista un chat anterior
        if str(room.id_publicacion) == str(id_publicacion):
            return jsonify({'message: ':"chat_access"})
        id_chats.append(room.id_chat)
    print(id_chats)
    chat_code = generate_unique_code(4,rooms=id_chats)
    new_chat = Chat(id_chat=chat_code, fechainicio=datetime.now(), activo=True,id_publicacion=id_publicacion, id_usuario=current_user.id_usuario)
    db.session.add(new_chat)
    db.session.commit()
    return jsonify({"message: ": "new_chat_created"})



@app.route('/join_chat', methods=['POST'])
@login_required
def join_chat():
    chat_code = request.form['chat_code'] 
    chat = Chat.query.filter_by(id_chat=chat_code).first()
    if chat and chat.activo:
        chat.id_usuario = current_user.id_usuario
        db.session.commit()
    return redirect(url_for('index'))

@app.route('/send_message', methods=['POST'])
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
        socketIO.emit('message', {'text': text, 'user': current_user.email, 'reciver': chat.id_publicacion}, room=chat_code)
    return jsonify({"message": "Mensaje enviado"})

@app.route('/chat_message/<chat_code>') #Mensajes segun el chat 
@login_required
def chat_messages(chat_code):
    messages = Mensaje.query.filter_by(id_chat=chat_code).all()
    chat_messages = [{
        "texto": m.texto,
        "fecha": m.fecha,
        "leido": m.leido,
        "id_chat": m.id_chat
    } for m in messages]
    return jsonify(chat_messages)
    #return render_template('message_page.html', chats=chat, messages=messages)


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
    user_send = Usuario.query.filter_by(email=data['user']).first()
    if user_send:
        room = data['room']
        send(data['text'], room=room,broadcast=True)

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
    app.run(debug=True,host='0.0.0.0', port=5000)
    #socketIO.run(app,debug=True,host='0.0.0.0', port=5000)