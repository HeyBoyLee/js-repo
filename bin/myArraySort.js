"use strict";function CompareForSort(r,t){return r==t?0:r<t?-1:1}var test=require("./test"),a=new Array(4,11,2,10,3,1),b=a.sort(CompareForSort);