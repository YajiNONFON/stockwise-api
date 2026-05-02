import { NotFoundException } from "../../shared/errors/http-errors";
import { UpdateProfileDto } from "./users.dto";
import { userRepository } from "./users.repository";

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findUserById(userId);
    if (!user) throw new NotFoundException("User not found");

    return user;
  },

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await userRepository.updateUser(userId, data);

    if (!user) throw new NotFoundException("User not found");

    return user;
  },

  async deleteAccount(userId: string) {
    const user = await userRepository.deleteUser(userId);
    if (!user) throw new NotFoundException("User not found");

    return user;
  },
};
