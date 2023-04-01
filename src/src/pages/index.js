import React from "react";
import { Link } from 'gatsby';
import Layout from '../components/Layout.js';
import '../styles/index.scss';

const IndexPage = () => {

  return(
    <Layout>
      <div className="index">
        <div className="content">
          <h2>The only all in one tool to automate the flipping process</h2>
          <Link className='callToAction' to='/Pricing'><span>Compare Plans</span></Link>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage;

export const Head = () => <title>Spatula Software</title>
