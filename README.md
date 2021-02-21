# ellucian-banner-sections-scraper

Scrapes courses sections from the course search page in Ellucian Banner (v8.4)

# Install

```
npm i  AhmadAlHallak/ellucian-banner-sections-scraper
```

## Usage

```
const scrap = require('ellucian-banner-sections-scraper');
const coursesToRegister = ['ME308', 'ME308Lab'];
console.log(JSON.stringify(scrap('./index.html', coursesToRegister), null, 2));
```

## API

### `scrap(htmlPath,coursesToRegister [,options])`

### `htmlPath`

Type: `string`

### `coursesToRegister`

Type: `array<string>`

### `options?`
Type: `object`

#### dailyStart
Type: `number`\
Default: `0`

In minutes. When you want your school day to start.

#### dailyEnd
Type: `number`\
Default: `1440`

In minutes. When you want your school day to end.

#### offDays
Type: `array<string>`\
Default: `[]`

If you don't want to include any section that falls on a certain day.

#### excludedCRNs
Type: `array<string>`\
Default: `[]`

If you don't want specific CRNs to be scrapped.


