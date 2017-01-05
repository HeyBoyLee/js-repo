namespace java com.miui.metok.thrift.LocationQueryService

struct Location {
    1: required double lat;
    2: required double lng;
}

struct AddressComponent {
    1: required i32 infocode;   // 结果响应代码： 1 OK；  0： 无结果数据
    2: string province;         // 省份
    3: string city;             // 城市
    4: string district;         // 区县
    5: string districtCode;     // 区县代码
}

exception NotFoundException {
    1: i32 status;      // 均为404
    2: string message;  // 均为Not Found
}

exception MetokQueryException {
    1: i32 status;      // 400 | 401 | 500
    2: string message;  // 请求参数错误 | 无权限 | 内部错误
}

service LocationQuery {
    Location locTokenQuery(1: string locToken, 2: string key) throws (1: MetokQueryException qe; 2: NotFoundException ne)
    AddressComponent addrTokenQuery(1: string locToken, 2: string key) throws (1: MetokQueryException qe; 2: NotFoundException ne)
}
