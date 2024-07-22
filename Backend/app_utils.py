# Utilidades y validaciones de lado del sevidor
from werkzeug.security import check_password_hash, generate_password_hash
import random


def check_password(hashed_pass,password):
    return check_password_hash(hashed_pass,password)

def hash_password(password):
    return generate_password_hash(password)

def generate_unique_code(length, rooms):
    while True:
        code = ""
        for _ in range(length):
            code += str(random.randint(0, 9))
        if code not in rooms:
            break
    return code
        
