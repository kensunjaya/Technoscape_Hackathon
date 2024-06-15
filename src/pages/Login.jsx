import { useNavigate } from "react-router";
import { auth, db } from "../firebaseSetup"
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { BeatLoader } from "react-spinners";

const Login = () =>{
  const navigate = useNavigate();
  const { setUserData, setAdmin } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (email === "" || password === "") {
      setErrorMsg("Please fill in all required fields!");
      return;
    }
    if (email === "admin@binus.id" && password === "admin123") {
      setAdmin(true);
      navigate('/admin');
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth,
        email,
        password
      );
      const userData = await getUser();
      setUserData(userData);
      setErrorMsg("");
      navigate("/")
    } catch (error) {
      console.error(error);
      setErrorMsg((error).message.slice(10));
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("Data does not exist in database!");
        return null;
      }
    } catch (e) {
      console.error("Error getting document:", e);
      return null;
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-background font-sans">
      <form className="form-content p-10 min-w-[40vh] bg-bluepale rounded-xl bg-blueform">
        <div className="font-semibold text-xl pb-5 w-full text-center">Sign In</div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black">
            <BeatLoader loading={loading} size={25} color="white" margin={5}/>
          </div>
        )}

        <div className="form-group pb-5 w-full">
          <input type="email" id="formEmail" placeholder="email" className="p-3 rounded-xl bg-bluefield text-white w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group pb-5 min-w-[20rem]">
          <input type="password" id="formPassword" placeholder="password" className="p-3 rounded-xl bg-bluefield text-white w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {errorMsg !== "" && <div className="text-red-400 mb-5">{errorMsg}</div>}
        <div>
          <button onClick={signIn} type="button" className="btn btn-primary rounded-xl mr-5 bg-graysbtn text-blueform font-semibold w-full">
            Login
          </button>
          <div className="flex pt-3">
            <div className="pr-2 text-sm">Don't have an account? </div>
            <Link to="/signup" className="text-white text-sm underline">Register here</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login