# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## 0.2.0

([Full Changelog](https://github.com/deepnote/jupyterlab-deepnote/compare/d6f97a62a821d2ae08f3e1a5abb3a6447145fed0...b83efdd108e32b1db1f80e3943d06fc8d35fb03a))

### Merged PRs

- fix(publish_release): allow ci workflow to push to main [#61](https://github.com/deepnote/jupyterlab-deepnote/pull/61) ([@saltenasl](https://github.com/saltenasl))
- fix(publish_release): add contents: write permissions [#60](https://github.com/deepnote/jupyterlab-deepnote/pull/60) ([@saltenasl](https://github.com/saltenasl))
- fix(publish_release): add packages: read permissions [#59](https://github.com/deepnote/jupyterlab-deepnote/pull/59) ([@saltenasl](https://github.com/saltenasl))
- fix(publish_release): incorrect checkout version hash [#58](https://github.com/deepnote/jupyterlab-deepnote/pull/58) ([@saltenasl](https://github.com/saltenasl))
- feat(publish_release): match init steps with check_release workflow [#57](https://github.com/deepnote/jupyterlab-deepnote/pull/57) ([@saltenasl](https://github.com/saltenasl))
- fix(publish_release): add NODE_AUTH_TOKEN and GITHUB_TOKEN env vars to the job scope [#56](https://github.com/deepnote/jupyterlab-deepnote/pull/56) ([@saltenasl](https://github.com/saltenasl))
- fix(publish_release): add NODE_AUTH_TOKEN to Populate Release step [#55](https://github.com/deepnote/jupyterlab-deepnote/pull/55) ([@saltenasl](https://github.com/saltenasl))
- fix(publish_release): add GITHUB_TOKEN to Populate Release step [#54](https://github.com/deepnote/jupyterlab-deepnote/pull/54) ([@saltenasl](https://github.com/saltenasl))
- docs: publishing preparations [#53](https://github.com/deepnote/jupyterlab-deepnote/pull/53) ([@dinohamzic](https://github.com/dinohamzic))
- chore: codeowners group [#52](https://github.com/deepnote/jupyterlab-deepnote/pull/52) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- docs: add minimal SECURITY.md [#51](https://github.com/deepnote/jupyterlab-deepnote/pull/51) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- docs: compatibility and maintenance plans [#50](https://github.com/deepnote/jupyterlab-deepnote/pull/50) ([@dinohamzic](https://github.com/dinohamzic))
- chore(deps): update github actions (major) [#48](https://github.com/deepnote/jupyterlab-deepnote/pull/48) ([@renovate](https://github.com/renovate))
- fix: Add ESLint rules for type safety and fix violations [#46](https://github.com/deepnote/jupyterlab-deepnote/pull/46) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- test: test coverage for core transformation functions [#45](https://github.com/deepnote/jupyterlab-deepnote/pull/45) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- ci: fix ci dupe [#44](https://github.com/deepnote/jupyterlab-deepnote/pull/44) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- chore: update codeowners to inc dino [#43](https://github.com/deepnote/jupyterlab-deepnote/pull/43) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- chore: add draftPR to renovate config [#42](https://github.com/deepnote/jupyterlab-deepnote/pull/42) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- ci: add fetch-depth: 0 to qlty checkout for proper git history access [#39](https://github.com/deepnote/jupyterlab-deepnote/pull/39) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- Remove andyjakubowski from CODEOWNERS [#38](https://github.com/deepnote/jupyterlab-deepnote/pull/38) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- fix(ci): ignore youtube link in check_links CI job [#35](https://github.com/deepnote/jupyterlab-deepnote/pull/35) ([@andyjakubowski](https://github.com/andyjakubowski))
- docs: update OSS docs [#34](https://github.com/deepnote/jupyterlab-deepnote/pull/34) ([@andyjakubowski](https://github.com/andyjakubowski))
- chore(deps): update github actions [#33](https://github.com/deepnote/jupyterlab-deepnote/pull/33) ([@renovate](https://github.com/renovate))
- feat: add kernel metadata fallback [#32](https://github.com/deepnote/jupyterlab-deepnote/pull/32) ([@andyjakubowski](https://github.com/andyjakubowski))
- fix(ui): fix toolbar layout on file load [#31](https://github.com/deepnote/jupyterlab-deepnote/pull/31) ([@andyjakubowski](https://github.com/andyjakubowski))
- chore(deps): update actions/checkout action to v5 [#30](https://github.com/deepnote/jupyterlab-deepnote/pull/30) ([@renovate](https://github.com/renovate))
- chore(deps): pin jupyterlab/maintainer-tools action to affc83b [#29](https://github.com/deepnote/jupyterlab-deepnote/pull/29) ([@renovate](https://github.com/renovate))
- chore: sync strict TypeScript compiler flags from deepnote/deepnote [#23](https://github.com/deepnote/jupyterlab-deepnote/pull/23) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- chore(deps): update github actions (major) [#21](https://github.com/deepnote/jupyterlab-deepnote/pull/21) ([@renovate](https://github.com/renovate))
- chore(deps): pin dependencies [#20](https://github.com/deepnote/jupyterlab-deepnote/pull/20) ([@renovate](https://github.com/renovate))
- Revert: "Revert "feat: add CI and Codecov badges to README and set up Codecov integration"" [#19](https://github.com/deepnote/jupyterlab-deepnote/pull/19) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- chore: add lint-staged with pre-commit hooks for src/ directory [#18](https://github.com/deepnote/jupyterlab-deepnote/pull/18) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- Revert "feat: add CI and Codecov badges to README and set up Codecov integration" [#17](https://github.com/deepnote/jupyterlab-deepnote/pull/17) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- feat: add CI and Codecov badges to README and set up Codecov integration [#16](https://github.com/deepnote/jupyterlab-deepnote/pull/16) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- ci: add comprehensive lint and format checks to CI workflow [#15](https://github.com/deepnote/jupyterlab-deepnote/pull/15) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- feat: add codecov integration with test results upload [#13](https://github.com/deepnote/jupyterlab-deepnote/pull/13) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- chore: fix license check naming and put in ci file [#12](https://github.com/deepnote/jupyterlab-deepnote/pull/12) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- feat: add cspell configuration and CI spell-check [#11](https://github.com/deepnote/jupyterlab-deepnote/pull/11) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- feat: add yarn audit checks to CI workflow [#10](https://github.com/deepnote/jupyterlab-deepnote/pull/10) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- chore: configure Renovate [#9](https://github.com/deepnote/jupyterlab-deepnote/pull/9) ([@renovate](https://github.com/renovate))
- chore: add CODEOWNERS file [#8](https://github.com/deepnote/jupyterlab-deepnote/pull/8) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- chore: add qlty configuration and CI checks [#7](https://github.com/deepnote/jupyterlab-deepnote/pull/7) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- fix: re-add notebook switching inside Deepnote file [#6](https://github.com/deepnote/jupyterlab-deepnote/pull/6) ([@andyjakubowski](https://github.com/andyjakubowski))
- feat: convert Deepnote file to Jupyter on the frontend [#4](https://github.com/deepnote/jupyterlab-deepnote/pull/4) ([@andyjakubowski](https://github.com/andyjakubowski))
- ci: add license checker [#3](https://github.com/deepnote/jupyterlab-deepnote/pull/3) ([@jamesbhobbs](https://github.com/jamesbhobbs))
- fix(ui): Set max width on notebook dropdown [#1](https://github.com/deepnote/jupyterlab-deepnote/pull/1) ([@andyjakubowski](https://github.com/andyjakubowski))

### Contributors to this release

([GitHub contributors page for this release](https://github.com/deepnote/jupyterlab-deepnote/graphs/contributors?from=2025-09-10&to=2025-10-28&type=c))

[@andyjakubowski](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Aandyjakubowski+updated%3A2025-09-10..2025-10-28&type=Issues) | [@codecov](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Acodecov+updated%3A2025-09-10..2025-10-28&type=Issues) | [@coderabbitai](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Acoderabbitai+updated%3A2025-09-10..2025-10-28&type=Issues) | [@devin-ai-integration](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Adevin-ai-integration+updated%3A2025-09-10..2025-10-28&type=Issues) | [@dinohamzic](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Adinohamzic+updated%3A2025-09-10..2025-10-28&type=Issues) | [@jamesbhobbs](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Ajamesbhobbs+updated%3A2025-09-10..2025-10-28&type=Issues) | [@linear](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Alinear+updated%3A2025-09-10..2025-10-28&type=Issues) | [@renovate](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Arenovate+updated%3A2025-09-10..2025-10-28&type=Issues) | [@saltenasl](https://github.com/search?q=repo%3Adeepnote%2Fjupyterlab-deepnote+involves%3Asaltenasl+updated%3A2025-09-10..2025-10-28&type=Issues)

<!-- <END NEW CHANGELOG ENTRY> -->
