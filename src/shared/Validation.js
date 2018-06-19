export default class {

    static validateEmail(email) {
        return /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})/.test(email);
    }

    static missingUserInfo(user) {
        let requiredAttributes = [
            user.username,
            user.email,
            user.firstName,
            user.lastName,
            user.country,
            user.addressStreetName,
            user.addressStreetNumber,
            user.addressPostalCode,
            user.addressCity,
            user.addressCountry,
            user.acceptedPrivacyPolicy,
            user.acceptedTermsOfService,
        ];
        return requiredAttributes.some(val => !val);
    }
}