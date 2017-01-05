function Field(val){
  this.value = val;
}
Field.prototype = {
  get value(){
    console.log('get');
    return this._value;
  },
  set value(val){
    console.log('set');
    this._value = val;
  }
};
var field = new Field("test");
field.value="test2";

console.log(field.value);