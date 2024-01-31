import moment from "moment";
import Chance from 'chance';

const chance = new Chance();

interface PatientInterface {
    birthDay: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    address: string;
    city: string;
    childBirthDay: string;
}

export function createPatient(): PatientInterface {
    const birthDate = moment.utc(chance.birthday({ type: 'adult' })).format("MM/DD/YYYY")
    const childBirthDate = moment.utc(chance.birthday({ type: 'child' })).format("MM/DD/YYYY")
    const emailDomain = "@yopmail.com"
    const firstName = chance.first()
    const lastName = chance.last()
    const emailAddress = firstName + lastName + emailDomain
    const address = "24 " + lastName + " St"
    const city = firstName + "ville"
    return {
        birthDay: birthDate,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        address: address,
        city: city,
        childBirthDay: childBirthDate
    };
};