import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "./UseAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../Pages/Provider/AuthProvider";


const UseCart = () => {
    const axiosSecure = UseAxiosSecure()
    const {user} = useContext(AuthContext)
    const { data: cart = [], refetch} = useQuery({
        queryKey: ["cart", user?.email],
        queryFn: async () => {
          const res = await axiosSecure.get(`/carts?email=${user.email}`);
          return res.data;
        },
      });
      return [cart, refetch]
};

export default UseCart;