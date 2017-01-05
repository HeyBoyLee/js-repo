//<script type="text/javascript">
    // <![CDATA[
    var createLinkList = function(){
        var _this = {}, first = null , head = null;
        _this.length = 0;
        _this.add = function(val) {
            if(!first)
            {
                head = first = {data:val, next: first || null , pre: first || null};
            }
            else
            {
                var t = first;
                first = {data:val, next: null , pre: null};
                t.next = first;
                first.pre = t;
            }
            _this.length++;
        }
        // --- del
        _this.del = function(val){
            if (first.data == val){
                first = first.next;
                return ;
            }
            var ptemp = temp = first;
            for( ; temp; ptemp = temp ,temp= temp.next){
                if(temp.data == val){
                    ptemp.next = temp.next;
                    _this.length--;
                    return ;
                }
            }
        }
        // --- get
        _this.get = function(val){
            for( var temp = first ; temp; temp= temp.next){
                if(temp.data == val){
                    alert( temp )
                }
            }
        }
        // ---------
        _this.show = function(fn) {
            for(var temp=head;temp;temp=temp.next) {
                fn(temp.data);
            }
        }
        return _this;
    }

    var linksList = createLinkList(); // 创建一个单链表实例
    linksList.add("NowaMagic"); // 向链表添加一个元素
    linksList.add("Gonn");// 再次添加元素
    linksList.add(1);
    function linkslista(){
        var text = '';
        linksList.show(function(data){
            text +='-'+ data;
        });
        //document.getElementById('linkslist').value = text;
        console.log(text);
    }
    linkslista();

    // ]]>
//</script>

