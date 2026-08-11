import React from 'react';
import { Auth } from './Auth';

export const Login = () => <Auth initialMode="login" />;
export const Register = () => <Auth initialMode="register" />;

export default Auth;
