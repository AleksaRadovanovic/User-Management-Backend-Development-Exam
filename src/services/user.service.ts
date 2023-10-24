import { Group, GroupStatus, User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

const createUser = async (email: string, name: string, groupId: string): Promise<User> => {
    if (await getUserByEmail(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    if (groupId && !(await getGroupById(groupId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid groupId provided');
    }

    const user = await prisma.user.create({
        data: {
            email,
            name,
            groupId: groupId || null
        }
    });

    if (groupId) {
        //Set group is not empty
        await prisma.group.update({
            where: { id: groupId },
            data: { status: GroupStatus.NotEmpty }
        });
    }

    return user;
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { email }
    });
};

const getGroupById = async (id: string): Promise<Group | null> => {
    return prisma.group.findUnique({
        where: { id }
    });
};

const queryUsersWithPagination = async <Key extends keyof User>(
    options: {
        limit?: number;
        page?: number;
    },
    keys: Key[] = ['id', 'email', 'name', 'groupId'] as Key[]
): Promise<Pick<User, Key>[]> => {
    const page = options.page ?? 0;
    const limit = options.limit ?? 10;

    const users = await prisma.user.findMany({
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: page * limit,
        take: limit
    });

    return users as Pick<User, Key>[];
};

const filterUsers = async <Key extends keyof User>(
    filter: object,
    keys: Key[] = ['id', 'email', 'name', 'groupId'] as Key[]
): Promise<Pick<User, Key>[]> => {
    return prisma.user.findMany({
        where: filter,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<User, Key>[]>;
};

const createGroup = async (name: string): Promise<Group> => {
    return await prisma.group.create({
        data: {
            name
        }
    });
};

const removeUserFromGroup = async (userId: string): Promise<Group | null> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not founded');
    }

    const { groupId } = user;

    if (!groupId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not in group');
    }

    // Removing user groupId
    await prisma.user.update({
        where: { id: userId },
        data: { groupId: null }
    });

    // Check if the group has no more members
    const membersCount = await prisma.user.count({
        where: { groupId: groupId }
    });

    if (membersCount === 0) {
        return await prisma.group.update({
            where: { id: groupId },
            data: { status: GroupStatus.Empty }
        });
    }

    return await prisma.group.findUnique({ where: { id: groupId } });
};

export default {
    createUser,
    filterUsers,
    queryUsersWithPagination,
    createGroup,
    removeUserFromGroup
};
