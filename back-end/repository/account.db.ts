import { Account } from "../model/account";
import database from "./database";
import eventdb from "./event.db";
const getAll = async (): Promise<Account[]> => {
    try {
        const AccountPrisma = await database.account.findMany({
            include:  { interests: true, events: true},
        });
        const accounts = await Promise.all(AccountPrisma.map(async (accountPrisma) => {
            const account = Account.fromPrisma(accountPrisma);
            const joinedEvents = await eventdb.getByJoinedAccountId(accountPrisma.id);
            account.setJoinedEvents(joinedEvents);
            return account;
        }));
        return accounts;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const getById = async (id: number): Promise<Account | null> => {
    try {
        const accountPrisma = await database.account.findUnique({
            where: { id },
            include: { interests: true, events: true },
        });
        if (accountPrisma) {
            const account = Account.fromPrisma(accountPrisma);
            const joinedEvents = await eventdb.getByJoinedAccountId(accountPrisma.id);
            account.setJoinedEvents(joinedEvents);
            return account;
        }else{
            return null;
        }

    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getByEmail = async (email: string): Promise<Account | null> => {
    try {
        const accountPrisma = await database.account.findUnique({
            where: { email },
            include: { interests: true, events: true,},
        });
        if (accountPrisma) {
            const account = Account.fromPrisma(accountPrisma);
            const joinedEvents = await eventdb.getByJoinedAccountId(accountPrisma.id);
            account.setJoinedEvents(joinedEvents);
            return account;
        }else{
            return null;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getByUsername = async (username: string): Promise<Account | null> => {
    try {
        const accountPrisma = await database.account.findUnique({
            where: { username },
            include: { interests: true, events: true },
        });
        if (accountPrisma) {
            const account = Account.fromPrisma(accountPrisma);
            const joinedEvents = await eventdb.getByJoinedAccountId(accountPrisma.id);
            account.setJoinedEvents(joinedEvents);
            return account;
        }else{
            return null;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const getByPhoneNumber = async (phoneNumber: string): Promise<Account | null> => {
    try {
        const accountPrisma = await database.account.findFirst({
            where: { phoneNumber },
            include: { interests: true, events: true },
        });
        if (accountPrisma) {
            const account = Account.fromPrisma(accountPrisma);
            const joinedEvents = await eventdb.getByJoinedAccountId(accountPrisma.id);
            account.setJoinedEvents(joinedEvents);
            return account;
        }else{
            return null;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const create = async (account: Account): Promise<Account> => {
    try {
        const prismaaccount = account.toPrisma();
        const { id, ...prismaaccountWithoutId } = prismaaccount; 
        const accountPrisma = await database.account.create({
            data: {
                ...prismaaccountWithoutId,
                interests: {
                    connect: prismaaccount.interests.map((interest) => ({ id: interest.id })),
                },
            },
            include: { interests: true, events: true },
        });
        return Account.fromPrisma(accountPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const update = async (account: Account): Promise<Account> => {
    try {
        const prismaaccount = account.toPrisma();
        const accountPrisma = await database.account.update({
            where: { id: account.getId() },
            include: { interests: true, events: true },
            data: {
                ...prismaaccount,
                interests: {
                    set: prismaaccount.interests.map((interest) => ({ id: interest.id })),
                }
            },
        });
        return Account.fromPrisma(accountPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const remove = async (id: number): Promise<void> => {
    try {
        await database.account.delete({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

export default {
    getAll,
    getById,
    getByEmail,
    getByUsername,
    getByPhoneNumber,
    create,
    update,
    remove,
};