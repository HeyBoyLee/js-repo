//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

Point.foo = 6;
let p = new Point(1,2);

//Object.assign(Point.prototype , {foo:5});
let x =Reflect.ownKeys(Object.getPrototypeOf(p));
x;

var y = Object.create({foo: 1});
y;
