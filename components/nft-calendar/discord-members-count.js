import { useState, useEffect } from "react"
import API from '../../common/api';

export default function DiscordMembersCount(props) {
  const [count, setCount] = useState(null)
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    API.getDiscordMembersCount(props.link).then(result => {
      setCount(result);
      setLoading(false)
    })
  }, [])
  if (isLoading) return 0
  if (!count) return 0

  return (count)
}