var user = firebase.auth().currentUser;
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
    }
    else {
        // User is signed out.
        // ...
    }
});

function signIn() {
    console.log("Attempting to sign in...");
    var email = $("#login_email").val();
    var password = $("#login_password").val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorMessage);
        // ...
    });
}

function signUpUser() {
    var firstName = $('#first_name').val();
    var lastName = $('#last_name').val();
    var fullName = firstName + " " + lastName;
    var userEmail = $('#email_field').val().toLowerCase();
    var userPass = $('#password_field').val();
    var userPassConf = $('#password_conf_field').val();
    var userSSN = $('#user_ssn').val();

    if (userPassConf == userPass) {
        firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        db.collection("users").doc(userEmail).get().then((docSnapshot) => {
            if (docSnapshot.exists) {
                window.alert("Error : " + errorMessage + `. This person is of type User.`);
            }
            else {
                window.alert("Error : " + errorMessage + `. This person is of type Company.`);
            }
        })

        // Do other stuff??
        });
        
        db.collection("users").doc(userEmail).get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                console.log("User exists already.");
            }
            else {
                db.collection("companies").doc(userEmail).get()
                .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        console.log("Company exists already.")
                    }
                    else {
                        db.collection("users").doc(userEmail).set({
                            name: fullName,
                            type: "user",
                            email: userEmail,
                            ssn: userSSN,
                            balance: "$0.00",
                            numReviews: 0,
                            dateCreated: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                    }
                })
            }
        });   
    }
    else {
        window.alert("Error : Passwords do not match");
    }
}

function signUpCompany() {
    var companyName = $('#company_name').val();
    var companyEmail = $('#email_field').val().toLowerCase();
    var companyPass = $('#password_field').val();
    var companyPassConf = $('#password_conf_field').val();
    var companyBio = $('#company_bio').val();
    var companyGoal1 = $('#company_goal1').val();
    var companyGoal2 = $('#company_goal2').val();
    var companyGoal3 = $('#company_goal3').val();


    if (companyPassConf == companyPass) {
        firebase.auth().createUserWithEmailAndPassword(companyEmail, companyPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        db.collection("company").doc(companyEmail).get().then((docSnapshot) => {
            if (docSnapshot.exists) {
                window.alert("Error : " + errorMessage + `. This person is of type Company.`);
            }
            else {
                window.alert("Error : " + errorMessage + `. This person is of type User.`);
            }
        })

        // Do other stuff??
        });

        db.collection("companies").doc(companyEmail).get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                console.log("company exists already.");
            }
            else {
                db.collection("users").doc(companyEmail).get()
                .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        console.log("User exists already.")
                    }
                    else {
                        db.collection("companies").doc(companyEmail).set({
                            name: companyName,
                            type: "company",
                            email: companyEmail,
                            bio: companyBio,
                            moneyRaised: "$0.00",
                            numReviews: 0,
                            goals: [companyGoal1, companyGoal2, companyGoal3],
                            photos: [],
                            dateCreated: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                    }
                })
            }
        });
    }
    else {
        window.alert("Error : Passwords do not match");
    }
}

function signOut() {
    firebase.auth().signOut();
}

function removeSignIn() {
    $("#loginDropdown").addClass("remove");
}

function showSignIn() {
    $("#loginDropdown").removeClass("remove");
}

function showProfile() {
    $("#profileDropdown").removeClass("remove");
}

function removeProfile() {
    $("#profileDropdown").addClass("remove");
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var div = document.getElementById('profile-name');
        removeSignIn();
        showProfile();
        var name = getNavName()
        div.innerHTML = div.innerHTML.replace('', name);
        
    }
    else {
        // User is signed out.
        showSignIn();
        removeProfile();
    }
});

function getNavName() {
    var user = firebase.auth().currentUser;

    db.collection("users").doc(user.email).get()
    .then(function(doc) {
        if (doc.exists) {
            let data = doc.data();
            console.log(data["name"]);
            name = data["name"];
            loadNavName(name);
        }
        else {
            db.collection("companies").doc(user.email).get()
            .then(function(doc) {
                if (doc.exists) {
                    let data = doc.data();
                    console.log(data["name"]);
                    name = data["name"];
                    loadNavName(name);
                }
                else {
                    console.log("No such document!");
                }
            })
        }
    })
    .catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function loadNavName(name) {
    var div = document.getElementById('profile-name');
    console.log(`name is ${name}`);

    // replace text in HTML string:
    div.innerHTML = name;
}
