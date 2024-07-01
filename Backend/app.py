from flask import Flask, request, jsonify, render_template, jsonify
from chat import get_response
from flask_sqlalchemy import SQLAlchemy
import json
import os
import models
from datetime import datetime

#Templates folder
template_dir = os.path.abspath('../Frontend')
static_dir = os.path.abspath('../Frontend')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres.asjubxyoqpiyuxewoxwg:empanada.123@aws-0-us-west-1.pooler.supabase.com:6543/postgres'
db = SQLAlchemy(app)

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
    tipo_transaccion = db.Column(db.String(50), nullable=False)
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
    __tablename__ = 'imagen_libro'
    id_imagen = db.Column(db.Integer, primary_key=True, autoincrement=True)
    imagen = db.Column(db.LargeBinary, nullable=False)
    id_libro = db.Column(db.Integer, db.ForeignKey('libro.id_libro'), nullable=False)
    descripcion = db.Column(db.String(255), nullable=True)
    libro = db.relationship('Libro', backref=db.backref('imagenes', lazy=True))

class Resena(db.Model):
    __tablename__ = 'resena'
    id_resena = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(100), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    puntuacion = db.Column(db.Integer, nullable=False)
    id_publicacion = db.Column(db.Integer, db.ForeignKey('publicacion.id_publicacion'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    publicacion = db.relationship('Publicacion', backref=db.backref('resenas', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('resenas', lazy=True))

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
    fecha_inicio = db.Column(db.DateTime, nullable=False)
    fecha_fin = db.Column(db.DateTime, nullable=True)
    activo = db.Column(db.Boolean, nullable=False)
    id_publicacion = db.Column(db.Integer, db.ForeignKey('publicacion.id_publicacion'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    publicacion = db.relationship('Publicacion', backref=db.backref('chats', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('chats', lazy=True))

class Etiqueta(db.Model):
    __tablename__ = 'etiqueta'
    id_etiqueta = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom_etiqueta = db.Column(db.String(50), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)

class EtiquetaLibro(db.Model):
    __tablename__ = 'etiqueta_libro'
    id_etiqueta = db.Column(db.Integer, db.ForeignKey('etiqueta.id_etiqueta'), primary_key=True)
    id_libro = db.Column(db.Integer, db.ForeignKey('libro.id_libro'), primary_key=True)
    etiqueta = db.relationship('Etiqueta', backref=db.backref('etiqueta_libros', lazy=True))
    libro = db.relationship('Libro', backref=db.backref('etiqueta_libros', lazy=True))


# Render templates
@app.route('/new_product', methods=['GET'])
def newProduct():
    return render_template('new_product.html')

@app.route('/manage_posts', methods=['GET'])
def managePosts():
    return render_template('manage_posts.html')



# API
@app.route('/')
def index_get():
    return render_template('base.html')

@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get('message')
    response = get_response(text)
    message = {'answer': response}
    print(message)
    return jsonify(message)

@app.route('/addBook', methods=['POST', 'OPTIONS'])
def addBook():
    data = request.get_json()
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
    
    return jsonify({"message": "Book added successfully!"}), 201
    
@app.route('/posts', methods=['GET'])
def getBooks():
    books = Libro.query.all()
    books_list = []
    for book in books:
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
            'category': book.categoria
        })
    return jsonify(books_list)

if __name__ == '__main__':
    app.run(debug=True)
