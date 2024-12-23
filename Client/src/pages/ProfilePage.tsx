function ProfilePage () {
    return (
        <>
         <div className="profile-header">
            <h1>Profile</h1>
            <h2>Hello User username </h2>
         </div>
         <div className="profile-container">
            <h2>Watch List - Movies the user wants to watch</h2>
            <div className="profile-items">
            <div className="watch-review-box">
                This is Watch list box.
            </div>
            </div>
            <h2>Reviews</h2>
            <div className="profile-items">
            <div className="watch-review-box">
            This is reviw box.
            </div>
            </div>
        </div>

        </>
    )

}

export default ProfilePage;