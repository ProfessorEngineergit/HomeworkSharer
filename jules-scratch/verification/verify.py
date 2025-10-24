
from playwright.sync_api import sync_playwright, expect
import os
import re

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Create a dummy file for the upload feature
    dummy_file_path = "jules-scratch/verification/dummy_file.txt"
    os.makedirs(os.path.dirname(dummy_file_path), exist_ok=True)
    with open(dummy_file_path, "w") as f:
        f.write("This is a test file.")

    try:
        page.goto("file://" + os.path.abspath("index.html"))
        expect(page.locator(".homework-item")).to_have_count(2)

        # Switch to Math Club context
        page.get_by_role("link", name="Math Club").click()
        expect(page.locator(".homework-item")).to_have_count(1)


        # Trigger "Add New Homework" by setting a file on the hidden input
        page.locator("#file-upload").set_input_files(dummy_file_path)

        # Wait for the modal to appear and fill the form
        add_modal = page.locator("#add-homework-modal")
        expect(add_modal).to_be_visible()
        add_modal.get_by_label("Topic:").fill("Final Project Proposal")
        add_modal.get_by_label("Description:").fill("Submit a 1-page proposal")
        add_modal.get_by_label("Due Date:").fill("2025-11-15")
        add_modal.get_by_label("Subject:").fill("Astrophysics")
        add_modal.get_by_role("button", name="Save").click()

        # Wait for submission effects and for the new item to render
        page.wait_for_timeout(2000)
        expect(page.locator("text=Final Project Proposal")).to_be_visible()

        # Check and uncheck the first homework item
        first_homework_item = page.locator(".homework-item").first

        # Click the label to check the box
        first_homework_item.locator("label").first.click()
        page.wait_for_timeout(500)
        class_attribute_after_check = first_homework_item.get_attribute("class")
        assert "completed" in class_attribute_after_check

        # Click the label again to uncheck
        first_homework_item.locator("label").first.click()
        page.wait_for_timeout(500)
        class_attribute_after_uncheck = first_homework_item.get_attribute("class")
        assert "completed" not in class_attribute_after_uncheck

        # Open and close the details modal
        first_homework_item.click()
        expect(page.locator("#homework-modal")).to_be_visible()
        # XP should increase by 1 after viewing
        page.locator("#homework-modal .close-button").click()
        expect(page.locator("#homework-modal")).not_to_be_visible()

        # Navigate to Profile view
        page.locator("#profile-btn").click()
        expect(page.locator("#profile-view")).to_be_visible()

        # Navigate to Leaderboard view
        page.locator("#leaderboard-btn").click()
        expect(page.locator("#leaderboard-view")).to_be_visible()

        # Screenshot the final state (leaderboard)
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        os.remove(dummy_file_path)
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
