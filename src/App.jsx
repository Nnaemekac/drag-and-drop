import { CloseCircle, Folder } from 'iconsax-react';
import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import './assets/style.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [ validationErrMsg, setValidationErrMsg ] = useState('');
  const [ successErrMsg, setSuccessErrMsg ] = useState('');

  useEffect(() => {
    window.xuiAlerts();
    const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    setImages(storedImages);
  }, []);

  const localStorageSave = (newImages) => {
    localStorage.setItem('uploadedImages', JSON.stringify(newImages));
  };

  const handleDrop = async (acceptedFiles) => {
    const validFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        if (file.type.startsWith('image/') && file.size <= 1048576) {
          const dataUrl = await readFileAsDataURL(file);
          return { file, dataUrl };
          
        }
        return null;
      })
    );

    const filteredFiles = validFiles.filter((file) => file !== null);

    if (filteredFiles.length === 0) {
      setValidationErrMsg('Image file is invalid, please select another image');
      window.xuiAnime("validationAlert");
      return;
    }

    setValidationErrMsg('');

    const updatedImages = [...images, ...filteredFiles];
    setImages(updatedImages);

    localStorageSave(updatedImages);
    
    setSuccessErrMsg('Images uploaded successfully!');
    window.xuiAnime('successAlert');
  };

  const handleDelete = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    localStorageSave(updatedImages);
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className='xui-p-1'>
      <div className='xui-lg-w-fluid-90 xui-w-fluid-100 xui-h-500 xui-mx-auto xui-box-shadow-3 xui-lg-p-2 xui-p-1'>
        <Dropzone onDrop={handleDrop} accept="image/*" maxSize={1048576}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="drop-zone xui-d-flex xui-h-fluid-100 xui-flex-jc-center xui-flex-ai-center">
              <input {...getInputProps()} />
              <div>
                <Folder size="80" color="#213282" variant="Bold"/>
                <h3 className='xui-font-sz-200 xui-font-w-bold'>Drag & Drop</h3>
                <p className='xui-opacity-6 xui-font-sz-120 xui-mb-1'>Upload only png,jpg, or jpeg</p>
                <button className='xui-btn xui-py-1 xui-px-3 xui-bdr-rad-half xui-text-white' style={{"backgroundColor": "#384FEE"}}>Upload Image</button>
              </div>
              
            </div>
          )}
        </Dropzone>
      </div>

      <div className='xui-w-fluid-90 xui-mx-auto xui-mt-1'>
        <div className="image-preview xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-md-grid-col-2 xui-grid-gap-2">
          {images.map((image, index) => (
            <div key={index}>
              <img
                className="xui-w-fluid-100 xui-h-300 xui-bdr-rad-half"
                src={image.dataUrl}
                alt={`Preview ${index}`}
              />
              <button  className='xui-badge xui-bdr-rad-half xui-text-white' style={{"backgroundColor": "#384FEE"}} onClick={() => handleDelete(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      {validationErrMsg && 
          <div className="xui-alert xui-alert-danger" xui-custom="validationAlert" xui-placed="top-center">
            <div className="xui-alert-close">
                <CloseCircle size={20} />
            </div>
            <div className="xui-alert-content">
                <span>{validationErrMsg}</span>
            </div>
          </div>
      }
      {successErrMsg && 
          <div className="xui-alert xui-alert-success" xui-custom="successAlert" xui-placed="top-center" no-icon="true">
            <div className="xui-alert-close">
                {/* <CloseCircle size={20} /> */}
            </div>
            <div className="xui-alert-content">
                <span>{successErrMsg}</span>
            </div>
          </div>
      }
      
    </div>
    
  );
};

export default App;
