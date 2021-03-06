# d3-pie-demo

a data visualization of some data from the library, using the pie layout of the d3 library including some tips of using the pie layout

---

##Description:
这是一个D3实线饼状图的demo,效果图如下,数据是一个人在图书馆的借书数据,内圈把所有借过的书进行童妓,表示的是不同类别的书所占比例的大小,外圈表示按时间顺序排列下来的借书记录,按月分,灰色部分表示没有借书的时间段,其他颜色表示各个类别的书
##Presentation:
默认视图,会有扇子展开的动态效果:
![default](http://7xiieb.com1.z0.glb.clouddn.com/default.png)
鼠标悬停特效,显示某一类别书在时间轴上的分布:
![default](http://7xiieb.com1.z0.glb.clouddn.com/hover.png)
点击事件:内圈点击出现类别和书的数目,外圈点击相应条段会显示书籍信息以及借阅时间,
![default](http://7xiieb.com1.z0.glb.clouddn.com/click.png)
##Data:
原始数据:lxy.csv
处理文件:preprocess.py(别人写的,我做了修改)
结果文件:nodes2.js
```
{name:"大学物理学习题详解", catagory:"O", interval:"86", borrow_date:"20120906", return_date:"20121201"},
{name:"固体物理学基础", catagory:"O", interval:"73", borrow_date:"20141018", return_date:"20141230"},
{name:"2010考研数学核心题型， 理工类·数学二", catagory:"O", interval:"68", borrow_date:"20140503", return_date:"20140710"},
{name:"考研数学单选题解题方法与技巧", catagory:"O", interval:"68", borrow_date:"20140503", return_date:"20140710"},
{name:"应用流体力学", catagory:"O", interval:"64", borrow_date:"20130825", return_date:"20131028"},
```
##实现算法:
外圈的实现还是让我脑疼了一段时间;

* 需求: 按月分,按时间排序,时间的起止时间为数据文件里的最早时间和最晚时间,每个月内不同的颜色表示不同类别的书,该类别书数目越多则色条越宽.
* 初始想法: 由于色条宽度和类别有关,要统计每类在每月的分布,然后每个月本身可能还会有空余,得把留空体现出来,感觉得先画一个圈表示所用的空余时间,然后再用借书的圈来覆盖,觉得这种双层的效果并不好实现,
* 最终想法: 先把数据按照借阅时间排序,然后给每本书定一个大小为一的衡量角度的值,把每本书按照借阅时间在圆环上排序,此时每本书都等宽,然后就来分月份,每个月的剩余天数用20减去前面统计的本月所借书的数目,把剩余天数插入每个月最后借的那本书后面,最终实现按月排布的效果,并且避免了可能的双层的麻烦
* **具体实现:**
* 首先用冒泡排序把书目按照借阅时间的顺序排个序;
```
    for(var i = data.length - 1; i >= 0; i--){
		for (var j = 0; j < i; j++) {
			var temp1 = timeformat.parse(data[i]["borrow_date"]);
			var temp2 = timeformat.parse(data[j]["borrow_date"]);
			if (temp1 < temp2) {
				var temp = data[i];
				data[i] = data[j];
				data[j] = temp;
			};			
		};
	};
```

* 然后就是如何去插入月份空余,注释很清楚啦!
```
	//用于计算本月空余时间
	var countMonth = 0;
	var dataLength = data.length;
	for(i = 0; i < dataLength; i++){
		//给每条数据定义一个衡量角度的值num = 1,
		if(!data[i].num){
			data[i].num = 1;
			data[i].yearMonth = monthformat(timeformat.parse(data[i]["borrow_date"]));
		};
		//判断这条数据是不是刚刚添加的该月空余
		if(data[i]["borrow_date"]){
			var tempMonth1 = timeformat.parse(data[i]["borrow_date"]).getMonth();
			//判断是否是最后一条数据,保证数据有效
			if(data[parseInt(i)+1]){
				var tempMonth2 = timeformat.parse(data[parseInt(i)+1]["borrow_date"]).getMonth();		
			}
			//最后一条数据的话就直接在后面添加该月的空余
			else{
				data.push({"num": 20-countMonth,"catagory": "Q","name":"没借书的时间段","yearMonth": data[i].yearMonth});
				//结束循环
				break;
			};
		}
		//若是空余时间就直接跳过
		else{
			continue;
		};
		//判断前后记录是不是同一个月,用来判断是否该添加本月空余
		if(tempMonth1 == tempMonth2)
		{
			//用来计算最终的空余时间
			countMonth = countMonth + 1;
		}
		else{
			//添加本月空余,20是我自定义的数
			data.splice(parseInt(i)+1, 0, {"num": 20-countMonth,"catagory": "Q","name":"没借书的时间段","yearMonth":data[i].yearMonth});
			//数据条数增加
			dataLength++;
			//借阅数目归0
			countMonth = 0;
		};
	};
```
##饼图的123
* 饼图绘制 = 数据转换(d3.layout.pie,将普通数据转换成适合饼图绘制的数据) + 绘制图形(添加"path")
* 数据转换后的格式:
value是决定该块区域所跨越的角度的衡量值
data为用户传递的数据
```
data: Object
    borrow_date: "20111224"
    catagory: "H"
    interval: "62"
    name: "基础德语"
    num: 1
    return_date: "20120224"
    yearMonth: "2011-12"
    __proto__: Object
endAngle: 0.7428396422281287
padAngle: 0
startAngle: 0.7325224249749602
value: 1
```
* d3.layout.pie()默认只接受一个数组,要想传递其他信息,则得设置其访问器的value值,如下:d是传入的数据,格式随意,但d.population得构成一个数组!
```
var pie = d3.layout.pie()
    .value(function(d){ return d.population; });
```
* d3的饼图会默认将内容按照大小按从大到小的顺序来排列,在我这个项目里我要自定义顺序时,得禁用这自动排序.用sort(null):[问题链接](http://stackoverflow.com/questions/17169504/pie-donut-chart-segment-order-in-d3)
```
var outerRing = d3.layout.pie()
					.value(function(d)
						{
							return d.num;
						})
					.startAngle(0)
					.sort(null);
```


##关于d3.js
* 参考链接:
    * [数据可视化专题站](http://www.ourd3js.com/wordpress/):我所见的最好的中文教程
    * [饼图参考](http://www.ourd3js.com/wordpress/?p=190):解决了我许多问题
    * [饼图参考2](http://bl.ocks.org/kerryrodden/7090426)

---

- 李辉   
- helicese@gmail.com
- 热爱学习的前端小兵,欢迎前来交流讨论
- 2015.6.11



