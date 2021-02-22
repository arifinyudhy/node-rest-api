const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');


class UserController {
    getAllUsers = async (req, res, next) => {
        let userList = await UserModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'Users not found');
        }
        userList = userList.map(user => {
            const {
                password,
                ...userWithoutPassword
            } = user;
            return userWithoutPassword;
        });

        res.send(userList);
    };

    getUserById = async (req, res, next) => {
        const user = await UserModel.findOne({
            id: req.params.id
        });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const {
            password,
            ...userWithoutPassword
        } = user;

        res.send(userWithoutPassword);
    };

    createUser = async (req, res, next) => {
        //console.log(req.body);
        const result = await UserModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('User was created!');
    };

    updateUser = async (req, res, next) => {

        const {
            confirm_password,
            ...restOfUpdates
        } = req.body;

        const result = await UserModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const {
            affectedRows,
            changedRows,
            info
        } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({
            message,
            info
        });
    };

    deleteUser = async (req, res, next) => {
        const result = await UserModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found');
        }
        res.send('User has been deleted');
    };
}

module.exports = new UserController;