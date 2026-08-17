import api, { request } from "@/services/api";

const endpoint = "/ai-chat";

export const askAiAssistant = (payload) => request(api.post(endpoint, payload));

export default {
  askAiAssistant,
};
