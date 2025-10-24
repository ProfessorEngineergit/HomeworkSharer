import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the local file
        await page.goto(f"file:///app/index.html")

        # Wait for initial load
        await page.wait_for_selector('.homework-item', state='visible')
        await page.wait_for_timeout(1000)

        # 1. Verify Leaderboard
        await page.click('#leaderboard-btn')
        await page.wait_for_selector('.leaderboard-item', state='visible')
        await page.wait_for_timeout(500)
        await page.screenshot(path="jules-scratch/verification/leaderboard_view.png")

        # 2. Verify Redesigned Close Button
        await page.click('.classes-nav a') # Go back to homework
        await page.wait_for_selector('.homework-item', state='visible')
        await page.wait_for_timeout(500)
        await page.click('.homework-item')
        await page.wait_for_selector('#homework-modal', state='visible')
        await page.wait_for_timeout(500)
        await page.screenshot(path="jules-scratch/verification/modal_close_button.png")
        await page.click('.close-button') # Close the modal

        # 3. Verify Profile XP Counter
        await page.click('#profile-btn')
        await page.wait_for_selector('#profile-view', state='visible')
        await page.wait_for_timeout(500)
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
