import { api } from "../../libs/api";
import { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

export function useFindThreads() {
  return useQuery<Post[]>({
    queryKey: ["threads"],
    queryFn: async () => {
      return (await api.get("/posts")).data;
    },
  });
}
