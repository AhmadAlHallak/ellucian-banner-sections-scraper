const { readFileSync } = require('fs');
const { JSDOM } = require('jsdom'); // can be coded out if running in browser environment.

/*
  // Sample options
  const options = {
    coursesToRegister: ['ME309', 'ME308', 'ME308Lab', 'EE306', 'EE306Lab', 'ME315', 'ME316'], // Add lab suffix if a course is made up of two separate sections (lecture with full credit, lab wiht 0 credit)
    dailyStart: 0, // In minutes. When you want your school day to start.
    dailyEnd: 1440, // In minutes. When you want your school day to end.
    excludedCRNs: [], // If you don't want a specific CRN to be scrapped.
    offDays: [ 'M'], // If you don't want to include any section that falls on a certain day
  };
*/

// Convert the values of the time column from '11:00 am-00:50 pm' the table to an array in minutes: [660, 780]
const parseTime = (time) => {
  const t1h = +time.slice(0, 2) !== 12 ? +time.slice(0, 2) : 0; // Fuck 12-Hour system.
  const t1m = +time.slice(3, 5);
  let t1 = t1h * 60 + t1m;
  if (time.slice(6, 8) === 'pm') {
    t1 += 12 * 60;
  }

  const t2h = +time.slice(9, 11) !== 12 ? +time.slice(9, 11) : 0;
  const t2m = +time.slice(12, 14);
  let t2 = t2h * 60 + t2m;
  if (time.slice(15, 17) === 'pm') {
    t2 += 12 * 60;
  }
  return [t1, t2];
};

const Course = class {
  constructor(name, crdt) {
    this.name = name;
    this.crdt = crdt;
    this.secs = [];
  }

  addSection(secNo, secCRN, secBuilding, secInstructor, sectionSlots, secCourse) {
    this.secs.push({
      secNo,
      secCRN,
      secBuilding,
      secInstructor,
      sectionSlots,
      secCourse, // Redundant
    });
  }
};


// Checks that the section is in line with the user options
const sectionCheck = (options, secCourse, secDays, secTime, secLocation, secCRN) => {
  const {coursesToRegister,offDays = [], dailyStart = 0, dailyEnd = 1440, excludedCRNs = [], offDays = [] } = options;
  if (
    (coursesToRegister && !coursesToRegister.includes(secCourse)) ||
    offDays.includes(secDays) ||
    secTime[0] < dailyStart ||
    secTime[1] > dailyEnd ||
    excludedCRNs.includes(secCRN)
  )
    return false;

  return true;
};

// Grabs the relevant data from the table and puts it in an easy to read and manipulate object.
// Also preforms culling on the data using sectionCheck()
module.exports = (htmlPath, options = {}) => {
  const html = readFileSync(htmlPath).toString();
  const dom = new JSDOM(html);
  const table = dom.window.document.getElementsByClassName('datadisplaytable')[0];
  const courses = {};
  const { coursesToRegister } = options;
  coursesToRegister.forEach((course) => {
    courses[course] = new Course(course);
  });
  const data = Object.values(table.children[1].children).slice(2);
  let rowCRN;
  let rowCourse;
  let rowSecNo;
  let rowCrdt;
  let rowDays;
  let rowTime;
  let rowInstructor;
  let rowLocation;
  let sectionSlots = {};
  const len = data.length;
  for (let i = 0; i < len; i += 1) {
    const row = data[i];
    if (row.children[1] && row.children[1].textContent !== 'CRN') {
      if (/\S/.test(row.children[2].textContent)) {
        // Check that this is a new section
        if (Object.keys(sectionSlots).length) {
          // If so submit the previous section if it meets the conditions
          courses[rowCourse].crdt = +rowCrdt;
          courses[rowCourse].addSection(rowSecNo, rowCRN, rowLocation, rowInstructor, sectionSlots, rowCourse);
          sectionSlots = {};
        }
        rowCRN = row.children[1].textContent.trim();
        rowCourse = row.children[2].textContent + row.children[3].textContent.trim();
        rowSecNo = row.children[4].textContent;
        rowCrdt = row.children[6].textContent;
        rowCourse = rowCrdt === '0.000' ? `${rowCourse}Lab` : rowCourse;
        rowDays = row.children[8].textContent;
        rowTime = row.children[9].textContent;
        rowTime = parseTime(rowTime);
        rowInstructor = row.children[13].textContent.replace('(P)', '').replace(/\s+/g, ' ').trim().split(' , ').toString();
        rowLocation = row.children[15].textContent.replace(/ .*/, '');

        if (
          sectionCheck(
            options,
            rowCourse,
            /* Temp for online */ rowCrdt === '0.000' ? rowDays : 'asda',
            rowTime,
            rowLocation,
            rowCRN,
            rowSecNo,
            rowCRN
          )
        ) {
          [...rowDays].forEach((day) => {
            sectionSlots[day] = rowTime;
          });
        }
      } else {
        rowDays = row.children[8].textContent;
        rowTime = row.children[9].textContent;
        rowTime = parseTime(rowTime);

        if (sectionCheck(options, rowCourse, rowCrdt === '0.000' ? rowDays : 'asda', rowTime, rowLocation, rowCRN)) {
          [...rowDays].forEach((day) => {
            sectionSlots[day] = rowTime;
          });
        } else {
          sectionSlots = {};
        }
        if (Object.keys(sectionSlots).length && i === len - 1) {
          // If so submit the previous section if it meets the conditions
          courses[rowCourse].crdt = +rowCrdt;
          courses[rowCourse].addSection(rowSecNo, rowCRN, rowLocation, rowInstructor, sectionSlots, rowCourse);
          sectionSlots = {};
        }
      }

      if (Object.keys(sectionSlots).length && i === len - 1) {
        // If so submit the previous section if it meets the conditions
        courses[rowCourse].crdt = +rowCrdt;
        courses[rowCourse].addSection(rowSecNo, rowCRN, rowLocation, rowInstructor, sectionSlots, rowCourse);
        sectionSlots = {};
      }
    }
  }
  return courses;
};
