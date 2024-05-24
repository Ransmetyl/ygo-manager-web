import firebase_admin
import json
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor
from firebase_admin import db, credentials
from firebase_admin import db

# Inizializza Firebase con le tue credenziali
cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://yu-gi-oh--card-manager-default-rtdb.europe-west1.firebasedatabase.app/'
})

ref = db.reference('/')

def insertCards():
    with open("./cards.json", "r") as file:
        data = json.load(file)

    def filter_null(obj):
        return {k: v for k, v in obj.items() if v is not None}

    ref = db.reference('cards')  # Riferimento alla tabella "cards"

    def process_card(card_data):
        card_ids = card_data.pop('id')  # Prendi gli ID della carta
        for card_id in card_ids:  # Itera su ogni ID della carta
            filtered_card_data = filter_null(card_data.copy())  # Fai una copia dei dati della carta
            if filtered_card_data:  # Controlla se ci sono dati dopo aver rimosso i campi null
                card_info = filtered_card_data  # Usa i dati filtrati come informazioni della carta
                ref.child(card_id).set(card_info)  # Utilizza Firebase per creare un nuovo oggetto con l'ID specificato

        with tqdm(total=len(data)) as pbar:  # Inizializza la barra di avanzamento
            with ThreadPoolExecutor() as executor:
                futures = []
                for card_data in data:  # Itera su ogni carta nella lista
                    future = executor.submit(process_card, card_data)
                    futures.append(future)
                
                for future in futures:
                    future.result()
                    pbar.update(1)  # Aggiorna la barra di avanzamento

        print("Dati caricati su Realtime Database.")

def cancellaTutto():
    # wait for user input to confirm  
    print("Sei sicuro di voler cancellare tutti i dati nel database? (y/n)")
    scelta = input()
    if scelta != "y":
        print("Operazione annullata.")
        return
    
    ref.child("cards").delete()
    print("Tutti i dati nel database sono stati cancellati.")

def load_deck(deck_name):
    path = f"./decks/{deck_name}.ydk"
    with open(path, "r") as file:
        card_ids = [line.strip() for line in file.readlines() if line.strip().isnumeric()]

    card_ids = sorted(card_ids, key=lambda x: int(x))
    card_assoc = {card_id: card_ids.count(card_id) for card_id in card_ids}

    with tqdm(total=len(card_ids)) as pbar:
        for card_id in card_ids:
            card_data = ref.child("cards").child(card_id).get()
            if card_data:
                card_info = card_data.copy()
                card_info["quantity"] = card_assoc[card_id]
                ref.child("decks").child(deck_name).child(card_id).set(card_info)
            else:
                print(f"Card {card_id} not found in the database")
            pbar.update(1)

def upload_decks():
    # take each .ydk file in the decks folder and upload it to the database
    import os
    for file in tqdm(os.listdir("./decks")):
        if file.endswith(".ydk"):
            deck_name = file.split(".")[0]
            load_deck(deck_name)
            print(f"Deck {deck_name} uploaded to database\n")
    


def get_deck(deck_name):
    deck_data = ref.child("decks").child(deck_name).get()
    card_ids = []
    for card_id, quantity in deck_data.items():
        card_ids.extend([card_id] * quantity)
    return card_ids

def set_owned(card_id,quantity):
    if quantity == 0:
        rem_owned(card_id)
    ref.child("owned").child(card_id).set(quantity)

def rem_owned(card_id):
    ref.child("owned").child(card_id).delete()

def add_card(deck_name, card_id ,quantity):
    # go to cards table, copy the card with that id and paste it into the decks/deck_name i gave you with the quantity i gave you
    card_data = ref.child("cards").child(card_id).get()
    if card_data:
        card_info = card_data.copy()
        card_info["quantity"] = quantity
        ref.child("decks").child(deck_name).child(card_id).set(card_info)
        print(f"Card {card_id} added to deck {deck_name} with quantity {card_info['quantity']}")
    else:
        print(f"Card {card_id} not found in the database")

def add_all_owned():
    #read collection.ydk and add all cards to owned ignoring non-numeric lines, if a card is already in owned, update the quantity
    with open("./collection.ydk", "r") as file:
        card_ids = [line.strip() for line in file.readlines() if line.strip().isnumeric()]

    card_ids = sorted(card_ids, key=lambda x: int(x))
    card_assoc = {card_id: card_ids.count(card_id) for card_id in card_ids}

    with tqdm(total=len(card_ids)) as pbar:
        for card_id in card_ids:
            ref.child("owned").child(card_id).set(card_assoc[card_id])
            pbar.update(1)



def main():
    #insertCards()
    pass

if __name__ == "__main__":
    upload_decks()

    