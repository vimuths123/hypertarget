import { useRouter } from 'next/router';
import Header from '../components/Header';
import '../styles/globals.css'
import { SSRProvider } from "@react-aria/ssr";
import { useState } from 'react';
import { useEffect } from 'react';
/* import 'bootstrap/dist/css/bootstrap.css'; */
/* import '../styles/bootstrap.min.css' */
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />

function MyApp({ Component, pageProps }) {
  const router=useRouter()

  const [currentPath,setPathName] = useState(router.pathname)

  useEffect(() => {
    setPathName(router.pathname)
    console.log(router.pathname)
  }, [router.pathname])
  
  return (
      <SSRProvider>
        {(currentPath=="/setting" || currentPath=="/dashboard" || currentPath=="/") && <Header />}
        <Component {...pageProps} />
      </SSRProvider>
  )
}

export default MyApp
