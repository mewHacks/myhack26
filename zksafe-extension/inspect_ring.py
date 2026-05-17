from playwright.sync_api import sync_playwright


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 420, "height": 680}, device_scale_factor=2)
    page.goto("http://127.0.0.1:3000", wait_until="networkidle")
    page.screenshot(path="/tmp/zksafe-ring.png", full_page=True)

    ring = page.locator(".checkmark-ring-arc")
    wrap = page.locator('[aria-label="safe-checkmark"]')
    print({
        "ring_count": ring.count(),
        "ring_box": ring.bounding_box(),
        "wrap_box": wrap.bounding_box(),
        "html": wrap.evaluate("node => node.outerHTML"),
    })

    browser.close()
