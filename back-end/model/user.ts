

export class User {
    private id?: number;
    private firstName: string;
    private lastName: string;
    private phoneNumber: string;
    private email: string;
    private rijkregisternummer: string;


    constructor(user: {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    rijkregisternummer: string;
    })
     {
        this.validate(user);
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
        this.rijkregisternummer = user.rijkregisternummer;
    }


    getId(): number | undefined {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getEmail(): string {
        return this.email;
    }

    getRijkregisternummer(): string {
        return this.rijkregisternummer;
    }


    validate(user: {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    rijkregisternummer: string;
    }) {
        if (!user.firstName?.trim()) {
            throw new Error('First name is required');
        }
        if (!user.lastName?.trim()) {
            throw new Error('Last name is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.phoneNumber?.trim()) {
            throw new Error('phone number is required');
        }
        if (!user.rijkregisternummer?.trim()) {
            throw new Error('rijksregisternummer is required');
        }
    }
    
    equals(user: User): boolean {
        return (this.firstName === user.getFirstName() &&
                       this.lastName === user.getLastName() &&
                       this.phoneNumber === user.getPhoneNumber() &&
                       this.email === user.getEmail() &&
                       this.rijkregisternummer === user.getRijkregisternummer()
            )}
}