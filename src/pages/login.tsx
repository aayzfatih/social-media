import { useNavigate } from "react-router-dom";
import { provider, auth } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";

export const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate("/");
  };
  return (
    <div>
      <p>Sign In With Google To Contuniue</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
};
