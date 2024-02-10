import axios from "axios";
import { useState } from "react";

const About = () => {
  const [status, setStatus] = useState();

  const handleClick = async () => {
    try {
      const response = await axios.get('/api/health');
      setStatus({
        type: 'success',
        message: response.data.message,
        time: new Date(),
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
        time: new Date(),
      });
    }
  };

  return (
    <div className="about-page">
      <h2>About</h2>

      <button onClick={handleClick}>Check status</button>

      <div className="status">
        { status
          ? <p>{status.time.toString()}: {status.message}</p>
          : <p>Unknown status</p>
        }
      </div>
    </div>
  );
};

export default About;