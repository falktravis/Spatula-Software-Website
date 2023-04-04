import React from 'react';
import './styles/Pricing.scss';

export default function Pricing() {
  return (
    <div className="pricingContainer">
        <h2>Packages</h2>
        <div className="pricing">
            <div className="card">
                <h3>Basic</h3>
                <p>$15/Month</p>
            </div>
            <div className="card">
                <h3>Intermediate</h3>
                <p></p>
            </div>
            <div className="card">
                <h3>Ultimate</h3>
                <p></p>
            </div>
        </div>
    </div>
  )
}
