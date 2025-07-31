#!/usr/bin/env python3
"""
Base Test Class for PRMCMS Test Suite
Provides common functionality and error handling for all test cases
"""

import asyncio
import logging
from typing import Optional, Dict, Any
from playwright import async_api

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BaseTest:
    """Base class for all PRMCMS test cases"""
    
    def __init__(self):
        self.pw: Optional[async_api.Playwright] = None
        self.browser: Optional[async_api.Browser] = None
        self.context: Optional[async_api.BrowserContext] = None
        self.page: Optional[async_api.Page] = None
        self.base_url = "http://localhost:5173"
        self.timeout = 10000
        
    async def setup(self):
        """Initialize Playwright and browser"""
        try:
            logger.info("Starting Playwright session")
            self.pw = await async_api.async_playwright().start()
            
            logger.info("Launching browser")
            self.browser = await self.pw.chromium.launch(
                headless=True,
                args=[
                    "--window-size=1280,720",
                    "--disable-dev-shm-usage",
                    "--ipc=host",
                    "--single-process"
                ],
            )
            
            logger.info("Creating browser context")
            self.context = await self.browser.new_context()
            self.context.set_default_timeout(5000)
            
            logger.info("Creating new page")
            self.page = await self.context.new_page()
            
        except Exception as e:
            logger.error(f"Setup failed: {e}")
            await self.cleanup()
            raise
    
    async def cleanup(self):
        """Clean up resources"""
        try:
            if self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            if self.pw:
                await self.pw.stop()
        except Exception as e:
            logger.error(f"Cleanup error: {e}")
    
    async def navigate_to_app(self):
        """Navigate to the application"""
        try:
            logger.info(f"Navigating to {self.base_url}")
            await self.page.goto(self.base_url, wait_until="commit", timeout=self.timeout)
            
            # Wait for page to load
            try:
                await self.page.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                logger.warning("DOM content loaded timeout - continuing anyway")
            
            # Wait for all frames to load
            for frame in self.page.frames:
                try:
                    await frame.wait_for_load_state("domcontentloaded", timeout=3000)
                except async_api.Error:
                    logger.warning(f"Frame load timeout - continuing anyway")
                    
        except Exception as e:
            logger.error(f"Navigation failed: {e}")
            raise
    
    async def safe_click(self, selector: str, timeout: int = 5000):
        """Safely click an element with error handling"""
        try:
            await self.page.wait_for_timeout(1000)  # Small delay for stability
            element = self.page.locator(selector)
            await element.click(timeout=timeout)
            logger.info(f"Successfully clicked: {selector}")
        except Exception as e:
            logger.error(f"Click failed for {selector}: {e}")
            raise
    
    async def safe_fill(self, selector: str, value: str, timeout: int = 5000):
        """Safely fill an input field with error handling"""
        try:
            await self.page.wait_for_timeout(1000)  # Small delay for stability
            element = self.page.locator(selector)
            await element.fill(value, timeout=timeout)
            logger.info(f"Successfully filled {selector} with: {value}")
        except Exception as e:
            logger.error(f"Fill failed for {selector}: {e}")
            raise
    
    async def wait_for_element(self, selector: str, timeout: int = 5000):
        """Wait for an element to be present"""
        try:
            await self.page.wait_for_selector(selector, timeout=timeout)
            logger.info(f"Element found: {selector}")
        except Exception as e:
            logger.error(f"Element not found: {selector} - {e}")
            raise
    
    async def assert_page_title(self, expected_title: str):
        """Assert page title matches expected value"""
        try:
            actual_title = await self.page.title()
            assert actual_title == expected_title, f"Expected title '{expected_title}', got '{actual_title}'"
            logger.info(f"Page title assertion passed: {expected_title}")
        except Exception as e:
            logger.error(f"Page title assertion failed: {e}")
            raise
    
    async def assert_content_contains(self, expected_text: str):
        """Assert page content contains expected text"""
        try:
            content = await self.page.content()
            assert expected_text in content, f"Expected text '{expected_text}' not found in page content"
            logger.info(f"Content assertion passed: {expected_text}")
        except Exception as e:
            logger.error(f"Content assertion failed: {e}")
            raise
    
    async def run_test(self):
        """Main test method to be implemented by subclasses"""
        raise NotImplementedError("Subclasses must implement run_test method") 