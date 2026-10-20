# ORIONIS GEM QUEST

Phaser 3 + TypeScript Match-3 game inspired by the MIT-licensed [oruman/phaser3-match3](https://github.com/oruman/phaser3-match3). Original source and graphical assets are not copied.

- 8×8 board, 100 progressive levels, move limits and scoring
- Horizontal and vertical matching, reshuffles, special gems
- Touch swipe or two taps; mouse-friendly
- Progress stored in browser localStorage
- Ad request / level completion event hooks, no ad network enabled

Run `npm install && npm run build` in this directory for a Vite build. The Hugo deployment version is committed to `static/games/gem-quest/`.

MIT acknowledgements for inspiration: [upstream LICENSE](https://github.com/oruman/phaser3-match3/blob/main/LICENSE); Phaser: [Phaser LICENSE](https://github.com/phaserjs/phaser/blob/master/LICENSE.md).

Events: `orionis:gemquest:level-complete` and `orionis:gemquest:ad-request`. Connect ads only after disclosures, consent as needed, and provider configuration.