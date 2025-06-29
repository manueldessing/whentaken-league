from dotenv import load_dotenv
import os
from openai import OpenAI
from datetime import datetime
import json
import concurrent.futures
import argparse
from pydantic import BaseModel, Field

load_dotenv()

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai_client = OpenAI(api_key=OPENAI_API_KEY)

MAPPING_PATH = os.path.join(ROOT_DIR, "bot", "filename_mappings.json")

today_str = datetime.today().strftime('%Y-%m-%d')

rounds = list(range(1, 6))

with open(os.path.join(ROOT_DIR, "bot", "bot_system_prompt.txt"), "r") as pf:
    prompt = pf.read()

with open(MAPPING_PATH, "r") as f:
    filename_mappings = json.load(f)

class Guess(BaseModel):
    lat: float = Field(..., description="Latitude in decimal degrees, 5 decimals")
    lon: float = Field(..., description="Longitude in decimal degrees, 5 decimals")
    location: str = Field(..., description="Description of location in words")
    year: int = Field(..., description="Year as YYYY")
    confidence: float = Field(..., ge=0, le=1, description="Certainty as float 0-1")
    rationale: str = Field(..., description="Brief explanation")

def make_guess(round_number):
    print(f"Initiating round {round_number} guess.")
    file_key = f"{today_str}_{round_number}.jpg"
    file_id = filename_mappings.get(file_key)
    if not file_id:
        print(f"No file_id found for {file_key}")
        return None
    try:
        response = openai_client.responses.parse(
            model=MODEL_NAME,
            input=[
                {"role": "developer", "content": prompt},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_image",
                            "file_id": file_id,
                        },
                    ],
                }
            ],
            text_format=Guess,
        )
        print(f"Finished round {round_number} guess.")
        return response
    except Exception as e:
        print(f"Error for round {round_number}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', default='o3')
    args = parser.parse_args()
    global MODEL_NAME
    MODEL_NAME = args.model

    guesses_path = os.path.join(os.path.dirname(__file__), "bot_guesses.json")
    try:
        with open(guesses_path, "r") as f:
            all_guesses = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        all_guesses = {}

    today_guesses = all_guesses.get(today_str, {})
    bot_guesses = today_guesses.get(MODEL_NAME, {})

    # Check if we already have a complete set of guesses for today/model
    if all(str(r) in bot_guesses for r in rounds):
        print(f"Already have complete guesses for {today_str} and model '{MODEL_NAME}'. Skipping LLM calls.")
        for idx in rounds:
            print(f"Round {idx}:", bot_guesses[str(idx)])
        return

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(make_guess, round_number) for round_number in rounds]
        results = [f.result() for f in futures]

    for idx, res in enumerate(results, 1):
        # Use output_parsed if available, else fallback to output_text/raw
        guess = None
        if res and hasattr(res, "output_parsed") and res.output_parsed:
            guess = res.output_parsed.model_dump()
        elif res and hasattr(res, "output_text"):
            try:
                guess = json.loads(res.output_text)
            except Exception:
                guess = {"raw": getattr(res, "output_text", str(res))}
        if guess:
            bot_guesses[str(idx)] = guess
        print(f"Round {idx}:", guess)

    # Save results to bot_guesses.json
    for idx, res in enumerate(results, 1):
        if res and hasattr(res, "output_text"):
            try:
                guess = json.loads(res.output_text)
            except Exception:
                guess = {"raw": getattr(res, "output_text", str(res))}
            bot_guesses[str(idx)] = guess

    today_guesses[MODEL_NAME] = bot_guesses
    all_guesses[today_str] = today_guesses

    with open(guesses_path, "w") as f:
        json.dump(all_guesses, f, indent=2)

if __name__ == '__main__':
    main()