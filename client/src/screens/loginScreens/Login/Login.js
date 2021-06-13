import React from 'react';
import LoginForm from 'components/form/LoginForm';
import avocadoAndEgg from 'src/images/avocado_and_egg.jpg';
import LoginSignupScreenTemplate from 'components/UI/LoginSignupScreenTemplate';

const LoginScreen = () => (
  <LoginSignupScreenTemplate Form={LoginForm} sideImage={avocadoAndEgg} />
);

export default LoginScreen;
