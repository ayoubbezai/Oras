import api from "@/utils/api";

export const ProfileServices = {
  async getProfile() {
    try {
      const res = await api.get("/profile");
      console.log(res);
      return res.data;
    } catch (error) {
      return {
        success: false,
        error : error
      };
    }
  },
};
