// var data = [4, 8, 15, 16, 23, 42, 12];

function getCatagory (data) {
	var counts = {'A':0,'B':0,'C':0,'D':0,'E':0,'F':0,'G':0, 'H':0,'I':0,'J':0,'K':0,'N':0,'O':0,'P':0,'R':0,
            'S':0,'T':0,'U':0,'V':0,'X':0,'Z':0};
    // var arcinnerResult = {};
    var arcCount = {};
    var arcResult = [];
    var i = 0;
    for (i in data){
    	counts[data[i].catagory]++;
    }
    i = 0;
    for(var key in counts){
    	if(counts[key]!=0){
    		arcResult[i]={};
    		arcResult[i]["catagory"]=key;
    		arcResult[i]["angle"]=counts[key];
    		i++;

    	}
	}

    return arcResult;
};


var timeformat = d3.time.format("%Y%m%d");
var monthformat = d3.time.format("%Y-%m");
var monthNameFormat = d3.time.format("%B");
var time = timeformat.parse(book_nodes["children"][1]["borrow_date"]);
var month = monthformat(time);
// console.log(time);
// console.log(month);
// console.log(book_nodes["children"][1]["borrow_date"]);

var getmonth = function  (data) {
	var result = {};
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
	var countMonth = 0;
	// var count = 0;
	var dataLength = data.length;
	for(i = 0; i < dataLength; i++){
		// console.log("hello");
		if(!data[i].num){
			data[i].num = 1;
			data[i].yearMonth = monthformat(timeformat.parse(data[i]["borrow_date"]));
		};
		if(data[i]["borrow_date"]){
			var tempMonth1 = timeformat.parse(data[i]["borrow_date"]).getMonth();
			if(data[parseInt(i)+1]){
				var tempMonth2 = timeformat.parse(data[parseInt(i)+1]["borrow_date"]).getMonth();	
				// console.log(tempMonth1 + "," + tempMonth2);		
			}
			else{
				// console.log("hello world");
				// console.log(tempMonth1 + ',' + tempMonth2);
				data.push({"num": 20-countMonth,"catagory": "Q","name":"没借书的时间段","yearMonth": data[i].yearMonth});
				// dataLength++;
				// countMonth = 0;
				break;
			};
		}
		else{
			// console.log("the rest");
					// count++;
		// console.log(count);
			continue;
		};
		// console.log(tempMonth1 + ','+ tempMonth2);
		if(tempMonth1 == tempMonth2)
		{
			countMonth = countMonth + 1;
			// console.log("countMonth when equal"+countMonth);
		}
		else{

			data.splice(parseInt(i)+1, 0, {"num": 20-countMonth,"catagory": "Q","name":"没借书的时间段","yearMonth":data[i].yearMonth});
			dataLength++;
			// console.log()
			countMonth = 0;
			// console.log
		};
		// console.log(tempMonth1);
		// console.log("count: ");



	};
	return data;
}


var innerResult = getCatagory(book_nodes["children"]);
var outerResult = getmonth(book_nodes["children"]);
// console.log(outerResult);
var colors2 = {'A':'#eac5ff','B':'#f7b2f2','C':'#fc90d5','D':'#f752b4','E':'#ef0686','F':'#f22111','G':'#ea3e0a',
        'H':'#f4550f','I':'#f7760d','J':'#fcce08','K':'#f9e70b','N':'#d9e021','O':'#bced07','P':'#89d309','Q':'#666666','R':'#123456',
        'S':'#5bbc06','T':'#21cef7','U':'#3cb9e5','V':'#3ea2ce','X':'#5fddd7','Z':'#12ada9'};
var colors = {'A':'rgb(247,178,242)','B':'rgb(252,144,213)','C':'rgb(247,82,180)','D':'rgb(239,6,134)','E':'rgb(242,33,17)','F':'rgb(244,85,15)','G':'rgb(247,118,13)',
        'H':'rgb(252,206,8)','I':'rgb(180,221,11)','J':'rgb(137,211,9)','K':'rgb(91,188,6)','N':'rgb(76,147,6)','O':'rgb(48,214,190)','P':'rgb(18,173,169)','Q':'rgb(122,122,122)','R':'rgb(137,232,247)',
        'S':'rgb(33,206,247)','T':'rgb(60,185,229)','U':'rgb(62,162,206)','V':'rgb(20,147,138)','X':'rgb(14,100,165)','Z':'rgb(45,133,168)'};
var catagoryIndex = {
	'A':'思政',
	'B':'哲学宗教',
	'C':'社会科学总论',
	'D':'政治法律',
	'E':'军事',
	'F':'经济',
	'G':'文体科教',
	'H':'语言文字',
	'I':'文学',
	'J':'艺术',
	'K':'历史地理',
	'N':'自然科学总论',
	'O':'数理科学和化学',
	'P':'天文学,地球科学',
	'Q':'没有借书',
	'R':'生物技术',
	'S':'农业科学',
	'T':'工业技术',
	'U':'交通运输',
	'V':'航空航天',
	'X':'环境科学,安全科学',
	'Z':'综合性图书',
};

var width = 600;
var height = 600;
var outerRadius = width/2;
var innerRadius = width/3;
var center = width/2;
// Make the data suitable for the pie
var innerRing = d3.layout.pie()
					.value(function(d)
						{
							return d.angle;
						})
					.padAngle(function(d){
						return 0.01
					})
					.startAngle(0)
					.sort(null);
var outerRing = d3.layout.pie()
					.value(function(d)
						{
							return d.num;
						})
					.startAngle(0)
					.sort(null);
//append the svg
var svg = d3.select(".chart").append("svg")
							.attr("width",width)
							.attr("height",height);
// use the path of svg to draw the arc
var innerarc = d3.svg.arc()
			.outerRadius(outerRadius/2)
			.innerRadius(innerRadius/4);

var outerarc = d3.svg.arc()
			.outerRadius(outerRadius)
			.innerRadius(innerRadius);

var outerarcs = svg.selectAll("g.outerarc")
			.data(outerRing(outerResult))
			.enter()
			.append("g")
			.attr("class","outerarc")
			// translate to the center of svg
			.attr("transform", "translate(" + center + "," + center + ")");

var innerarcs = svg.selectAll("g.innerarc")
			.data(innerRing(innerResult))
			.enter()
			.append("g")
			.attr("class","innerarc")
			// translate to the center of svg
			.attr("transform", "translate(" + center + "," + center + ")");



outerarcs.append("path")
	.attr("fill",function(d,i){
		// console.log(d);
		return colors[d["data"]["catagory"]];
	})
	
	.attr("class", function(d,i){
		return d["data"]["catagory"];
	})
	.style("opacity","1")
	.on("click",outerclick)
	.transition()
	.delay(function(d,i){
		return i * 10;
	})
	.duration(100)
	.attr("d", outerarc);


innerarcs.append("path")
	.attr("fill",function(d,i){
		// console.log(d);
		// console.log(innerResult);
		return colors[d["data"]["catagory"]];
	})
	.on("mouseover",mouseover)
	.on("click",innerclick)
	.on("mouseout",mouseleave)
	.style("opacity","1")
	// .attr("d", function(d){
	// 	// console.log(d);
	// 	return innerarc(d);
	// })
	.attr("class", function(d,i){
		return d["data"]["catagory"];
	})
	.transition()
	.delay(function(d,i){
		return i * 130;
	})
	.duration(500)
	.attr('d',function(d){
		return innerarc(d);
	});

	d3.select(".chart").on("mouseleave",mouseleave);
	d3.select(".chart").append("div").attr("class", "infoWindow");

function mouseover(d){
	var temp = d3.select(this).attr("class");
	d3.selectAll("path").transition()
					.duration(500)
					.style("opacity",0.3);
	d3.selectAll("path").filter(function(d){
		// console.log(d);
		return d["data"]["catagory"] == temp;
	}).transition()
	.duration(500)
	.style("opacity",1);
}

function innerclick(d){
	console.log(d);
	d3.select(".infoWindow")
					.attr("id","infoWindow")
					// .style("display","true")
					.html(function(){
						console.log(d["data"]["catagory"]);
						return catagoryIndex[d["data"]["catagory"]] + '\n' +'数目: '+ d.value;
					})
					.on("click",function(){
						d3.select(".infoWindow").transition()
										.duration(500)
										.attr("id","info");
					})
}

function outerclick(d){
	console.log(d);
	d3.select(".infoWindow")
					.attr("id","infoWindow2")
					// .style("display","true")
					.html(function(){
						console.log(d["data"]["catagory"]);
						return d["data"]["name"] + '\n' +'时间: '+ d["data"]['yearMonth'];
					})
					.on("click",function(){
						d3.select(".infoWindow")
						.transition()
						.duration(500)
						.attr("id","info");
					})
}

function mouseleave(d){
	d3.selectAll("path").transition()
					.duration(500)
					.style("opacity",1);
}
