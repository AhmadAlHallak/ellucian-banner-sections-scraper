# ellucian-banner-sections-scraper

Scrapes courses sections from the course search page in Ellucian Banner (v8.4).

# Install

```
npm i AhmadAlHallak/ellucian-banner-sections-scraper
```

## Usage

```js
const scrap = require('ellucian-banner-sections-scraper');
// Sample input
const coursesToRegister = ['ME308', 'ME201'];
return scrap('./index.html', coursesToRegister);
```
Sample output =>
```js
{
  "ME308": {
    "name": "ME308",
    "crdt": 4,
    "sections": [
      { 
      "secNo": "02",
        "secCRN": "1317",
        "secBuilding": "ENG",
        "secInstructor": "Instructor 1", 
        "sectionSlots": { "T": [660, 710], "U": [600, 710] },
        "secCourse": "ME308"
      }
    ]
  },
  "ME201": {
    "name": "ME201",
    "crdt": 3,
    "sections": [
      {
        "secNo": "02",
        "secCRN": "1246",
        "secBuilding": "ENG",
        "secInstructor": "Instructor 2",  
        "sectionSlots": {"T": [840, 950], "U": [900, 950]},
        "secCourse": "ME201"
      },
      {
        "secNo": "03",
        "secCRN": "1248",
        "secBuilding": "ENG",
        "secInstructor": "Instructor 3",  
        "sectionSlots": {"M": [600, 710], "T": [780, 830]},
        "secCourse": "ME201"
      },
    ]
  }
}
```
## API

### `scrap(htmlPath,coursesToRegister [,options])`

### `htmlPath`

Type: `string`

### `coursesToRegister`

Type: `Array<string>`

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


## Note:
I made this script along with [weekly-scheduler](https://github.com/AhmadAlHallak/weekly-scheduler) to help me find schedules to register each new term in college. So both are best used in tandem.

I made this script a long time ago, so review the code properly before using.
