import { useNavigate } from "react-router";
import { auth, db } from "../firebaseSetup";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { BeatLoader } from "react-spinners";

const SignUp = () => {
  const navigate = useNavigate();
  const user = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [riwayat, setRiwayat] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const storeUserData = async () => {
    try {
      const docRef = await setDoc(doc(db, "users", email), {
        nama: username,
        email: email,
        password: password,
        riwayat: riwayat,
      });
      console.log(docRef);
      setErrorMsg("");
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message.slice(10));
    }
  };

  const createAccount = async () => {
    if (username === "" || email === "" || password === "") {
      setErrorMsg("Please fill in all required fields!");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      setErrorMsg("Invalid email! (example@gmail.com)");
      return;
    }
    if (confirmPassword !== password) {
      setErrorMsg("Invalid credential!");
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      await storeUserData();
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message.slice(10));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-background font-sans">
      <form className="form-content p-10 min-w-[40vh] bg-bluepale rounded-xl bg-blueform">
        <div className="font-semibold text-center text-lg pb-5">Sign Up</div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black">
            <BeatLoader loading={loading} size={50} color="white" margin={10} />
          </div>
        )}

        <div className="form-group pb-5 w-full">
          <input
            type="username"
            id="formUsername"
            placeholder="username"
            className="p-3 rounded-xl bg-bluefield text-white w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group pb-5 w-full">
          <input
            type="email"
            id="formEmail"
            placeholder="email"
            className="p-3 rounded-xl bg-bluefield text-white w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group pb-5 min-w-[20rem]">
          <input
            type="password"
            id="formPassword"
            placeholder="password"
            className="p-3 rounded-xl bg-bluefield text-white w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group pb-5 min-w-[20rem]">
          <input
            type="password"
            id="formPassword"
            placeholder="confirm password"
            className="p-3 rounded-xl bg-bluefield text-white w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {errorMsg !== "" && <div className="text-red-400 mb-5">{errorMsg}</div>}
        <div>
          <button
            onClick={createAccount}
            type="button"
            className="btn btn-primary rounded-xl mr-5 bg-graysbtn text-blueform font-semibold w-full"
          >
            Register
          </button>
          <div className="flex pt-3 justify-end">
            <div className="pr-2 text-sm">Already have an account?</div>
            <Link to="/signin" className="text-white text-sm underline">
              Login here
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
