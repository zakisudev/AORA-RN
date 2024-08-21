import { useEffect, useState } from "react";
import { Alert } from "react-native";

type AppwriteProps = {
  fn: any;
};

const useAppwrite = ({ fn }: AppwriteProps, args: string | null) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const data = await fn(args);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('An error occurred', String(error));
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    fetchVideos();
  }, []);

  const refetch = () => fetchVideos();

  return { data, refetch, isLoading };
};

export default useAppwrite;