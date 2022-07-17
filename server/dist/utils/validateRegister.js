"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes("@")) {
        return [
            {
                field: "email",
                message: "Invalid email",
            },
        ];
    }
    if (options.username.length <= 2) {
        return [
            {
                field: "username",
                message: "Username is too short",
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "Cannot include an @",
            },
        ];
    }
    if (options.password.length <= 2) {
        return [
            {
                field: "password",
                message: "Password is too short",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map