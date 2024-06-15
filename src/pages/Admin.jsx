import { useContext, useEffect, useState } from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseSetup";

const Admin = () =>{
  const { admin } = useContext(AuthContext);
  const [ history, setHistory ] = useState();
  const [ loading, setLoading ] = useState(false);
  const [ pageLoading, setPageLoading ] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!admin) {
      alert('You are not authorized to access this page! Redirecting to login page...');
      navigate('/signin');
    }
    else {
      getHistory().then((data) => {
        setHistory(data);
      });
    }
  }, [])

  const getHistory = async () => {
    try {
      setPageLoading(true);
      const docRef = doc(db, "histories", "binus");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data())
        return docSnap.data();
      } else {
        console.log("Data does not exist in database!");
        return null;
      }
    } catch (e) {
      console.error("Error getting document:", e);
      return null;
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      ></link>

      <div className="w-screen min-h-screen flex flex-col font-sans bg-background">
        {pageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black">
            <BeatLoader loading={pageLoading} size={25} color="white" margin={5} />
          </div>
        )}
        <NavbarAdmin />
        <div className="items-center w-screen min-h-screen">
          <div className="text-4xl font-semibold text-center mt-10">Customer history & mood</div>
          <div className="flex flex-col items-center mt-10">
            {history &&
              history.chat.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between w-[50%] bg-bluefield rounded-xl p-5 my-3"
                >
                  <div className="font-semibold">{item.content}</div>
                  <div className="font-regular">{item.sentiment}</div>
                </div>
              ))}
          </div>
        </div>

        
      </div>
    </>
  );
}

export default Admin;
