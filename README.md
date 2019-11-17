# jodel-analytics

## Request your data from jodel

https://jodel.zendesk.com/hc/de/requests/new

## Run

1. Paste your data in `json/*`
2. Run `yarn install` or `npm install` to install the node_modules
3. Run the script with `yarn start` or `npm run start` or `node index.js`

### Sample output
```bash
Oldest data Point:  2016-11-14
┌───────────────┐
│Posts per City │
│Erlangen: 5537 │
│Nürnberg:   71 │
│Hamburg:    53 │
│Berlin:     52 │
│München:    33 │
└───────────────┘
┌────────────────┐
│VoteStats       │
│Upvotes: 36785  │
│Downvotes: 6814 │
└────────────────┘
┌──────────────────────┐
│Top Interaction Months│
│2018-01: 879          │
│2017-11: 795          │
│2017-12: 722          │
│2018-02: 599          │
│2017-10: 412          │
└──────────────────────┘
┌───────────────┐
│Top Colors used│
│9EC41C: 1092   │
│DD5F5F: 1016   │
│FFBA00: 1003   │
│06A3CB: 1000   │
│FF9908: 925    │
└───────────────┘
```

## Add your own queries

Every interaction will be one `.json.` file named `timestamp-type-hash.json`. The type can be `post`, `reply`, `deleted` or `image`. The `analyse()` function will create an array containing all json objects except images.

---

Have fun and happy jodeling 🦝