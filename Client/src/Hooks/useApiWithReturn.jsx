import axios from 'axios';
import useLocalStorage from "./useLocalStorage";

// useApi() for updatable data state (best with only one unique repeatable request to API)
// useApiWithReturn() for single-use return statements (if you have multiple unique calls to API)

const useApiWithReturn = () => {
  const [credentials, setCredentials] = useLocalStorage("credentials", {});

  const getHeaders = (accessToken) => ({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const fetchData = async (givenUrl, bodyData, givenMethod, accessToken) => {
    const headers = getHeaders(accessToken);
    const config = {
      method: givenMethod,
      url: givenUrl,
      headers: headers,
      data: bodyData,
    };
    return await axios(config);
  };

  const refreshTokenAndRetry = async (originalConfig) => {
    const refreshToken = credentials["refreshToken"];
    const refreshResponse = await axios.post("/api/auth/refresh", {
        token: refreshToken,
    });
    const accessToken = refreshResponse.data.accessToken;
    const newRefreshToken = refreshResponse.data.refreshToken
    setCredentials({...credentials,"accessToken":accessToken, "refreshToken":newRefreshToken});
    originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;

    return axios(originalConfig);
  };

  const fetchDataWrapper = async (givenUrl, bodyData, givenMethod) => {
    try {
      const result = await fetchData(givenUrl, bodyData, givenMethod, credentials["accessToken"] || "");
      return result.data;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        try {
          const retryResult = await refreshTokenAndRetry({
            method: givenMethod,
            url: givenUrl,
            headers: getHeaders(credentials["accessToken"]),
            data: bodyData
          });
          return retryResult.data;
        } catch (refreshError) {
          return refreshError;
        }
      } else {
        return err;
      }
    }
  };

  const handleSubmit = (givenUrl, givenData, givenMethod) => {
    return fetchDataWrapper(givenUrl, givenData, givenMethod);
  };

  return { handleSubmit };
};

export default useApiWithReturn;