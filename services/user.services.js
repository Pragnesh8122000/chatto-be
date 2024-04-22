
class UserServices {
    constructor() {
        this.bcrypt = require("bcrypt");
        this.jwt = require("jsonwebtoken");
        this.constants = require("../helpers/constants");
        this.messages = require("../messages/auth.messages");
        this.helpers = require("../helpers/helper");
        this.repo = require("../repo/repo");
        this.userServices = require("./user.services");
        this.bridgeUsers = require("../user-bridge")
        // this.socketServices = require("../services/socket-services");
    }


    login = async (email, password) => {
        try {
            let isValidPassword;
            // get user using email
            let user = await this.repo.userRepo.getUserByEmail(email);

            // if user exists and password is correct then hash it
            if (user) {
                isValidPassword = await this.bcrypt.compare(password, user.password);
            }

            // if user with email and password does not exist
            if (!user || !isValidPassword) {
                return {
                    statusCode: 401,
                    resObj: {
                        status: false,
                        message: this.messages.allMessages.LOG_IN_UNAUTHORIZED,
                    }
                }
            }

            // Generate a Access token for authentication
            const accessToken = this.jwt.sign(
                {
                    email: user.email,
                    user_id: user.id,
                    user_name: `${user.first_name} ${user.last_name}`,
                    user_code: user.user_code
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME }
            );

            return {
                statusCode: 200,
                resObj: {
                    status: true,
                    message: this.messages.allMessages.LOG_IN_SUCCESS,
                    data: { user: user },
                    accessToken
                }
            }
        } catch (error) {
            console.log(error);
            return {
                statusCode: 500,
                resObj: {
                    status: false,
                    message: this.messages.allMessages.LOG_IN_FAILED,
                }
            }
        }

    }

    signUp = async (first_name, last_name, email, password, department_name) => {
        try {
            // get the department id from the department name
            const department = await this.repo.userRepo.getDeptByName(department_name);
            // if department is not found
            if (!department) {
                // return res.status(422).send({ status: false, message: this.messages.allMessages.DEPARTMENT_NOT_EXIST });
                return {
                    statusCode: 422,
                    resObj: {
                        status: false,
                        message: this.messages.allMessages.DEPARTMENT_NOT_EXIST
                    }
                }
            }

            const userObj = { first_name, last_name, email, password, department_id: department.id };

            // Generate user code
            const userCode = await this.helpers.generateUserCode();
            userObj.user_code = userCode;

            let existingUser = await this.repo.userRepo.getUserByEmailAndUserCode(email, userCode);
            // if enter password is wrong
            if (existingUser) {
                // return res.status(401).send({ status: false, message: this.messages.allMessages.USER_ALREADY_EXIST });
                return {
                    statusCode: 422,
                    resObj: {
                        status: false,
                        message: this.messages.allMessages.USER_ALREADY_EXIST
                    }
                }
            }

            let hashedPassword = password ? await this.bcrypt.hash(password, 10) : null;

            userObj.password = hashedPassword;

            // Create new user
            let user = await this.repo.userRepo.createUser(userObj);

            return {
                statusCode: 200,
                resObj: {
                    status: true,
                    message: this.messages.allMessages.SIGN_UP_SUCCESS,
                    data: {
                        user: {
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                        },
                    },
                }
            }
        } catch (error) {
            console.log(error);
            return {
                statusCode: 500,
                resObj: {
                    status: false,
                    message: this.messages.allMessages.SIGN_UP_FAILED
                }
            }
        }
    }

    updateUserStatus = async (user_id, status) => {
        try {
            let users = this.bridgeUsers.getUsers();
            // get user
            const user = await this.repo.userRepo.getUserById(user_id);
            if (!user) {
                return {
                    statusCode: 404,
                    resObj: {
                        status: false,
                        message: this.messages.allMessages.USER_NOT_EXIST
                    }
                }
            }
            await this.repo.userRepo.updateUserStatus(user_id, status);

            // // get user friends
            // let userFriends = await this.repo.friendsRepo.getUserFriends(user_id);
            // // get online friends from users friends array
            // const filteredFriends = await this.getFilteredUsersByReqToAndFrom(user, userFriends);
            // // get online friends from users array
            // const onlineFriends = users.filter(user => filteredFriends.some(friendId => user.user_id === friendId));
            // // send notification to online friends
            // if (onlineFriends.length > 0) {
            //     //   await this.socketServices.sendActivityNotificationToOnlineFriends(io, onlineFriends,user, status)
            //     for (let i = 0; i < onlineFriends.length; i++) {
            //         const onlineFriend = onlineFriends[i];
            //         io.to(onlineFriend.id).emit(this.constants.SOCKET.EVENTS.ACTIVITY_CHANGE, {
            //             online: status,
            //             user_id: user.user_id
            //         });
            //     }
            // }
            return {
                statusCode: 200,
                resObj: {
                    status: true,
                    message: this.messages.allMessages.UPDATE_USER_STATUS_SUCCESS
                }
            }
        } catch (error) {
            console.log(error);
            return {
                statusCode: 500,
                resObj: {
                    status: false,
                    message: this.messages.allMessages.UPDATE_USER_STATUS_FAILED
                }
            }
        }
    }

    getUserById = async (user_id) => {
        try {
            const user = await this.repo.userRepo.getUserById(user_id);
            if (!user) {
                return {
                    statusCode: 404,
                    resObj: {
                        status: false,
                        message: this.messages.allMessages.USER_NOT_EXIST
                    }
                }
            }
            return {
                statusCode: 200,
                resObj: {
                    status: true,
                    message: this.messages.allMessages.GET_USER_BY_ID_SUCCESS,
                    data: {
                        user
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return {
                statusCode: 500,
                resObj: {
                    status: false,
                    message: this.messages.allMessages.GET_USER_BY_ID_FAILED
                }
            }
        }
    }

    // get filtered friends in user object in friends array
    async getFilteredUsersByReqToAndFrom(user, userFriends) {
        let receiverUser;
        return userFriends.map(friend => {
            // console.log(user && friend.req_from.id === user.user_id);
            // get friend plain object
            friend = friend.get({ plain: true });
            receiverUser = user && friend.req_from.id == user.user_id ? friend.req_to : friend.req_from;
            // console.log(receiverUser);
            delete friend.req_to;
            delete friend.req_from;
            return receiverUser.id;
        })
    }
}

module.exports = new UserServices()