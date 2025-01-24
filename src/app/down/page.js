"use client"
import { useState, useEffect } from 'react';
const fetchedData = () => {
    const [templates, setTemplates] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/renderAndDownloadTemplate');
          const data = await response.json();
          setTemplates(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <h1>Fetched Email Templates</h1>
        <ul>
          {templates.map((template) => (
            <li key={template._id}> 
              {/* Display template data here */}
              <p>Title: {template.title}</p> 
              <p>Description: {template.description}</p>
              <img src={template.image} alt="" /> 
              {/* Display other fields similarly */}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default fetchedData;