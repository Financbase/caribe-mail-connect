#!/usr/bin/env node
import { execSync } from 'node:child_process'

const url = process.env.LH_URL || process.env.PSI_URL || 'http://localhost:8080'
try {
  // Prefer npx to avoid global install. --view is CLI flag to open report afterward.
  execSync(`npx --yes lighthouse ${url} --chrome-flags='--headless=new' --only-categories=performance,accessibility,best-practices,seo --output html --output-path=./reports/lighthouse-report.html | cat`, { stdio: 'inherit' })
  console.log('Lighthouse report at reports/lighthouse-report.html')
} catch (e) {
  console.error('Lighthouse run failed:', e?.message)
  process.exitCode = 1
}


