import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import './Assets/Css/Custome.css'
import CrudDashboard from './CrudDashboard' 

function App() {

  return (
    
    < >
      <CrudDashboard />

      {/* Toast Container */}
      <ToastContainer
        position="top-center" 
        autoClose={3000}
        rtl />
    </>
  );
}

export default App;
