/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: "https://hyper-target-api.netlify.app/.netlify/functions/",
    JWT_SECRET: "M7HTLPdYICMz8sXCJz_leZmo",
    GOOGLE_CLIENT_ID:"1064908942321-gv02ud6td8prcilts7lu4i6g0o5mhlcp.apps.googleusercontent.com",
    FACEBOOK_APP_ID:"723890372390020",
    STRIPE_PK:'pk_test_51Lrnh3Hn5HPNBT2DQtdgvnH7HCOm8qYTOyYDrzrIpJhAHdgeeC5n4i6qLFy2JibSXGNfjT5c419dHbVNyVZxBAY700PxxUxtgz',
    CALENDY_LINK:'https://calendly.com/hypertarget',
    EMAILJS_SERVICE_ID:"service_kesahz7",
    EMAILJS_TEMPLATE_ID:"template_0uav9jb",
    EMAILJS_USER_ID:"7MeV7BeW7evAZcrqP",
    SIMPLE_TOKEN_SECRET:"hyperScret0011#45",
    INDEX_URL:"https://hypertarget-frontweb.netlify.app/",
  },
  reactStrictMode: true,
}

module.exports = nextConfig
