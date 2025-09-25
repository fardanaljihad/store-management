import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { createContactValidation } from "../validations/contact-validation";
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

export default {
    create
}
