import { Account } from "../../model/account";
import { Gender, PhoneNumber, Role } from "../../types";
import { Interest } from "../../model/interest";

const validAccount = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: { countryCode: '+1', number: '123456789' },
    email: 'jane.doe@example.com',
    gender: 'female' as Gender,
    password: 'securepassword',
    interests: [],
    role: 'account' as Role,
    events: [],
    joinedEvents: [],
};

test('given:valid values for account, when:account is created, then:account is created with those values', () => {
    const account = new Account(validAccount);
    expect(validAccount.id).toEqual(account.getId());
    expect(validAccount.firstName).toEqual(account.getFirstName());
    expect(validAccount.lastName).toEqual(account.getLastName());
    expect(validAccount.phoneNumber).toEqual(account.getPhoneNumber());
    expect(validAccount.email).toEqual(account.getEmail());
    expect(validAccount.password).toEqual(account.getPassword());
    expect(validAccount.gender).toEqual(account.getGender());
    expect(validAccount.interests).toEqual(account.getInterests());
});

test('should throw an error if first name is missing', () => {
    expect(() => {
        new Account({ ...validAccount, firstName: "" });
    }).toThrow('First name is required');
});

test('should throw an error if last name is missing', () => {
    expect(() => {
        new Account({ ...validAccount, lastName: "" });
    }).toThrow('Last name is required');
});

test('should throw an error if email is missing', () => {
    expect(() => {
        new Account({ ...validAccount, email: "" });
    }).toThrow('Email is required');
});

test('should throw an error if country code is missing', () => {
    expect(() => {
        new Account({ ...validAccount, phoneNumber: { countryCode: '', number: '556446' } as PhoneNumber });
    }).toThrow('country code is required');
});

test('should throw an error if phone number is missing', () => {
    expect(() => {
        new Account({ ...validAccount, phoneNumber: { countryCode: '+1', number: '' } as PhoneNumber });
    }).toThrow('phone number is required');
});

test('should throw an error if password is missing', () => {
    expect(() => {
        new Account({ ...validAccount, password: "" });
    }).toThrow('Password is required');
});

test('should throw an error if gender is missing', () => {
    expect(() => {
        new Account({ ...validAccount, gender: "" as Gender });
    }).toThrow('Gender is required');
});

test('should add an interest to the validAccount', () => {
    const account = new Account(validAccount);
    const interest = new Interest({ name: "Reading", description: "Reading books" });
    account.addInterestToAccount(interest);
    expect(account.getInterests()).toContain(interest);
});

test('should throw an error if role is admin and gender is provided', () => {
    expect(() => {
        new Account({ ...validAccount, role: 'admin', gender: 'female' as Gender });
    }).toThrow('Only accounts can have a gender');
});

test('should throw an error if role is admin and interests are provided', () => {
    expect(() => {
        new Account({ ...validAccount, role: 'admin', gender : null, interests: [new Interest({ name: "Reading", description: "Reading books" })] });
    }).toThrow('Only accounts can have interests');
});


test('should return true if two validAccounts are equal', () => {
    const validAccount1 = new Account(validAccount);
    const validAccount2 = new Account(validAccount);
    expect(validAccount1.equals(validAccount2)).toBe(true);
});

test('should return false if two validAccounts are not equal', () => {
    const validAccount1 = new Account(validAccount);
    const validAccount2 = new Account({ ...validAccount, email: "john.doe@example.com" });
    expect(validAccount1.equals(validAccount2)).toBe(false);
});

test('should convert account to summary correctly', () => {
    const account = new Account(validAccount);
    const summary = account.toSummary();
    expect(summary.firstName).toEqual(validAccount.firstName);
    expect(summary.lastName).toEqual(validAccount.lastName);
    expect(summary.email).toEqual(validAccount.email);
    expect(summary.gender).toEqual(validAccount.gender);
    expect(summary.interests).toEqual(validAccount.interests);
});

test('should convert account to prisma format correctly', () => {
    const account = new Account(validAccount);
    const prismaAccount = account.toPrisma();
    expect(prismaAccount.firstName).toEqual(validAccount.firstName);
    expect(prismaAccount.lastName).toEqual(validAccount.lastName);
    expect(prismaAccount.email).toEqual(validAccount.email);
    expect(prismaAccount.gender).toEqual(validAccount.gender);
    expect(prismaAccount.phoneNumber).toEqual(`${validAccount.phoneNumber.countryCode} ${validAccount.phoneNumber.number}`);
    expect(prismaAccount.role).toEqual(validAccount.role);
    expect(prismaAccount.password).toEqual(validAccount.password);
});






