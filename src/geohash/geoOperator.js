
var Tools = {};//require('../../../commons/utils.js');
var Combinatorics = {};//require('../../../commons/combinatorics.js');
var combination = {};//Combinatorics.combination;
var bigCombination = {};//Combinatorics.bigCombination;

var default_options = {
  // polygon: [],
  // center: [],
  // radius: 0,
  handleCoord: function(coordRecord){
    return {lng: coordRecord.loc.coordinates[0], lat: coordRecord.loc.coordinates[1]};
  },
  density: 20 // unit: m ; geo gird density; wifi coverage radius better
};

/**
 * @returns {{}}
 */
var extend = function(){
  var resultsObj = {};
  for( var i = 0; i < arguments.length; i++ ){
    var obj = arguments[i];
    for(var n in obj){
      if(obj.hasOwnProperty(n)){
        resultsObj[n] = obj[n];
      }
    }
  }
  return resultsObj;
};

const EARTH_RADIUS = 6378137.0; //unit m
const POLAR_RADIUS = 6356725;  // unit m

/********************************************************/

/**
 * wrap of geo-coordinates with rad
 * @param loc {{lng: number, lat: number}}
 * @constructor
 */
function Location(loc){
  var self = this;
  self.lng = loc.lng;
  self.lat = loc.lat;
  self.radLat = Location.getRad(self.lat);
  self.radLng = Location.getRad(self.lng);
  self.ec = POLAR_RADIUS + (EARTH_RADIUS - POLAR_RADIUS) * (90 - self.lat) / 90;
  self.ed = self.ec * Math.cos(self.radLat);
}

Location.prototype.toJSON = function (){
  var self = this;
  return {lng: self.lng, lat: self.lat, radLat: self.radLat, radLng: self.radLng, ec: self.ec, ed: self.ed};
};

Location.getRad = function (x){
  return x * Math.PI / 180;
};

/********************************************************/

/**
 * Static methods for Geo
 * @constructor
 */
function GeoHelper(){}

/**
 * Enum of Azimuths
 * @type {{North: number, NorthEast: number, East: number, SouthEast: number, South: number, SouthWest: number, West: number, NorthWest: number}}
 */
GeoHelper.Azimuth = {
  North: 0,
  NorthEast: 45,
  East: 90,
  SouthEast: 135,
  South: 180,
  SouthWest: 225,
  West: 270,
  NorthWest: 315
};

/**
 * get distance from locA to locB. unit: m
 * @param locA {{lng: number, lat: number}}
 * @param locB {{lng: number, lat: number}}
 * @returns {number}
 */
GeoHelper.getDistance = function (locA, locB){
  // var locationA = new Location(locA);
  // var locationB = new Location(locB);
  //
  // if (Math.abs(locationA.lat) > 90 || Math.abs(locationB.lat) > 90 ||
  //   Math.abs(locationA.lng) > 180 || Math.abs(locationB.lng) > 180)
  //   throw new RangeError("invalid location range");
  //
  // var latDis = locationA.radLat - locationB.radLat;
  // var lngDis = locationA.radLng - locationB.radLng;
  //
  // var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDis / 2), 2) +
  //     Math.cos(locationA.lat) * Math.cos(locationB.lat) * Math.pow(Math.sin(lngDis / 2), 2)));
  // s = s * EARTH_RADIUS;
  // s = Math.round(s * 100) / 100;
  //
  // return s;

  var f = Location.getRad((locA.lat + locB.lat)/2);
  var g = Location.getRad((locA.lat - locB.lat)/2);
  var l = Location.getRad((locA.lng - locB.lng)/2);
  if(g === 0 && l === 0) return 0;

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s,c,w,r,d,h1,h2,dis;
  var a = EARTH_RADIUS;
  var fl = 1/298.257;

  sg = sg*sg;
  sl = sl*sl;
  sf = sf*sf;

  s = sg*(1-sl) + (1-sf)*sl;
  c = (1-sg)*(1-sl) + sf*sl;

  w = Math.atan(Math.sqrt(s/c));
  r = Math.sqrt(s*c)/w;
  d = 2*w*a;
  h1 = (3*r -1)/2/c;
  h2 = (3*r +1)/2/s;

  dis = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));

  return Math.round(dis * 100) / 100;
};

/**
 * move to another location, use distance and azimuth
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @param azimuth {number|GeoHelper.Azimuth.}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.move = function (loc, distance, azimuth){
  distance = distance || 0;
  azimuth = azimuth || 0;
  var location = new Location(loc);

  var dx = distance * Math.sin(azimuth * Math.PI / 180);
  var dy = distance * Math.cos(azimuth * Math.PI / 180);

  var lng = (dx / location.ed + location.radLng) * 180 / Math.PI;
  var lat = (dy / location.ec + location.radLat) * 180 / Math.PI;

  // return new Location({lng: lng, lat:lat});
  return {lng: lng, lat:lat};
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToSouth = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.South);
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToWest = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.West);
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToEast = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.East);
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToNorth = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.North);
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToNorthEast = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.NorthEast);
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToNorthWest = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.NorthWest);
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToSouthEast = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.SouthEast);
};

/**
 * @param loc {{lng: number, lat: number}}
 * @param distance {number}
 * @returns {{lng: number, lat: number}}
 */
GeoHelper.moveToSouthWest = function (loc, distance){
  return GeoHelper.move(loc, distance, GeoHelper.Azimuth.SouthWest);
};

/**
 * generate range of geo-grid from polygon
 * @param polygon {[[number]|{lng:number,lat:number}]}
 * @returns {{origin: {}, target: {}}}
 */
GeoHelper.getGridRangeFromPolygon = function (polygon){
  polygon = polygon || [];
  var origin = {};
  var target = {};
  polygon.forEach(function (loc){
    var lng = loc instanceof Array ? loc[0] : loc.lng;
    var lat = loc instanceof Array ? loc[1] : loc.lat;

    origin.lat = origin.lat ? (origin.lat > lat ? lat : origin.lat) : lat;
    origin.lng = origin.lng ? (origin.lng > lng ? lng : origin.lng) : lng;

    target.lat = target.lat ? (target.lat < lat ? lat : target.lat) : lat;
    target.lng = target.lng ? (target.lng < lng ? lng : target.lng) : lng;

  });

  return {origin: origin, target: target};
};

/**
 * generate range of geo-grid from circle
 * @param center {[number]|{lng:number,lat:number}}
 * @param radius {number}
 * @returns {{origin: {lng: number, lat: number}, target: {lng: number, lat: number}}}
 */
GeoHelper.getGridRangeFromCircle = function(center, radius){
  // var southContact = GeoHelper.moveToSouth(center, radius);
  // var westContact = GeoHelper.moveToWest(center, radius);
  // var origin = new Location({lng: westContact.lng, lat: southContact.lat});
  var lng = center instanceof Array ? center[0] : center.lng;
  var lat = center instanceof Array ? center[1] : center.lat;
  var origin = GeoHelper.moveToSouthWest({lng: lng, lat: lat}, Math.sqrt(2) * radius);
  var target = GeoHelper.moveToNorthEast({lng: lng, lat: lat}, Math.sqrt(2) * radius);
  //第二 第四 个点
  // 4 3
  // 1 2
  var secondPoint = GeoHelper.moveToSouthEast({lng: lng, lat: lat}, Math.sqrt(2) * radius);
  var fourthPoint = GeoHelper.moveToNorthWest({lng: lng, lat: lat}, Math.sqrt(2) * radius);
  var bounds = [
    [origin.lng, origin.lat],
    [secondPoint.lng, secondPoint.lat],
    [target.lng, target.lat],
    [fourthPoint.lng, fourthPoint.lat]];
  return {origin: origin, target: target, bounds: bounds};
};

/**
 *
 * @param center {[number]|{lng:number,lat:number}}
 * @param radius {number}
 * @param n {number}
 * @returns {[number]|[[number]]}
 */
GeoHelper.getApproximatePolygon = function (center, radius, n){
  if(n < 3) n= 3;
  if(n > 72) n = 72;

  var radStep = 360 / n;
  var lng = center instanceof Array ? center[0] : center.lng;
  var lat = center instanceof Array ? center[1] : center.lat;

  if(radius <= 0){
    return [[lng, lat]]
  }

  var polygon = [];
  for(var i=0; i<n; ++i){
    var rad = radStep * i;
    var p =GeoHelper.move({lng: lng, lat: lat}, radius, rad);
    polygon.push([p.lng, p.lat])
  }
  polygon = Tools.distinctArray(polygon);
  polygon.push(polygon[0]);
  return polygon;
};


/**
 * box of geo-grid frame
 * @param colIndex {number}
 * @param rowIndex {number}
 * @param gridFrame {GeoGridFrame}
 * @param originCoord {{lng: number, lat: number}}
 * @param density {number}
 * @constructor
 */
function GeoGridBox(colIndex, rowIndex, gridFrame, originCoord, density){
  var self = this;
  self.colIndex = colIndex;
  self.rowIndex = rowIndex;
  self.density = density;
  self.gridFrame = gridFrame;
  self._init(originCoord, density)
}

GeoGridBox.prototype._init = function (loc, d){
  var self = this;
  var eastLoc = GeoHelper.moveToEest(loc, d);
  var northLoc = GeoHelper.moveToNorth(loc, d);
  var northEastLoc = GeoHelper.moveToNorthEast(loc, Math.sqrt(2) * d);

  self.center = GeoHelper.moveToNorthEast(loc, Math.sqrt(2) * d / 2);
  self.bounds = {
    leftTop: northLoc,
    leftBottom: loc,
    rightTop: northEastLoc,
    rightBottom: eastLoc
  };
  self.points = [];
  self.covered = false;
};

/**
 * push a location record into geo-grid box
 * @param locRecord {{}} : record object with coord
 */
GeoGridBox.prototype.push = function (locRecord){
  var self = this;
  self.points.push(locRecord)
};

/**
 * get box's neighbors
 * @returns {{left: GeoGridBox, right: GeoGridBox, top: GeoGridBox, bottom: GeoGridBox}}
 */
GeoGridBox.prototype.getNeighbors = function (){
  var self = this;
  if(self.gridFrame){
    return self.gridFrame.getNeighbors(self);
  }
  return {
    left: null,
    right: null,
    top: null,
    bottom: null
  };
};

/**
 * generate mini covering points
 * @param getCoordFunc {function}
 * @returns {Array|*}
 */
GeoGridBox.prototype.miniCoveringPoint = function (getCoordFunc){
  var self = this;
  var points = self.points;
  var center = self.center;
  var density = self.density;

  if(!!self.covered) return self.miniCoverages;
  if(!getCoordFunc) getCoordFunc = function (l){ return l; };
  var miniCoverages = [];
  var covered = false;

  if(points.length === 0){
    self.covered = false;
    self.miniCoverages = miniCoverages;
    return self.miniCoverages;
  }
  else if(points.length === 1){
    miniCoverages.push(points[0]);
    self.covered = true;
    self.miniCoverages = miniCoverages;
    return self.miniCoverages;
  }

  // 找到在网格中间的点（误差: 网格密度的 1/10）
  for(var idx=0; idx<points.length; ++idx){
    var locRecord = points[idx];
    var coord = getCoordFunc(locRecord);
    var distance = GeoHelper.getDistance(center, coord);
    if(Math.ceil(distance) <= Math.ceil(density/10)){
      miniCoverages.push(locRecord);
      covered = true;
      break;
    }
  }

  if(!! covered){
    self.covered = covered;
    self.miniCoverages = miniCoverages;
    return self.miniCoverages;
  }

  // 两两比较距离

  // bigCombination:
  // This option may be a little slower and use a little more memory but can handle a much larger array
  // see https://www.npmjs.com/package/js-combinatorics#bigcombination
  var combinationFunc = points.length > 30 ? bigCombination : combination;
  var pointCombinations = combinationFunc(points, 2);
  var pointCombinationsWithDistance = [];
  pointCombinations.forEach(function (group){
    var locRecordA = group[0];
    var locRecordB = group[1];
    var coordA = getCoordFunc(locRecordA);
    var coordB = getCoordFunc(locRecordB);
    var distance = GeoHelper.getDistance(coordA, coordB);
    pointCombinationsWithDistance.push({locRecordA: locRecordA, locRecordB: locRecordB, distance: distance});
  });

  pointCombinationsWithDistance.sort(function (groupA, groupB){
    return groupB.distance - groupA.distance;
  });

  // 排序后取出距离最远的2点
  var maxDistanceGroup = pointCombinationsWithDistance[0];
  miniCoverages.push(maxDistanceGroup.locRecordA);
  miniCoverages.push(maxDistanceGroup.locRecordB);

  // 如果距离大于边长 density, 小于对角线长, 则 2点即可全覆盖 box
  if(maxDistanceGroup.distance > density &&
    maxDistanceGroup.distance <= (Math.sqrt(2) * density)){
    // return;
  }else {
    // 小于边长,则需要再找出第三点
    var otherPoints = points.filter(function (locRecord){
      return locRecord !== miniCoverages[0] && locRecord !== miniCoverages[1]
    });

    // 找到 otherPoints 中 距离 miniCoverages[0] miniCoverages[1] 最远的点
    var coordA = getCoordFunc(miniCoverages[0]);
    var coordB = getCoordFunc(miniCoverages[1]);
    var tmpMiddleCoord = {lng: (coordA.lng+ coordB.lng)/2, lat: (coordA.lat+ coordB.lat)/2 };
    if(otherPoints.length >0){
      otherPoints.sort(function (pA, pB){
        var coordA = getCoordFunc(pA);
        var coordB = getCoordFunc(pB);
        var distanceA = GeoHelper.getDistance(coordA, tmpMiddleCoord);
        var distanceB = GeoHelper.getDistance(coordB, tmpMiddleCoord);
        return distanceB - distanceA;
      });

      miniCoverages.push(otherPoints[0]);
    }
  }

  self.covered = true;
  self.miniCoverages = miniCoverages;
  return self.miniCoverages;

};

/********************************************************/

/**
 * frame of geo-grid
 * @param origin {{lng: number, lat: number}}: left-bottom location
 * @param target {{lng: number, lat: number}}: right-top location
 * @param d {number}: grid density
 * @constructor
 */
function GeoGridFrame(origin, target, d){
  var self = this;
  var gridBoxes = [];
  if(!origin || ! target) return;
  self.origin = origin;
  self.target = target;
  self.density = d;

  var originLng = origin.lng;
  var originLat = origin.lat;
  var curColIndex = 0, curRowIndex = 0;
  while (originLng < target.lng){
    var gridCol = [];
    while (originLat < target.lat){
      var gridBox = new GeoGridBox(curColIndex, curRowIndex, self, {lat: originLat, lng: originLng}, d);
      gridCol.push(gridBox);
      originLat = gridBox.bounds.leftTop.lat;
      ++curRowIndex;
    }
    gridBoxes.push(gridCol);

    ++curColIndex;
    curRowIndex = 0;
    originLat = origin.lat;
    originLng = gridBox.bounds.rightBottom.lng;
  }
  self.gridBoxes = gridBoxes;
}

/**
 * get grid-box neighbors
 * @param gridBox
 * @returns {{left: GeoGridBox, right: GeoGridBox, top: GeoGridBox, bottom: GeoGridBox}}
 */
GeoGridFrame.prototype.getNeighbors = function (gridBox){
  var self = this;
  var neighbors = {
    left: null,
    right: null,
    top: null,
    bottom: null
  };

  if(gridBox){
    var colIndex = gridBox.colIndex;
    var rowIndex = gridBox.rowIndex;
    var colFrame = self.gridBoxes[colIndex];
    var colFrameLeft = self.gridBoxes[colIndex-1];
    var colFrameRight = self.gridBoxes[colIndex+1];
    if(colFrame){
      neighbors.top = colFrame[rowIndex+1] || null;
      neighbors.bottom = colFrame[rowIndex-1]|| null;
    }
    if(colFrameLeft) neighbors.left = colFrameLeft[rowIndex]|| null;
    if(colFrameRight) neighbors.right = colFrameRight[rowIndex]|| null;
  }

  return neighbors;
};

/**
 * get grid-box by col-index & row-index
 * @param colIndex {number}
 * @param rowIndex {number}
 * @returns {GeoGridBox}
 */
GeoGridFrame.prototype.getGridBox = function (colIndex, rowIndex){
  var self = this;
  var box;
  try{
    box = self.gridBoxes[colIndex][rowIndex];
  }catch (ex){
    box = null;
  }
  return box;
};

/**
 * get grid-box indexes which coord point belongs
 * @param coord
 * @returns {{colIndex: number, rowIndex: number}}
 */
GeoGridFrame.prototype.indexOf = function (coord){
  var self = this;
  var origin = self.origin;
  var d = self.density;

  // 纬线上的投影坐标
  var projectionLatCoord = {lng: coord.lng, lat: origin.lat};
  // 经线上的投影坐标
  var projectionLngCoord = {lng: origin.lng, lat: coord.lat};

  var projectionLatDistance = GeoHelper.getDistance(origin, projectionLatCoord);
  var projectionLngDistance = GeoHelper.getDistance(origin, projectionLngCoord);

  var colIndex = Math.ceil(projectionLatDistance / d) -1;
  var rowIndex = Math.ceil(projectionLngDistance / d) -1;
  return { colIndex: colIndex, rowIndex: rowIndex};
};

/**
 *
 * @param f {function(GeoGridBox=, number=, number=, Array.<T>=)}
 */
GeoGridFrame.prototype.forEach = function (f){
  var self = this;
  for(var colIndex=0; colIndex<self.gridBoxes.length; ++colIndex){
    var col = self.gridBoxes[colIndex];
    for(var rowIndex=0; rowIndex<col.length; ++rowIndex){
      if(f){
        f(col[rowIndex], colIndex, rowIndex, col);
      }
    }
  }
};

/**
 * fill locRecord data into geo-grid
 * @param locRecord
 * @param getCoordFunc
 */
GeoGridFrame.prototype.fillData = function (locRecord, getCoordFunc){
  var self = this;
  var loc;
  if(getCoordFunc){
    loc = getCoordFunc(locRecord);
  }else {
    loc = locRecord;
  }

  var indexes = self.indexOf(loc);
  if(indexes.colIndex > -1 && indexes.rowIndex > -1){
    var box = self.getGridBox(indexes.colIndex, indexes.rowIndex);
    if(box) box.push(locRecord)
  }
};

/********************************************************/

const CoverageType = {
  unknown: 0,
  circle: 1,
  polygon: 2
};

/**
 * Location Set covering Problem (LSCP)
 * @param options {{}}
 * @constructor
 */
function LocationSetCovering(options){
  options = extend(default_options, options || {});
  var self = this;
  self.init(options);
}

LocationSetCovering.prototype.init = function (options){
  options = options || {};
  var self = this;
  self.originLoction = null;
  self.targetLoction = null;
  self.coverage = null;
  self.coverageType = CoverageType.unknown;

  self.getCoord = options.handleCoord;
  self.density = options.density || 20;
  self.coordinatesGridFrame = null;  // instance of GeoGridFrame

  if(options.hasOwnProperty('polygon')){
    self.coverage = options.polygon;
    self.coverageType = CoverageType.polygon;
  }else if(options.hasOwnProperty('center') && options.hasOwnProperty('radius')){
    self.coverage = {center: options.center, radius: options.radius};
    self.coverageType = CoverageType.circle;
  }else{

  }

  self._initRange();
  self._buildGrid();
};

/**
 * generate grid range coordinates.
 * origin: coordinates system O point (left-bottom)
 * target: coordinates system T point (right-top)
 */
LocationSetCovering.prototype._initRange = function (){
  var self = this;
  var gridRange;
  if(self.coverageType === CoverageType.circle){
    var center = self.coverage.center;
    var radius = self.coverage.radius;
    gridRange = GeoHelper.getGridRangeFromCircle(center, radius);
  }else if(self.coverageType === CoverageType.polygon){
    var polygon = self.coverage || [];
    gridRange = GeoHelper.getGridRangeFromPolygon(polygon);
  }

  if(gridRange){
    self.originLoction = gridRange.origin;
    self.targetLoction = gridRange.target;
  }
};

/**
 * build coordinates system grid frame
 */
LocationSetCovering.prototype._buildGrid = function (){
  var self = this;
  if(!self.originLoction || !self.targetLoction) return;

  self.coordinatesGridFrame = new GeoGridFrame(self.originLoction, self.targetLoction, self.density);
};

/**
 * put location records collection into ...
 * @param points {[{}]}
 */
LocationSetCovering.prototype.put = function (points){
  var self = this;
  points = points || [];
  if(self.coordinatesGridFrame instanceof GeoGridFrame ){
    points.forEach(function (point){
      self.coordinatesGridFrame.fillData(point, self.getCoord);
    });
  }
};

/**
 * generate maximal coverages
 * @returns {Array}
 */
LocationSetCovering.prototype.maximalCovering = function (){
  var self = this;
  var maxiCoverages = [];
  if(self.coordinatesGridFrame instanceof GeoGridFrame){
    self.coordinatesGridFrame.forEach(function (geoGridBox){
      var singleBoxCoverages = geoGridBox.miniCoveringPoint(self.getCoord);
      if(!!geoGridBox.covered)
        maxiCoverages = maxiCoverages.concat(singleBoxCoverages);
    });
  }
  return maxiCoverages;
};

exports.GeoGridFrame = GeoGridFrame;
exports.GeoHelper = GeoHelper;
exports.LocationSetCovering = LocationSetCovering;