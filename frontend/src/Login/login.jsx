import React, { useState } from 'react';
// import './LoginPage.css'; // Ensure this file includes any additional custom styles

const LoginPage = () => {
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (formType === 'signup' && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert(`${formType === 'login' ? 'Login' : 'Sign Up'} form submitted!`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchFormType = () => {
    setFormType(formType === 'login' ? 'signup' : 'login');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="relative flex justify-center items-center bg-red-400">
      <video 
        src='/public/images/galar-scenery.mp4' 
        autoPlay 
        loop 
        muted 
        playsInline 
        className='absolute top-0 left-0 w-full h-full object-cover'
      />

      <div className="relative bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl transform transition-transform hover:scale-105">
        <h1 className="text-4xl font-extrabold text-yellow-600 text-center mb-6">
          Pokémon {formType === 'login' ? 'Login' : 'Sign Up'}
        </h1>
        <form onSubmit={handleSubmit}>
          {formType === 'signup' && (
            <div className="mb-4">
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={formData.username} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
                required 
              />
            </div>
          )}
          <div className="mb-4">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
              required 
            />
          </div>
          <div className="mb-4 relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
              required 
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? 
                <img src="../../public/images/openball.png" height='20' width='20' alt="openball" /> :
                <img src='../../public/images/Pokeball.png' height='20' width='20' alt="pokeball" />  
              }
            </button>
          </div>
          {formType === 'signup' && (
            <div className="mb-4 relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
                required 
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? 
                  <img src="../../public/images/openball.png" height='20' width='20' alt="openball" /> :
                  <img src='../../public/images/Pokeball.png' height='20' width='20' alt="pokeball" />  
                }
              </button>
            </div>
          )}
          <button 
            type="submit" 
            className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 transition-colors"
          >
            {formType === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={switchFormType} 
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-colors"
          >
            {formType === 'login' ? 'Create an Account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
