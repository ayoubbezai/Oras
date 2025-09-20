import api from "@/utils/api";

export const ConstatServices = {
  async getDetails() {
    try {
      const res = await api.get("/details");
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
