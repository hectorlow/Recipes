import React from 'react';
import SignupForm from 'components/form/SignupForm';
import autumnSoup from 'src/images/autumn_soup.jpg';
import LoginSignupScreenTemplate from 'components/UI/LoginSignupScreenTemplate';

const SignupScreen = () => (
  <LoginSignupScreenTemplate Form={SignupForm} sideImage={autumnSoup} />
);

export default SignupScreen;
