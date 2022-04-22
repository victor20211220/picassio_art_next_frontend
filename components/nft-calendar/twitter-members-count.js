
// const twitterAPIUrl = "https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=";
import { useState, useEffect } from "react"
import API from '../../common/api';
export default function TwitterMembersCount(props) {
  const [count, setCount] = useState(null)
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    API.getTwitterFollowersCount(props.link).then(result => {
      setCount(result);
      setLoading(false);
    })
  }, []);
  if (isLoading) return 0
  if (!count) return 0

  return count
}