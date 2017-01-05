"use strict";

var test = require("./test");
var a = new Array(4, 11, 2, 10, 3, 1);

// This is ASCII character order.
// Output: 1,10,11,2,3,4)

// Sort the array elements with a function that compares array elements.
var b = a.sort(CompareForSort);
// Output: 1,2,3,4,10,11.

// Sorts array elements in ascending order numerically.
function CompareForSort(first, second) {
  if (first == second) return 0;
  if (first < second) return -1;else return 1;
}