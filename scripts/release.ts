#!/usr/bin/env zx

import { versionBump } from 'bumpp'
import { $ } from 'zx'

try {
  console.log('Bumping versions in packages:', './package.json', '\n')

  const result = await versionBump({
    files: ['./package.json'],
    commit: true,
    push: true,
    tag: true,
  })

  if (!result.newVersion.includes('beta')) {
    console.log('Pushing to release branch')
    await $`git update-ref refs/heads/release refs/heads/main`
    await $`git push origin release`
  }
  console.log('New release is ready, waiting for conformation at https://github.com/vitest-dev/vitest-browser-react/actions')
}
catch (err) {
  console.error(err)
}
