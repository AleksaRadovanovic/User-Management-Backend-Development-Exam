import Joi from 'joi';

const createGroup = {
    body: Joi.object().keys({
        name: Joi.string().required()
    })
};

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        groupId: Joi.string()
    })
};

const getUsers = {
    query: Joi.object().keys({
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    })
};

const getUsersByName = {
    query: Joi.object().keys({
        name: Joi.string().required()
    })
};

const getUsersByEmail = {
    query: Joi.object().keys({
        email: Joi.string().email().required()
    })
};

const removeUserFromGroup = {
    params: Joi.object().keys({
        userId: Joi.string().uuid().required()
    })
};

export default {
    createUser,
    getUsers,
    getUsersByName,
    getUsersByEmail,
    removeUserFromGroup,
    createGroup
};
