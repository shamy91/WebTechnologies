
var Markit = {};
                    
Markit.InteractiveChartApi = function (symbol, duration) {
    this.symbol = symbol.toUpperCase();
    this.duration = duration;
    this.PlotChart();
};

Markit.InteractiveChartApi.prototype.PlotChart = function () {

    var params = {
        parameters: JSON.stringify(this.getInputParams())
    };

    //Make JSON request for timeseries data
    $.ajax({
        beforeSend: function () {
            $("#highchart").text("Loading chart...");
        },
        data: {parameters: this.symbol},
        url: " own-url-for-making-php-calls-to-API",
        dataType: "json",
        context: this,
        success: function (json) {
            //Catch errors
            if (!json || json.Message) {
                window.console.error("Error: ", json.Message);
                return;
            }
            this.render(json);
        },
        error: function (response, txtStatus) {
            window.console.log(response, txtStatus);
        }
    });
};

Markit.InteractiveChartApi.prototype.getInputParams = function () {
    return {
        Normalized: false,
        NumberOfDays: this.duration,
        DataPeriod: "Day",
        Elements: [
            {
                Symbol: this.symbol,
                Type: "price",
                Params: ["ohlc"]
            }
        ]
    };
};

Markit.InteractiveChartApi.prototype._fixDate = function (dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
};

Markit.InteractiveChartApi.prototype._getOHLC = function (json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]) {

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = this._fixDate( dates[i] );
              var pointData = [
                    dat,
                    elements[0].DataSeries['open'].values[i],
                    elements[0].DataSeries['high'].values[i],
                    elements[0].DataSeries['low'].values[i],
                    elements[0].DataSeries['close'].values[i]
                ];
                chartSeries.push( pointData );  

        };
    }
    return chartSeries;
};



Markit.InteractiveChartApi.prototype.render = function(data) {
    var ohlc = this._getOHLC(data);

    // set the allowed units for data grouping
    var groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
    ], [
        'month',
        [1, 3, 6]
    ]];

    // create the chart
    $('#highchart').highcharts('StockChart', {

        rangeSelector: {

                buttons: [{
                    type: 'week',
                    count: 1,
                    text: '1w'
                    },{
                    type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'ytd',
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
            selected: 0,
            inputEnabled : false
        },

        title: {
            text: this.symbol + ' Stock Value'
        },

        yAxis: [{
            title: {
                text: 'Stock Value'
            },
            height: 200,
            lineWidth: 2
        }],

        series: [{
            type: 'area',
            name: this.symbol,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            },
            fillColor : {
                linearGradient : {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops : [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }],
        exporting: { enabled: false },

        credits: {
            enabled:false
        }
    });
};
        
var time,amt,sym,change,chp;
var charturl='http://chart.finance.yahoo.com/t?s=';
var markcap="";
var cname="";
var stockyes = false;

function clinput() {
    document.getElementById("details").innerHTML="";
    document.getElementById("highchart").innerHTML="";
    document.getElementById("news").innerHTML="";
    document.getElementById("symb").nodeValue="";
    document.getElementById("nex").disabled=true;
    $('.carousel').carousel(0); 
    document.getElementById("err").style.visibility="hidden";

}

function autorefFunc(){

    for (var i = 0; i < localStorage.length; i++){
        aIt= localStorage.getItem(localStorage.key(i));
        $.ajax({
        type: 'GET',
        url: "own-url-for-making-php-calls-to-API",
        data: { symb: aIt},
        dataType:"json",
        success: function(data) {

                var sm1= data['Symbol'];
                var sprice1 = ((data['LastPrice']).toFixed(2));
                var schange1 = ((data['Change']).toFixed(2));
                var schp1 = ((data['ChangePercent']).toFixed(2));
                var srow1 = document.getElementById(sm1);
                var col1 = srow1.childNodes;
                col1[2].firstChild.nodeValue='$ '+sprice1;
                if(schp1>0 && schange1>0){

                    var favits = col1[3].childElementCount;
                    for(var j=0;j<favits;j++){
                        col1[3].removeChild(col1[3].firstChild);
                    }
                    col1[3].appendChild(document.createElement('span'));
                    col1[3].firstChild.appendChild(document.createTextNode(schange1+' ( '+schp1+'% )'));
                    col1[3].firstChild.setAttribute('class','green');
                    col1[3].appendChild(document.createElement('img'));
                    col1[3].childNodes[1].setAttribute('src',"http://up.png");
                    col1[3].childNodes[1].setAttribute('width','20px');
                    col1[3].childNodes[1].setAttribute('height','20px');


                }
                else if(schp1<0 || schange1<0){

                    var favits = col1[3].childElementCount;
                    for(var j=0;j<favits;j++){
                        col1[3].removeChild(col1[3].firstChild);
                    }
                    col1[3].appendChild(document.createElement('span'));
                    col1[3].firstChild.appendChild(document.createTextNode(schange1+' ( '+schp1+'% )'));
                    col1[3].firstChild.setAttribute('class','red');
                    col1[3].appendChild(document.createElement('img'));
                    col1[3].childNodes[1].setAttribute('src',"http://down.png");
                    col1[3].childNodes[1].setAttribute('width','20px');
                    col1[3].childNodes[1].setAttribute('height','20px');
                }
                else if(schp1>0 || schange1>0){

                    var favits = col1[3].childElementCount;
                    for(var j=0;j<favits;j++){
                        col1[3].removeChild(col1[3].firstChild);
                    }
                    col1[3].appendChild(document.createElement('span'));
                    col1[3].firstChild.appendChild(document.createTextNode(schange1+' ( '+schp1+'% )'));
                    col1[3].firstChild.setAttribute('class','green');
                    col1[3].appendChild(document.createElement('img'));
                    col1[3].childNodes[1].setAttribute('src',"http://up.png");
                    col1[3].childNodes[1].setAttribute('width','20px');
                    col1[3].childNodes[1].setAttribute('height','20px');
                }
                else{
                    var favits = col1[3].childElementCount;
                    for(var j=0;j<favits;j++){
                        col1[3].removeChild(col1[3].firstChild);
                    }
                    col1[3].appendChild(document.createTextNode(schange1+' ( '+schp1+'% )'));
                }

            }
        });
    }
}            

function fillfav(s){

    if(s===undefined){

            for (var i = 0; i < localStorage.length; i++){
                thissym= localStorage.getItem(localStorage.key(i));
                $.ajax({
                    type: 'GET',
                    url: "own-url-for-making-php-calls-to-API",
                    data: { symb: thissym},
                    dataType:"json",
                    success: function(data) {
                        if(data['Status']=="SUCCESS"){

                                var table = document.getElementById("favlist");
                                var row = table.insertRow(-1);
                                row.id=data['Symbol'];
                                var cell1 = row.insertCell(0);
                                var cell2 = row.insertCell(1);
                                var cell3 = row.insertCell(2);
                                var cell4 = row.insertCell(3);
                                var cell5 = row.insertCell(4);
                                var cell6 = row.insertCell(5);
                                var LP = data['LastPrice'];
								LP=LP.toFixed(2);
                                var C = data['Change'];
                                C = (C).toFixed(2);
                                var CP = data['ChangePercent'];
                                CP = (CP).toFixed(2);
                                $('<a href="#"></a>').html(data['Symbol']).appendTo(cell1).click(function(){ stockyes=true; document.getElementById("nex").disabled=false; $('.carousel').carousel(1); stockdet(data['Symbol']);});
                                cell2.innerHTML = data['Name'];
                                cell3.innerHTML = '$ '+LP;
                              if(data['ChangePercent']>0){

                                  cell4.innerHTML = '<span class="green">'+C+' ( '+CP+'% )</span><img src="http://up.png" width="20px" height="20px"/>';

                              }
                              else if(data['ChangePercent']<0){

                                  cell4.innerHTML = '<span class="red">'+C+' ( '+CP+'% )</span><img src="http://down.png" width="20px" height="20px"/>';

                              }
                              else{

                                  cell4.innerHTML = '<span>'+C+' ( '+CP+'% )</span>';
                              }
                                var MC = data['MarketCap'];
                                MC=MC/1000000000;
                                var NMC=0;
                                if(MC<1)
                                    NMC = MC*1000;
                                if(MC<1){
                                    if(NMC<1){
                                       cell5.innerHTML = (data['MarketCap']).toFixed(2);
                                    }
                                    else{
                                        cell5.innerHTML = ((NMC).toFixed(2))+' Million';
                                    }
                                }     
                                else{
                                     cell5.innerHTML = ((MC).toFixed(2))+' Billion';
                                }
                               
                                cell6.innerHTML='<button type="button" id="'+data['Symbol']+'" class="trash"><span class="glyphicon glyphicon-trash"></span></button>';
                        }
                    }
                 }); 
            }  
      }
      else{
					s=s.toUpperCase();
                    $.ajax({
                        type: 'GET',
                        url: "own-url-for-making-php-calls-to-API",
                        data: { symb: s},
                        dataType:"json",
                        success: function(data) {
                            if(data['Status']=="SUCCESS"){
                                
                                var table = document.getElementById("favlist");
                                var row = table.insertRow(-1);
                                row.id=data['Symbol'];
                                var cell1 = row.insertCell(0);
                                var cell2 = row.insertCell(1);
                                var cell3 = row.insertCell(2);
                                var cell4 = row.insertCell(3);
                                var cell5 = row.insertCell(4);
                                var cell6 = row.insertCell(5);
                                var LP = data['LastPrice'];
								LP=LP.toFixed(2);
                                var C = data['Change'];
                                C = (C).toFixed(2);
                                var CP = data['ChangePercent'];
                                CP = (CP).toFixed(2);
                                $('<a href="#"></a>').html(data['Symbol']).appendTo(cell1).click(function(){stockyes=true; document.getElementById("nex").disabled=false; $('.carousel').carousel(1); stockdet(data['Symbol']);});
                                cell2.innerHTML = data['Name'];
                                cell3.innerHTML = '$ '+LP;
                              if(data['ChangePercent']>0){

                                  cell4.innerHTML = '<span class="green">'+C+' ( '+CP+'% )</span><img src="http://up.png" width="20px" height="20px"/>';

                              }
                              else if(data['ChangePercent']<0){

                                  cell4.innerHTML = '<span class="red">'+C+' ( '+CP+'% )</span><img src="http://down.png" width="20px" height="20px"/>';

                              }
                              else{

                                  cell4.innerHTML = '<span>'+C+' ( '+CP+'% )</span>';
                              }

                            
                               var MC = data['MarketCap'];
                                MC=MC/1000000000;
                                var NMC=0;
                                if(MC<1)
                                    NMC = MC*1000;
                                if(MC<1){
                                    if(NMC<1){
                                       cell5.innerHTML = (data['MarketCap']).toFixed(2);
                                    }
                                    else{
                                        cell5.innerHTML = ((NMC).toFixed(2))+' Million';
                                    }
                                }     
                                else{
                                     cell5.innerHTML = ((MC).toFixed(2))+' Billion';
                                }
                                
                                cell6.innerHTML='<button type="button" id="'+data['Symbol']+'" class="trash"><span class="glyphicon glyphicon-trash"></span></button>';
                            }
                        }
                    });
      }
}

function stockdet(newsym){

	newsym = newsym.toUpperCase();
    if(stockyes==false){
        document.getElementById("err").innerHTML="Select a valid entry";
        document.getElementById("err").style.visibility="visible";
        document.getElementById("nex").disabled=true;
        $('.carousel').carousel(0); 
        $('#details').html(""); 
    }
    else{
            document.getElementById("err").style.visibility="hidden";
            sym = newsym;
            $.ajax({
                type: 'GET',
                url: "own-url-for-making-php-calls-to-API",
                data: { symb:  newsym},
                dataType:"json",
                success: function(data) {
                    if(data['Status']=="SUCCESS"){
                        
                        amt = data['LastPrice'];
						amt= amt.toFixed(2);
                        change = data['Change'];
                        change = ((change).toFixed(2));
                        chp = data['ChangePercent'];
                        chp = ((chp).toFixed(2));
                        cname=data['Name'];
                         var reslist='<table class="table table-nonfluid table-striped table-responsive"><tbody>';
                         reslist+= '<tr><td class="tdquot">Name</td><td class="tdcent">';
                         reslist+=data['Name']+'</td></tr>';
                         reslist+= '<tr><td class="tdquot">Symbol</td><td class="tdcent">';
                         reslist+=data['Symbol']+'</td></tr>';
                         reslist+= '<tr><td class="tdquot">Last Price</td><td class="tdcent">$';
                         reslist+=amt+'</td></tr>';
                         reslist+='<tr><td class="tdquot">Change(Change Percent)</td><td class="tdcent">';
                        if((parseFloat(data['ChangePercent'])>0)&&(parseFloat(data['Change'])>0)){
                             reslist+='<span class="green">';
                             reslist+=change+' ( ';
                             reslist+=chp+'% )</span><img src="http://up.png" width="20px" height="20px"/></td></tr>';
                        }
                        else if((parseFloat(data['ChangePercent'])<0)||(parseFloat(data['Change'])<0)){ 
                            reslist+='<span class="red">';
                            reslist+=change+' ( ';
                            reslist+=chp+'% )</span><img src="http://down.png" width="20px" height="20px"/></td></tr>';
                        }
                        else if((parseFloat(data['ChangePercent'])>0)||(parseFloat(data['Change'])>0)){ 
                            reslist+='<span class="green">';
                            reslist+=change+' ( ';
                            reslist+=chp+'% )</span><img src="http://up.png" width="20px" height="20px"/></td></tr>';
                        }
                        else{
                            reslist+=change+' ( ';
                            reslist+=chp+'% )</td></tr>';
                        }

                        reslist+= '<tr><td class="tdquot">Time and Date</td><td class="tdcent">';
                        var d = data['Timestamp'];
                        reslist+=moment(d).format('D MMMM YYYY, h:mm:ss a')+'</td></tr>';
                        reslist+= '<tr><td class="tdquot">Market Cap</td><td class="tdcent">';
                        var mcap = data['MarketCap'];
                        mcap=mcap/1000000000;
                        var newmcap=0;
                        if(mcap<1)
                            newmcap = mcap*1000;
                        if(mcap<1){
                            if(newmcap<1){
                                markcap=data['MarketCap'];
                                reslist+=markcap+'</td></tr>';
                            }
                            else{
                                markcap=((newmcap).toFixed(2))+' Million';
                                reslist+=markcap+'</td></tr>';
                            }

                        }     
                        else{
                            markcap=((mcap).toFixed(2))+' Billion';
                            reslist+=markcap+'</td></tr>';
                        }

                         reslist+= '<tr><td class="tdquot">Volume</td><td class="tdcent">';
                         reslist+=data['Volume']+'</td></tr>';
                         reslist+= '<tr><td class="tdquot">ChangeYTD(Change Percent YTD)</td><td class="tdcent">';
                         chytd = data['ChangeYTD'].toFixed(2);
                         chpytd = data['ChangePercentYTD'].toFixed(2);
                         if((parseFloat(data['ChangePercentYTD'])>0)&&(parseFloat(data['ChangeYTD'])>0)){
                             reslist+='<span class="green">';
                             reslist+=chytd+' ( ';
                              reslist+=chpytd+'% )</span><img src="http://up.png" width="20px" height="20px"/></td></tr>';
                         }

                        else if((parseFloat(data['ChangePercentYTD'])<0)||(parseFloat(data['ChangeYTD'])<0)){

                            reslist+='<span class="red">';
                            reslist+=chytd+' ( ';
                            reslist+=chpytd+'% )</span><img src="http://down.png" width="20px" height="20px"/></td></tr>';
                        }
                        else if((parseFloat(data['ChangePercentYTD'])>0)||(parseFloat(data['ChangeYTD'])>0)){

                            reslist+='<span class="green">';
                            reslist+=chytd+' ( ';
                            reslist+=chpytd+'% )</span><img src="http://up.png" width="20px" height="20px"/></td></tr>';
                        }
                        else{
                            reslist+=chytd+' ( ';
                            reslist+=chpytd+'% )</td></tr>';
                        }

                         reslist+= '<tr><td class="tdquot">High Price</td><td class="tdcent">$';
                         high = data['High'].toFixed(2);
                         reslist+=high+'</td></tr>';
                         reslist+= '<tr><td class="tdquot">Low Price</td><td class="tdcent">$';
                         low = data['Low'].toFixed(2);
                         reslist+=low+'</td></tr>';
                         reslist+= '<tr><td class="tdquot">Opening Price</td><td class="tdcent">$';
                         vopen = data['Open'].toFixed(2);
                         reslist+=vopen+'</td></tr>';
                        charturl+=newsym;
                        charturl+='&lang=en-US&width=300&height=400';
                        reslist+='</tbody></table>';
						chlist='<img id="chrt" src="http://chart.finance.yahoo.com/t?s=';
                        chlist+=newsym;
                        chlist+='&lang=en-US&width=450&height=400"></img>';

                        $('#details').html(reslist); 
						$('#ychart').html(chlist);
                         document.getElementById("nex").disabled=false; 
						 $('.carousel').carousel(1);
                        //Highchart Stock chart
                        new Markit.InteractiveChartApi(newsym, 1095);
                    }
                    else{
                        document.getElementById("err").innerHTML="No stock data found";
                        document.getElementById("err").style.visibility="visible";
                        document.getElementById("nex").disabled=true;
                        $('.carousel').carousel(0); 
                        $('#details').html(""); 
                        stockyes=false;

                    }

                },
                error: function (response, txtStatus) {
                    document.getElementById("nex").disabled=true;
                    window.console.log("Stock details error."+response+":"+txtStatus);
                    stockyes=false;
                }
            });
        
            //if stock data found, only then call remaining APIs
            if(stockyes==true){
                   
                $.ajax({
                        url: 'http://ajax.googleapis.com/ajax/services/search/news?v=1.0&q='+newsym+'&userip= ',
                        dataType: 'jsonp',
                        success: function (data) {
                                if(data.responseData==null){
                                     $("#news").html("");
                                     $("#news").append("News feed currently unavaliable. Please retry after some time")
                                     window.console.log("Please retry after some time");
                                }
                                else{
                                    var item_html='<ul>';
                                    $("#news").html("");
                                    $.each(data.responseData.results, function (i, e) {
                                        $("#news").append('<div class="well nws">' +'<a href="'+unescape(e.url)+'" target="_blank">'+e.title+'</a><br/>'+ e.content + '<br/><br/><b>Publisher: '+e.publisher+'<br/>Date: '+ e.publishedDate+"</b></div>");
                                    });
                                }        
                        },
                        error: function () {
                            $("#news").html("");
                            $("#news").append("News feed currently unavaliable");
                            window.console.log("Newsfeed not availabe");
                        }
                });
            }
             
             if(newsym==null || newsym=="" || newsym===null){
                    document.getElementById("nex").disabled=true;
             }
             else{

                     document.getElementById("nex").disabled=false;

                     if(localStorage.getItem(newsym)){
						 
                         if($('.fav').find('span').hasClass('star-empty')){
                             $('.fav').find('span').toggleClass('star-empty').toggleClass('star'); 
                         }
						 document.getElementById("stars").style.color="yellow";
                     }
                    else{

                        if($('.fav').find('span').hasClass('star')){
                             $('.fav').find('span').toggleClass('star-empty').toggleClass('star'); 
                         }
                         document.getElementById("stars").style.color="white";
                     }

             }
    }

}


$(document).ready(function() {
      var time;
      var svalue = document.getElementById("symb").value;
      document.getElementById("err").style.visibility="hidden";
      document.getElementById("nex").disabled=true;
      fillfav();
      function log( message ) {
         $( "<div>" ).text( message ).prependTo( "#log" );
         $( "#log" ).scrollTop( 0 );
      }

      $( "#symb" ).autocomplete({

          source: function( request, response ) {

              $.ajax({
                   type: 'GET',
                   url: "own-url-for-making-php-calls-to-API",
                   dataType:"json",
                   data: {
                     input: request.term
                   },
                   success: function( data ) {
                       stockyes=false;
                       response( $.map(data, function(item) {
                            var symstr=$('#symb').val();
                            if(symstr.toUpperCase()==item.Symbol){
                                  stockyes=true;
                            } 
                            return {
                                  label: item.Symbol+' - '+item.Name + " (" +item.Exchange+ ")",
                                  value: item.Symbol,
                            }
                       }));
                    }
               });
          },
          minLength: 1,
          select: function( event, ui ) {
              stockyes=true;
          },
          open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
          },
          close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
          }
      });
	  
	  $('#mainform').submit(function(e){
		  
			e.preventDefault();
		    var val1 = $('#symb').val();
			document.getElementById("nex").disabled=false;
			if(localStorage.getItem(val1)){
				document.getElementById("stars").style.color="yellow";
			}
			else{
				document.getElementById("stars").style.color="white";
			}
			  stockdet(val1);
		  
	  });

       $(".fblink").click(function(){

                      FB.getLoginStatus(function(response) {

                            if (response.status === 'connected') {
                              // Logged into your app and Facebook.
                                FB.ui(
                                 {
                                 method: 'feed',
                                 link: 'http://dev.markitondemand.com/',
                                     name:'Current Stock Price of '+cname+' is $'+amt,
                                     description:'Stock Information of '+cname+'('+sym+')',
                                     caption: 'LAST TRADE PRICE: $'+amt+', CHANGE: '+change+'('+chp+'%)',
                                     picture: charturl,
                                }, 
                                function(response) {
                                    if (response && !response.error_code) {
                                      window.alert('Posted Successfully.');
                                    } else {
                                      window.alert('Not Posted.');
                                    }
                                });
                            } 
                              else {
                              // The person is not logged into Facebook

                                      FB.login(function(response) {
                                      if (response.status === 'connected') {
                                        // Logged into your app and Facebook.
                                              FB.ui(
                                             {
                                             method: 'feed',
                                             link: 'http://dev.markitondemand.com/',
                                                 name:'Current Stock Price of '+cname+' is $'+amt,
                                                 description:'Stock Information of '+cname+'('+sym+')',
                                             caption: 'LAST TRADE PRICE: $'+amt+', CHANGE: '+change+'('+chp+'%)',
                                                 picture: charturl,
                                            }, 
                                            function(response) {
												console.log(response);
                                                if (response && !response.error_code) {
                                                  window.alert('Posted Successfully.');
                                                } else {
                                                  window.alert('Not Posted.');
                                                }
                                            });
                                      } 
                                     else {
                                        // The person is not logged into Facebook
                                         window.alert("Could not log in");
                                      }
                                    },{scope:'public_profile,email'});
                            }
                    }, true);

       }); 
       $("#carousel-example-generic").carousel({
       });

       $('#nex').click(function(){
          $('#carousel-example-generic').carousel("next"); 

       });
       $('#pre').click(function(){
          $('#carousel-example-generic').carousel("prev"); 

       });

    
       $('.fav').click(function(){
           $(this).find('span').toggleClass('star-empty').toggleClass('star');
           if($(this).find('span').hasClass('star')){
			  document.getElementById("stars").style.color="yellow";
              localStorage.setItem(sym, sym);
              fillfav(sym);
           }
           else if($(this).find('span').hasClass('star-empty')){
			   document.getElementById("stars").style.color="white";
               localStorage.removeItem(sym);
               var row = document.getElementById(sym);
               row.parentNode.removeChild(row);
           }
        });


       $('#favlist').on('click', 'button', function() {
          localStorage.removeItem($(this).attr("id"));
          var row = document.getElementById($(this).attr("id"));
          row.parentNode.removeChild(row);
		  if(localStorage.length == 0){
			  document.getElementById("nex").disabled=true;
		  }
       });

       $('#ref').click(function(){

          var sm="";
          var sprice="";
          var schange,schp;
           for (var i = 0; i < localStorage.length; i++){
                    aItem= localStorage.getItem(localStorage.key(i));
                    $.ajax({
                    type: 'GET',
                    url: "own-url-for-making-php-calls-to-API",
                    data: { symb: aItem},
                    dataType:"json",
                    success: function(data) {

                        sm= data['Symbol'];
                        sprice = data['LastPrice'];
						sprice=sprice.toFixed(2);
                        schange = data['Change'];
                        schange=((schange).toFixed(2));
                        schp = data['ChangePercent'];
                        schp=((schp).toFixed(2));
                        var srow = document.getElementById(sm);
                        var col = srow.childNodes;
                        col[2].firstChild.nodeValue='$ '+sprice;
                        if(schp>0 && schange>0){

                            var favits = col[3].childElementCount;
                            for(var j=0;j<favits;j++){
                                col[3].removeChild(col[3].firstChild);
                            }
                            col[3].appendChild(document.createElement('span'));
                            col[3].firstChild.appendChild(document.createTextNode(schange+' ( '+schp+'% )'));
                            col[3].firstChild.setAttribute('class','green');
                            col[3].appendChild(document.createElement('img'));
                            col[3].childNodes[1].setAttribute('src',"http://up.png");
                            col[3].childNodes[1].setAttribute('width','20px');
                            col[3].childNodes[1].setAttribute('height','20px');


                        }
                        else if(schp<0 || schange<0){

                            var favits = col[3].childElementCount;
                            for(var j=0;j<favits;j++){
                                col[3].removeChild(col[3].firstChild);
                            }
                            col[3].appendChild(document.createElement('span'));
                            col[3].firstChild.appendChild(document.createTextNode(schange+' ( '+schp+'% )'));
                            col[3].firstChild.setAttribute('class','red');
                            col[3].appendChild(document.createElement('img'));
                            col[3].childNodes[1].setAttribute('src',"http://down.png");
                            col[3].childNodes[1].setAttribute('width','20px');
                            col[3].childNodes[1].setAttribute('height','20px');
                        }
                        else if(schp>0 || schange>0){

                            var favits = col[3].childElementCount;
                            for(var j=0;j<favits;j++){
                                col[3].removeChild(col[3].firstChild);
                            }
                            col[3].appendChild(document.createElement('span'));
                            col[3].firstChild.appendChild(document.createTextNode(schange+' ( '+schp+'% )'));
                            col[3].firstChild.setAttribute('class','green');
                            col[3].appendChild(document.createElement('img'));
                            col[3].childNodes[1].setAttribute('src',"http://up.png");
                            col[3].childNodes[1].setAttribute('width','20px');
                            col[3].childNodes[1].setAttribute('height','20px');
                        }
                        else{
                            var favits = col[3].childElementCount;
                            for(var j=0;j<favits;j++){
                                col[3].removeChild(col[3].firstChild);
                            }
                            col[3].appendChild(document.createTextNode(schange+' ( '+schp+'% )'));
                        }

                    }
                });

           }
      });

      document.getElementById('autoref').onchange = function() {
            if ( document.getElementById('autoref').checked === true ) {

                time = setInterval(autorefFunc, 5000);
            }
            else{

                clearInterval(time);
            }
      };
	  
	  jQuery(document).on( 'shown.bs.tab', 'a[data-toggle="pill"]', function (e) {
		    jQuery( ".high" ).each(function() {
		        var chart = $('#highchart').highcharts();
		        chart.reflow();
		    });
		});
		
		jQuery(document).on( 'show.bs.tab', 'a[data-toggle="pill"]', function (e) {
			 var chart = $('#highchart').highcharts();
		      chart.reflow();
		});


}); 