var HOSTURL = 'http://localhost/mitalumni/';
var loggedUserId = 0;
var output = $("#output");
    output.hide();

function loginProcess () {
	var user_email = $("#email").val();
    /*if (user_email == null || user_email == "") {
        alert("Please Enter Email ID");
    };*/
    var password = $("#password").val();
    /*if (password == null || password == "") {
        alert("Please Enter Password");
    };*/
    var loginobj = {
        "email": user_email,
        "password": password
    };

    
    if(loginobj.email != '' && loginobj.password !== ''){
    	// console.log(loginobj);
		$.mobile.loading("show",{
			textVisible: true,
			theme:"b"
		});

		$.ajax({
			url: HOSTURL+'apis/login.php',
			dataType: 'json',
			data: JSON.stringify(loginobj),
			type : 'POST',
			contentType: 'application/json',		// The content type used when sending data to the server.
			cache: false,				// To unable request pages to be cached
			processData:false,			// To send DOMDocument or non processed data file it is set to false
			success: function (data, status, jqXHR) {
				console.log(data);
				$.mobile.loading("hide");
				if(data.status==1){
					// alert(data.data.user.full_name);
					loggedUserId = data.data.user.user_id;
					localStorage.loggedUserId = data.data.user.user_id;
					localStorage.loggedFullName = data.data.user.full_name;
					// console.log(data.data.user.user_id);
					$.mobile.changePage("#profile", {transition: "slideup"});
				}else{
					// alert(data.error);
					// console.log(data.error);
					output.html("<p>"+data.error+"</p>").show("fast").delay(5000).hide("slow");

				}
			},
			error: function(error){
				$.mobile.loading("hide");
				alert('An error has occurred:' + error);
				output.html("<p>"+error+"</p>").show("fast").delay(5000).hide("slow");
			},
			complete:function(data, status){
				output.html("<p>"+data.statusTest+"</p>").show("fast").delay(5000).hide("slow");
			}
		});
    }else if(loginobj.email==''){
    	// console.log(loginobj);
    	alert("Please enter Email.")
    }else if(loginobj.password == '') {
    	alert("Please enter Password");
    };
	
};

function regProcess() {
	var regform = $("#regForm"),
		name = regform.find("input#name").val(),
		email = regform.find("input#email").val(),
		mobile = regform.find("input#mobile").val(),
		date = regform.find("input#date").val(),
		branch = regform.find("input#branch").val(),
		occup = regform.find("input#occup").val(),
		address = regform.find("input#address").val(),
		pass1 = regform.find("input#pass1").val(),
		pass2 = regform.find("input#pass2").val();
	
	var regisObj = {"email":email,"password":pass1,"cnf_password":pass2,"full_name":name,"user_mobile":mobile,"passing_year":date,"branch":branch,"current_occupation":occup,"business_address":address};
		
	// console.log(regisObj);
	console.log(JSON.stringify(regisObj));

	$.ajax({
		url: HOSTURL + 'apis/regtration.php',
		dataType: 'jsonp',
		data: JSON.stringify(regisObj),
		type : 'POST',
		contentType: 'application/json',
		cache: false,
		processData:false,
		success: function (data, status, jqXHR) {
			console.log(data);
			if(data.status==1){
				alert(data.data.user.full_name);
				console.log(data.data.user.user_id);
				
			}else{
				alert(data.error);
			}
		},
		error:function () {
			// alert("Ajax error");
			console.error("Ajax error. Data captured. Check database.")
		}
	});	

};

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
				alert(data.error);
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
				// console.log(data.data.user[0].full_name);
				for(i=0; i<data.data.user.length; i++){
					var listItem = '<li class="ui-li-has-alt ui-li-has-thumb" data-userid="'+data.data.user[i].user_id+'"><a href="#" class="ui-btn"><img src="'+HOSTURL+data.data.user[i].photo+'" class="ui-li-thumb" width="100" height="100"><h2>'+data.data.user[i].full_name+' <small>(MD)</small></h2><p>'+data.data.user[i].email+'<br>9876543210</p><div class="ui-li-aside"><strong>'+data.data.user[i].passing_year+'</strong><br><small>Batch</small></div></a><a href="#" class="ui-icon-comment ui-nodisc-icon ui-alt-icon ui-btn ui-btn-icon-notext ui-icon-user" title=""></a></li>';
					userList.append(listItem);
				};
				userList.listview( "refresh" );
				// $.mobile.changePage("#profile", {transition: "slideup"});
			}else{
				alert(data.error);
				// output.html("<p>Something went wrong while processing the ajax request.</p>").show("fast").delay(5000).hide("slow");
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
				alert(data.error);
				// output.html("<p>Something went wrong while processing the ajax request.</p>").show("fast").delay(5000).hide("slow");
			}
		},
		error: function(error){
			alert("An error has occurred: "+ error );
		}
	});
});


/* -- add event -- */
function addEvent(){
	// alert("click");
	var evtName = $("#addEventForm #eventname").val(),
		evtDate = $("#addEventForm #eventdate").val(),
		evTime = $("#addEventForm #eventime").val(),
		evtAddress = $("#addEventForm #eventaddress").val(),
		evtImg = $("#addEventForm #eventimg").val(),
		evtDetail = $("#addEventForm #eventdetail").val();
		
	var eventObj = {"title":evtName,"description":evtDetail,"address":evtAddress,"event_date":evtDate,"event_time":evTime,"organizer":localStorage.loggedFullName,"banner":HOSTURL+"img/default.jpg","user_id":localStorage.loggedUserId};

	console.log(JSON.stringify(eventObj));

	$.ajax({
		url: HOSTURL+'apis/event-add.php',
		dataType: 'json',
		data: JSON.stringify(eventObj),
		type : 'POST',
		contentType: 'application/json',		// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function (result, status, jqXHR) {
			console.log(result);
			if(result.status==1){
				alert(result.data.user.full_name);
				console.log(result.data.user[0].full_name);
				// $.mobile.changePage("#profile", {transition: "slideup"});
			}else{
				alert(result.error);
				output.html(result.error).show("fast").delay(5000).hide("slow");
			}
		},
		error: function(error){
			alert(error);
			console.error(error);
			output.html(error).show("fast").delay(5000).hide("slow");
		}
	});
}