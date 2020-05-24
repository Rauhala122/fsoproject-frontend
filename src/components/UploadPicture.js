import React from 'react'

const UploadPicture = ({setImage, image}) => {

  return (
    <div>
      <input
      type="file"
      value={image ? `C:\\fakepath\\${image.name}` : "" }
      onChange={({ target: { validity, files: [file] } }) =>
        validity.valid && setImage(file)
      }
      />
    </div>
  );
};

export default UploadPicture
