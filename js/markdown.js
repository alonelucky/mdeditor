void function(){
    window.Markdown = function Markdown(selecter,ops){
        this.parentEle = selecter
        this.selecter = selecter+" textarea"
        if(ops){
            this.width = ops && ops.width || "100%"
            this.height = ops && ops.height || 300
            this.fontSize = ops && ops.fontSize || 16
            this.lineHeight = ops && ops.lineHeight || 1.3
            this.height = ops && ops.height || 300
        }
        void function(that){
            console.log(that)
            // 设置编辑器宽高
            $(that.parentEle).css({
                width:that.width,
                height:that.height
            })
            $(that.selecter).css({
                fontSize:that.fontSize,
                lineHeight:that.lineHeight
            }).addClass("md-body")
            // 处理键盘事件
            $(document).on("keydown",function(e){
                if(e.keyCode==9){
                    e.preventDefault()
                    _tabToSpace(that.selecter)
                }
                _checkKey(e)
            })
            $(document).on("keyup",function(e){
                _checkKey(e)
            })
            // 初始化工具栏
            _setToolsBar(that.parentEle)
            // 绑定事件
            addDocumentEvent("click",that.parentEle+" li.code",function(e){
                $(that.parentEle+" div.preview").css({display:"none"})
            })
            addDocumentEvent("click",that.parentEle+" li.preview",function(e){
                _previewHtml(document.querySelector(that.selecter))
            })
        }(this)
        return this
    }
    
    Markdown.prototype.getHtml=_getHtml
    Markdown.prototype.getMd=_getMd
    Markdown.prototype.getLineNum=_getLineNum
    // 判断ctrl+s,阻止默认保存
    isCtrl = false
    function _checkKey(e){
        if(e.keyCode==17){
            isCtrl = true
        }
        if(e.keyCode==83&&isCtrl){
            e.preventDefault()
            isCtrl=false
        }else{
            idCtrl=false
        }
    }

    // tab插入4个空格,并定位到指定位置
    function _tabToSpace(selecter){
        var element = document.querySelector(selecter)
        _insertSrt(element,"    ")
    }

    // 获取html内容
    function _getHtml(){
        var mdStr = $(this.selecter).val()
        return marked(mdStr)
    }

    // 获取md内容
    function _getMd(){
        return $(this.selecter).val()
    }

    // 获取总行数
    function _getLineNum(){
        return $(this.selecter).val().split("\n").length
    }

    // 工具栏
    function _setToolsBar(parentEle){
        var toolbar = `
        <div class="md-toolbar">
            <ul class="clearfix">
                <li title="markdown" class="code"><i class="fa fa-file-code-o"></i></li>
                <li title="预览" class="preview"><i class="fa fa-newspaper-o"></i></li>
            </ul>
        </div>
        `
        $(parentEle).append(toolbar)
    }

    // 预览图遮罩
    function _previewHtml(textarea){
        var htmlStr = marked(textarea.value)
        var parentEle =  $(textarea).parent()
        if(parentEle.find("div.preview").length>0){
            parentEle.find("div.preview").css({display:"block"}).html(htmlStr)
        }else{
            var _preEle = `<div class="preview">${htmlStr}</div>`
            $(textarea).parent().append(_preEle)
        }
    }

    // 在指定位置插入字符
    function _insertSrt(ele,str){
        if(document.selection){
            // IE 下适用
            ele.focus()
            var sel = document.selection.createRange()
            sel.text = str
            sel.select()
        }else if (ele.selectionStart || ele.selectionStart == "0"){
            // 非IE下适用
            var startPos = ele.selectionStart
            var endPos = ele.selectionEnd
            // 将原有字符截取为两部分
            var beforeVal = ele.value.slice(0,startPos) 
            var afterVal = ele.value.slice(endPos,ele.value.length)
            // 拼接字符并返回
            ele.value = beforeVal + str + afterVal
            // 设置光标开始和结束位置
            ele.selectionStart = startPos + str.length
            ele.selectionEnd = endPos + str.length
            ele.focus()
        }else{
            ele.value += str
            ele.focus()
        }
    }
    // 绑定事件
    function addDocumentEvent(eventType,childEle,handler){
        $(document).on(eventType,childEle,handler)
    }
}()


