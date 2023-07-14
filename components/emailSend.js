import emailjs from 'emailjs-com';

const sendEmail = async ({emails,owner, link,setError}) => {
  const templateParams = {
    email: emails,
    link : link, 
    owner : owner,
    form:owner
  };

  await emailjs
    .send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, templateParams, process.env.EMAILJS_USER_ID)
    .then((result) => {
      console.log('Email sent successfully :' , result);
      setError({type:"success",msg:"Email sent successfully"})
      // Handle success
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      setError({type:"error",msg:"Error sending email"})
      // Handle error or display error message
    });
};

export default sendEmail;
