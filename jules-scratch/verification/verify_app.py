from playwright.sync_api import sync_playwright
import os
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto(f"file://{os.path.abspath('index.html')}")

    # 1. Test sidebar
    page.click('.sidebar-toggle') # Close
    page.click('.sidebar-toggle') # Open

    # 2. Test context switching
    page.click('a:has-text("Math Club")')
    time.sleep(1) # Wait for rendering

    # 3. Test checkbox on redesigned item
    page.click('.homework-item[data-id="mc1"] .homework-pill')

    # 4. Test "Add New Homework" flow
    page.on("filechooser", lambda file_chooser: file_chooser.set_files("README.md"))
    page.click("#dropzone")

    page.fill('#new-homework-title', 'Test Homework')
    page.fill('#new-homework-description', 'This is a test description.')
    page.fill('#new-homework-due-date', '2025-12-31')
    page.fill('#new-homework-subject', 'Testing')
    page.click('#add-homework-form button[type="submit"]')

    # 5. Test profile page
    page.click('#profile-btn')

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
