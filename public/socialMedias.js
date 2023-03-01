async function buildSocialMediasTable(socialMediasTable, socialMediasTableHeader, token, message) {
    try {
        const response = await fetch("/api/v1/socialMedias", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        var children = [socialMediasTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                socialMediasTable.replaceChildren(...children); // clear this for safety
                return 0;
            } else {
                for (let i = 0; i < data.socialMedias.length; i++) {
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.socialMedias[i]._id}>edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.socialMedias[i]._id}>delete</button></td>`;
                    let rowHTML = `<td>${data.socialMedias[i].platform}</td><td>${data.socialMedias[i].url}</td>${editButton}${deleteButton}`;
                    let rowEntry = document.createElement("tr");
                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                socialMediasTable.replaceChildren(...children);
            }
            return data.count;
        } else {
            message.textContent = data.msg;
            return 0;
        }
    } catch (err) {
        message.textContent = "A communication error occurred.";
        return 0;
    }
}

//section 1
document.addEventListener("DOMContentLoaded", () => {
    const logoff = document.getElementById("logoff");
    const message = document.getElementById("message");
    const logonRegister = document.getElementById("logon-register");
    const logon = document.getElementById("logon");
    const register = document.getElementById("register");
    const logonDiv = document.getElementById("logon-div");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const logonButton = document.getElementById("logon-button");
    const logonCancel = document.getElementById("logon-cancel");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const socialMedias = document.getElementById("socialMedias");
    const socialMediasTable = document.getElementById("socialMedias-table");
    const socialMediasTableHeader = document.getElementById("socialMedias-table-header");
    const addSocialMedia = document.getElementById("add-socialMedia");
    const editSocialMedia = document.getElementById("edit-socialMedia");
    const platform = document.getElementById("platform");
    const url = document.getElementById("url");
    const addingSocialMedia = document.getElementById("adding-socialMedia");
    const socialMediasMessage = document.getElementById("socialMedias-message");
    const editCancel = document.getElementById("edit-cancel");

    // section 2 
    let showing = logonRegister;
    let token = null;
    document.addEventListener("startDisplay", async () => {
        showing = logonRegister;
        token = localStorage.getItem("token");
        if (token) {
            //if the user is logged in
            logoff.style.display = "block";
            const count = await buildSocialMediasTable(
                socialMediasTable,
                socialMediasTableHeader,
                token,
                message
            );
            if (count > 0) {
                socialMediasMessage.textContent = "";
                socialMediasTable.style.display = "block";
            } else {
                socialMediasMessage.textContent = "There are no socialMedias to display for this user.";
                socialMediasTable.style.display = "none";
            }
            socialMedias.style.display = "block";
            showing = socialMedias;
        } else {
            logonRegister.style.display = "block";
        }
    });
    var thisEvent = new Event("startDisplay");
    document.dispatchEvent(thisEvent);
    var suspendInput = false;

    document.addEventListener("click", async (e) => {
        if (suspendInput) {
            return; // we don't want to act on buttons while doing async operations
        }
        if (e.target.nodeName === "BUTTON") {
            message.textContent = "";
        }
        if (e.target === logoff) {
            title.innerHTML = ""
            logoff.style.display = "none"
            localStorage.removeItem("token");
            token = null;
            showing.style.display = "none";
            logonRegister.style.display = "block";
            showing = logonRegister;
            socialMediasTable.replaceChildren(socialMediasTableHeader); // don't want other users to see
            message.textContent = "You are logged off.";
        } else if (e.target === logon) {
            showing.style.display = "none";
            logonDiv.style.display = "block";
            showing = logonDiv;
        } else if (e.target === register) {
            showing.style.display = "none";
            registerDiv.style.display = "block";
            showing = registerDiv;
        } else if (e.target === logonCancel || e.target == registerCancel) {
            showing.style.display = "none";
            logonRegister.style.display = "block";
            showing = logonRegister;
            email.value = "";
            password.value = "";
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
        } else if (e.target === logonButton) {
            suspendInput = true;
            try {
                const response = await fetch("/api/v1/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value,
                    }),
                });
                const data = await response.json();

                if (response.status === 200) {
                    let usrName = data.user.name.charAt(0).toUpperCase() + data.user.name.slice(1);
                    title.innerHTML = `Welcome ${usrName}. Your list is here:`
                    message.textContent = `Logon successful.  Welcome ${data.user.name}`;
                    token = data.token;
                    localStorage.setItem("token", token);
                    showing.style.display = "none";
                    thisEvent = new Event("startDisplay");
                    email.value = "";
                    password.value = "";
                    document.dispatchEvent(thisEvent);
                } else {
                    message.textContent = data.msg;
                }
            } catch (err) {
                message.textContent = "A communications error occurred.";
            }
            suspendInput = false;
        } else if (e.target === registerButton) {
            if (password1.value != password2.value) {
                message.textContent = "The passwords entered do not match.";
            } else {
                suspendInput = true;
                try {
                    const response = await fetch("/api/v1/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: name.value,
                            email: email1.value,
                            password: password1.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        message.textContent = `Registration successful.  Welcome ${data.user.name}`;
                        token = data.token;
                        localStorage.setItem("token", token);
                        showing.style.display = "none";
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);
                        name.value = "";
                        email1.value = "";
                        password1.value = "";
                        password2.value = "";
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    message.textContent = "A communications error occurred.";
                }
                suspendInput = false;
            }
        } // section 4
        else if (e.target === addSocialMedia) {
            showing.style.display = "none";
            editSocialMedia.style.display = "block";
            showing = editSocialMedia;
            delete editSocialMedia.dataset.id;
            platform.value = "";
            url.value = "";
            addingSocialMedia.textContent = "add";
        } else if (e.target === editCancel) {
            showing.style.display = "none";
            platform.value = "";
            url.value = "";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
        } else if (e.target === addingSocialMedia) {

            if (!editSocialMedia.dataset.id) {
                // this is an attempted add
                suspendInput = true;
                try {
                    const response = await fetch("/api/v1/socialMedias", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            platform: platform.value,
                            url: url.value
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        //successful create
                        message.textContent = "The socialMedia entry was created.";
                        showing.style.display = "none";
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);
                        platform.value = "";
                        url.value = "";
                    } else {
                        // failure
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    message.textContent = "A communication error occurred.";
                }
                suspendInput = false;
            } else {
                // this is an update
                suspendInput = true;
                try {
                    const socialMediaID = editSocialMedia.dataset.id;
                    const response = await fetch(`/api/v1/socialMedias/${socialMediaID}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            platform: platform.value,
                            url: url.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                        message.textContent = "The entry was updated.";
                        showing.style.display = "none";
                        platform.value = "";
                        url.value = "";
                        thisEvent = new Event("startDisplay");
                        document.dispatchEvent(thisEvent);
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {

                    message.textContent = "A communication error occurred.";
                }
            }
            suspendInput = false;
        } // section 5
        else if (e.target.classList.contains("editButton")) {
            editSocialMedia.dataset.id = e.target.dataset.id;
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/socialMedias/${e.target.dataset.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    platform.value = data.socialMedia.platform;
                    url.value = data.socialMedia.url;
                    showing.style.display = "none";
                    showing = editSocialMedia;
                    showing.style.display = "block";
                    addingSocialMedia.textContent = "update";
                    message.textContent = "";
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The socialMedias entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
        else if (e.target.classList.contains("deleteButton")) {
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/socialMedias/${e.target.dataset.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.status === 200) {

                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                    message.textContent = "The socialMedia entry was deleted.";
                    showing.style.display = "none";
                } else {
                    // might happen if the list has been updated since last display
                    message.textContent = "The socialMedias entry was not found";
                    thisEvent = new Event("startDisplay");
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = "A communications error has occurred.";
            }
            suspendInput = false;
        }
    })
});
