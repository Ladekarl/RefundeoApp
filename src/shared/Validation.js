import {strings} from './i18n';

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

    static missingRequestRefundUserInfo(user) {
        let requiredAttributes = [
            user.swift,
            user.accountNumber
        ];
        return requiredAttributes.some(val => !val);
    }

    static checkPassword(newPassword, confPassword) {
        if (newPassword && confPassword && newPassword === confPassword) {
            // noinspection EqualityComparisonWithCoercionJS
            const hasLowerCase = newPassword.toUpperCase() != newPassword;
            const uniqueChars = String.prototype.concat(...new Set(newPassword)).length;
            if (hasLowerCase && newPassword.length >= 8 && uniqueChars >= 4) {
                return null;
            }
            else if (newPassword.length < 8) {
                return strings('settings.error_password_too_short');
            }
            else if (uniqueChars < 4) {
                return strings('settings.error_password_not_unique');
            }
            else if (!hasLowerCase) {
                return strings('settings.error_password_only_uppercase');
            }
        } else if (!newPassword || !confPassword) {
            return strings('settings.error_password_not_filled');
        } else {
            return strings('settings.error_password_not_same');
        }
    }
}