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

// 字符处理相关函数

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

// 文本排版相关函数

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

// 网址个性化处理相关函数

// ------------------------------------------------------------------------------------------------

// 网络黑名单

// 需要注意的是，黑名单不宜过短，过短则会误杀一些有用的网址
// 如果筛选的词语真的很短，最好是加上 dot 符号来区别一下
// 🔴🔴🔴🔴很遗憾，目前的这个黑名单只能说讲究能用，但是这个黑名单其实还没有形成体系，只能是在实践中不断尝试。

function Delete_Blacklist() {
	// 1 电商平台
	// 资料参考：全球主流跨境电商平台汇总（超全）🔗https://zhuanlan.zhihu.com/p/411087832
	Delete_Lines("Normal","jd.");									// 京东，这里最好加上一个 dot ，只有两个字母很容易误杀
	Delete_Lines("Normal","taobao.");								// 淘宝
	Delete_Lines("Normal","meituan.");								// 美团
	Delete_Lines("Normal","goofish.");								// 咸鱼
	Delete_Lines("Normal","pinduoduo.");							// 拼多多
	Delete_Lines("Normal","jinritemai.");							// 抖店
	Delete_Lines("Normal","douyin.");								// 抖音
	Delete_Lines("Normal","suning.");								// 苏宁易购
	Delete_Lines("Normal","dangdang.");								// 当当
	Delete_Lines("Normal","amazon.");								// Amazon
	Delete_Lines("Normal","ebay.");									// eBay
	Delete_Lines("Normal","aliexpress.");							// 速卖通
	Delete_Lines("Normal","walmart.");								// 沃尔玛

	// 2 手机为代表的移动端
	// 👉👉苹果公司相关服务
	Delete_Lines("Normal","apple");									// 
	Delete_Lines("Normal","iphone");								// 
	Delete_Lines("Normal","ipad");									// 
	Delete_Lines("Normal","airpod");								// 
	Delete_Lines("Normal","icloud");								// 
	Delete_Lines("Normal","imac");									// 这里使用 imac 可以是可以，但是很容易误杀一些别的网站，因为 imac 这个词可以在别的词中出现
	Delete_Lines("Normal","eclecticlight");							// 和苹果公司相关的网站，页面设计和艺术水平很高，但是对我来说并不重要
	Delete_Lines("Normal","9to5mac");								// 苹果公司相关新闻推送
	Delete_Lines("Normal","macrumors");								// 苹果公司相关新闻推送
	Delete_Lines("Normal","macstories");							// 苹果产品相关资讯
	Delete_Lines("Normal","macsofter");								// Mac 电报
	// 👉👉谷歌公司相关服务
	Delete_Lines("Normal","google");								// 
	Delete_Lines("Normal","9to5google");							// 
	Delete_Lines("Normal","play.google");							// 
	Delete_Lines("Normal","android");								// 
	Delete_Lines("Normal","f-droid.org");							// 
	// 👉👉别的一些手机产品
	Delete_Lines("Normal","mobile");								// 
	Delete_Lines("Normal","samsung");								// 三星
	Delete_Lines("Normal","sammobile");								// 三星
	Delete_Lines("Normal","oneplus");								// 一加
	Delete_Lines("Normal","oppo");									// OPPO
	Delete_Lines("Normal","vivo");									// VIVO
	Delete_Lines("Normal","hihonor");								// 荣耀
	Delete_Lines("Normal","meizu");									// 魅族
	Delete_Lines("Normal","huawei.com");							// 华为，但是我同时想要保留华为云服务

	// 3 流媒体 | 泛用性客户端
	Delete_Lines("Regex","//((?!mp\\.weixin).)*\\.qq\\.com");		// 腾讯，同时保留微信公众号文章
	Delete_Lines("Normal","netflix");								// Netflix
	Delete_Lines("Normal","disney");								// Disney
	Delete_Lines("Normal","kuaishou");								// 快手
	Delete_Lines("Normal","douyu");									// 斗鱼
	Delete_Lines("Normal","sina");									// 新浪
	Delete_Lines("Normal","weibo");									// 微博
	Delete_Lines("Normal","facebook");								// Facebook
	Delete_Lines("Normal","ghxi.com");								// 果核剥壳
	Delete_Lines("Normal","hupu");									// 虎扑
	Delete_Lines("Normal","xiaoyuzhoufm");							// 小宇宙
	Delete_Lines("Normal","instagram");								// Instagram
	Delete_Lines("Normal","tiktok");								// TikTok

	// 4 网课 | 知识付费 | 硬件付费
	Delete_Lines("Normal","dji.com");								// 大疆
	Delete_Lines("Normal","coding.imooc.com");						// 慕课网
	Delete_Lines("Normal","cloud");									// 云服务
	Delete_Lines("Normal","acwing");								// Acwing 卖计算机课程
	Delete_Lines("Normal","smzdm.com");								// 什么值得买网站
	Delete_Lines("Normal","zhaniker");								// 宅客网
	Delete_Lines("Normal","chongdiantou");							// 充电头网，质量其实不错但是我不是很关心
	Delete_Lines("Normal","chinese.engadget.com");					// Engadget 网，质量其实不错但是我不是很关心

	// ------------------------------------------------------------------------------------------------

	// 我不需要的网址 | 低质量网站 | 我不爱看的网站 | 游戏类网站 | 记录别人数据的网站

	// 游戏类
	Delete_Lines("Normal","epicgames");								// Epic Game
	Delete_Lines("Normal","steampowered");							// 游戏
	Delete_Lines("Normal","game");									// 游戏
	Delete_Lines("Normal","store.steampowered.com");				// STEAM 游戏
	Delete_Lines("Normal","xbox.com");								// Xbox 游戏

	Delete_Lines("Normal","speedtest");								// 测速工具，我暂时不需要，主要是别人的数据快照
	Delete_Lines("Normal","imgur.com");								// 截图保存网站，我不需要，主要是别人的数据快照
	Delete_Lines("Normal","lrepacks.net");							// 俄文，看不懂
	Delete_Lines("Normal","iois.me");								// 我没有订阅他们的 NewsLetter
	Delete_Lines("Normal","://paste");								// 代码片段托管
	Delete_Lines("Normal","pixiv.net");								// pixiv
	Delete_Lines("Normal","fishpi.cn");								// 这个论坛网站感觉不怎么样
	Delete_Lines("Normal","ruike1.com");							// 这个论坛网站感觉也是不怎么样
	Delete_Lines("Normal","zoom.us");								// Zoom
	Delete_Lines("Normal","ldqk.xyz");								// 🤔这个群聊的信息不要加入
	Delete_Lines("Normal","douban");								// 豆瓣
	Delete_Lines("Normal","live.bilibili.com");						// B站直播 🔴需要把别的的直播源给加上，比如央视的
	Delete_Lines("Normal","space.bilibili.com");					// B站相关 🤔我其实在想，到底要不要放弃 B站 ?
	Delete_Lines("Normal","tzsucai.com");							// 这个是素材网站，我暂时不需要
	Delete_Lines("Normal","spendtest.net");							// ❓
	Delete_Lines("Normal","kuaizhan");								// 快赞
	Delete_Lines("Normal","nhentai.net");							// 色色的东西

	// 🤔适合主动搜索而不是被动吸收内容的网站
	Delete_Lines("Normal","52pojie.cn");							// 52 破解 容易出现 too many request 的问题，有需求再去了解吧。
	Delete_Lines("Normal","fars.ee");								// 
	Delete_Lines("Normal","ithome");								// IT 之家
	Delete_Lines("Normal","wiki");									// Wiki
	Delete_Lines("Normal","en.cppreference.com");					// 当你知道 cppreference 怎么使用之后，主动打开最好。
	Delete_Lines("Normal","v2ex.com");								// v2ex 社区
	Delete_Lines("Normal","sohu.com");								// 搜狐
	Delete_Lines("Normal","ahhhhfs.com");							// 一个个人资源站点
	Delete_Lines("Normal","bugs.");									// bugs 🔴这个关键词我还是需要去确认一下

	// 网盘类 | 下载类
	Delete_Lines("Normal","baidu");									// 百度
	Delete_Lines("Normal","163.com");								// 163 网盘
	Delete_Lines("Normal","download.csdn.net");						// csdn资料下载，csdn 还不至于到所有的内容都是垃圾
	Delete_Lines("Normal","123pan.com");							// 123 网盘，质量一般
	Delete_Lines("Normal","lanzou");								// 蓝奏网盘
	Delete_Lines("Normal","yunpanziyuan.com");						// 云盘资源
	Delete_Lines("Normal","ziyuanluntan.com");						// 资源论坛

	// 报纸类 | 新闻类
	// 有些报纸的订阅制对于目前的我来说不适用，有些报纸我没有想过养成习惯去看
	Delete_Lines("Normal","news.");									// 
	Delete_Lines("Normal","zaobao.com");							// 联合早报
	Delete_Lines("Normal","bloomberg.com");							// 彭博社
	Delete_Lines("Normal","cn.nikkei.com");							// 日本经济新闻中文版
	Delete_Lines("Normal","cn.yna.co.kr");							// 韩联社
	Delete_Lines("Normal","fortune.com");							// 这个报纸内容可以免费看，但是我不想看
	Delete_Lines("Normal","ftchinese.com");							// FT 中文网
	Delete_Lines("Normal","nytimes.com");							// New York Times
	Delete_Lines("Normal","wsj.com");								// 华尔街日报
	Delete_Lines("Normal","edition.cnn");							// CNN
	Delete_Lines("Normal","jiemian.com");							// 界面新闻
	Delete_Lines("Normal","wallstreetcn.com");						// 华尔街见闻
	Delete_Lines("Normal","bbc.com");								// BBC
	Delete_Lines("Normal","reuters.com");							// 路透社
	Delete_Lines("Normal","ft.com");								// Financial Times
	Delete_Lines("Normal","cna.com");								// 中央社一手新闻


	// 打不开的网址
	Delete_Lines("Normal","archive.org");							// 
	Delete_Lines("Normal","cnbeta.com");							// cnbeta 已经寄了
	Delete_Lines("Normal","fuqing.ch");								// 
	Delete_Lines("Normal","gg0.net");								// 
	Delete_Lines("Normal","jikipedia.com");							// 小鸡词典已经寄了
	Delete_Lines("Normal","pozou");									// 破走游戏论坛
	Delete_Lines("Normal","tategaki.de");							// 
	Delete_Lines("Normal","thepaper.cnewsDetail");					// cnbeta 已经寄了
	Delete_Lines("Normal","vmovier.com");							// 
	Delete_Lines("Normal","youpanso");								// 
	Delete_Lines("Normal","ip.jiangxianli.com");					// 危险网站
	Delete_Lines("Normal","ifanr.com");								// 这个网站有的时候打得开，有的时候打不开，但是质量其实一般般

	// 手机端链接
	Delete_Lines("Normal","//m.");									// 这里一定要加上 "/" ，要区别 com 和 medium 等单词
	Delete_Lines("Normal","mobile");								// 

	// 🔴🔴🔴🔴待整理的网站
	Delete_Lines("Normal","noisevip.cn");							// 
	Delete_Lines("Normal","money.udn.com");							// 
	Delete_Lines("Normal","vipc6.com");								// 
	Delete_Lines("Normal","videogameschronicle.com");				// 
	Delete_Lines("Normal","vgtime.com");							// 
	Delete_Lines("Normal","toptal.com");							// 
	Delete_Lines("Normal","rfi.fr");								// 
	Delete_Lines("Normal","gsnew.com");								// 看电影的
	Delete_Lines("Normal","3c.ltn.com");							// 
	Delete_Lines("Normal","3g.china.com");							// 
	Delete_Lines("Normal","115.com");								// 
	Delete_Lines("Normal","bbs.fuyuan6.com");						// 
	Delete_Lines("Normal","hostloc.com");							// 
	Delete_Lines("Normal","godbolt.org");							// 
	Delete_Lines("Normal","423down.com");							// 
	Delete_Lines("Normal","zxxk.com");								// 
	Delete_Lines("Normal","1point3acres.com");						// 
	Delete_Lines("Normal","cool3c.com");							// 
	Delete_Lines("Normal","dianbo.org");							// 
	Delete_Lines("Normal","fjhn.net");								// 
	Delete_Lines("Normal","phononix.com");							// 
	Delete_Lines("Normal","scmn.com");								// 
	Delete_Lines("Normal","tzsncai.com");							// 
	Delete_Lines("Normal","vmonier.com");							// 
	Delete_Lines("Normal","ypsnare.com");							// 
	Delete_Lines("Normal","zndn.com");								// 
	Delete_Lines("Normal","fjha.net");								// 瑞士电信股票

	// 素材网站
	Delete_Lines("Normal","58pic.com");								// 58 素材网站
	Delete_Lines("Normal","cgown.com");								// CG 素材网站


	// ------------------------------------------------------------------------------------------------

	// 高深的内容 | 技术相关但是细枝末节的内容 等等

	// RSS 相关
	Delete_Lines("Normal","rsshub.app");							// RssHub 这个网址适合主动搜寻
	Delete_Lines("Normal","/feed");									// 
	Delete_Lines("Normal","/atom");									// 
	Delete_Lines("Normal",".atom");									// 

	// Github 相关
	Delete_Lines("Normal","/compare/");								// 
	Delete_Lines("Normal","/commit/");								// 
	Delete_Lines("Normal","/issues/");								// 
	Delete_Lines("Normal","/pull/");								// 
	Delete_Lines("Normal","/releases/");							// 
	Delete_Lines("Normal","/discussions/");							// 

	// Telegram 相关
	Delete_Lines("Normal","t.me/addtheme");							// 界面主题
	Delete_Lines("Normal","t.me/addstickers");						// 贴纸
	Delete_Lines("Normal","t.me/addemoji");							// 表情包
	Delete_Lines("Normal","t.me/setlanguage");						// 语言
	Delete_Lines("Normal","t.me/proxy?server=");					// 这个和代理相关
	Delete_Lines("Normal","t.me/socks?server=");					// 这个和代理相关

	// 代理相关
	Delete_Lines("Normal","v1.mk");									// 节点相关
	Delete_Lines("Normal","://xn");									// 一元机场
	Delete_Lines("Normal","vps");									// vps
	Delete_Lines("Normal","racknerd");								// VPS 商家

	// Matlab 相关
	Delete_Lines("Normal","matlab");								// Matlab
	Delete_Lines("Normal","mathworks");								// Matlab 产品相关网站 
	Delete_Lines("Normal","ww2.mathworks.cn");						// Matlab 产品相关网站

	// Linux 相关
	// 我目前是在 WSL2 上安装 Ubuntu-22.04 来完成日常的一些工作，是 Linux 新手
	Delete_Lines("Normal","macOS");									// MacOS
	Delete_Lines("Normal","archlinux");								// Arch Linux
	Delete_Lines("Normal","redhat");								// RedHat
	Delete_Lines("Normal","mozilla");								// 火狐
	Delete_Lines("Normal","firefox");								// 火狐
	Delete_Lines("Normal","gentoo");								// Gentoo

	// ------------------------------------------------------------------------------------------------

	// 不想下载文件链接
	// 常见文件格式参考：https://docs-cn.eagle.cool/article/18-what-file-formats-does-eagle-support?categoryId=5-category
	// 图片
	Delete_Lines("Normal",".avif");									// 
	Delete_Lines("Normal",".base64");								// 
	Delete_Lines("Normal",".bmp");									// 
	Delete_Lines("Normal",".eps");									// 
	Delete_Lines("Normal",".gif");									// 
	Delete_Lines("Normal",".heic");									// 
	Delete_Lines("Normal",".heif");									// 
	Delete_Lines("Normal",".hif");									// 
	Delete_Lines("Normal",".icns");									// 
	Delete_Lines("Normal",".ico");									// 
	Delete_Lines("Normal",".insp");									// 
	Delete_Lines("Normal",".jfif");									// 
	Delete_Lines("Normal",".jpe");									// 
	Delete_Lines("Normal",".jpeg");									// 
	Delete_Lines("Normal",".jpg");									// 
	Delete_Lines("Normal",".jxl");									// 
	Delete_Lines("Normal",".png");									// 
	Delete_Lines("Normal",".svg");									// 
	Delete_Lines("Normal",".tif");									// 
	Delete_Lines("Normal",".tiff");									// 
	Delete_Lines("Normal",".ttf");									// 
	Delete_Lines("Normal",".webp");									// 
	// 3D相关
	Delete_Lines("Normal",".3ds");									// 
	Delete_Lines("Normal",".3mf");									// 
	Delete_Lines("Normal",".blender");								// 
	Delete_Lines("Normal",".dae");									// 
	Delete_Lines("Normal",".fbx");									// 
	Delete_Lines("Normal",".glb");									// 
	Delete_Lines("Normal",".ifc");									// 
	Delete_Lines("Normal",".obj");									// 
	Delete_Lines("Normal",".ply");									// 
	Delete_Lines("Normal",".stl");									// 
	// 贴图
	Delete_Lines("Normal",".dds");									// 
	Delete_Lines("Normal",".exr");									// 
	Delete_Lines("Normal",".hdr");									// 
	Delete_Lines("Normal",".tga");									// 
	// 源文件
	Delete_Lines("Normal",".Principle");							// 
	Delete_Lines("Normal",".afdesign");								// 
	Delete_Lines("Normal",".afphoto");								// 
	Delete_Lines("Normal",".afpub");								// 
	Delete_Lines("Normal",".ai");									// 
	Delete_Lines("Normal",".c4d");									// 
	Delete_Lines("Normal",".cdr");									// 
	Delete_Lines("Normal",".clip");									// 
	Delete_Lines("Normal",".dwg");									// 
	Delete_Lines("Normal",".fig");									// 
	Delete_Lines("Normal",".graffle");								// 
	Delete_Lines("Normal",".idml");									// 
	Delete_Lines("Normal",".indd");									// 
	Delete_Lines("Normal",".indt");									// 
	Delete_Lines("Normal",".mindnode");								// 
	Delete_Lines("Normal",".psb");									// 
	Delete_Lines("Normal",".psd");									// 
	Delete_Lines("Normal",".psdt");									// 
	Delete_Lines("Normal",".pxd");									// 
	Delete_Lines("Normal",".sketch");								// 
	Delete_Lines("Normal",".skp");									// 
	Delete_Lines("Normal",".skt");									// 
	Delete_Lines("Normal",".xd");									// 
	Delete_Lines("Normal",".xmind");								// 
	// 视频
	Delete_Lines("Normal",".avi");									// 
	Delete_Lines("Normal",".m4v");									// 
	Delete_Lines("Normal",".mov");									// 
	Delete_Lines("Normal",".mp4");									// 
	Delete_Lines("Normal",".mpg");									// 
	Delete_Lines("Normal",".webm");									// 
	Delete_Lines("Normal",".wmv");									// 
	// 音频
	Delete_Lines("Normal",".aac");									// 
	Delete_Lines("Normal",".flac");									// 
	Delete_Lines("Normal",".m4a");									// 
	Delete_Lines("Normal",".mp3");									// 
	Delete_Lines("Normal",".ogg");									// 
	Delete_Lines("Normal",".wav");									// 
	// 字体
	Delete_Lines("Normal",".otf");									// 
	Delete_Lines("Normal",".ttc");									// 
	Delete_Lines("Normal",".ttf");									// 
	Delete_Lines("Normal",".woff");									// 
	// RAW
	Delete_Lines("Normal",".3fr");									// 
	Delete_Lines("Normal",".arw");									// 
	Delete_Lines("Normal",".cr2");									// 
	Delete_Lines("Normal",".cr3");									// 
	Delete_Lines("Normal",".crw");									// 
	Delete_Lines("Normal",".dng");									// 
	Delete_Lines("Normal",".erf");									// 
	Delete_Lines("Normal",".mrw");									// 
	Delete_Lines("Normal",".nef");									// 
	Delete_Lines("Normal",".nrw");									// 
	Delete_Lines("Normal",".orf");									// 
	Delete_Lines("Normal",".otf");									// 
	Delete_Lines("Normal",".pef");									// 
	Delete_Lines("Normal",".raf");									// 
	Delete_Lines("Normal",".raw");									// 
	Delete_Lines("Normal",".rw2");									// 
	Delete_Lines("Normal",".sr2");									// 
	Delete_Lines("Normal",".srw");									// 
	Delete_Lines("Normal",".x3f");									// 
	// 办公
	Delete_Lines("Normal",".doc");									// 
	Delete_Lines("Normal",".docx");									// 
	Delete_Lines("Normal",".eddx");									// 
	Delete_Lines("Normal",".emmx");									// 
	Delete_Lines("Normal",".key");									// 
	Delete_Lines("Normal",".numbers");								// 
	Delete_Lines("Normal",".pages");								// 
	// Delete_Lines("Normal",".pdf");									// PDF 文件应当保留查看
	Delete_Lines("Normal",".potx");									// 
	Delete_Lines("Normal",".ppt");									// 
	Delete_Lines("Normal",".pptx");									// 
	Delete_Lines("Normal",".txt");									// 
	Delete_Lines("Normal",".xls");									// 
	Delete_Lines("Normal",".xlsx");									// 
	// (+)压缩包
	Delete_Lines("Normal",".7z");									// 
	Delete_Lines("Normal",".apk");									// 
	Delete_Lines("Normal",".dmg");									// 
	Delete_Lines("Normal",".exe");									// 
	Delete_Lines("Normal",".gz");									// 
	Delete_Lines("Normal",".rar");									// 
	Delete_Lines("Normal",".tgz");									// 
	Delete_Lines("Normal",".zip");									// 
	// (+)别的格式
	Delete_Lines("Normal",".bin");									// 
	Delete_Lines("Normal",".deb");									// 
	Delete_Lines("Normal",".sh");									// 
	Delete_Lines("Normal",".txt");									// 
	Delete_Lines("Normal",".yaml");									// 
	Delete_Lines("Normal",".api");									// 
	Delete_Lines("Normal",".msi");									//
}

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
// 
function Delete_Parameters_And_Anchors() {
	Replace_Words("Regex","\\?", "\\n");					// ?
	Replace_Words("Regex","#", "\\n");						// #
	Replace_Words("Regex","@", "\\n");						// @
	Replace_Words("Regex", "&", "\\n");						// &
	Replace_Words("Regex", "\\/\\n", "\\n");				// 删除网址尾部的多余的斜杠
	Overlay_Lines("Normal",URL_Front);						// 提取需要的网址
}

// ------------------------------------------------------------------------------------------------

