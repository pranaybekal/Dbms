const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
var Name = document.getElementById("sname");
var Email = document.getElementById("semail");
var password = document.getElementById("stxtPassword");
var confirmPassword = document.getElementById("sPassword2");
signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


function validate() {

	
	if (Name.value == "") {
		alert("Please enter your name.");
		Name.focus();
		return false;
	  }
	  if (Email.value == "") {
		alert("Please enter a valid e-mail address.");
		Email.focus();
		return false;
	  }
	  if (Email.value.indexOf("@", 0) < 0) {
		alert("Please enter a valid e-mail address.");
		Email.focus();
		return false;
	  }
	  if (Email.value.indexOf(".", 0) < 0) {
		alert("Please enter a valid e-mail address.");
		Email.focus();
		return false;
	  }
	  if (password.value == "") {
		alert("Please enter your password");
		password.focus();
		return false;
	  }
	  if (password.value.length<8) {
		alert("password two small");
		password.focus();
		return false;
	  }
	  if (password.value != confirmPassword.value) {
		alert("Passwords do not match.");
		return false;
	}
	return true;
}
function validation()
{
    var username=document.getElementById("email").value;
    var password=document.getElementById("password").value;

	if(username=='')
	{
		alert("Email cannot be empty!!!")
	}
	else if(password==''&&password.length<8)
	{
		alert("Enter valid password!!!")
	}
   
}