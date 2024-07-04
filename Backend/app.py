from flask import Flask, request, jsonify, render_template, jsonify, url_for
from chat import get_response
from flask_sqlalchemy import SQLAlchemy
import json
import os

from datetime import datetime
from werkzeug.utils import secure_filename
from PIL import Image


#Templates folder
template_dir = os.path.abspath('../Frontend')
static_dir = os.path.abspath('../Frontend')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres.asjubxyoqpiyuxewoxwg:empanada.123@aws-0-us-west-1.pooler.supabase.com:6543/postgres'
app.config['UPLOAD_FOLDER'] = '../Frontend/static/uploads'
db = SQLAlchemy(app)

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

class Usuario(db.Model):
    __tablename__ = 'usuario'
    id_usuario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    correo_electronico = db.Column(db.String(50), nullable=False)
    contraseña = db.Column(db.String(255), nullable=False)
    fecha_nac = db.Column(db.DateTime, nullable=False)
    ciudad = db.Column(db.String(20), nullable=False)
    cod_postal = db.Column(db.String(20), nullable=False)
    rol = db.Column(db.String(10), nullable=False)
    foto_perfil = db.Column(db.LargeBinary, nullable=True)

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
    id_chat = db.Column(db.Integer, db.ForeignKey('chat.id_chat'), nullable=False)
    chat = db.relationship('Chat', backref=db.backref('mensajes', lazy=True))

class Chat(db.Model):
    __tablename__ = 'chat'
    id_chat = db.Column(db.Integer, primary_key=True, autoincrement=True)
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
def index():
    return render_template('home.html')

@app.route('/my_info', methods=['GET'])
def myInfo():
    return render_template('my_info.html')

@app.route('/new_product', methods=['GET'])
def newProduct():
    return render_template('new_product.html')

@app.route('/manage_posts', methods=['GET'])
def managePosts():
    return render_template('manage_posts.html')

@app.route('/hello', methods=['GET'])
def index_get():
    return render_template('base.html')

@app.route('/chat', methods=['GET'])
def chat():
    return render_template('chat.html')

@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')



# API


@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get('message')
    response = get_response(text)
    message = {'answer': response}
    print(message)
    return jsonify(message)

@app.route('/addBook', methods=['POST'])
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




if __name__ == '__main__':
    app.run(debug=True)
