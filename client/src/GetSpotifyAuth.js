import { useState, useEffect } from "react"
import axios from "axios"
import { getAuth } from "firebase/auth";

const auth = getAuth(); // Authorization component

export default function useAuth(code) {

  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  const currentUser = auth.currentUser.uid

  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code, currentUser,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        console.log("amde it here")
        //window.history.pushState({}, null, "/Pineapple-Music")
      })
      .catch((err) => {
        //window.location = "/Pineapple-Music"
        console.log("code issue: " + code + " " + err)
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken, currentUser,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        })
        .catch(() => {
          window.location = "/Pineapple-Music"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}