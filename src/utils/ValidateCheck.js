// checker Email
export const isValidEmail = (email) => {
const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return strictEmailRegex.test(email)
    
};

// Checker UserName
export const isValidUsername = (username) => {
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{6,15}$/;
    return usernameRegex.test(username);
}

// Checker Password length
export const  isValidPasswordLength = (password)=>  password.length >= 8 && password.length <= 20;