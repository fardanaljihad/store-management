import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { createContactValidation, getAllContactsValidation, getContactValidation, updateContactValidation } from "../validations/contact-validation";
import { getUserValidation } from "../validations/user-validation.js"
import { validate } from "../validations/validation.js"

const create = async (username, request) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username
        },
        select: {
            contact: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }
    
    if (user.contact) {
        throw new ResponseError(400, "User already has a contact");
    }

    const contact = validate(createContactValidation, request);
    contact.username = username;

    return prismaClient.contact.create({
        data: contact
    });
}

const getAll = async (request) => {
    const { page, limit } = validate(getAllContactsValidation, request);
    const skip = (page - 1) * limit;

    const contacts = await prismaClient.contact.findMany({
        skip,
        take: limit
    });

    return {
        data: contacts,
        pagination: {
            total: contacts.length,
            page,
            limit,
        }
    }
}

const get = async (username) => {
    username = validate(getContactValidation, username);

    const contact = await prismaClient.contact.findUnique({
        where: {
            username
        }
    });

    if (!contact) {
        throw new ResponseError(404, "Contact not found");
    }

    return contact;
}

const update = async (username, request) => {
    username = validate(getContactValidation, username);

    const isContactExist = await prismaClient.contact.findUnique({
        where: {
            username
        }
    });

    if (!isContactExist) {
        throw new ResponseError(404, "Contact not found");
    }

    const contact = validate(updateContactValidation, request);
    const data = {};
    if (contact.first_name) data.first_name = contact.first_name;
    if (contact.last_name) data.last_name = contact.last_name;
    if (contact.email) data.email = contact.email;
    if (contact.phone) data.phone = contact.phone;

    return prismaClient.contact.update({
        where: {
            username
        },
        data
    });
}

export default {
    create,
    getAll,
    get,
    update
}
