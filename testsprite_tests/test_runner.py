#!/usr/bin/env python3
"""
PRMCMS Test Runner
Comprehensive test runner for all Playwright-based test cases
"""

import asyncio
import sys
import os
import importlib.util
from pathlib import Path
from typing import List, Dict, Any
import traceback

class TestRunner:
    def __init__(self, test_dir: str = "."):
        self.test_dir = Path(test_dir)
        self.results: Dict[str, Dict[str, Any]] = {}
        
    def discover_tests(self) -> List[Path]:
        """Discover all Python test files in the directory"""
        test_files = []
        for file_path in self.test_dir.glob("TC*.py"):
            if file_path.is_file():
                test_files.append(file_path)
        return sorted(test_files)
    
    async def run_single_test(self, test_file: Path) -> Dict[str, Any]:
        """Run a single test file and return results"""
        test_name = test_file.stem
        result = {
            "file": str(test_file),
            "name": test_name,
            "status": "unknown",
            "error": None,
            "duration": 0.0
        }
        
        try:
            # Import the test module
            spec = importlib.util.spec_from_file_location(test_name, test_file)
            if spec is None or spec.loader is None:
                raise ImportError(f"Could not load test file: {test_file}")
            
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # Check if the module has a run_test function
            if not hasattr(module, 'run_test'):
                raise AttributeError(f"Test file {test_file} does not contain 'run_test' function")
            
            # Run the test
            start_time = asyncio.get_event_loop().time()
            await module.run_test()
            end_time = asyncio.get_event_loop().time()
            
            result["status"] = "passed"
            result["duration"] = end_time - start_time
            
        except Exception as e:
            result["status"] = "failed"
            result["error"] = str(e)
            result["traceback"] = traceback.format_exc()
            
        return result
    
    async def run_all_tests(self) -> Dict[str, Dict[str, Any]]:
        """Run all discovered tests"""
        test_files = self.discover_tests()
        print(f"Found {len(test_files)} test files")
        
        for test_file in test_files:
            print(f"\nRunning {test_file.name}...")
            result = await self.run_single_test(test_file)
            self.results[test_file.name] = result
            
            if result["status"] == "passed":
                print(f"✅ {test_file.name} - PASSED ({result['duration']:.2f}s)")
            else:
                print(f"❌ {test_file.name} - FAILED")
                if result["error"]:
                    print(f"   Error: {result['error']}")
        
        return self.results
    
    def print_summary(self):
        """Print a summary of test results"""
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results.values() if r["status"] == "passed")
        failed_tests = total_tests - passed_tests
        
        print(f"\n{'='*50}")
        print(f"TEST SUMMARY")
        print(f"{'='*50}")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "N/A")
        
        if failed_tests > 0:
            print(f"\nFailed Tests:")
            for test_name, result in self.results.items():
                if result["status"] == "failed":
                    print(f"  - {test_name}: {result['error']}")

async def main():
    """Main entry point"""
    runner = TestRunner()
    
    try:
        await runner.run_all_tests()
        runner.print_summary()
        
        # Exit with appropriate code
        failed_count = sum(1 for r in runner.results.values() if r["status"] == "failed")
        sys.exit(1 if failed_count > 0 else 0)
        
    except KeyboardInterrupt:
        print("\nTest execution interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"Test runner error: {e}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 