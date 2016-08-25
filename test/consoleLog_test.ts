// Ad-hoc test of consoleLog.ts
// Run with:
//  npm run compile && DEBUG=yes node test/consoleLog_test.js

import * as consoleLog from "../src/consoleLog";

console.log("Console should show the same line 5 times");
console.log("A BB CCC D  EE");
consoleLog.free("A", "BB", "CCC", "D  EE");
consoleLog.fixed([0, 0, 0, 0], "A", "BB", "CCC", "D  EE");
consoleLog.fixed([], "A", "BB", "CCC", "D  EE");
consoleLog.fixed([1, 2, 3, 5], "AAAAAA", "BBBBBB", "CCCCCCC", "D  EE");
consoleLog.fixed([0, 0, 0, 2, 0], "A", "BB", "CCC", "D", "EE");
