import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import ProductDetails from './pages/product-details';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product-detail/:id" element={<ProductDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
