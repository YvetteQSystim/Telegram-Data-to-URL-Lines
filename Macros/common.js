// ------------------------------------------------------------------------------------------------

// 吐槽
// EmEditor 目前在某些方面还不是很支持 Javascript 语言的语法实现。
// 比如，目前的 V8 和已有的宏存在不兼容的问题。
// 比如，有些 EmEditor 的宏方法是和光标的位置有关系的，这在某些场景是很人性化，但是在宏运行的时候不小心移动光标会影响结果，这会带来困扰。
// 比如，如何在 javascript 文件中调用另一个 javascript 中的函数这个问题，在 EmEditor 中使用的是 #include "<filename>" ，但是 import fetch 等命令在 EmEditor 中是不支持的。
// 所以，很难不流汗😅

// ------------------------------------------------------------------------------------------------

// 这个文件罗列宏命令文件的公用函数定义。
// 关于字符处理相关的函数，主要是 普通模式(Noemal)、正则模式(Regex)和转义模式(Escape)三种，调用函数的时候若没有指认第一个参数的话，默认都是 Normal 模式。
// 关于文本排版相关的函数，基本上是可以完全通用的。
// 另外一些关于网址个性化处理的函数也放入了本文件中，之后如果再增加一两个网址处理的函数，则会考虑新建一个 "URL Analysis.js" 文件单独存放

// ------------------------------------------------------------------------------------------------

// 🪴 字符处理相关函数

// ------------------------------------------------------------------------------------------------

// 删除筛选的文本行
function Delete_Lines(strModule, strFilter) {
	document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选工具栏中的内容
	if (strModule == "Regex")						// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceRegExp, 0, 0, 0, 0, 0);
	else if (strModule == "Escape")					// 转义匹配👈
		document.Filter(strFilter, 0, eeFindReplaceEscSeq, 0, 0, 0, 0, 0);
	else											// 普通匹配（默认）👈
		document.Filter(strFilter, 0, 0, 0, 0, 0, 0, 0);
    document.selection.SelectAll();					// 👉全选
    document.selection.DeleteLeft(1);				// 👉删除
    document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选栏中的内容
}

// 提取符合筛选条件的文本行
function Extract_Lines(strModule, strFilter) {
	document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选栏中的内容
	if (strModule == "Regex")						// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceRegExp, 0, 0, 0, 0, 0);		
	else if (strModule == "Escape")					// 转义匹配👈
		document.Filter(strFilter, 0, eeFindReplaceEscSeq, 0, 0, 0, 0, 0);
	else											// 普通匹配（默认）👈
		document.Filter(strFilter, 0, 0, 0, 0, 0, 0, 0);
	editor.ExecuteCommandByID(3928);				// 👉提取所有行
}

// 提取符合筛选条件的文本行并覆盖原有的所有文本行
function Overlay_Lines(strModule, strFilter) {
	editor.ExecuteCommandByID(3912);				// 👉将焦点设置在筛选工具栏
	if (strModule == "Regex")						// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceRegExp, 0, 0, 0, 0, 0);
	else if (strModule == "Escape")					// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceEscSeq, 0, 0, 0, 0, 0);
	else											// 普通匹配（默认）👈
		document.Filter(strFilter, 0, 0, 0, 0, 0, 0, 0);
	document.selection.SelectAll();					// 👉全选
	document.selection.Cut();						// 👉剪切
	editor.ExecuteCommandByID(3912);				// 👉将焦点设置在筛选工具栏
	document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选工具栏中的内容
	document.selection.SelectAll();					// 👉全选
	document.selection.Paste(eeCopyUnicode);		// 👉粘贴覆盖
}

// 字符串替换
function Replace_Words(strModule,strFind, strReplace) {
	if (strModule == "Regex")						// 正则替换👈
		document.selection.Replace(strFind, strReplace, eeReplaceAll | eeFindReplaceRegExp, 0);
	else if (strModule == "Escape")					// 转义替换👈
		document.selection.Replace(strFind, strReplace, eeReplaceAll | eeFindReplaceEscSeq, 0);
	else											// 普通替换（默认）👈
		document.selection.Replace(strFind, strReplace, eeReplaceAll, 0);
}

// ------------------------------------------------------------------------------------------------

// 🪴 文本排版相关函数

// ------------------------------------------------------------------------------------------------

// 删除重复行 & 按字母升序排序
// 这个函数一般在整个流程的尾部加上就足够了，数据处理的中间过程用不用这个函数其实无所谓
function Clean_Text() {
	document.DeleteDuplicates("", 0);		// 删除重复行
	editor.ExecuteCommandByID(4477);		// 按字母升序排序
}

// 删除缩进
function Delete_Indent() {
	document.selection.SelectAll();			// 全选
	document.selection.UnIndent();			// 取消缩进
}

// 制表
function Make_Table(strTable) {
	if (strTable == ",")
		editor.ExecuteCommandByID(22528);	// 英文逗号制表👈
	else if (strTable == ";")
		editor.ExecuteCommandByID(22530);	// 分号制表👈
	else if (strTable == "|")
		editor.ExecuteCommandByID(22532);	// 竖线制表👈
	else
		editor.ExecuteCommandByID(22529);	// 制表符 \t 制表（默认）👈
}

// 取消制表
function UnMake_Table() {
	editor.ExecuteCommandByID(4472);		// 标准模式，即文本模式
}

// ------------------------------------------------------------------------------------------------

// 🪴 网址个性化处理相关函数

// ------------------------------------------------------------------------------------------------

// 从文本行中提取网址 - 直接将网址从文本行中提取出来，然后覆盖原来已有的文本

function Extract_URLs_From_Lines(strFilter) {
	// strFilter 这个参数可以缺省，也可以规定
	if (strFilter != null)
		URL_Front = strFilter;
	else
		URL_Front = "https://";

	// 处理头部，直接在网址前面加上换行
	Replace_Words("Regex","https","\\nhttps");				// 网址前面加上换行
	Overlay_Lines("Normal", URL_Front);						// 提取 URL_Front

	// 处理尾部，统一使用正则替换为换行符
	// 此处删除的仅仅是网址的尾部的一些没有意义的字符，这些字符往往是网址后面紧接着出现的字符
	// 有很多网址仅仅是，比如网址的尾部是否有 / 而被当作两个网址看待，这个是不行的
	// 需要说明的是，此处的尾部处理不会删除网址中自带的定位信息（如参数和锚点），即 ? # & @ 等符号
	// 这些定位信息的删除可以使用下面的 Delete_Parameters_And_Anchors() 函数
	// 一方面，对于不会出现在网址中间的字符，直接正则替换为换行符即可
	Replace_Words("Regex"," ", "\\n");						// 空格
	Replace_Words("Regex","\\|", "\\n");					// 竖线
	Replace_Words("Regex","\\\\", "\\n");					// 反斜杠
	Replace_Words("Regex",",", "\\n");						// 英文逗号
	Replace_Words("Regex",";", "\\n");						// 英文分号
	Replace_Words("Regex","\"", "\\n");						// 英文双引号
	Replace_Words("Regex","'", "\\n");						// 英文单引号
	Replace_Words("Regex","\\(", "\\n");					// 英文左小括号
	Replace_Words("Regex","\\)", "\\n");					// 英文右小括号
	Replace_Words("Regex","\\[", "\\n");					// 英文左中括号
	Replace_Words("Regex","\\]", "\\n");					// 英文右中括号
	Replace_Words("Regex","{", "\\n");						// 英文左大括号
	Replace_Words("Regex","}", "\\n");						// 英文右大括号
	// 另一方面，对于可能出现在网址中间的字符，需要多匹配一个换行符来加以精确匹配网址尾部字符
	Replace_Words("Regex","\\.\\n", "\\n");					// 英文句号
	Replace_Words("Regex", "/\\n", "\\n");					// /

	// 最后载覆盖原有的文本
	Overlay_Lines("Normal",URL_Front);						// 提取 URL_Front
}

// ------------------------------------------------------------------------------------------------

// 删除网址的内部定位消息

// 👉🔗https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#%E5%8F%82%E6%95%B0
// 网址内部的参数和锚点其实是有特殊符号的格式的，只需要正则替换掉 ? # @ & = 等符号就可以删除掉网址内部的定位信息

function Delete_Parameters_And_Anchors() {
	Replace_Words("Regex","\\?", "\\n");					// ?
	Replace_Words("Regex","#", "\\n");						// #
	Replace_Words("Regex","@", "\\n");						// @
	Replace_Words("Regex", "&", "\\n");						// &
	Replace_Words("Regex", "\\/\\n", "\\n");				// 删除网址尾部的多余的斜杠
	Overlay_Lines("Normal",URL_Front);						// 提取需要的网址
}

// ------------------------------------------------------------------------------------------------

