var HOSTURL = 'http://mahavastu.com/mitalumni/';
$(document).on('pageinit','#list',function(){

	var output = $('ul#userList');
	console.log('pageinit '+output.length);
	$.ajax({
		url: HOSTURL+'apis/userslist.php',
		dataType: 'jsonp',
		// jsonp: 'jsoncallback',
		timeout: 5000,
		success: function(data, status){
			if(data.status==1){
				$.each(data.user, function(i,item){ 
					var landmark = '<li class="ui-li-has-thumb"><a href="#" class="ui-btn"><img src="js/'+HOSTURL+item.photo+'" /><small>'+item.current_occupation+'</small><h2>'+item.full_name+'</h2>'
					+ '<p>'+item.email+'<br>'
					+ item.mobile+'</p><div class="ui-li-aside"><strong>'
					+ item.passing_year + '</strong><br><small>Batch</small></div></a></li>';
					
					output.append(landmark);
				});
			}
			
		},
		error: function(){
			output.html('<li>There was an error loading the data.</li>');
		}
	});
});
