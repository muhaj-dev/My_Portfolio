import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import './About.scss';
import { supabase, getImageUrl } from '../../lib/supabase';


const About = () => {
  const [abouts, setAbouts] = useState([]);

  useEffect(() => {
    supabase
      .from('abouts')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setAbouts(data || []));
  }, [])
  

  return (
    <>
    <h2 className="head-text">I Know that <span>Good Development</span> <br />means  <span>Good Business</span></h2>

    <div className="app__profiles">
      {abouts?.map((about, index) => (
        <motion.div
          whileInView={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, type: 'tween' }}
          className="app__profile-item"
          key={about.title + index}
        >
          <img src={getImageUrl(about.img_path)} alt={about.title} />
          <h2 className="bold-text" style={{ marginTop: 20, fontSize: '150%' }}>{about.title}</h2>
          <p className="" style={{ marginTop: 10, fontSize: '90%' }}>{about.description}</p>
        </motion.div>
      ))}
    </div>
  </>
  )
}

export default AppWrap(
  MotionWrap(About, 'app__about'), 
  'about',
  "app__whitebg"
  );