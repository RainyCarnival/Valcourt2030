function emailValidation(email) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    
	if (emailRegex.test(email)) {
		return {
			valid: true,
			email
		};
	} else {
		return {
			valid: false,
			message: 'Invalid email address. Please enter a valid email address in the format example@example.com.',
			email
		};
	}
}

function passwordValidation(password) {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

	if (passwordRegex.test(password)) {
		return {
			valid: true,
			password
		};
	} else {
		return {
			valid: false,
			message: 'Password must contain:\n- At least 8 characters\n- At least 1 uppercase letter\n- At least 1 lowercase letter\n- At least 1 number',
			password
		};
	}
}


module.exports = {
	emailValidation,
	passwordValidation
};