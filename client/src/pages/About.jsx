import axios from "axios";

const About = () => {

  const handleClick = async () => {
    const { data } = await axios.get('/api/ping');
    console.log(data);
  };

  return (
    <div className="about-page">
      <h2>About</h2>

      <button onClick={handleClick}>Ping</button>
    </div>
  );
};

export default About;