import pick from '../utils/pick';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req, res) => {
    const { email, name, groupId } = req.body;
    const user = await userService.createUser(email, name, groupId);
    res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
    const options = pick(req.query, ['limit', 'page']);
    const result = await userService.queryUsersWithPagination(options);
    res.send(result);
});

const getUsersByName = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name']);

    const result = await userService.filterUsers(filter);
    res.send(result);
});

const getUsersByEmail = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email']);

    const result = await userService.filterUsers(filter);
    res.send(result);
});

const removeUserFromGroup = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const result = await userService.removeUserFromGroup(userId);
    res.send(result);
});

const createGroup = catchAsync(async (req, res) => {
    const { name } = req.body;
    const user = await userService.createGroup(name);
    res.status(httpStatus.CREATED).send(user);
});

export default {
    createUser,
    getUsers,
    getUsersByName,
    getUsersByEmail,
    removeUserFromGroup,
    createGroup
};
