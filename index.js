/* eslint-disable camelcase */
const fs = require('fs');
const moment = require('moment');
const boxen = require('boxen');
const chalk = require('chalk');

const ROOT_PATH = './json/';

// log helpers
const fill = l => new Array(l < 1 ? 1 : l + 2).fill(' ').join('');
const logObj = (a, t) => {
  const longest = Object.keys(a).reduce(
    (max, key) => Math.max(`${key}: ${chalk.magenta(a[key])}`.length, max),
    0
  );
  const body = Object.keys(a).reduce((s, key) => {
    const row = `${key}: ${chalk.magenta(a[key])}\n`;
    return `${s}${key}:${fill(longest - row.length)}${chalk.magenta(a[key])}\n`;
  }, `${chalk.yellow(t)}\n`);
  // eslint-disable-next-line no-console
  console.log(boxen(`${body.trim()} `, {}));
};

// Generic helpers
const reduceSumUpBy = (data, keyAccessor, valueAccessor) =>
  data.reduce((reducedData, currentEntry) => {
    const key = keyAccessor(currentEntry);
    const nextKeyValue =
      reducedData[key] == null
        ? 1
        : valueAccessor(currentEntry, reducedData[key]);
    return {
      ...reducedData,
      [key]: nextKeyValue,
    };
  }, {});

const getOldestDataPoint = data =>
  data
    .reduce((oldest, { created_at }) => {
      const current = moment(created_at);
      return moment.min(oldest, current);
    }, moment())
    .format('YYYY-MM-DD');

const getCountUpvoteTotal = data =>
  data.reduce((total, { up_votes_count }) => total + up_votes_count, 0);

const getCountDownvoteTotal = data =>
  data.reduce((total, { down_votes_count }) => total + down_votes_count, 0);

const sumByMonth = data =>
  reduceSumUpBy(
    data,
    ({ created_at }) => moment(created_at).format('YYYY-MM'),
    (currentEntry, oldVal) => oldVal + 1
  );

const sumByCity = data =>
  reduceSumUpBy(
    data,
    entry => entry.location.city,
    (currentEntry, oldVal) => oldVal + 1
  );

const sumByColor = data =>
  reduceSumUpBy(
    data,
    entry => entry.color,
    (currentEntry, oldVal) => oldVal + 1
  );

const getTop = (summedBy, top, reduceBack) =>
  Object.keys(summedBy)
    .sort((keyA, keyB) => summedBy[keyB] - summedBy[keyA])
    .slice(0, top)
    .reduce(reduceBack, {});

const getTopList = (summedByCity, top) =>
  getTop(summedByCity, top, (obj, key) => ({
    ...obj,
    [key]: summedByCity[key],
  }));

const analyze = () => {
  const data = [];
  fs.readdirSync(ROOT_PATH).forEach(filename => {
    if (
      filename.includes('reply') ||
      filename.includes('post') ||
      filename.includes('deleted')
    ) {
      data.push(JSON.parse(fs.readFileSync(`${ROOT_PATH}${filename}`, 'utf8')));
    }
  });
  // Analyze here
  // eslint-disable-next-line no-console
  console.log('Oldest data Point: ', getOldestDataPoint(data));
  logObj(getTopList(sumByCity(data), 5), 'Posts per City');
  logObj(
    {
      Upvotes: getCountUpvoteTotal(data),
      Downvotes: getCountDownvoteTotal(data),
    },
    'VoteStats'
  );
  logObj(getTopList(sumByMonth(data), 5), 'Top Interaction Months');
  logObj(getTopList(sumByColor(data), 5), 'Top Colors used');
};

analyze();
