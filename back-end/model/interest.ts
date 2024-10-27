export class Interest {
    private id?: number;
    private name: string;
    

    constructor(interest: {
        id?: number;
        name: string;
        
    }) {
        this.validate(interest);
        this.id = interest.id;
        this.name = interest.name;
        
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

   

    validate(interest: {
        id?: number;
        name: string;
        
    }) {
        if (!interest.name) {
            throw new Error('Interest must have a name');
        }
       
    }   


    equals(interest: Interest): boolean {
        return this.name === interest.getName()
    }


}