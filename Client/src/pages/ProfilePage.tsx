

function ProfilePage () {
    return (
        <>
         <div className="">

         <div className="profile-header">
            <h1>Profile</h1>
            <h2>Hello User username </h2>
         </div>
         <div className="profile-container">
            <h2>Watch List - Movies the user wants to watch</h2>
            <div className="profile-items">
            <div className="watch-review-box">
                 <img src="https://placehold.co/200"/>  
            </div>
            </div>
            <h2>Reviews</h2>
            <div className="profile-items">
            <div className="watch-review-box">
                <img src="https://placehold.co/200"/> 
           </div>
            </div>
        </div>
        </div>
        </>
    )

}

export default ProfilePage;