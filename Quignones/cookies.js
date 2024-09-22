// Function to set a cookie
export function setCookie(name, value, days) {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie
export function getCookie(name) {
	const cookieName = `${name}=`;
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		let trimmedCookie = cookie.trim();
		if (trimmedCookie.indexOf(cookieName) === 0) {
			return trimmedCookie.substring(cookieName.length, trimmedCookie.length);
		}
	}
	return null;
}