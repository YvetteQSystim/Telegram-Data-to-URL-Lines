// ------------------------------------------------------------------------------------------------

// 函数定义
// 主要分为 普通模式、正则模式、转义模式，当然应该还有别的模式但是我没有加上去
// 这些不同的模式下做的相同的事情可以用一个函数去复用的，只是多一个参数罢了。

// ------------------------------------------------------------------------------------------------

// 文本处理相关函数

// ✅删除筛选的文本行
function Delete_Lines(strModule, strFilter) {
	document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选工具栏中的内容
	if (strModule == "Normal")						// 普通匹配👈
		document.Filter(strFilter, 0, 0, 0, 0, 0, 0, 0);		
	if (strModule == "Regex")						// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceRegExp, 0, 0, 0, 0, 0);
	if (strModule == "Escape")						// 转义匹配👈
		document.Filter(strFilter, 0, eeFindReplaceEscSeq, 0, 0, 0, 0, 0);
    document.selection.SelectAll();					// 👉全选
    document.selection.DeleteLeft(1);				// 👉删除
    document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选栏中的内容
}

// ✅提取符合筛选条件的文本行
function Extract_Lines(strModule, strFilter) {
	document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选栏中的内容
	if (strModule == "Normal")						// 普通匹配👈
		document.Filter(strFilter, 0, 0, 0, 0, 0, 0, 0);
	if (strModule == "Regex")						// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceRegExp, 0, 0, 0, 0, 0);		
	if (strModule == "Escape")						// 转义匹配👈
		document.Filter(strFilter, 0, eeFindReplaceEscSeq, 0, 0, 0, 0, 0);
	editor.ExecuteCommandByID(3928);				// 👉提取所有行
}

// ✅提取符合筛选条件的文本行并覆盖原有的所有文本行
function Overlay_Lines(strModule, strFilter) {
	editor.ExecuteCommandByID(3912);				// 👉将焦点设置在筛选工具栏
	if (strModule == "Normal")						// 普通匹配👈
		document.Filter(strFilter, 0, 0, 0, 0, 0, 0, 0);
	if (strModule == "Regex")						// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceRegExp, 0, 0, 0, 0, 0);
	if (strModule == "Escape")						// 正则匹配👈
		document.Filter(strFilter, 0, eeFindReplaceEscSeq, 0, 0, 0, 0, 0);
	document.selection.SelectAll();					// 👉全选
	document.selection.Cut();						// 👉剪切
	editor.ExecuteCommandByID(3912);				// 👉将焦点设置在筛选工具栏
	document.Filter("", 0, 0, 0, 0, 0, -1, -1);		// 👉清空筛选工具栏中的内容
	document.selection.SelectAll();					// 👉全选
	document.selection.Paste(eeCopyUnicode);		// 👉粘贴覆盖
}

// ✅字符串替换
function Replace_Words(strModule,strFind, strReplace) {
	if (strModule == "Normal")
		document.selection.Replace(strFind, strReplace, eeReplaceAll, 0);
	if (strModule == "Regex")
		document.selection.Replace(strFind, strReplace, eeReplaceAll | eeFindReplaceRegExp, 0);
	if (strModule == "Escape")
		document.selection.Replace(strFind, strReplace, eeReplaceAll | eeFindReplaceEscSeq, 0);
}

// ------------------------------------------------------------------------------------------------

// 格式处理相关函数

// 删除重复行 & 按字母升序排序
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
		editor.ExecuteCommandByID(22528);	// 英文逗号制表
	if (strTable == ";")
		editor.ExecuteCommandByID(22530);	// 分号制表
	if (strTable == "|")
		editor.ExecuteCommandByID(22532);	// 竖线制表
	else
		editor.ExecuteCommandByID(22529);	// 制表符 \t 制表
	// 因为在 EmEditor 中不能做到所有字符当作制表符，于是只好将最原始的 制表符制表 的情况放到 else 中。
}

// 取消制表
function UnMake_Table() {
	editor.ExecuteCommandByID(4472);		// 标准模式，即文本模式
}

// ------------------------------------------------------------------------------------------------

// 吐槽
// 在 EmEditor 中，有很多的 Javascript 的语法没有办法实现
// 比如 import fetch 等等，在 V8 模式下是不支持的

// ------------------------------------------------------------------------------------------------

// 比如
// ❓如何在 javascript 文件中调用另一个 javascript 中的函数？
// 🔗https://stackoverflow.com/questions/15276672/how-to-use-a-function-across-multiple-js-files
// 🔗https://www.cnblogs.com/xhliang/p/11765223.html
// 🔗https://stackoverflow.com/questions/36919916/shared-javascript-file-with-different-definitions-of-a-function-call
// 🤔 这个方法没有尝试，但是可能在 EmEditor 中也不能用罢。
// 怎么说呢，很难不流汗啊