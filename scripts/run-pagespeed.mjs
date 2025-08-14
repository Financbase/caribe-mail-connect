#!/usr/bin/env node
import { execSync } from 'node:child_process'

const url = process.env.PSI_URL || process.env.LH_URL || 'http://localhost:8080'
try {
  // Use PageSpeed Insights via PSI CLI
  execSync(`npx --yes psi ${url} --strategy=mobile --format=json > reports/pagespeed-mobile.json`, { stdio: 'inherit' })
  execSync(`npx --yes psi ${url} --strategy=desktop --format=json > reports/pagespeed-desktop.json`, { stdio: 'inherit' })
  console.log('PSI reports saved to reports/pagespeed-*.json')
} catch (e) {
  console.error('PSI run failed:', e?.message)
  process.exitCode = 1
}


