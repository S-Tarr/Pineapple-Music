import './profileSettings.css';

function profileSettings( {navigation} ) {
    return (
      <div className="profile-header">
          <div className="image-container">
              <text className="text">Change Profile Image</text>
              {/* <input type="file" id="file" ref="fileUploader" style={{display: "none"}}/> */}
          </div>
      </div>
    )
}

export default profileSettings;