from datetime import datetime
import os
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv()

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
IMAGES_DIR = os.path.join(ROOT_DIR, 'daily_images')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai_client = OpenAI(api_key=OPENAI_API_KEY)

DELETE_DAYS_THRESHOLD = 5
MAPPING_PATH = os.path.join(ROOT_DIR, "bot", "filename_mappings.json")

def main():
    today = datetime.today()

    # Delete old local files
    for entry in os.scandir(IMAGES_DIR):
        path = entry.path
        file_name = os.path.basename(path)
        
        try:
            date_list = file_name.split('_')[0].split('-')
            if len(date_list) == 3:
                file_date = datetime(*map(int, date_list))
                if (today - file_date).days >= DELETE_DAYS_THRESHOLD:
                    os.remove(path)
        except (ValueError, IndexError):
            continue

    # Delete old files on OpenAI server and update mapping file
    try:
        with open(MAPPING_PATH, "r") as f:
            mappings = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        mappings = {}

    to_delete_from_mapping = []
    for fname, file_id in mappings.items():
        try:
            date_list = fname.split('_')[0].split('-')
            if len(date_list) == 3:
                file_date = datetime(*map(int, date_list))
                if (today - file_date).days >= DELETE_DAYS_THRESHOLD:
                    resp = openai_client.files.delete(file_id)
                    if getattr(resp, "deleted", False):
                        to_delete_from_mapping.append(fname)
        except Exception:
            continue

    # Remove deleted entries from mapping and save
    if to_delete_from_mapping:
        for fname in to_delete_from_mapping:
            mappings.pop(fname, None)
        with open(MAPPING_PATH, "w") as f:
            json.dump(mappings, f, indent=2)

if __name__ == "__main__":
    main()