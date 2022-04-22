import axios from "axios";
export default axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APIURL}/api`,
  headers: {
    "Content-type": "application/json"
  }
});