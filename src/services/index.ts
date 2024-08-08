export const sendRequest = async (requestFunc: () => Promise<any>) => {
  try {
    const response = await requestFunc();
    return { response: response.data };
  } catch (error: any) {
    return { error: error.message };
  }
};
