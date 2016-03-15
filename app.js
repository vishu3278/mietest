var HOSTURL = 'http://localhost/mitalumni/';
var loggedUserId = 0;
var output = $("#output");
    output.hide();

function loginProcess () {
	var user_email = $("#email").val();
    if (user_email == null || user_email == "") {
        alert("Please Enter Email ID");
    };
    var password = $("#password").val();
    if (password == null || password == "") {
        alert("Please Enter Password");
    };
    var loginobj = {
        "email": user_email,
        "password": password
    };

    

	$.ajax({
		url: HOSTURL+'apis/login.php',
		dataType: 'json',
		data: JSON.stringify(loginobj),
		type : 'POST',
		contentType: 'application/json',		// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function (data, status, jqXHR) {
			// console.log(data);
			if(data.status==1){
				// alert(data.data.user.full_name);
				loggedUserId = data.data.user.user_id;
				localStorage.loggedUserId = data.data.user.user_id;
				// console.log(data.data.user.user_id);
				$.mobile.changePage("#profile", {transition: "slideup"});
			}else{
				// alert(data.msg);
				output.html("<p>Something went wrong while processing the ajax request.</p>").show("fast").delay(5000).hide("slow");
			}
		},
		error: function(x,y,z){
			alert('An error has occurred:\n' + x + '\n' + y + '\n' + z);
		}


	});
}

$(document).on('pagecreate','#profile',function(){
	var loginobj = {
	        "user_id": localStorage.loggedUserId
	    };
	// console.log(localStorage.loggedUserId + " + " );
	$.ajax({
		url: HOSTURL+'apis/user-profile.php',
		dataType: 'json',
		data: JSON.stringify(loginobj),
		type : 'POST',
		contentType: 'application/json',		// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function (data, status, jqXHR) {
			// console.log(data);
			if(data.status==1){
				if(data.data.user[0].photo == ''){
					$("#profileImg").attr('src', 'img/default.jpg' );
				}else{
					$("#profileImg").attr('src', HOSTURL + data.data.user[0].photo);
				};
				$("#userName").html(data.data.user[0].display_name);
				$("#profile #name").val(data.data.user[0].full_name);
				$("#profile #email").val(data.data.user[0].email);
				$("#profile #phone").val(data.data.user[0].mobile);
				$("#profile #batch").val(data.data.user[0].passing_year);
				$("#profile #branch").val(data.data.user[0].branch);
				$("#profile #occup").val(data.data.user[0].current_occupation);
				$("#profile #location").val(data.data.user[0].business_address);
				$("#profile #hobby").val(data.data.user[0].current_occupation);
				// $.mobile.changePage("#profile", {transition: "slideup"});
			}else{
				alert(data.msg);
			}
		},
		error: function(x,y,z){
			alert('An error has occurred:\n' + x + '\n' + y + '\n' + z);
		}


	});
});

$(document).on('pagecreate','#list',function(){
	var userList = $("#userList"),
		userObject = {"user_id":localStorage.loggedUserId};

	alert("List page created");

	$.ajax({
		url: HOSTURL+'apis/userslist.php',
		dataType: 'json',
		data: JSON.stringify(userObject),
		type : 'POST',
		contentType: 'application/json',		// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		// processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function (data, status, jqXHR) {
			// console.log(data);
			if(data.status==1){
				// alert(data.data.user.full_name);
				console.log(data.data.user[0].full_name);
				for(i=0; i<data.data.user.length; i++){
					var listItem = '<li class="ui-li-has-alt ui-li-has-thumb" data-userid="'+data.data.user[i].user_id+'"><a href="#" class="ui-btn"><img src="'+HOSTURL+data.data.user[i].photo+'" class="ui-li-thumb" width="100" height="100"><h2>'+data.data.user[i].full_name+' <small>(MD)</small></h2><p>'+data.data.user[i].email+'<br>9876543210</p><div class="ui-li-aside"><strong>'+data.data.user[i].passing_year+'</strong><br><small>Batch</small></div></a><a href="#" class="ui-icon-comment ui-nodisc-icon ui-alt-icon ui-btn ui-btn-icon-notext ui-icon-user" title=""></a></li>';
					userList.append(listItem);
				};
				userList.listview( "refresh" );
				// $.mobile.changePage("#profile", {transition: "slideup"});
			}else{
				// alert(data.msg);
				output.html("<p>Something went wrong while processing the ajax request.</p>").show("fast").delay(5000).hide("slow");
			}
		},
		error: function(x,y,z){
			alert('An error has occurred:\n' + x + '\n' + y + '\n' + z);
		}
	});

	var eventList = $("#two");
	$.ajax({
		url: HOSTURL+'apis/eventlist.php',
		dataType: 'json',
		data: '',
		type : 'POST',
		contentType: 'application/json',		// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		// processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function (data, status, jqXHR) {
			
			if(data.status==1){
				// console.log(data.data);
				for(i=0; i<data.data.events.length; i++){
					var eventItem = '<div class="block" data-eventId="'
						+data.data.events[i].event_id
						+'"><div class="media"><img src="'
						+HOSTURL+data.data.events[i].banner
						+'" width="300" height="200" alt="img"><div class="tag"><p class="">024<br><small>Going</small></p><a href="#" class="share ui-link"><span class="icon-share"></span></a></div></div><div class="body"><h3>'
						+data.data.events[i].title
						+'</h3><div class="date">'
						+data.data.events[i].event_date
						+'02<br>Jan</div><div class="action"><p>'
						+data.data.events[i].event_time
						+' </p><button class="ui-btn-prime  ui-btn" data-mini="true">Join Now</button></div><div class="descrip"><p>'
						+data.data.events[i].description + ', ' +data.data.events[i].address
						+' </p><p>Organised by <a href="#" class="ui-link">'
						+data.data.events[i].organizer
						+'</a></p></div><div class="clear"></div></div></div>';
					eventList.append(eventItem);
				};
				// userList.listview( "refresh" );
				// $.mobile.changePage("#profile", {transition: "slideup"});
			}else{
				// alert(data.msg);
				output.html("<p>Something went wrong while processing the ajax request.</p>").show("fast").delay(5000).hide("slow");
			}
		},
		error: function(x,y,z){
			alert('An error has occurred:\n' + x + '\n' + y + '\n' + z);
		}
	});
})