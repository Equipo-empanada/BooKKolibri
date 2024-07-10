# Utilidades y validaciones de lado del sevidor
from werkzeug.security import check_password_hash, generate_password_hash

def check_password(hashed_pass,password):
    return check_password_hash(hashed_pass,password)

def hash_password(password):
    return generate_password_hash(password)


