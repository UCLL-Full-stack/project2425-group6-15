import { Interest as InterestPrisma } from '@prisma/client';
export class Interest {
    private id?: number;
    private name: string;
    private description: string;
    

    constructor(interest: {
        id?: number;
        name: string;
        description: string;
        
    }) 
    {
        this.validate(interest);
        this.id = interest.id;
        this.name = interest.name;
        this.description = interest.description;
        
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }
    getDescription(): string {
        return this.description;
    }

   

    validate(interest: {
        id?: number;
        name: string;
        description: string;
        
    }) {
        if (!interest.name) {
            throw new Error('Interest must have a name');
        }
        if (!interest.description) {
            throw new Error('Interest must have a description');
        }
    }   


    equals(interest: Interest): boolean {
        return this.name === interest.getName(), this.description === interest.getDescription();
    }

    toPrisma(): InterestPrisma {
        return {
            id: this.id ?? 0,
            name: this.name,
            description: this.description,
        };
    }

    static fromPrisma(interest: InterestPrisma): Interest {
        return new Interest({
            id: interest.id,
            name: interest.name,
            description: interest.description,
        });
    }
}