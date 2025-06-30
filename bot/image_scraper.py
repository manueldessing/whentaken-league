from playwright.sync_api import sync_playwright, expect, TimeoutError
import re, time
from datetime import datetime
import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

WHENTAKEN      = "https://whentaken.com/game"
ROUNDS         = 5
YEAR_TO_GUESS  = 1999

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
OUT_DIR = os.path.join(ROOT_DIR, 'daily_images')

CDN_PREFIX     = "https://cdn.whentaken.com/images/"

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai_client = OpenAI(api_key=OPENAI_API_KEY)

today = datetime.today()
today_str = today.strftime('%Y-%m-%d')

def mid_point(box):
    return (
        box["x"] + box["width"] // 2,
        box["y"] + box["height"] // 2,
    )

def upload_file_to_openai(file_path):
    with open(file_path, "rb") as file_content:
        result = openai_client.files.create(
            file=file_content,
            purpose="vision",
        )
        return result.id


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    mapping_path = os.path.join(ROOT_DIR, "bot", "filename_mappings.json")
    file_id_store = {}
    
    current_files_in_openai = [file.filename for file in openai_client.files.list().data]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page    = browser.new_page()

        # capture the first image while navigating 
        with page.expect_response(lambda r: r.url.startswith(CDN_PREFIX)) as first_resp_info:
            page.goto(WHENTAKEN, wait_until="networkidle")

        first_resp = first_resp_info.value
        seen_urls  = {first_resp.url}

        # Round 1
        fname = os.path.join(OUT_DIR, f"{today_str}_1.jpg")
        with open(fname, "wb") as f:
            f.write(first_resp.body())

        if not f"{today_str}_1.jpg" in current_files_in_openai:
            file_id = upload_file_to_openai(fname)
            file_id_store[f"{today_str}_1.jpg"] = file_id

        print("Round 1: saved", os.path.basename(fname))

        # cookie banner 
        banner = page.locator("#accept-choices")
        try:
            banner.wait_for(state="visible", timeout=5_000)
            banner.click()
            print("Cookie banner accepted")
        except TimeoutError:
            pass

        # stable locators (persist across rounds) 
        canvas     = page.locator("canvas.syrup-canvas")
        year_input = page.locator('input[maxlength="4"][inputmode="numeric"]')
        guess_btn  = page.locator("button:has-text('Guess')")
        next_link  = page.get_by_role("link", name=re.compile("next round", re.I))
        ok_link    = page.get_by_role("link", name=re.compile("^ok$", re.I))

        # loop for rounds 2 to 5
        for idx in range(2, ROUNDS + 1):
            box = canvas.bounding_box()
            x, y = mid_point(box)
            print("Click on point", x, y)
            page.mouse.click(x, y)
            time.sleep(0.5)
            page.mouse.click(x, y)
            year_input.fill(str(YEAR_TO_GUESS))
            expect(guess_btn).to_be_enabled(timeout=10_000)
            guess_btn.click(force=True)
            expect(next_link).to_be_visible(timeout=10_000)
            with page.expect_response(
                lambda r: r.url.startswith(CDN_PREFIX) and r.url not in seen_urls
            ) as resp_info:
                next_link.click(force=True)
            try:
                ok_link.wait_for(state="visible", timeout=2_000)
                ok_link.click()
                print("Bad-score popup dismissed")
            except TimeoutError:
                pass

            # Save file locally
            resp      = resp_info.value
            seen_urls.add(resp.url)
            fname     = os.path.join(OUT_DIR, f"{today_str}_{idx}.jpg")
            with open(fname, "wb") as f:
                f.write(resp.body())

            # Upload file to OpenAI if it doesn't exist
            if not f"{today_str}_{idx}.jpg" in current_files_in_openai:
                file_id = upload_file_to_openai(fname)
                file_id_store[f"{today_str}_{idx}.jpg"] = file_id

            print(f"Round {idx}: saved {os.path.basename(fname)}")
            time.sleep(0.3)

        browser.close()

        # Merge with existing mapping file (if any)
        try:
            with open(mapping_path, "r") as f:
                existing = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            existing = {}

        if file_id_store:
            existing.update(file_id_store)

        with open(mapping_path, "w") as f:
            json.dump(existing, f, indent=2)

if __name__ == "__main__":
    main()