import csv
import requests
import os
from tqdm import tqdm

def read_names(deck):
    names = []
    path = f"./owned_conversion/{deck}.csv"
    with open(path,"r") as csv_file:
        file = csv.reader(csv_file)
        skip = 1
        for line in file:
            if(skip == 1 or skip==2):
                skip = skip+1
            else:
                for _ in range(int(line[1])): 
                    names.append(line[3])
    
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
    path = f"./owned_conversion/{deck}.ydk"
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
        # parse any special characters in the name to be URL-safe
        if name == 'Armityle the Chaos Phantasm':
            name = 'Armityle the Chaos Phantom'
        name = requests.utils.quote(name)
        ids.append(get_card_by_name(name))
        time.sleep(0.1)

    write_ydk(deck, ids)

#fix Armytile the Chaos Phantasm


def convert_all():
    path = os.path.join(os.getcwd(),"owned_conversion")

    for file in os.listdir(path):
        if file.endswith(".csv"):
            deck = file.split(".")[0]
            print(f"Converting {deck}...")
            convert(deck)
            print(f"{deck} converted!")
            print("\n\n")
            # move the file to the converted folder
            os.rename(f"./owned_conversion/{deck}.csv", f"./owned_conversion/done/{deck}.csv")
    

if __name__ == "__main__":
    #convert_all()
    from firebase import add_all_owned
    
    path = os.path.join(os.getcwd(),"owned_conversion")

    for file in os.listdir(path):
        if file.endswith('ydk'):
            deck = file.split(".")[0]
            print(f"Adding {deck} to owned...")
            add_all_owned(f"./owned_conversion/{deck}.ydk")
            print(f"{deck} added!")
            print("\n\n")
            # move the file to the converted folder
            os.rename(f"./owned_conversion/{deck}.ydk", f"./owned_conversion/backup/{deck}.ydk")