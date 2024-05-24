import csv
import requests


def read_names(deck):
    names = []
    path = f"./csv/{deck}.csv"
    with open(path,"r") as csv_file:
        file = csv.reader(csv_file)
        skip = 1
        for line in file:
            if(skip == 1 or skip==2):
                skip = skip+1
            else:
                for value in range(int(line[1])): 
                    names.append(line[2])
    
    return names

def get_card_by_name(name):
    query = f"https://db.ygoprodeck.com/api/v7/cardinfo.php?name={name}"
    try:
        r = requests.get(query)
        r.raise_for_status()  # Ensure we handle HTTP errors properly
        data = r.json()  # Correctly call the json() method
        if 'data' in data and data['data']:
            card_info = data['data'][0]  # The API returns a list of cards under 'data'
            card_id = card_info['id']
            return card_id
        else:
            print("Card not found")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    except (KeyError, IndexError) as e:
        print(f"Unexpected response structure: {e}")

def write_ydk(deck, data):
    data_string = ""
    path = f"./decks/{deck}.ydk"
    for e in data:
        data_string += f"{e}\n"
    with open(path, "w") as ydk_file:
        ydk_file.write(data_string)
    print("Scritto il deck!")


def convert(deck):
    import time
    from tqdm import tqdm
    
    ids = []
    names = read_names(deck)

    for name in tqdm(names, desc="Processing names"):
        ids.append(get_card_by_name(name))
        time.sleep(0.1)

    write_ydk(deck, ids)


    

if __name__ == "__main__":
    import os
    from tqdm import tqdm

    print(os.curdir)
    dir = os.path.join(os.curdir,"csv")
    for filename in tqdm(dir,desc=f"Processing decks" ):
        if os.path.isfile(os.path.join(dir, filename)):
            file_root, file_ext = os.path.splitext(filename)
            convert(file_root)
            print(f'[Converted] {file_root}.csv to {file_root}.ydk')
