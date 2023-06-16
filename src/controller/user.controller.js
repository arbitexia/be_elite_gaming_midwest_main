import { userService } from '@/services';

export const getUsers = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await userService.loadUsers(filterBy, cursor, req.user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.getOne(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getRoles = async (req, res) => {
  try {
    const result = await userService.loadRoles();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId, input } = req.body;
    const result = await userService.updateUser(userId, input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId, oldPassword, password } = req.body;
    const result = await userService.updatePassword(userId, oldPassword, password);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
