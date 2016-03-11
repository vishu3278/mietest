var HOSTURL = 'http://localhost/mitalumni/';
var loggedUserId = 0;


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

    var output = $("#output");
    output.hide();

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
				console.log(data.data.user.user_id);
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
	console.log(localStorage.loggedUserId + " + " );
	$.ajax({
		url: HOSTURL+'apis/user-profile.php',
		dataType: 'json',
		data: JSON.stringify(loginobj),
		type : 'POST',
		contentType: 'application/json',		// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function (data, status, jqXHR) {
			console.log(data);
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