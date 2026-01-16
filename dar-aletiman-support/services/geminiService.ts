// This service is now redirected to the local Python Backend (app_api.py)
const API_BASE_URL = import.meta.env.VITE_API_URL || ''; // Empty string = relative URL

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }), // Sending only message for now as backend manages history/context via LlamaIndex? 
      // Actually backend v2 doesn't manage history session per se yet in chat_logic signature, 
      // but let's send history just in case we enhance it later.
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Backend API Error:", error);
    return "عذراً، حدث خطأ في الاتصال بالنظام الذكي (Local Backend).";
  }
};
