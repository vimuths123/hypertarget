import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";


const UserJourneysDashboard = ({ }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    router.push("/dashboard")
  }, [])


  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div className="hyper-user-journeys-container">
          <Header />
        </div>
      )}
    </>
  );
};

export default UserJourneysDashboard;
