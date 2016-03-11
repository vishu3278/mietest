var HOSTURL = 'http://localhost/mitalumni/';
var loggedUserId = 0;

$(document).on('pageinit','#welcome',function(){

	var output = $("#output") ;

	$("#loginForm").validate({
			errorPlacement: function(error, element) {
				error.insertBefore();
			},
			
			submitHandler: function(form){
				
				var user_email = $("#email").val();
			    if (user_email == null || user_email == "") {
			        alert("Please Enter Email ID");
			    }
			    var password = $("#password").val();
			    if (password == null || password == "") {
			        alert("Please Enter Password");
			    }
			    var loginobj = {
			        "email": user_email,
			        "password": password
			    }

				$.ajax({
					url: HOSTURL+'apis/login.php',
					dataType: 'json',
					data: JSON.stringify(loginobj),
					type : 'POST',
					contentType: 'application/json',		// The content type used when sending data to the server.
					cache: false,				// To unable request pages to be cached
					processData:false,			// To send DOMDocument or non processed data file it is set to false
					success: function (data, status, jqXHR) {
                		// var response = JSON.stringify(data);
                		// console.log(data.status);
						if(data.status==1){
							// alert(data.data.user.full_name);
							loggedUserId = data.data.user.user_id;
							// console.log(data.data.user.user_id);
							$.mobile.changePage("#profile", {transition: "slideup"});
						}else{
							alert("Wrong login details.");
						}
					},
					error: function(){
						output.html('<p>There was an error loading the data</p>');
					}


				});
				
			}	
	});
	
	
});

$(document).on('pageinit','#profile',function(){
	var loginobj = {
	        "user_id": loggedUserId
	    }
	console.log(loggedUserId);
	$.ajax({
		url: HOSTURL+'apis/user-profile.php',
		dataType: 'json',
		data: JSON.stringify(loginobj),
		type : 'POST',
		contentType: 'application/json',		// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function (data, status, jqXHR) {
    		// var response = JSON.stringify(data);
    		// console.log(data.status);
			if(data.status==1){
				// alert(data.data.user.full_name);
				$("#name").val(data.data.user.full_name);
				console.log(data.data.user.full_name);
				
				// $.mobile.changePage("#profile", {transition: "slideup"});
			}else{
				alert(data.msg);
			}
		},
		error: function(){
			output.html('<p>There was an error loading the data</p>');
		}


	});
});