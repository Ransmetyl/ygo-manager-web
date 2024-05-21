import firebase_admin
from firebase_admin import credentials, storage
import os
from tqdm import tqdm

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'yu-gi-oh--card-manager.appspot.com'  
})

bucket = storage.bucket()
folder_path = "./char"
firebase_folder = "char"
for filename in tqdm(os.listdir(folder_path)):
    if filename.endswith(".jpg") or filename.endswith(".png"):  # Assicurati che sia un'immagine
        file_path = os.path.join(folder_path, filename)
        blob = bucket.blob(firebase_folder + "/" + filename)
        blob.upload_from_filename(file_path)
   
print("Caricamento completato.")
