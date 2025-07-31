#!/usr/bin/env python3
"""
Setup script for PRMCMS Test Suite
Installs dependencies and configures the test environment
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python 3.8+ required, found {version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing Python dependencies...")
    
    # Upgrade pip first
    if not run_command(f"{sys.executable} -m pip install --upgrade pip", "Upgrading pip"):
        return False
    
    # Install requirements
    if not run_command(f"{sys.executable} -m pip install -r requirements.txt", "Installing requirements"):
        return False
    
    return True

def install_playwright_browsers():
    """Install Playwright browsers"""
    print("\n🌐 Installing Playwright browsers...")
    
    if not run_command(f"{sys.executable} -m playwright install chromium", "Installing Chromium browser"):
        return False
    
    return True

def verify_installation():
    """Verify that all dependencies are properly installed"""
    print("\n🔍 Verifying installation...")
    
    try:
        import asyncio
        print("✅ asyncio module available")
    except ImportError:
        print("❌ asyncio module not available")
        return False
    
    try:
        from playwright import async_api
        print("✅ playwright module available")
    except ImportError:
        print("❌ playwright module not available")
        return False
    
    try:
        import pytest
        print("✅ pytest module available")
    except ImportError:
        print("❌ pytest module not available")
        return False
    
    return True

def create_test_config():
    """Create test configuration file"""
    print("\n⚙️ Creating test configuration...")
    
    config_content = """# PRMCMS Test Configuration
BASE_URL=http://localhost:5173
TIMEOUT=10000
HEADLESS=true
BROWSER=chromium
"""
    
    config_file = Path("test_config.ini")
    try:
        with open(config_file, "w") as f:
            f.write(config_content)
        print("✅ Test configuration created")
        return True
    except Exception as e:
        print(f"❌ Failed to create test configuration: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 PRMCMS Test Suite Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Failed to install dependencies")
        sys.exit(1)
    
    # Install Playwright browsers
    if not install_playwright_browsers():
        print("\n❌ Failed to install Playwright browsers")
        sys.exit(1)
    
    # Verify installation
    if not verify_installation():
        print("\n❌ Installation verification failed")
        sys.exit(1)
    
    # Create test configuration
    if not create_test_config():
        print("\n❌ Failed to create test configuration")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Start your PRMCMS application on http://localhost:5173")
    print("2. Run tests with: python3 test_runner.py")
    print("3. Run individual tests with: python3 TC001_Multi_factor_Authentication_Success.py")

if __name__ == "__main__":
    main() 