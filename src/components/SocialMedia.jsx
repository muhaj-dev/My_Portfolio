import React from 'react';
import { BsTwitter, BsInstagram } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const SocialMedia = () => (
  <div className="app__social">
    <div>
      <a href='https://twitter.com/muhaj_dev?t=pU4ZlMNoswLKsoJaYRAHaw&s=09'>
        <BsTwitter />
      </a>
    </div>
    <div>
    <a href='https://github.com/muhammod1'>
      <FaGithub />
    </a>

    </div>
    <div>
    <a href='https://www.linkedin.com/in/muhammod-ajibade-6111911b5'>
      <FaLinkedinIn />
    </a>

    </div>
  </div>
);

export default SocialMedia;
