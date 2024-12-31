import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login'); 
    return ; 
  }
  
  return children;
};

export default ProtectedRoute; 